import { useCallback, useEffect, useMemo, useState } from "react";
import { api, formatDate, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

function BusinessDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api("/api/orders/all");
      setOrders(result);
      setSelectedOrder((current) =>
        result.find((order) => order.id === current?.id) || result[0] || null,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const metrics = useMemo(() => {
    const totalCost = orders.reduce(
      (sum, order) => sum + (order.ai_estimate?.breakdown?.total_estimated_krw || 0),
      0,
    );
    const riskOrders = orders.filter(
      (order) => (order.ai_estimate?.risk_notes?.length || 0) > 0,
    ).length;
    const dutyFree = orders.filter(
      (order) => order.ai_estimate?.is_duty_free_likely,
    ).length;
    return { totalCost, riskOrders, dutyFree };
  }, [orders]);

  const estimate = selectedOrder?.ai_estimate;

  return (
    <Layout
      title="Global Flow Control Tower"
      description="B2C 주문과 AI 통관 분석을 연결해 운영 위험을 한눈에 파악합니다."
      actions={
        <button className="secondary-action compact-action" onClick={loadOrders}>
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
          <strong>{metrics.riskOrders}<small>건</small></strong>
          <p>통관 위험요소 사전 확인</p>
        </article>
        <article className="metric-card">
          <span>면세 예상</span>
          <strong>{metrics.dutyFree}<small>건</small></strong>
          <p>면세 가능성이 높은 주문</p>
        </article>
      </section>

      <section className="operation-strip">
        <div><span className="operation-dot active" /><strong>OMS</strong><small>주문 수집</small></div>
        <span>→</span>
        <div><span className="operation-dot active" /><strong>Customs AI</strong><small>품목·관세 예측</small></div>
        <span>→</span>
        <div><span className="operation-dot" /><strong>WMS</strong><small>센터 배정</small></div>
        <span>→</span>
        <div><span className="operation-dot" /><strong>Kakao T</strong><small>배송 실행</small></div>
      </section>

      {loading ? (
        <LoadingSpinner label="통합 주문 데이터를 불러오고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>운영 데이터를 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>다시 시도</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol">B2B</span>
          <strong>아직 연동된 주문이 없습니다.</strong>
          <p>구매자 계정에서 주문을 생성하면 이곳에 즉시 표시됩니다.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <section className="content-card orders-table-card">
            <div className="card-heading-row">
              <div><span>LIVE ORDERS</span><h2>통합 주문 현황</h2></div>
              <small>최근 주문순</small>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>주문</th><th>상품</th><th>출발국</th><th>예상금액</th><th>AI 신뢰도</th><th>상태</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={selectedOrder?.id === order.id ? "selected-row" : ""}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td>#{String(order.id).padStart(4, "0")}</td>
                      <td><strong>{order.product_name}</strong><small>{formatDate(order.created_at)}</small></td>
                      <td>{order.origin_country || "-"}</td>
                      <td>{order.ai_estimate ? formatWon(order.ai_estimate.breakdown?.total_estimated_krw) : "분석 없음"}</td>
                      <td><span className={`confidence-tag ${order.ai_estimate?.confidence || "none"}`}>{order.ai_estimate?.confidence || "-"}</span></td>
                      <td><span className="status-tag">결제 완료</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="order-detail-card">
            <div className="detail-heading">
              <span>ORDER INSIGHT</span>
              <h2>주문 #{String(selectedOrder.id).padStart(4, "0")}</h2>
              <p>{selectedOrder.product_name}</p>
            </div>

            <div className="detail-route">
              <div><span>출발</span><strong>{selectedOrder.origin_country || "-"}</strong></div>
              <div className="route-line"><span>AI 분석 완료</span></div>
              <div><span>도착</span><strong>KR</strong></div>
            </div>

            {estimate ? (
              <>
                <div className="detail-grid">
                  <div><span>품목 분류</span><strong>{estimate.category}</strong></div>
                  <div><span>HS Code</span><strong>{estimate.hs_code_guess}</strong></div>
                  <div><span>관세율</span><strong>{estimate.duty_rate_percent}%</strong></div>
                  <div><span>최종비용</span><strong>{formatWon(estimate.breakdown?.total_estimated_krw)}</strong></div>
                </div>
                <div className="detail-risk">
                  <strong>AI 통관 체크</strong>
                  {estimate.risk_notes?.length ? (
                    <ul>{estimate.risk_notes.map((risk) => <li key={risk}>{risk}</li>)}</ul>
                  ) : <p>현재 주요 위험요소가 없습니다.</p>}
                </div>
              </>
            ) : (
              <div className="detail-risk"><p>이 주문에는 AI 분석 결과가 없습니다.</p></div>
            )}
          </aside>
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
