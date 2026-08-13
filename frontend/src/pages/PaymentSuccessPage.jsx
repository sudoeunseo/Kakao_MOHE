import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const started = useRef(false);
  const [state, setState] = useState({ status: "loading", message: "결제 승인을 확인하고 있습니다." });

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const pgToken = searchParams.get("pg_token");
    const callbackOrderId = searchParams.get("partner_order_id");
    const pending = JSON.parse(localStorage.getItem("mohePendingPayment") || "null");

    if (!pgToken || !pending) {
      setState({ status: "error", message: "결제 승인 정보를 찾을 수 없습니다." });
      return;
    }

    api("/api/kakaopay/approve", {
      method: "POST",
      body: JSON.stringify({
        partnerOrderId: callbackOrderId || pending.partnerOrderId,
        pgToken,
        productMeta: pending.productMeta,
      }),
    })
      .then(() => {
        localStorage.removeItem("mohePendingPayment");
        setState({ status: "success", message: "카카오페이 결제와 주문 접수가 완료되었습니다." });
      })
      .catch((error) => {
        setState({ status: "error", message: error.message });
      });
  }, [searchParams]);

  return (
    <main className="payment-page">
      <section className="payment-card">
        <span className={`payment-symbol ${state.status}`}>
          {state.status === "loading" ? "…" : state.status === "success" ? "✓" : "!"}
        </span>
        <span className="page-eyebrow">KAKAO MOHE PAYMENT</span>
        <h1>{state.status === "success" ? "결제가 완료되었습니다" : state.status === "error" ? "결제를 확인하지 못했습니다" : "결제 확인 중"}</h1>
        <p>{state.message}</p>
        {state.status === "success" && <Link className="primary-action link-action" to="/buyer/orders?created=1">내 주문 확인하기</Link>}
        {state.status === "error" && <Link className="secondary-action link-action" to="/buyer/estimate">상품 분석으로 돌아가기</Link>}
      </section>
    </main>
  );
}

export default PaymentSuccessPage;
