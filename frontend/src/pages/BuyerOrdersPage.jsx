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

  return (
    <Layout
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
      ) : (
        <div className="order-list">
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </Layout>
  );
}

export default BuyerOrdersPage;
