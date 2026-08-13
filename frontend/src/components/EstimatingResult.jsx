import { formatWon } from "../api/client";

const CONFIDENCE_LABEL = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

function EstimatingResult({
  estimate,
  onOrder,
  onKakaoPay,
  orderLoading,
  paymentLoading,
}) {
  const breakdown = estimate.breakdown || {};
  const risks = estimate.risk_notes || [];

  const items = [
    ["상품 가격", breakdown.product_price_krw],
    ["국제 배송비", breakdown.intl_shipping_krw],
    ["예상 관부가세", breakdown.duty_and_vat_krw],
    ["플랫폼 수수료", breakdown.platform_fee_krw],
  ];

  return (
    <section className="result-card" aria-live="polite">
      <div className="result-hero">
        <div>
          <span className="success-badge">AI 분석 완료</span>
          <p>예상 최종 결제금액</p>
          <strong>{formatWon(breakdown.total_estimated_krw)}</strong>
          <small>실제 통관 결과와 환율에 따라 달라질 수 있습니다.</small>
        </div>
        <div className={`confidence-orb ${estimate.confidence || "medium"}`}>
          <span>AI 신뢰도</span>
          <strong>{CONFIDENCE_LABEL[estimate.confidence] || "보통"}</strong>
        </div>
      </div>

      <div className="cost-breakdown">
        {items.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{formatWon(value)}</strong>
          </div>
        ))}
      </div>

      <div className="analysis-grid">
        <div className="analysis-item">
          <span>AI 추정 품목</span>
          <strong>{estimate.category}</strong>
        </div>
        <div className="analysis-item">
          <span>HS Code 추정</span>
          <strong>{estimate.hs_code_guess}</strong>
        </div>
        <div className="analysis-item">
          <span>예상 관세율</span>
          <strong>{estimate.duty_rate_percent}%</strong>
        </div>
        <div className="analysis-item">
          <span>면세 가능성</span>
          <strong>{estimate.is_duty_free_likely ? "높음" : "낮음"}</strong>
        </div>
      </div>

      <div className="ai-note">
        <span className="note-icon">AI</span>
        <div>
          <strong>분석 요약</strong>
          <p>{estimate.note}</p>
        </div>
      </div>

      <div className="risk-panel">
        <strong>통관 전 확인사항</strong>
        {risks.length > 0 ? (
          <ul>
            {risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        ) : (
          <p>현재 확인된 주요 위험요소가 없습니다.</p>
        )}
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={onOrder}
          disabled={orderLoading || paymentLoading}
        >
          {orderLoading ? "주문 저장 중..." : "데모 주문 확정"}
        </button>
        <button
          type="button"
          className="kakao-action"
          onClick={onKakaoPay}
          disabled={orderLoading || paymentLoading}
        >
          <span className="pay-mark">pay</span>
          {paymentLoading ? "결제창 준비 중..." : "카카오페이로 결제"}
        </button>
      </div>
    </section>
  );
}

export default EstimatingResult;
