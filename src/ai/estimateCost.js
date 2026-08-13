// ai/estimateCost.js
//
// 문서의 "AI #1(품목분류) + AI #2(최종비용예측)"을 한 번의 LLM 호출로 합친 버전.
// 해커톤에서 AI 호출 2번 나눌 시간 없으니, 프롬프트 안에서 "먼저 품목분류 → 그 다음 비용계산"
// 순서로 생각하게 시켜서 하나의 JSON으로 받는다. (Chain-of-thought를 프롬프트로 유도)
//
// 발표 때: "AI가 상품명을 분석해 품목을 분류하고, 그 분류를 근거로 관세율을 추정한 뒤
//          국제배송비·대행수수료까지 합산한 최종 예상 결제금액을 산출합니다" 라고 말하면 됨.
//
// * 모델: Gemini (무료 티어 사용 가능. https://aistudio.google.com 에서 키 발급)
// * responseSchema로 출력 형식을 강제하기 때문에, 마크다운 코드블록이나 잡담이 섞여
//   JSON.parse가 깨지는 문제가 Claude 버전보다 훨씬 적다.

const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `너는 해외직구 플랫폼 "Kakao MOHE"의 통관·비용 예측 AI다.
사용자가 입력한 해외 상품 정보를 보고 다음을 추정한다:
1. 상품의 예상 품목분류(카테고리)와 관세율
2. 예상 국제배송비
3. 예상 관세 + 부가세
4. 플랫폼 대행 수수료 (상품가의 3%, 최소 3000원)
5. 위 항목을 모두 합한 최종 예상 결제금액(원화 기준)

규칙:
- 미국발 $200 미만, 그 외 국가 $150 미만은 목록통관 대상으로 관세가 면제될 수 있음을 반영해라 (단, 전자제품/주류/화장품 등 특정 품목은 예외일 수 있다고 명시).
- shipping_mode가 "direct"(구매자가 이미 해외배송을 진행하고 관세 처리만 대행하는 경우)이면 국제배송비 항목은 0으로 두고 "이미 구매자가 별도 진행" 이라고 note에 남겨라.
- 반드시 지정된 JSON 스키마 형식으로만 응답한다.`;

// Gemini의 responseSchema — 이 구조를 벗어난 답을 못 하도록 강제한다.
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING, description: '추정 품목분류, 예: 전자제품/의류/화장품 등' },
    hs_code_guess: { type: Type.STRING, description: '추정 HS Code 앞 4자리, 모르면 분류불가' },
    duty_rate_percent: { type: Type.NUMBER },
    is_duty_free_likely: { type: Type.BOOLEAN },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        product_price_krw: { type: Type.NUMBER },
        intl_shipping_krw: { type: Type.NUMBER },
        duty_and_vat_krw: { type: Type.NUMBER },
        platform_fee_krw: { type: Type.NUMBER },
        total_estimated_krw: { type: Type.NUMBER },
      },
      required: [
        'product_price_krw',
        'intl_shipping_krw',
        'duty_and_vat_krw',
        'platform_fee_krw',
        'total_estimated_krw',
      ],
    },
    confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
    risk_notes: { type: Type.ARRAY, items: { type: Type.STRING } },
    note: { type: Type.STRING, description: '한 문장 요약, 사용자에게 보여줄 문구' },
  },
  required: [
    'category',
    'hs_code_guess',
    'duty_rate_percent',
    'is_duty_free_likely',
    'breakdown',
    'confidence',
    'risk_notes',
    'note',
  ],
};

/**
 * @param {object} input
 * @param {string} input.productName
 * @param {number} input.priceAmount
 * @param {string} input.priceCurrency  // 'USD' | 'KRW' 등
 * @param {string} input.originCountry  // 'US' | 'CN' | 'JP' 등
 * @param {'forwarding'|'direct'} input.shippingMode
 * @returns {Promise<object>} 파싱된 예측 JSON
 */
async function estimateCost(input) {
  const { productName, priceAmount, priceCurrency, originCountry, shippingMode } = input;

  const userPrompt = `상품명: ${productName}
가격: ${priceAmount} ${priceCurrency}
출발 국가: ${originCountry}
배송 모드: ${shippingMode === 'direct' ? 'direct (구매자가 해외배송 직접 진행, 관세만 대행)' : 'forwarding (배송대행지 경유)'}

위 정보를 바탕으로 예측 결과를 산출해줘.`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      12000,
      'Gemini 비용 예측 응답 제한시간 12초를 초과했습니다.',
    );

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.warn('[estimate] Gemini 호출 실패, 규칙 기반 비용 예측으로 대체:', error.message);
    return buildCostFallback(input, error);
  }
}

