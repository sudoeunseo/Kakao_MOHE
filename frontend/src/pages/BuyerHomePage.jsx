import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";

const QUICK_CATEGORIES = [
  ["의류", "옷"],
  ["신발", "신발"],
  ["뷰티", "화장품"],
  ["전자제품", "전자제품"],
  ["식품", "식품"],
  ["생활용품", "생활용품"],
];

const STATUS_LABEL = {
  paid: "결제 완료",
  shipping: "해외 운송 중",
  customs: "통관 진행 중",
  delivered: "배송 완료",
};

function BuyerHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api(`/api/orders?userId=${user.id}`)
      .then((result) => setOrders(Array.isArray(result) ? result : []))
      .catch(() => setOrders([]));
  }, [user.id]);

  function startAnalysis(value = query) {
    const searchValue = value.trim();
    const key = /^https?:\/\//i.test(searchValue) ? "url" : "product";
    const destination = searchValue
      ? `/buyer/estimate?${key}=${encodeURIComponent(searchValue)}`
      : "/buyer/estimate";
    navigate(destination);
  }

  function handleSubmit(event) {
    event.preventDefault();
    startAnalysis();
  }

  const latestOrder = orders[0];
  const latestEstimate = latestOrder?.ai_estimate;
  const latestTotal = latestEstimate?.breakdown?.total_estimated_krw;
  const latestDuty = latestEstimate?.breakdown?.duty_and_vat_krw;

  return (
    <Layout
      topbarTitle="홈"
      title={`안녕하세요, ${user.name || "구매자"}님 👋`}
      description="해외상품 링크 하나로 가격 정보부터 관세와 최종 결제금액까지 확인해 보세요."
    >
      <section className="buyer-home-hero">
        <div className="buyer-search-panel">
          <span className="buyer-panel-label">SMART GLOBAL PURCHASE</span>
          <h2>어떤 상품을 찾고 계신가요?</h2>
          <p>상품 URL을 붙여 넣으면 AI가 상품명·가격·통화·출발 국가를 자동으로 채웁니다.</p>
          <form className="buyer-home-search" onSubmit={handleSubmit}>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="해외 쇼핑몰 상품 URL 또는 상품명을 입력하세요"
              aria-label="상품 URL 또는 상품명"
            />
            <button type="submit">AI 분석 시작</button>
          </form>
          <div className="buyer-category-list" aria-label="빠른 품목 선택">
            {QUICK_CATEGORIES.map(([label, value]) => (
              <button key={label} type="button" onClick={() => startAnalysis(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <aside className={`buyer-order-alert ${latestOrder ? "has-order" : ""}`}>
          <span className="buyer-panel-label">MY ORDER</span>
          {latestOrder ? (
            <>
              <small>가장 최근 주문</small>
              <h2>{latestOrder.product_name}</h2>
              <strong>{latestTotal ? formatWon(latestTotal) : `${latestOrder.price_amount} ${latestOrder.price_currency}`}</strong>
              <div className="buyer-alert-meta">
                <span>{STATUS_LABEL[latestOrder.status] || "주문 접수"}</span>
                {latestDuty !== undefined && <span>관부가세 {formatWon(latestDuty)}</span>}
              </div>
              <button type="button" onClick={() => navigate("/buyer/orders")}>배송 자세히 보기</button>
            </>
          ) : (
            <>
              <small>아직 주문이 없어요</small>
              <h2>첫 해외구매를<br />똑똑하게 시작해 보세요</h2>
              <p>결제 전에 숨은 비용과 통관 위험을 먼저 확인할 수 있습니다.</p>
              <button type="button" onClick={() => navigate("/buyer/estimate")}>관세 계산하기</button>
            </>
          )}
        </aside>
      </section>

      <section className="buyer-quick-section">
        <div className="buyer-section-heading">
          <div>
            <span className="buyer-panel-label">MOHE AI GUIDE</span>
            <h2>해외구매, 세 단계면 충분해요</h2>
          </div>
          <button type="button" onClick={() => navigate("/buyer/estimate")}>바로 시작하기 →</button>
        </div>
        <div className="buyer-quick-grid">
          <article>
            <span>01</span>
            <strong>상품 링크 분석</strong>
            <p>판매 페이지에서 상품명과 가격 정보를 자동으로 찾습니다.</p>
          </article>
          <article>
            <span>02</span>
            <strong>관세·최종비용 예측</strong>
            <p>HS Code와 면세 기준을 분석해 배송비까지 합산합니다.</p>
          </article>
          <article>
            <span>03</span>
            <strong>결제·배송 조회</strong>
            <p>카카오페이 결제 후 주문과 통관 진행상태를 확인합니다.</p>
          </article>
        </div>
      </section>
    </Layout>
  );
}

export default BuyerHomePage;
