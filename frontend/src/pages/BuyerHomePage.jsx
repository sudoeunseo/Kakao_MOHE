import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";

const QUICK_CATEGORIES = [
  ["👕", "의류", "옷"],
  ["👟", "신발", "신발"],
  ["💄", "뷰티", "화장품"],
  ["💻", "전자제품", "전자제품"],
  ["🍫", "식품", "식품"],
  ["👜", "패션잡화", "패션잡화"],
  ["🏠", "생활용품", "생활용품"],
  ["🧸", "취미·완구", "취미 완구"],
];

const RECOMMENDATIONS = [
  {
    name: "아마존 킨들 페이퍼화이트",
    meta: "미국 아마존 · 전자기기",
    price: "214,500원",
    badge: "관세예측 완료",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCchmGo48bFBDPlisbODd3KXNPTqGQApMHcL2Yss5358WspLVgrzJuarvT0ZoRAUldI9TBd5LTiCTXDujoGKm_5BUeYi6z9ndwehbYSNd4VF5tcxu8M645T3HM1MPQCnwFkbEox_pJp4V0tPPd_9D70U7OWJxw49G2xtWk-DPa4CnbxwI2-MG7WQRE9MN6nMfMGRrUFtIExObeCO9974h411_fj-7GD1ZfHCeeDEvWtYspgwcmllfZZ1A",
  },
  {
    name: "킷캣 프리미엄 말차 박스",
    meta: "일본 돈키호테 · 식품",
    price: "38,400원",
    badge: "면세 범위",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDosFAz3HAKKHsppv6LieSxwqvlnxhcyWecQyDveYbtQSR7EtrurGH9gDlECPgaUcJRQT-y-X2fDL_nVUzQuySTESy7NImLCfhO9jy0mtalaXoo6hyuZGhg6kI4FaFO5kos4P6A0KVy1L6F033K-bJXrD4KwEpADFmHZ_61ZEZ0z82smiijL-kQui0rBPmMzoICA8joIx3dz9V6SiELlfdOW8YfT6qcTCUBLS8dgYQL78U_HwyTA8WBkg",
  },
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
      description="오늘도 해외쇼핑을 더 쉽고 똑똑하게 시작해 보세요."
    >
      <section className="buyer-home-hero">
        <div className="buyer-search-panel">
          <h2>어떤 상품을 찾고 계신가요?</h2>
          <p>상품 URL을 붙여 넣으면 AI가 상품 정보와 예상 최종금액을 자동으로 분석합니다.</p>
          <form className="buyer-home-search" onSubmit={handleSubmit}>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="상품명이나 해외 쇼핑몰 URL을 입력하세요"
              aria-label="상품 URL 또는 상품명"
            />
            <button type="submit">AI 분석 시작</button>
          </form>
          <div className="buyer-popular-search"><span>인기 검색어:</span><button type="button" onClick={() => startAnalysis("영양제")}>영양제</button><button type="button" onClick={() => startAnalysis("캠핑용품")}>캠핑용품</button><button type="button" onClick={() => startAnalysis("커피머신")}>커피머신</button></div>
          <div className="buyer-category-list" aria-label="빠른 품목 선택">
            {QUICK_CATEGORIES.map(([icon, label, value]) => (
              <button key={label} type="button" onClick={() => startAnalysis(value)}>
                <span>{icon}</span><strong>{label}</strong>
              </button>
            ))}
          </div>
        </div>

        <aside className={`buyer-order-alert ${latestOrder ? "has-order" : ""}`}>
          <span className="buyer-alert-title">▲ 확인할 것이 있어요</span>
          {latestOrder ? (
            <>
              <small>최근 주문 안내</small>
              <h2>{latestOrder.product_name}</h2>
              <strong>{latestTotal ? formatWon(latestTotal) : `${latestOrder.price_amount} ${latestOrder.price_currency}`}</strong>
              <div className="buyer-alert-meta">
                <span>{STATUS_LABEL[latestOrder.status] || "주문 접수"}</span>
                {latestDuty !== undefined && <span>관부가세 {formatWon(latestDuty)}</span>}
              </div>
              <button type="button" onClick={() => navigate(latestDuty ? "/buyer/customs" : "/buyer/orders")}>{latestDuty ? "관세 확인하기" : "배송 자세히 보기"}</button>
            </>
          ) : (
            <>
              <small>구매 전 확인</small>
              <h2>관세와 배송비를<br />먼저 계산해 보세요</h2>
              <p>결제 전에 숨은 비용과 통관 위험을 확인할 수 있습니다.</p>
              <button type="button" onClick={() => navigate("/buyer/estimate")}>관세 계산하기</button>
            </>
          )}
        </aside>
      </section>

      <section className="buyer-home-lower">
        <article className="buyer-shipping-preview">
          <div className="buyer-section-title-row"><h2>🚚 배송 중인 상품</h2><button type="button" onClick={() => navigate("/buyer/orders")}>전체보기 →</button></div>
          {latestOrder ? <><div className="buyer-shipping-product"><span className="material-symbols-outlined">package_2</span><div><small>{STATUS_LABEL[latestOrder.status] || "주문 접수"}</small><strong>{latestOrder.product_name}</strong><p>MOHE-{String(latestOrder.id).padStart(8, "0")}</p></div></div><div className="buyer-shipping-track"><span>현지 발송</span><b /><span>해외 배송</span><b /><span>통관</span><b /><span>배송 완료</span></div><button type="button" onClick={() => navigate("/buyer/orders")}>배송 자세히 보기</button></> : <div className="buyer-empty-inline">현재 배송 중인 상품이 없습니다.</div>}
        </article>
        <div className="buyer-recommendation-wrap"><div className="buyer-section-title-row"><h2>💡 MOHE AI 추천</h2><button type="button" onClick={() => navigate("/buyer/recommendations")}>더보기 →</button></div><div className="buyer-home-recommendations">{RECOMMENDATIONS.map((item) => <button type="button" key={item.name} onClick={() => navigate(`/buyer/estimate?product=${encodeURIComponent(item.name)}`)}><img src={item.image} alt={item.name} /><span><strong>{item.name}</strong><small>{item.meta}</small><em>{item.badge}</em><b>{item.price}</b></span></button>)}</div></div>
      </section>
    </Layout>
  );
}

export default BuyerHomePage;