const EXCHANGE_RATES_KRW = {
  USD: 1350,
  JPY: 9.5,
  EUR: 1480,
  CNY: 190,
  KRW: 1,
  GBP: 1800,
  CAD: 1000,
  AUD: 870,
};

const PRODUCT_RULES = [
  { pattern: /운동화|스니커|shoe|sneaker|nike|adidas|new balance/i, category: '신발/스니커즈', hs: '6404', duty: 13 },
  { pattern: /향수|perfume|fragrance|eau de parfum|cologne/i, category: '향수/화장품', hs: '3303', duty: 6.5, regulated: true },
  { pattern: /화장품|크림|세럼|로션|cosmetic|skincare|balm/i, category: '화장품/바디케어', hs: '3304', duty: 6.5, regulated: true },
  { pattern: /재킷|의류|셔츠|바지|jacket|shirt|apparel|clothing/i, category: '의류/아우터', hs: '6201', duty: 13 },
  { pattern: /초콜릿|젤리|스낵|식품|chocolate|jelly|snack|food/i, category: '식품/간식', hs: '1806', duty: 8, regulated: true },
  { pattern: /키보드|keyboard/i, category: '전자제품/키보드', hs: '8471', duty: 0, regulated: true },
  { pattern: /카메라|이어폰|헤드폰|게임기|전자|camera|earphone|headphone|switch|electronic/i, category: '전자제품', hs: '8525', duty: 0, regulated: true },
  { pattern: /레고|완구|피규어|lego|toy|model kit/i, category: '완구/취미', hs: '9503', duty: 0 },
];

function buildCostFallback(input, error) {
  const priceAmount = Math.max(0, Number(input.priceAmount) || 0);
  const currency = String(input.priceCurrency || 'USD').toUpperCase();
  const exchangeRate = EXCHANGE_RATES_KRW[currency] || EXCHANGE_RATES_KRW.USD;
  const productPriceKrw = Math.round(priceAmount * exchangeRate);
  const rule = PRODUCT_RULES.find((item) => item.pattern.test(input.productName || ''))
    || { category: '기타 상품', hs: '9999', duty: 8 };
  const usdValue = productPriceKrw / EXCHANGE_RATES_KRW.USD;
  const dutyFreeThreshold = input.originCountry === 'US' ? 200 : 150;
  const isDutyFreeLikely = usdValue < dutyFreeThreshold && !rule.regulated;
  const shippingKrw = input.shippingMode === 'direct'
    ? 0
    : Math.round(Math.min(65000, Math.max(15000, 15000 + (productPriceKrw * 0.055))));
  const dutyKrw = isDutyFreeLikely ? 0 : Math.round(productPriceKrw * (rule.duty / 100));
  const vatKrw = isDutyFreeLikely ? 0 : Math.round((productPriceKrw + shippingKrw + dutyKrw) * 0.1);
  const dutyAndVatKrw = dutyKrw + vatKrw;
  const platformFeeKrw = Math.max(3000, Math.round(productPriceKrw * 0.03));
  const totalKrw = productPriceKrw + shippingKrw + dutyAndVatKrw + platformFeeKrw;

  const riskNotes = [
    `${rule.category} 기준의 추정 HS Code와 기본 관세율을 적용했습니다. 실제 세관 분류에 따라 달라질 수 있습니다.`,
    input.shippingMode === 'direct'
      ? '직배송으로 입력되어 국제배송비는 구매자가 별도 결제하는 것으로 계산했습니다.'
      : '배송대행지 기본 운임을 적용했으며 실측 무게와 부피에 따라 변동될 수 있습니다.',
  ];
  if (rule.regulated) riskNotes.push('인증·성분·배터리 등 품목별 수입요건을 통관 전에 확인해 주세요.');

  return {
    category: rule.category,
    hs_code_guess: rule.hs,
    duty_rate_percent: isDutyFreeLikely ? 0 : rule.duty,
    is_duty_free_likely: isDutyFreeLikely,
    breakdown: {
      product_price_krw: productPriceKrw,
      intl_shipping_krw: shippingKrw,
      duty_and_vat_krw: dutyAndVatKrw,
      platform_fee_krw: platformFeeKrw,
      total_estimated_krw: totalKrw,
    },
    confidence: 'medium',
    risk_notes: riskNotes,
    note: 'Gemini 한도 초과로 환율·품목·면세 기준을 적용한 MOHE 통계 계산 결과입니다.',
    __fallback: true,
    __fallback_reason: classifyFallbackReason(error),
  };
}

function classifyFallbackReason(error) {
  const message = String(error?.message || '');
  if (/429|quota|resource_exhausted|too many requests/i.test(message)) return 'quota';
  if (/시간|timeout/i.test(message)) return 'timeout';
  return 'provider_error';
}

function withTimeout(promise, timeoutMs, message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

module.exports = { estimateCost, buildCostFallback };
