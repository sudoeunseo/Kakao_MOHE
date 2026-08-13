import { Link, useLocation } from "react-router-dom";

function PaymentFailPage() {
  const location = useLocation();
  const cancelled = location.pathname.includes("cancel");

  return (
    <main className="payment-page">
      <section className="payment-card">
        <span className="payment-symbol error">!</span>
        <span className="page-eyebrow">KAKAO MOHE PAYMENT</span>
        <h1>{cancelled ? "결제가 취소되었습니다" : "결제를 완료하지 못했습니다"}</h1>
        <p>주문은 생성되지 않았습니다. 상품 분석 결과에서 다시 시도할 수 있습니다.</p>
        <Link className="secondary-action link-action" to="/buyer/estimate">상품 분석으로 돌아가기</Link>
      </section>
    </main>
  );
}

export default PaymentFailPage;
