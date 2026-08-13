// ai/predictBusinessTrend.js
//
// 문서의 "AI #6: 수요·수익 예측"에 해당. 기업 대시보드에서 사용.
//
// 다른 AI들과 다르게, 이건 "가상의 상황 하나"를 예측하는 게 아니라
// "이미 쌓인 주문 데이터 전체"를 분석해서 트렌드를 뽑아내는 것이라
// 호출 전에 orders 테이블을 집계해서 프롬프트에 요약 통계로 넣어준다.
// (원본 데이터를 통째로 넣지 않는 이유: 주문이 많아지면 토큰이 커지고,
//  AI가 굳이 개별 레코드를 볼 필요 없이 집계 수치만으로 트렌드 해석이 가능하기 때문)
//
// 발표 때: "AI가 누적된 주문 데이터를 분석해서 다음 달 예상 매출과 마진,
//          어떤 카테고리가 성장하는지를 예측해서 기업 파트너의 재고·물류 계획에 활용합니다"

const { GoogleGenAI, Type } = require('@google/genai');
const db = require('../db/init');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `너는 해외직구 플랫폼 "Kakao MOHE"의 수요·수익 예측 AI다.
기업 파트너에게 보여줄 대시보드용으로, 지금까지 쌓인 주문 통계 요약을 보고 다음을 추정한다:
1. 다음 달 예상 매출(원화, 플랫폼 대행수수료 총합 기준)
2. 다음 달 예상 순이익 (수수료 매출에서 운영비 비율을 합리적으로 가정하여 추정)
3. 성장이 예상되는 카테고리 1~2개와 그 이유
4. 재고/물류 준비를 위한 제안 1~2가지

규칙:
- 입력된 통계가 적을수록(주문 건수가 적을수록) 예측 신뢰도를 낮게 잡고, 그 사실을 언급해라.
- 숫자는 과장하지 말고 입력된 데이터 규모에 비례하는 현실적인 범위로 추정해라.
- 반드시 지정된 JSON 스키마 형식으로만 응답해라.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    estimated_next_month_revenue_krw: { type: Type.NUMBER },
    estimated_next_month_profit_krw: { type: Type.NUMBER },
    confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
    growth_categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['category', 'reason'],
      },
    },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    summary: { type: Type.STRING, description: '대시보드 상단에 한 줄로 보여줄 요약 문구' },
  },
  required: [
    'estimated_next_month_revenue_krw',
    'estimated_next_month_profit_krw',
    'confidence',
    'growth_categories',
    'recommendations',
    'summary',
  ],
};

// orders 테이블을 집계해서 AI에게 넘길 요약 통계를 만든다.
function buildOrderStats() {
  const orders = db.prepare(`SELECT * FROM orders`).all();

  const totalOrders = orders.length;
  let totalRevenue = 0; // 플랫폼 수수료 합산 (실질 매출로 취급)
  const categoryCounts = {};

  orders.forEach((o) => {
    if (!o.ai_estimate) return;
    let estimate;
    try {
      estimate = JSON.parse(o.ai_estimate);
    } catch {
      return;
    }
    const fee = estimate.breakdown?.platform_fee_krw || 0;
    totalRevenue += fee;

    const cat = estimate.category || '미분류';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  return { totalOrders, totalRevenue, topCategories };
}

async function predictBusinessTrend() {
  const stats = buildOrderStats();

  const userPrompt = `현재까지 누적 데이터:
- 전체 주문 건수: ${stats.totalOrders}건
- 누적 플랫폼 수수료 매출: ${stats.totalRevenue.toLocaleString()}원
- 카테고리별 주문 건수 (상위): ${
    stats.topCategories.length > 0
      ? stats.topCategories.map((c) => `${c.category} ${c.count}건`).join(', ')
      : '데이터 없음'
  }

위 데이터를 바탕으로 다음 달 수요·수익 예측 결과를 산출해줘. 데이터가 적으면 그 점을 감안해서 신뢰도를 낮게 잡아줘.`;

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

  return { ...parsed, __stats: stats };
}

module.exports = { predictBusinessTrend };
