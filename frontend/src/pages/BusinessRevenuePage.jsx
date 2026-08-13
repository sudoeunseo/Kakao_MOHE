import { useCallback, useEffect, useMemo, useState } from "react";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

const COST_SEGMENTS = [
  { key: "product_price_krw", label: "상품가", color: "seg-a" },
  { key: "intl_shipping_krw", label: "국제배송비", color: "seg-b" },
  { key: "duty_and_vat_krw", label: "관세·부가세", color: "seg-c" },
  { key: "platform_fee_krw", label: "대행 수수료", color: "seg-d" },
];

function BusinessRevenuePage() {
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
      const category = order.ai_estimate?.category;
      if (!category) return;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
    return { totalOrders, totalRevenue, topCategories };
  }, [orders]);

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
      title="분석"
      description="누적 주문 데이터를 기반으로 AI가 다음 달 매출·순이익과 성장 카테고리를 예측합니다."
      actions={
        <button
          className="secondary-action compact-action"
          onClick={() => {
            loadTrend();
            loadOrders();
          }}
        >
          다시 예측하기
        </button>
      }
    >
      {ordersLoading ? (
        <LoadingSpinner label="주문 데이터를 불러오고 있습니다" />
      ) : ordersError ? (
        <div className="empty-state error-state">
          <strong>주문 데이터를 불러오지 못했습니다.</strong>
          <p>{ordersError}</p>
          <button className="secondary-action" onClick={loadOrders}>다시 시도</button>
        </div>
      ) : (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <span>누적 주문</span>
              <strong>{realStats.totalOrders}<small>건</small></strong>
              <p>지금까지 결제 완료된 전체 주문</p>
            </article>
            <article className="metric-card">
              <span>누적 대행 수수료 매출</span>
              <strong>{formatWon(realStats.totalRevenue)}</strong>
              <p>플랫폼 수수료 합산 기준</p>
            </article>
            <article className="metric-card accent-metric">
              <span>AI 예측 다음달 매출</span>
              <strong>{trendLoading ? "…" : trendError ? "-" : formatWon(trend.estimated_next_month_revenue_krw)}</strong>
              <p>수수료 매출 기준 추정</p>
            </article>
            <article className="metric-card accent-metric">
              <span>AI 예측 다음달 순이익</span>
              <strong>{trendLoading ? "…" : trendError ? "-" : formatWon(trend.estimated_next_month_profit_krw)}</strong>
              <p>운영비 비율 반영 추정</p>
            </article>
          </section>

          <section className="content-card cost-structure-card">
            <div className="card-heading-row">
              <div><span>REAL DATA</span><h2>비용 구조</h2></div>
              <small>누적 주문 AI 예측 합산 기준</small>
            </div>
            {costBreakdown.every((seg) => seg.amount === 0) ? (
              <p className="action-empty">아직 비용 구조를 계산할 주문 데이터가 없습니다.</p>
            ) : (
              <>
                <div className="cost-bar">
                  {costBreakdown.map((seg) => (
                    <div key={seg.key} className={`cost-bar-seg ${seg.color}`} style={{ width: `${seg.pct}%` }} title={seg.label} />
                  ))}
                </div>
                <div className="cost-legend">
                  {costBreakdown.map((seg) => (
                    <div key={seg.key} className="cost-legend-item">
                      <span className={`legend-dot ${seg.color}`} />
                      <span>{seg.label} ({seg.pct}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="ai-briefing wide-briefing">
            <div className="card-heading-row">
              <div>
                <span>MOHE AI SUMMARY</span>
                <h2>{trendLoading ? "AI가 누적 주문을 분석하고 있습니다..." : trendError ? `브리핑을 불러오지 못했습니다: ${trendError}` : trend.summary}</h2>
              </div>
              {trend && !trendLoading && !trendError && (
                <span className={`confidence-tag ${trend.confidence}`}>신뢰도 {trend.confidence}</span>
              )}
            </div>
            {!trendLoading && !trendError && realStats.totalOrders < 5 && (
              <p className="action-empty">
                누적 주문이 적어 예측 신뢰도가 낮게 반영되어 있습니다. 주문이 쌓일수록 예측이 정교해집니다.
              </p>
            )}
          </section>

          <div className="revenue-grid">
            <section className="content-card">
              <div className="card-heading-row">
                <div><span>REAL DATA</span><h2>카테고리별 주문 현황</h2></div>
                <small>누적 상위 5개</small>
              </div>
              {realStats.topCategories.length ? (
                <ul className="category-list">
                  {realStats.topCategories.map((item) => (
                    <li key={item.category}>
                      <strong>{item.category}</strong>
                      <span>{item.count}건</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="action-empty">아직 카테고리 데이터가 없습니다.</p>
              )}
            </section>

            <section className="content-card">
              <div className="card-heading-row">
                <div><span>AI FORECAST</span><h2>성장 예상 카테고리</h2></div>
              </div>
              {trendLoading ? (
                <p className="action-empty">AI 분석 중입니다...</p>
              ) : trendError ? (
                <p className="action-empty">AI 예측을 불러오지 못했습니다.</p>
              ) : trend.growth_categories?.length ? (
                <ul className="category-list growth">
                  {trend.growth_categories.map((item) => (
                    <li key={item.category}>
                      <strong>{item.category}</strong>
                      <p>{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="action-empty">아직 뚜렷한 성장 신호가 감지되지 않았습니다.</p>
              )}
            </section>
          </div>

          <section className="content-card recommendation-card">
            <div className="card-heading-row">
              <div><span>NEXT ACTION</span><h2>재고·물류 준비 제안</h2></div>
            </div>
            {trendLoading ? (
              <p className="action-empty">AI 분석 중입니다...</p>
            ) : trendError ? (
              <p className="action-empty">AI 예측을 불러오지 못해 제안을 표시할 수 없습니다: {trendError}</p>
            ) : trend.recommendations?.length ? (
              <ul className="briefing-list wide">
                {trend.recommendations.map((rec) => <li key={rec}>{rec}</li>)}
              </ul>
            ) : (
              <p className="action-empty">현재 추가로 제안할 사항이 없습니다.</p>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}

export default BusinessRevenuePage;
