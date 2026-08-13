import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import OrderCard from "../components/OrderCard";

function BuyerOrdersPage() {
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const created = new URLSearchParams(location.search).get("created") === "1";

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api(`/api/orders?userId=${user.id}`);
      setOrders(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const visibleOrders = orders.filter((order) =>
    order.product_name?.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Layout
      topbarTitle="내 주문·배송 조회"
      title="내 해외주문"
      description="여러 해외 쇼핑몰의 주문과 통관 진행상태를 한곳에서 확인하세요."
      actions={
        <button className="secondary-action compact-action" onClick={loadOrders}>
          새로고침
        </button>
      }
    >
      {created && (
        <div className="success-banner">
          <span>✓</span>
          <div>
            <strong>주문이 정상적으로 접수되었습니다.</strong>
            <p>기업 운영 대시보드에도 동일한 주문이 실시간으로 반영됩니다.</p>
          </div>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="buyer-delivery-metrics">
            <article><span>전체 배송</span><strong>{orders.length}</strong><i className="material-symbols-outlined">local_shipping</i></article>
            <article className="blue"><span>해외 배송중</span><strong>{orders.filter((order) => order.status === "shipping").length}</strong><i className="material-symbols-outlined">flight_takeoff</i></article>
            <article className="orange"><span>통관 진행중</span><strong>{orders.filter((order) => order.status === "customs").length}</strong><i className="material-symbols-outlined">gavel</i></article>
            <article className="green"><span>배송 완료</span><strong>{orders.filter((order) => order.status === "delivered").length}</strong><i className="material-symbols-outlined">package_2</i></article>
          </div>
          <label className="buyer-order-search">
            <span className="material-symbols-outlined">search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="주문번호 또는 상품명 검색" />
          </label>
        </>
      )}

      {loading ? (
        <LoadingSpinner label="주문을 불러오고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>주문을 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>다시 시도</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol">01</span>
          <strong>아직 주문이 없습니다.</strong>
          <p>AI로 해외상품의 최종비용을 분석하고 첫 주문을 만들어 보세요.</p>
          <button className="primary-action" onClick={() => navigate("/buyer/estimate")}>
            상품 분석하러 가기
          </button>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="empty-state"><strong>검색 결과가 없습니다.</strong><p>다른 상품명으로 다시 검색해 주세요.</p></div>
      ) : (
        <div className="order-list">
          {visibleOrders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </Layout>
  );
}

export default BuyerOrdersPage;
