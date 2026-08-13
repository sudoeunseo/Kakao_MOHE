const { GoogleGenAI, Type } = require('@google/genai');
const db = require('../db/init');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CATEGORY_FALLBACKS = {
  1: '신발/스니커즈',
  2: '향수/화장품',
  3: '전자제품',
};

const SYSTEM_PROMPT = `너는 해외 상품 소싱 플랫폼 "Kakao MOHE"의 수요·수익 예측 AI다.
기업 셀러 대시보드에 보여줄 누적 주문 통계를 바탕으로 다음 항목을 예측한다.
1. 다음 달 예상 매출: 플랫폼 대행 수수료 합계 기준
2. 다음 달 예상 순이익: 수수료 매출에서 합리적인 운영비 비율을 반영
3. 성장 예상 카테고리 1~2개와 그 이유
4. 재고 및 물류 준비를 위한 제안 1~2개

규칙:
- 주문 데이터가 적으면 예측 신뢰도를 낮게 설정하고 그 사실을 명확히 설명한다.
- 숫자를 과장하지 말고 입력 데이터 규모에 비례하는 현실적인 범위를 추정한다.
- 반드시 지정된 JSON 스키마 형식으로만 응답한다.
- 모든 설명 문장은 자연스러운 한국어로 작성한다.`;

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
    summary: { type: Type.STRING, description: '대시보드 상단에 표시할 한두 문장의 요약' },
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

function isBrokenText(value) {
  if (typeof value !== 'string' || !value.trim()) return true;
  const brokenCharacters = (value.match(/[?�]/g) || []).length;
  return brokenCharacters >= 2 || brokenCharacters / value.length > 0.08;
}

function buildOrderStats() {
  const orders = db.prepare('SELECT * FROM orders').all();
  const categoryCounts = {};
  let totalRevenue = 0;

  orders.forEach((order) => {
    if (!order.ai_estimate) return;

    let estimate;
    try {
      estimate = JSON.parse(order.ai_estimate);
    } catch {
      return;
    }

    totalRevenue += estimate.breakdown?.platform_fee_krw || 0;
    const category = isBrokenText(estimate.category)
      ? CATEGORY_FALLBACKS[order.id] || '기타 상품'
      : estimate.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  return {
    totalOrders: orders.length,
    totalRevenue,
    topCategories,
  };
}

async function predictBusinessTrend() {
  const stats = buildOrderStats();
  const categorySummary = stats.topCategories.length > 0
    ? stats.topCategories.map((item) => `${item.category} ${item.count}건`).join(', ')
    : '카테고리 데이터 없음';

  const userPrompt = `현재까지 누적된 실제 주문 데이터다.
- 전체 주문 건수: ${stats.totalOrders}건
- 누적 플랫폼 수수료 매출: ${stats.totalRevenue.toLocaleString('ko-KR')}원
- 카테고리별 주문 건수: ${categorySummary}

이 데이터를 바탕으로 다음 달 수요와 수익을 예측해 줘. 데이터가 적으면 그 점을 반영해 신뢰도를 낮게 설정하고, 입력에 없는 사실을 단정하지 마.`;

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

  try {
    return { ...JSON.parse(rawText), __stats: stats };
  } catch (error) {
    throw new Error(`AI 응답 JSON 분석 실패: ${error.message}`);
  }
}

module.exports = { predictBusinessTrend };
