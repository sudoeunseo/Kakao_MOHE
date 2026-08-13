import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_STEPS = [
  { key: "pending", label: "신규 접수" },
  { key: "paid", label: "결제완료" },
  { key: "shipping", label: "국제운송" },
  { key: "customs", label: "통관" },
  { key: "delivered", label: "배송완료" },
];

function BusinessDashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [trend, setTrend] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api("/api/orders/all");
      setOrders(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrend = useCallback(async () => {
    setTrendLoading(true);
    setTrendError("");
    try {
      const result = await api("/api/business-trend");
      setTrend(result);
    } catch (requestError) {
      setTrendError(requestError.message);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadTrend();
  }, [loadOrders, loadTrend]);

  const metrics = useMemo(() => {
    const totalCost = orders.reduce(
      (sum, order) => sum + (order.ai_estimate?.breakdown?.total_estimated_krw || 0),
      0,
    );
    const riskOrders = orders.filter(
      (order) => (order.ai_estimate?.risk_notes?.length || 0) > 0,
    );
    const dutyFree = orders.filter(
      (order) => order.ai_estimate?.is_duty_free_likely,
    ).length;
    const statusCounts = STATUS_STEPS.reduce((acc, step) => {
      acc[step.key] = orders.filter((order) => order.status === step.key).length;
      return acc;
    }, {});
    return { totalCost, riskOrders, dutyFree, statusCounts };
  }, [orders]);

  return (
    <Layout
      title="홈"
      description="B2C 주문과 AI 통관 분석을 연결해 운영 위험을 한눈에 파악합니다."
      actions={
        <button
          className="secondary-action compact-action"
          onClick={() => {
            loadOrders();
            loadTrend();
          }}
        >
          데이터 새로고침
        </button>
      }
    >
      <section className="metric-grid">
        <article className="metric-card accent-metric">
          <span>통합 주문</span>
          <strong>{orders.length}<small>건</small></strong>
          <p>구매자 주문 실시간 연동</p>
        </article>
        <article className="metric-card">
          <span>예상 총 거래액</span>
          <strong>{formatWon(metrics.totalCost)}</strong>
          <p>AI 산출 최종비용 합계</p>
        </article>
        <article className="metric-card warning-metric">
          <span>주의 필요 주문</span>
          <strong>{metrics.riskOrders.length}<small>건</small></strong>
          <p>통관 위험요소 사전 확인</p>
        </article>
        <article className="metric-card">
          <span>면세 예상</span>
          <strong>{metrics.dutyFree}<small>건</small></strong>
          <p>면세 가능성이 높은 주문</p>
        </article>
      </section>

      <section className="operation-strip">
        {STATUS_STEPS.map((step, index) => (
          <Fragment key={step.key}>
            {index > 0 && <span>→</span>}
            <div>
              <span className={`operation-dot ${metrics.statusCounts[step.key] > 0 ? "active" : ""}`} />
              <strong>{step.label}</strong>
              <small>{metrics.statusCounts[step.key] || 0}건</small>
            </div>
          </Fragment>
        ))}
      </section>

      {loading ? (
        <LoadingSpinner label="통합 주문 데이터를 불러오고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>운영 데이터를 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>다시 시도</button>
        </div>
      ) : (
        <div className="home-grid">
          <section className="content-card action-card">
            <div className="card-heading-row">
              <div><span>ACTION NEEDED</span><h2>확인이 필요한 업무</h2></div>
              <button className="secondary-action compact-action" onClick={() => navigate("/business/orders")}>
                주문 관리로 이동
              </button>
            </div>
            {metrics.riskOrders.length === 0 ? (
              <p className="action-empty">현재 AI가 감지한 통관 위험 주문이 없습니다.</p>
            ) : (
              <ul className="action-list">
                {metrics.riskOrders.slice(0, 5).map((order) => (
                  <li key={order.id}>
                    <span className="action-icon">!</span>
                    <div>
                      <strong>{order.product_name}</strong>
                      <small>
                        #{String(order.id).padStart(4, "0")} · {order.ai_estimate.risk_notes[0]}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="ai-briefing">
            <div className="card-heading-row">
              <div><span>MOHE AI</span><h2>수요·수익 브리핑</h2></div>
              {trend && <span className={`confidence-tag ${trend.confidence}`}>{trend.confidence}</span>}
            </div>

            {trendLoading ? (
              <LoadingSpinner label="AI가 누적 주문을 분석하고 있습니다" />
            ) : trendError ? (
              <p className="action-empty">브리핑을 불러오지 못했습니다: {trendError}</p>
            ) : (
              <>
                <p className="briefing-summary">{trend.summary}</p>
                <div className="briefing-grid">
                  <div>
                    <span>다음달 예상 매출</span>
                    <strong>{formatWon(trend.estimated_next_month_revenue_krw)}</strong>
                  </div>
                  <div>
                    <span>다음달 예상 순이익</span>
                    <strong>{formatWon(trend.estimated_next_month_profit_krw)}</strong>
                  </div>
                </div>
                {trend.recommendations?.length > 0 && (
                  <ul className="briefing-list">
                    {trend.recommendations.map((rec) => <li key={rec}>{rec}</li>)}
                  </ul>
                )}
                <button className="secondary-action compact-action briefing-more" onClick={() => navigate("/business/revenue")}>
                  통계·분석에서 자세히 보기
                </button>
              </>
            )}
          </section>
        </div>
      )}

      <section className="future-modules">
        <div className="card-heading-row">
          <div><span>NEXT OPERATION</span><h2>데이터가 이어 만드는 물류 최적화</h2></div>
          <small>서비스 확장 모듈</small>
        </div>
        <div className="future-grid">
          <article><span>01</span><strong>통관 지연 예측</strong><p>세관 혼잡과 서류 위험을 사전에 감지합니다.</p></article>
          <article><span>02</span><strong>물류센터 자동 배정</strong><p>주문지역에 맞춰 최적 거점을 추천합니다.</p></article>
          <article><span>03</span><strong>카카오 T 배차</strong><p>통관 완료시간에 맞춰 차량을 예약합니다.</p></article>
        </div>
      </section>
    </Layout>
  );
}

export default BusinessDashboardPage;
