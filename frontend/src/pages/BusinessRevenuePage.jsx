import { useCallback, useEffect, useMemo, useState } from "react";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getOrderDisplay } from "../utils/orderDisplay";
import useLanguage from "../context/useLanguage";

const COST_SEGMENTS = [
  { key: "product_price_krw", ko: "상품가", en: "Product Cost", color: "seg-a" },
  { key: "intl_shipping_krw", ko: "국제배송비", en: "Intl. Shipping", color: "seg-b" },
  { key: "duty_and_vat_krw", ko: "관세·부가세", en: "Duty & VAT", color: "seg-c" },
  { key: "platform_fee_krw", ko: "대행 수수료", en: "Service Fee", color: "seg-d" },
];

const CHART_COLORS = ["#17213a", "#3d6df2", "#ffcd00", "#17a875", "#cf4141", "#9aa4b5"];

function BusinessRevenuePage() {
  const { language, t } = useLanguage();
  const [trend, setTrend] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const loadTrend = useCallback(async () => {
    setTrendLoading(true);
    setTrendError("");
    try {
      setTrend(await api("/api/business-trend"));
    } catch (requestError) {
      setTrendError(requestError.message);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      setOrders(await api("/api/orders/all"));
    } catch (requestError) {
      setOrdersError(requestError.message);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrend();
    loadOrders();
  }, [loadTrend, loadOrders]);

  // orders/all 은 business-trend AI 호출 성공 여부와 무관하게 항상 받아오는 값이라,
  // 누적 주문 통계는 여기서 직접 집계한다 (AI가 쿼터 초과 등으로 실패해도 실제 데이터는 보여줄 수 있게).
  const realStats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.ai_estimate?.breakdown?.platform_fee_krw || 0),
      0,
    );
    const categoryCounts = {};
    orders.forEach((order) => {
      const category = getOrderDisplay(order, language).category;
      if (!category) return;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCategories = sortedCategories.slice(0, 5).map(([category, count]) => ({ category, count }));
    const remainingCount = sortedCategories.slice(5).reduce((sum, [, count]) => sum + count, 0);
    const chartCategories = [
      ...topCategories,
      ...(remainingCount ? [{ category: t("기타", "Other"), count: remainingCount }] : []),
    ];
    return { totalOrders, totalRevenue, topCategories, chartCategories };
  }, [language, orders, t]);

  const dailySeries = useMemo(() => {
    const byDate = new Map();
    [...orders]
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
      .forEach((order) => {
        const date = String(order.created_at || "").slice(0, 10);
        if (!date) return;
        const current = byDate.get(date) || { date, orders: 0, fee: 0 };
        current.orders += 1;
        current.fee += order.ai_estimate?.breakdown?.platform_fee_krw || 0;
        byDate.set(date, current);
      });

    let cumulativeFee = 0;
    return [...byDate.values()].map((item) => {
      cumulativeFee += item.fee;
      return { ...item, cumulativeFee };
    });
  }, [orders]);

  const dataReadiness = useMemo(() => {
    const estimated = orders.filter((order) => order.ai_estimate?.breakdown).length;
    const countries = new Set(orders.map((order) => order.origin_country).filter(Boolean)).size;
    const observedDays = dailySeries.length;
    const volumeScore = Math.min(100, (orders.length / 30) * 100);
    const coverageScore = Math.min(100, (observedDays / 21) * 100);
    const completenessScore = orders.length ? (estimated / orders.length) * 100 : 0;
    const score = Math.round((volumeScore * 0.45) + (coverageScore * 0.25) + (completenessScore * 0.3));
    return { score, estimated, countries, observedDays };
  }, [dailySeries, orders]);

  const forecastRange = useMemo(() => {
    if (!trend?.estimated_next_month_revenue_krw) return null;
    const margin = trend.confidence === "high" ? 0.08 : trend.confidence === "medium" ? 0.16 : 0.25;
    const center = trend.estimated_next_month_revenue_krw;
    return { low: Math.round(center * (1 - margin)), high: Math.round(center * (1 + margin)), margin: Math.round(margin * 100) };
  }, [trend]);

  const costBreakdown = useMemo(() => {
    const totals = COST_SEGMENTS.reduce((acc, seg) => ({ ...acc, [seg.key]: 0 }), {});
    orders.forEach((order) => {
      const breakdown = order.ai_estimate?.breakdown;
      if (!breakdown) return;
      COST_SEGMENTS.forEach((seg) => {
        totals[seg.key] += breakdown[seg.key] || 0;
      });
    });
    const sum = COST_SEGMENTS.reduce((s, seg) => s + totals[seg.key], 0);
    return COST_SEGMENTS.map((seg) => ({
      ...seg,
      amount: totals[seg.key],
      pct: sum > 0 ? Math.round((totals[seg.key] / sum) * 100) : 0,
    }));
  }, [orders]);

  return (
    <Layout
      title={t("분석", "Analytics")}
      description={t("누적 주문 데이터를 기반으로 AI가 다음 달 매출·순이익과 성장 카테고리를 예측합니다.", "AI forecasts next month's revenue, profit, and growth categories from cumulative orders.")}
      actions={
        <button
          className="secondary-action compact-action"
          onClick={() => {
            loadTrend();
            loadOrders();
          }}
        >
          {t("다시 예측하기", "Run forecast again")}
        </button>
      }
    >
      {ordersLoading ? (
        <LoadingSpinner label={t("주문 데이터를 불러오고 있습니다", "Loading order data")} />
      ) : ordersError ? (
        <div className="empty-state error-state">
          <strong>{t("주문 데이터를 불러오지 못했습니다.", "Could not load order data.")}</strong>
          <p>{ordersError}</p>
          <button className="secondary-action" onClick={loadOrders}>{t("다시 시도", "Try again")}</button>
        </div>
      ) : (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <span>{t("누적 주문", "Cumulative Orders")}</span>
              <strong>{realStats.totalOrders}<small>{t("건", "")}</small></strong>
              <p>{t("지금까지 결제 완료된 전체 주문", "All completed orders to date")}</p>
            </article>
            <article className="metric-card">
              <span>{t("누적 대행 수수료 매출", "Cumulative Service Fee Revenue")}</span>
              <strong>{formatWon(realStats.totalRevenue)}</strong>
              <p>{t("플랫폼 수수료 합산 기준", "Based on total platform fees")}</p>
            </article>
            <article className="metric-card accent-metric">
              <span>{t("AI 예측 다음달 매출", "AI Forecast Revenue")}</span>
              <strong>{trendLoading ? "…" : trendError ? "-" : formatWon(trend.estimated_next_month_revenue_krw)}</strong>
              <p>{t("수수료 매출 기준 추정", "Estimated from service fee revenue")}</p>
            </article>
            <article className="metric-card accent-metric">
              <span>{t("AI 예측 다음달 순이익", "AI Forecast Net Profit")}</span>
              <strong>{trendLoading ? "…" : trendError ? "-" : formatWon(trend.estimated_next_month_profit_krw)}</strong>
              <p>{t("운영비 비율 반영 추정", "Estimated after operating costs")}</p>
            </article>
          </section>

          <section className="content-card cost-structure-card">
            <div className="card-heading-row">
              <div><span>REAL DATA</span><h2>{t("비용 구조", "Cost Structure")}</h2></div>
              <small>{t("누적 주문 AI 예측 합산 기준", "Aggregated from order estimates")}</small>
            </div>
            {costBreakdown.every((seg) => seg.amount === 0) ? (
              <p className="action-empty">{t("아직 비용 구조를 계산할 주문 데이터가 없습니다.", "There is not enough order data to calculate the cost structure.")}</p>
            ) : (
              <>
                <div className="cost-bar">
                  {costBreakdown.map((seg) => (
                    <div key={seg.key} className={`cost-bar-seg ${seg.color}`} style={{ width: `${seg.pct}%` }} title={seg[language]} />
                  ))}
                </div>
                <div className="cost-legend">
                  {costBreakdown.map((seg) => (
                    <div key={seg.key} className="cost-legend-item">
                      <span className={`legend-dot ${seg.color}`} />
                      <span>{seg[language]} ({seg.pct}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="content-card analytics-trend-card">
            <div className="card-heading-row">
              <div><span>VERIFIABLE DATA</span><h2>{t("일별 주문·수수료 추이", "Daily Orders & Fee Trend")}</h2></div>
              <small>{t("막대: 주문 건수 · 선: 누적 대행 수수료", "Bars: orders · Line: cumulative service fees")}</small>
            </div>
            <TrendChart data={dailySeries} language={language} />
            <p className="chart-source-note">{t("출처: 실제 주문 DB의 주문일과 AI 비용 산출 결과 · 마지막 갱신 시점 기준", "Source: order dates and AI cost estimates stored in the live order database.")}</p>
          </section>

          <section className="ai-briefing wide-briefing">
            <div className="card-heading-row">
              <div>
                <span>MOHE AI SUMMARY</span>
                <h2>{trendLoading
                  ? t("AI가 누적 주문을 분석하고 있습니다...", "AI is analyzing cumulative orders...")
                  : trendError
                    ? t(`브리핑을 불러오지 못했습니다: ${trendError}`, "Could not load the AI briefing.")
                    : t(trend.summary, "The forecast reflects the currently limited order data and will become more precise as additional orders accumulate.")}</h2>
              </div>
              {trend && !trendLoading && !trendError && (
                <div className="forecast-status-group">
                  {trend.__fallback && <span className="forecast-source-tag">{t("통계 안전 모드", "Statistical fallback")}</span>}
                  <span className={`confidence-tag ${trend.confidence}`}>{t("신뢰도", "Confidence")} {trend.confidence}</span>
                </div>
              )}
            </div>
            {!trendLoading && !trendError && (
              <div className="forecast-evidence">
                <div className="readiness-score">
                  <div><span>{t("데이터 준비도", "Data Readiness")}</span><strong>{dataReadiness.score}<small>/100</small></strong></div>
                  <div className="readiness-track"><i style={{ width: `${dataReadiness.score}%` }} /></div>
                  <p>{t("실제 데이터의 양·관측 기간·AI 분석 완성도를 합산한 점수입니다.", "A combined score for sample size, observation period, and estimate completeness.")}</p>
                </div>
                {trend.__fallback && (
                  <div className="fallback-explanation">
                    <strong>{t("AI 제공자 한도 초과로 실제 주문 통계 예측을 표시 중입니다.", "The AI provider limit was reached, so a forecast based on real order statistics is shown.")}</strong>
                    <span>{t("Gemini 할당량이 복구되면 다시 예측하기 버튼으로 생성형 AI 분석을 갱신할 수 있습니다.", "When the Gemini quota recovers, run the forecast again to refresh the generative AI analysis.")}</span>
                  </div>
                )}
                <div className="evidence-stat"><span>{t("실제 주문", "Real orders")}</span><strong>{realStats.totalOrders}{t("건", "")}</strong></div>
                <div className="evidence-stat"><span>{t("관측 일수", "Observed days")}</span><strong>{dataReadiness.observedDays}{t("일", " days")}</strong></div>
                <div className="evidence-stat"><span>{t("출발 국가", "Origin countries")}</span><strong>{dataReadiness.countries}{t("개국", "")}</strong></div>
                <div className="evidence-stat"><span>{t("비용 분석 완료", "Cost estimates")}</span><strong>{dataReadiness.estimated}/{realStats.totalOrders}</strong></div>
                {forecastRange && (
                  <div className="forecast-range">
                    <span>{t("다음 달 합리적 예측 범위", "Reasonable next-month range")}</span>
                    <strong>{formatWon(forecastRange.low)} – {formatWon(forecastRange.high)}</strong>
                    <small>{t(`${trend.confidence.toUpperCase()} 신뢰도에 따라 기준 예측값의 ±${forecastRange.margin}% 범위를 표시합니다.`, `Shows ±${forecastRange.margin}% around the baseline because confidence is ${trend.confidence.toUpperCase()}.`)}</small>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="revenue-grid">
            <section className="content-card">
              <div className="card-heading-row">
                <div><span>REAL DATA</span><h2>{t("카테고리별 주문 현황", "Orders by Category")}</h2></div>
                <small>{t("누적 상위 5개", "Top 5 cumulative")}</small>
              </div>
              {realStats.topCategories.length ? (
                <CategoryDonut categories={realStats.chartCategories} total={realStats.totalOrders} language={language} />
              ) : (
                <p className="action-empty">{t("아직 카테고리 데이터가 없습니다.", "No category data is available yet.")}</p>
              )}
            </section>

            <section className="content-card">
              <div className="card-heading-row">
                <div><span>AI FORECAST</span><h2>{t("성장 예상 카테고리", "Forecast Growth Categories")}</h2></div>
              </div>
              {trendLoading ? (
                <p className="action-empty">{t("AI 분석 중입니다...", "AI analysis in progress...")}</p>
              ) : trendError ? (
                <p className="action-empty">{t("AI 예측을 불러오지 못했습니다.", "Could not load the AI forecast.")}</p>
              ) : trend.growth_categories?.length ? (
                <ul className="category-list growth">
                  {trend.growth_categories.map((item) => (
                    <li key={item.category}>
                      <strong>{language === "en" ? "Growth Opportunity" : item.category}</strong>
                      <p>{t(item.reason, "This category shows potential based on the current order mix and should be monitored as more data accumulates.")}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="action-empty">{t("아직 뚜렷한 성장 신호가 감지되지 않았습니다.", "No clear growth signal has been detected yet.")}</p>
              )}
            </section>
          </div>

          <section className="content-card recommendation-card">
            <div className="card-heading-row">
              <div><span>NEXT ACTION</span><h2>{t("재고·물류 준비 제안", "Inventory & Logistics Recommendations")}</h2></div>
            </div>
            {trendLoading ? (
              <p className="action-empty">{t("AI 분석 중입니다...", "AI analysis in progress...")}</p>
            ) : trendError ? (
              <p className="action-empty">{t(`AI 예측을 불러오지 못해 제안을 표시할 수 없습니다: ${trendError}`, "Recommendations cannot be displayed because the AI forecast failed.")}</p>
            ) : trend.recommendations?.length ? (
              <ul className="briefing-list wide">
                {trend.recommendations.map((rec, index) => <li key={rec}>{t(rec, index === 0 ? "Monitor demand before increasing inventory commitments." : "Compare MOHE hub conditions before assigning the next sourcing route.")}</li>)}
              </ul>
            ) : (
              <p className="action-empty">{t("현재 추가로 제안할 사항이 없습니다.", "There are no additional recommendations at this time.")}</p>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}

function TrendChart({ data, language }) {
  if (!data.length) return <p className="action-empty">No trend data</p>;

  const width = 920;
  const height = 270;
  const left = 54;
  const right = 884;
  const top = 28;
  const bottom = 218;
  const slot = (right - left) / data.length;
  const maxOrders = Math.max(1, ...data.map((item) => item.orders));
  const maxFee = Math.max(1, ...data.map((item) => item.cumulativeFee));
  const labelStride = Math.max(1, Math.ceil(data.length / 11));
  const points = data.map((item, index) => ({
    ...item,
    x: left + (slot * index) + (slot / 2),
    y: bottom - ((item.cumulativeFee / maxFee) * (bottom - top)),
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points.at(-1).x},${bottom} L${points[0].x},${bottom} Z`;

  return (
    <div className="trend-chart-wrap">
      <div className="trend-chart-legend">
        <span><i className="orders" />{language === "en" ? "Daily orders" : "일별 주문"}</span>
        <span><i className="fees" />{language === "en" ? "Cumulative fees" : "누적 수수료"}</span>
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={language === "en" ? "Daily order and cumulative fee chart" : "일별 주문 및 누적 수수료 그래프"}>
        {[0, 0.33, 0.66, 1].map((ratio) => {
          const y = bottom - ((bottom - top) * ratio);
          return <line key={ratio} x1={left} x2={right} y1={y} y2={y} className="chart-grid-line" />;
        })}
        <text x="8" y={top + 4} className="chart-axis-label">{compactWon(maxFee, language)}</text>
        <text x="20" y={bottom + 4} className="chart-axis-label">0</text>
        <path d={area} className="fee-area" />
        {points.map((point, index) => {
          const barHeight = (point.orders / maxOrders) * 92;
          const barWidth = Math.min(30, slot * 0.38);
          return (
            <g key={point.date}>
              <rect x={point.x - (barWidth / 2)} y={bottom - barHeight} width={barWidth} height={barHeight} rx="5" className="order-volume-bar">
                <title>{point.date}: {point.orders} orders</title>
              </rect>
              <text x={point.x} y={bottom - barHeight - 8} textAnchor="middle" className="bar-value">{point.orders}</text>
              {(index % labelStride === 0 || index === points.length - 1) && (
                <text x={point.x} y="249" textAnchor="middle" className="chart-date-label">{point.date.slice(5).replace("-", "/")}</text>
              )}
            </g>
          );
        })}
        <path d={line} className="fee-line" />
        {points.map((point) => (
          <circle key={`point-${point.date}`} cx={point.x} cy={point.y} r="4.5" className="fee-point">
            <title>{point.date}: {compactWon(point.cumulativeFee, language)}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function CategoryDonut({ categories, total, language }) {
  let cursor = 0;
  const stops = categories.map((item, index) => {
    const start = cursor;
    cursor += total ? (item.count / total) * 100 : 0;
    return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}% ${cursor}%`;
  }).join(", ");

  return (
    <div className="category-chart-layout">
      <div className="category-donut" style={{ background: `conic-gradient(${stops})` }}>
        <div><strong>{total}</strong><span>{language === "en" ? "ORDERS" : "전체 주문"}</span></div>
      </div>
      <ul className="category-chart-list">
        {categories.map((item, index) => {
          const percent = total ? Math.round((item.count / total) * 100) : 0;
          return (
            <li key={item.category}>
              <div><i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} /><strong>{item.category}</strong><span>{item.count}{language === "en" ? "" : "건"} · {percent}%</span></div>
              <div className="category-share-track"><i style={{ width: `${percent}%`, background: CHART_COLORS[index % CHART_COLORS.length] }} /></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function compactWon(value, language) {
  if (language === "en") return value >= 1000 ? `₩${Math.round(value / 1000)}k` : `₩${value}`;
  return value >= 10000 ? `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}만원` : `${value.toLocaleString("ko-KR")}원`;
}

export default BusinessRevenuePage;
