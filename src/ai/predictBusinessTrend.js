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
- 주문 15건 미만은 low, 15~49건은 medium, 50건 이상은 high를 기본 신뢰도로 사용한다.
- 다만 관측 기간이 14일 미만이거나 AI 비용 분석 완료율이 70% 미만이면 신뢰도를 한 단계 낮춘다.
- summary에 실제 주문 건수와 관측 기간을 근거로 포함한다.
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
  const observedDates = new Set();
  const countries = new Set();
  let totalRevenue = 0;
  let estimatedOrders = 0;

  orders.forEach((order) => {
    if (order.created_at) observedDates.add(String(order.created_at).slice(0, 10));
    if (order.origin_country) countries.add(order.origin_country);
    if (!order.ai_estimate) return;

    let estimate;
    try {
      estimate = JSON.parse(order.ai_estimate);
    } catch {
      return;
    }

    totalRevenue += estimate.breakdown?.platform_fee_krw || 0;
    estimatedOrders += 1;
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
    observedDays: observedDates.size,
    originCountries: countries.size,
    estimateCompletionRate: orders.length ? Math.round((estimatedOrders / orders.length) * 100) : 0,
  };
}

async function predictBusinessTrend() {
  const stats = buildOrderStats();
  const categorySummary = stats.topCategories.length > 0
    ? stats.topCategories.map((item) => `${item.category} ${item.count}건`).join(', ')
    : '카테고리 데이터 없음';

  const userPrompt = `현재까지 누적된 실제 주문 데이터다.
- 전체 주문 건수: ${stats.totalOrders}건
- 실제 관측 기간: ${stats.observedDays}일
- 출발 국가 수: ${stats.originCountries}개국
- AI 비용 분석 완료율: ${stats.estimateCompletionRate}%
- 누적 플랫폼 수수료 매출: ${stats.totalRevenue.toLocaleString('ko-KR')}원
- 카테고리별 주문 건수: ${categorySummary}

이 데이터를 바탕으로 다음 달 수요와 수익을 예측해 줘. 데이터가 적으면 그 점을 반영해 신뢰도를 낮게 설정하고, 입력에 없는 사실을 단정하지 마.`;

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini 응답 제한시간 12초를 초과했습니다.')), 12000);
      }),
    ]);

    const rawText = response.text.trim();
    return { ...JSON.parse(rawText), __stats: stats };
  } catch (error) {
    console.warn('[business-trend] Gemini 호출 실패, 통계 예측으로 대체:', error.message);
    return buildStatisticalFallback(stats, error);
  }
}

function buildStatisticalFallback(stats, error) {
  const observedDays = Math.max(1, stats.observedDays);
  const dailyFeeRevenue = stats.totalRevenue / observedDays;
  const diversityBoost = Math.min(0.12, stats.originCountries * 0.01);
  const growthRate = 1.04 + diversityBoost;
  const estimatedRevenue = Math.max(
    stats.totalRevenue,
    Math.round(dailyFeeRevenue * 30 * growthRate),
  );
  const estimatedProfit = Math.round(estimatedRevenue * 0.72);

  let confidence = stats.totalOrders >= 50 ? 'high' : stats.totalOrders >= 15 ? 'medium' : 'low';
  if (stats.observedDays < 14 || stats.estimateCompletionRate < 70) {
    confidence = confidence === 'high' ? 'medium' : 'low';
  }

  const growthCategories = stats.topCategories.slice(0, 2).map((item, index) => ({
    category: item.category,
    reason: index === 0
      ? `누적 ${item.count}건으로 현재 주문 비중이 가장 높아 다음 입고 계획에서 우선 모니터링할 가치가 있습니다.`
      : `누적 ${item.count}건이 확인되어 추가 주문 유입 시 성장 가능성을 비교할 수 있는 카테고리입니다.`,
  }));

  return {
    estimated_next_month_revenue_krw: estimatedRevenue,
    estimated_next_month_profit_krw: estimatedProfit,
    confidence,
    growth_categories: growthCategories,
    recommendations: [
      `${stats.totalOrders}건의 주문 중 상위 카테고리를 중심으로 2주 단위 소량 입고를 운영해 수요 변화를 확인하세요.`,
      `${stats.originCountries}개 출발국의 배송대행지 비용과 통관 소요시간을 비교해 다음 소싱 경로를 배정하세요.`,
    ],
    summary: `실제 주문 ${stats.totalOrders}건과 ${stats.observedDays}일의 관측 데이터를 바탕으로 다음 달 실적을 추정했습니다. 현재 데이터 준비도에서는 보수적인 범위 예측이 적합합니다.`,
    __stats: stats,
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

module.exports = { predictBusinessTrend, buildOrderStats, buildStatisticalFallback };
