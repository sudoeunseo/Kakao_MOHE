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

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest', // .env에서 GEMINI_MODEL로 덮어쓸 수 있음. 계정마다 열려있는 모델이 달라서 'latest' 별칭을 기본값으로 둠.
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const rawText = response.text.trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`AI 응답 JSON 파싱 실패: ${err.message}\n원본 응답: ${rawText}`);
  }

  return parsed;
}

module.exports = { estimateCost };
