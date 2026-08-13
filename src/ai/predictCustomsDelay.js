// ai/predictCustomsDelay.js
//
// 문서의 "AI #3: 통관 지연 예측"에 해당.
// estimateCost.js와 입력이 겹치는 부분이 많아 재사용 가능하지만,
// 이건 "비용"이 아니라 "시간(통관 완료 시점)"과 "리스크"에 집중한 별도 예측이라 분리했다.
//
// 발표 때: "AI가 품목·원산지·서류 상태를 바탕으로 통관 완료 예상일과 지연 확률,
//          지연 원인을 예측해서 구매자가 미리 대비할 수 있게 합니다" 라고 말하면 됨.

const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `너는 해외직구 플랫폼 "Kakao MOHE"의 통관 지연 예측 AI다.
사용자가 입력한 상품 정보와 현재 상황을 보고 다음을 추정한다:
1. 통관 완료까지 예상 소요일수 (오늘 기준)
2. 지연 가능성 (%, 0~100)
3. 지연을 유발할 수 있는 주요 리스크 요인들 (서류 누락, 세관 물량 증가, 품목 특성상 정밀검사 대상 등)
4. 지연 위험도 등급 (low / medium / high)

규칙:
- 전자제품, 화장품, 건강기능식품, 주류는 서류 요구사항이 많아 지연 가능성이 상대적으로 높다고 판단해라.
- 목록통관 면세 대상(관세 없음)인 경우 정식 수입신고보다 통관이 빠른 경향이 있다고 반영해라.
- 항공특송이 일반적으로 해상특송보다 통관이 빠르다고 가정해라 (입력에 운송수단 정보가 없으면 항공특송으로 가정).
- 반드시 지정된 JSON 스키마 형식으로만 응답해라.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    expected_customs_days: { type: Type.NUMBER, description: '오늘부터 통관 완료까지 예상 소요일수' },
    delay_probability_percent: { type: Type.NUMBER },
    risk_level: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
    risk_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendation: { type: Type.STRING, description: '구매자가 취하면 좋을 행동 한 문장' },
  },
  required: [
    'expected_customs_days',
    'delay_probability_percent',
    'risk_level',
    'risk_factors',
    'recommendation',
  ],
};

/**
 * @param {object} input
 * @param {string} input.productName
 * @param {string} input.category        // estimateCost 결과의 category를 그대로 넘기면 정확도 향상
 * @param {string} input.originCountry
 * @param {boolean} input.isDutyFreeLikely  // estimateCost 결과의 is_duty_free_likely
 * @returns {Promise<object>}
 */
async function predictCustomsDelay(input) {
  const { productName, category, originCountry, isDutyFreeLikely } = input;

  const userPrompt = `상품명: ${productName}
품목분류: ${category || '미상'}
출발 국가: ${originCountry}
면세 대상 여부: ${isDutyFreeLikely ? '면세 대상 (목록통관)' : '면세 대상 아님 (정식 수입신고 필요 가능)'}

위 정보를 바탕으로 통관 지연 예측 결과를 산출해줘.`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
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

module.exports = { predictCustomsDelay };
