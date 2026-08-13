import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { api, formatDate, formatWon } from "../api/client";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import LoadingSpinner from "../components/LoadingSpinner";
import { getOrderDisplay } from "../utils/orderDisplay";
import useLanguage from "../context/useLanguage";

const STATUS_LABEL = {
  pending: { ko: "소싱 접수", en: "Sourcing" },
  paid: { ko: "배송대행지 검수", en: "Hub Inspection" },
  shipping: { ko: "국제운송중", en: "International Transit" },
  customs: { ko: "통관중", en: "Customs" },
  delivered: { ko: "셀러 입고완료", en: "Seller Intake Complete" },
};

const STATUS_ICON = {
  pending: "shopping_cart",
  paid: "inventory_2",
  shipping: "flight_takeoff",
  customs: "policy",
  delivered: "check_circle",
};

const STATUS_OPTIONS = Object.entries(STATUS_LABEL);

function BusinessOrdersPage() {
  const { language, t } = useLanguage();
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
  const statusCounts = useMemo(
    () => STATUS_OPTIONS.reduce((acc, [key]) => {
      acc[key] = orders.filter((order) => order.status === key).length;
      return acc;
    }, {}),
    [orders],
  );

  return (
    <Layout
      title={t("주문 관리", "Order Management")}
      description={t("판매용 해외 상품을 카카오 MOHE 배송대행지로 소싱하고 구매·검수·국제운송·통관·입고 상태를 관리합니다.", "Source overseas products through Kakao MOHE hubs and manage purchasing, inspection, international shipping, customs, and intake.")}
      actions={
        <button className="secondary-action compact-action" onClick={loadOrders}>
          {t("데이터 새로고침", "Refresh data")}
        </button>
      }
    >
      {loading ? (
        <LoadingSpinner label={t("주문 데이터를 불러오고 있습니다", "Loading order data")} />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>{t("주문 데이터를 불러오지 못했습니다.", "Could not load order data.")}</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>{t("다시 시도", "Try again")}</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol">B2B</span>
          <strong>{t("아직 연동된 주문이 없습니다.", "No orders are connected yet.")}</strong>
          <p>{t("구매자 계정에서 주문을 생성하면 이곳에 즉시 표시됩니다.", "Orders created from buyer accounts will appear here immediately.")}</p>
        </div>
      ) : (
        <>
        <section className="content-card pipeline-card">
          <div className="card-heading-row">
            <div><span>SOURCING FLOW</span><h2>{t("소싱·입고 현황", "Sourcing & Intake Status")}</h2></div>
          </div>
          <div className="pipeline-row">
            {STATUS_OPTIONS.map(([key, label], index) => (
              <Fragment key={key}>
                {index > 0 && <span className="pipeline-arrow"><Icon name="chevron_right" /></span>}
                <div className="pipeline-node">
                  <span className="pipeline-icon"><Icon name={STATUS_ICON[key]} /></span>
                  <strong>{label[language]}</strong>
                  <small>{statusCounts[key] || 0}{t("건", "")}</small>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="content-card orders-table-card">
            <div className="card-heading-row">
              <div><span>LIVE SOURCING</span><h2>{t("소싱 주문 현황", "Live Sourcing Orders")}</h2></div>
              <small>{t("최근 주문순", "Newest first")}</small>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>{t("주문", "Order")}</th><th>{t("상품", "Product")}</th><th>{t("출발국", "Origin")}</th><th>{t("예상금액", "Estimate")}</th><th>{t("AI 신뢰도", "AI Confidence")}</th><th>{t("상태", "Status")}</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const display = getOrderDisplay(order, language);
                    return (
                      <tr
                        key={order.id}
                        className={selectedOrder?.id === order.id ? "selected-row" : ""}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td>#{String(order.id).padStart(4, "0")}</td>
                        <td><strong>{display.product}</strong><small>{formatDate(order.created_at)}</small></td>
                        <td>{order.origin_country || "-"}</td>
                        <td>{order.ai_estimate ? formatWon(order.ai_estimate.breakdown?.total_estimated_krw) : t("분석 없음", "Not analyzed")}</td>
                        <td><span className={`confidence-tag ${order.ai_estimate?.confidence || "none"}`}>{order.ai_estimate?.confidence || "-"}</span></td>
                        <td><span className="status-tag">{STATUS_LABEL[order.status]?.[language] || order.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="order-detail-card">
            <div className="detail-heading">
              <span>SOURCING INSIGHT</span>
              <h2>{t("주문", "Order")} #{String(selectedOrder.id).padStart(4, "0")}</h2>
              <p>{getOrderDisplay(selectedOrder, language).product}</p>
            </div>

            <div className="detail-route">
              <div><span>{t("출발", "Origin")}</span><strong>{selectedOrder.origin_country || "-"}</strong></div>
              <div className="route-line"><span>{STATUS_LABEL[displayedStatus]?.[language] || displayedStatus}</span></div>
              <div><span>{t("도착", "Destination")}</span><strong>KR</strong></div>
            </div>

            <div className="status-actions">
              <span>{t("진행 단계 변경 (선택 후 적용을 눌러야 반영됩니다)", "Change progress stage (select a stage, then apply)")}</span>
              <div className="status-actions-row">
                {STATUS_OPTIONS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`status-pill ${displayedStatus === value ? "current" : ""}`}
                    disabled={updating || selectedOrder.status === value}
                    onClick={() => setPendingStatus(value)}
                  >
                    {label[language]}
                  </button>
                ))}
              </div>
              {hasPendingChange && (
                <div className="status-apply-row">
                  <span>
                    {STATUS_LABEL[selectedOrder.status]?.[language]} → {STATUS_LABEL[pendingStatus]?.[language]} {t("단계로 변경하시겠습니까?", "— apply this change?")}
                  </span>
                  <div>
                    <button type="button" className="secondary-action compact-action" disabled={updating} onClick={() => setPendingStatus(null)}>
                      {t("취소", "Cancel")}
                    </button>
                    <button type="button" className="kakao-action compact-action" disabled={updating} onClick={applyStatusChange}>
                      {updating ? t("적용 중...", "Applying...") : t("적용", "Apply")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {estimate ? (
              <>
                <div className="detail-grid">
                  <div><span>{t("품목 분류", "Category")}</span><strong>{getOrderDisplay(selectedOrder, language).category}</strong></div>
                  <div><span>HS Code</span><strong>{estimate.hs_code_guess}</strong></div>
                  <div><span>{t("관세율", "Duty Rate")}</span><strong>{estimate.duty_rate_percent}%</strong></div>
                  <div><span>{t("최종비용", "Total Cost")}</span><strong>{formatWon(estimate.breakdown?.total_estimated_krw)}</strong></div>
                </div>
                <div className="detail-risk">
                  <strong>{t("AI 통관 체크", "AI Customs Check")}</strong>
                  {estimate.risk_notes?.length ? (
                    <ul>{getOrderDisplay(selectedOrder, language).risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
                  ) : <p>{t("현재 주요 위험요소가 없습니다.", "No major risks are currently detected.")}</p>}
                </div>
              </>
            ) : (
              <div className="detail-risk"><p>{t("이 주문에는 AI 분석 결과가 없습니다.", "This order has no AI analysis result.")}</p></div>
            )}
          </aside>
        </div>
        </>
      )}
    </Layout>
  );
}

export default BusinessOrdersPage;
