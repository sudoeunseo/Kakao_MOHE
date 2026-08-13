import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
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
    const statusCounts = STATUS_STEPS.reduce((acc, step) => {
      acc[step.key] = orders.filter((order) => order.status === step.key).length;
      return acc;
    }, {});
    const riskOrders = orders.filter((order) => (order.ai_estimate?.risk_notes?.length || 0) > 0);
    return {
      statusCounts,
      paid: statusCounts.paid || 0,
      inTransit: (statusCounts.shipping || 0) + (statusCounts.customs || 0),
      riskOrders,
      maxCount: Math.max(1, ...STATUS_STEPS.map((s) => statusCounts[s.key] || 0)),
    };
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
      {loading ? (
        <LoadingSpinner label="통합 주문 데이터를 불러오고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>운영 데이터를 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>다시 시도</button>
        </div>
      ) : (
        <>
          <section className="kpi-grid">
            <article className="kpi-card">
              <div className="kpi-card-head"><span>신규 주문</span><Icon name="shopping_bag" /></div>
              <strong>{orders.length}</strong>
              <small>전체 접수된 주문</small>
            </article>
            <article className="kpi-card">
              <div className="kpi-card-head"><span>결제 완료</span><Icon name="package_2" /></div>
              <strong>{metrics.paid}</strong>
              <small>출고 준비 대상</small>
            </article>
            <article className="kpi-card">
              <div className="kpi-card-head"><span>배송 중</span><Icon name="local_shipping" /></div>
              <strong>{metrics.inTransit}</strong>
              <small>국제운송 + 통관</small>
            </article>
            <article className="kpi-card warn">
              <div className="kpi-card-head"><span>주의 필요</span><Icon name="warning" /></div>
              <strong>{metrics.riskOrders.length}</strong>
              <small>AI 통관 위험 감지</small>
            </article>
          </section>

          <section className="home-grid">
            <div className="content-card chart-card">
              <div className="card-heading-row">
                <div><span>ORDER STATUS</span><h2>상태별 주문 현황</h2></div>
              </div>
              <div className="bar-chart">
                {STATUS_STEPS.map((step) => {
                  const count = metrics.statusCounts[step.key] || 0;
                  const pct = Math.round((count / metrics.maxCount) * 100);
                  return (
                    <div key={step.key} className="bar-chart-col">
                      <span className="bar-chart-value">{count}</span>
                      <div className="bar-chart-track">
                        <div className="bar-chart-bar" style={{ height: `${Math.max(pct, count > 0 ? 6 : 2)}%` }} />
                      </div>
                      <span className="bar-chart-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="content-card action-card">
              <div className="card-heading-row">
                <div><span>ACTION NEEDED</span><h2>처리 필요 업무</h2></div>
              </div>
              {metrics.riskOrders.length === 0 ? (
                <p className="action-empty">현재 AI가 감지한 통관 위험 주문이 없습니다.</p>
              ) : (
                <ul className="action-list">
                  {metrics.riskOrders.slice(0, 4).map((order) => (
                    <li key={order.id}>
                      <span className="action-icon"><Icon name="error" /></span>
                      <div>
                        <strong>{order.product_name}</strong>
                        <small>#{String(order.id).padStart(4, "0")} · {order.ai_estimate.risk_notes[0]}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className="secondary-action compact-action nav-action" onClick={() => navigate("/business/orders")}>
                전체 보기
              </button>
            </div>
          </section>

          <section className="ai-briefing-band">
            <span className="ai-briefing-icon"><Icon name="smart_toy" /></span>
            <div>
              <h3>MOHE AI 물류 브리핑</h3>
              {trendLoading ? (
                <p>AI가 누적 주문을 분석하고 있습니다...</p>
              ) : trendError ? (
                <p>브리핑을 불러오지 못했습니다: {trendError}</p>
              ) : (
                <p>{trend.summary}</p>
              )}
              <button className="text-link-action light" onClick={() => navigate("/business/revenue")}>
                자세히 보기 <Icon name="arrow_forward" />
              </button>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

export default BusinessDashboardPage;
