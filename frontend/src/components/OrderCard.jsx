import { formatDate, formatWon } from "../api/client";

const STATUS_STEPS = [
  ["paid", "결제 완료"],
  ["shipping", "해외 운송"],
  ["customs", "통관 진행"],
  ["delivered", "배송 완료"],
];

function OrderCard({ order }) {
  const currentIndex = Math.max(
    0,
    STATUS_STEPS.findIndex(([status]) => status === order.status),
  );
  const estimate = order.ai_estimate;

  return (
    <article className="order-card">
      <div className="order-card-header">
        <div>
          <span>주문 #{String(order.id).padStart(4, "0")}</span>
          <h2>{order.product_name}</h2>
        </div>
        <strong className="order-total">
          {estimate
            ? formatWon(estimate.breakdown?.total_estimated_krw)
            : `${order.price_amount} ${order.price_currency}`}
        </strong>
      </div>

      <div className="order-meta">
        <span>{order.origin_country || "출발국 미입력"}</span>
        <span>{order.shipping_mode === "direct" ? "직배송" : "배송대행"}</span>
        <span>{formatDate(order.created_at)}</span>
      </div>

      <ol className="status-timeline">
        {STATUS_STEPS.map(([status, label], index) => (
          <li
            key={status}
            className={index <= currentIndex ? "active" : ""}
          >
            <span>{index < currentIndex ? "✓" : index + 1}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>

      {estimate && (
        <div className="order-ai-summary">
          <span>AI 품목분류</span>
          <strong>{estimate.category}</strong>
          <span>HS {estimate.hs_code_guess}</span>
          <span>관세율 {estimate.duty_rate_percent}%</span>
        </div>
      )}
    </article>
  );
}

export default OrderCard;
