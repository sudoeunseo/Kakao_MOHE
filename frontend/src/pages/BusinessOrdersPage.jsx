import { useCallback, useEffect, useMemo, useState } from "react";
import { api, formatDate, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_LABEL = {
  pending: "신규 접수",
  paid: "결제완료",
  shipping: "국제운송중",
  customs: "통관중",
  delivered: "배송완료",
};

const STATUS_OPTIONS = Object.entries(STATUS_LABEL);

function BusinessOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

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

  // 주문을 바꿔서 고르면, 이전에 골라둔(아직 적용 안 한) 단계 선택은 초기화한다.
  useEffect(() => {
    setPendingStatus(null);
  }, [selectedOrder?.id]);

  const displayedStatus = pendingStatus || selectedOrder?.status;
  const hasPendingChange = useMemo(
    () => Boolean(selectedOrder) && Boolean(pendingStatus) && pendingStatus !== selectedOrder.status,
    [selectedOrder, pendingStatus],
  );

  async function applyStatusChange() {
    if (!selectedOrder || !hasPendingChange) return;
    setUpdating(true);
    try {
      const updated = await api(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: pendingStatus }),
      });
      setOrders((current) => current.map((order) => (order.id === updated.id ? { ...order, status: updated.status } : order)));
      setSelectedOrder((current) => ({ ...current, status: updated.status }));
      setPendingStatus(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdating(false);
    }
  }

  const estimate = selectedOrder?.ai_estimate;

  return (
    <Layout
      title="주문 관리"
      description="구매자 주문의 결제·통관·배송 상태를 확인하고 진행 단계를 갱신합니다."
      actions={
        <button className="secondary-action compact-action" onClick={loadOrders}>
          데이터 새로고침
        </button>
      }
    >
      {loading ? (
        <LoadingSpinner label="주문 데이터를 불러오고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>주문 데이터를 불러오지 못했습니다.</strong>
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
                      <td><span className="status-tag">{STATUS_LABEL[order.status] || order.status}</span></td>
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
              <div className="route-line"><span>{STATUS_LABEL[displayedStatus] || displayedStatus}</span></div>
              <div><span>도착</span><strong>KR</strong></div>
            </div>

            <div className="status-actions">
              <span>진행 단계 변경 (선택 후 적용을 눌러야 반영됩니다)</span>
              <div className="status-actions-row">
                {STATUS_OPTIONS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`status-pill ${displayedStatus === value ? "current" : ""}`}
                    disabled={updating || selectedOrder.status === value}
                    onClick={() => setPendingStatus(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {hasPendingChange && (
                <div className="status-apply-row">
                  <span>
                    {STATUS_LABEL[selectedOrder.status]} → {STATUS_LABEL[pendingStatus]}로 변경하시겠습니까?
                  </span>
                  <div>
                    <button type="button" className="secondary-action compact-action" disabled={updating} onClick={() => setPendingStatus(null)}>
                      취소
                    </button>
                    <button type="button" className="kakao-action compact-action" disabled={updating} onClick={applyStatusChange}>
                      {updating ? "적용 중..." : "적용"}
                    </button>
                  </div>
                </div>
              )}
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
    </Layout>
  );
}

export default BusinessOrdersPage;
