import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatDate, formatWon } from "../api/client";
import Layout from "../components/Layout";

const PRODUCT_IMAGES = {
  smartHome: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTZNk4xnOWvIrU1o7CMed3Twk3RXyTWRxZmtvPgXH4luaLC_BeRh0uEPPkZjcw3JuedpE4eZrQz0TUFgOPsBTbs6p2wc8KDKdQIEIlopcytJb9X9PNVUwBg7MvVeF5mHWEK5NELTW-G1_vyX1GaoXEOxOZ1yxyUCCjtvo-XBr8_M823n2hGF8cftcLm3cryyXxElfnc_FVLS4OkRf55rPHuR5GphTxvuq0AkxdAoulvflKGZGJCcvgpw",
  skincare: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIztNDuUcEDeYq5g7rnL8_WzzqMYoEmXtcE5Cx5I5BbxK3LBi1tEyEBuv5uGgowsPxS073wYu3M4MSC0yjBh0KPDClgmWoOdBYZqzQ5njQGx6PIHzYSEyb8ts413rj5pJoBzneEKblUSV0R4FgyMx4Hv0uBYLHNFXYELuWKhj9yiyd-BHijjokuktIvhon3ei048jjg4t1B1qJRYy590tYYFiprsmZzDoiC7mdCUmpiONTReR3YIzXuQ",
  keyboard: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCugZ-VLIY6oeLZzlS9nvtuqHij5IUHvfFrEB2ctXEy3BPRZwL9_C4D_uosd1t-0Sp_km0vJJNEjU4ZXtz-BmdgidbFAFmZ_dLB9q1dgAg1IazqwG24jAk-zN-CO1CvxvvUW1-cn_COzOpTBgvYdxp1XufYLaqZZMwHJHOOVGhfd6ELHmsl_2JNp0MJw-zthiXLNsG0PL_PPRpxZX3ykLEUDpS0w0hjg9cLh13kqoqGLp9Vn6o8nLGkA",
  industrial: "https://lh3.googleusercontent.com/aida-public/AB6AXuDh11mkoitKoYn7LiryKKx9Yj8xUtGk-vIhJW1TR26aPZloFBxubvP3s5NjzjHfzzOEPRYL7cvjS5O4A_lreKaOzU7zw16tVu7WgPsyK-NFypQ8qqfrwKO7mlKdFGcmJ8HorP5Cx0sHkEtbjhUzAKUXIx5F6Dwj1J5s9uk_wYKFnojVloJNHxa744slJvH56p1YNH3GvbQzfjQJ4yUhj0mfI6IVDFi15eanJU0CX1MI0o2E4AmkgGd1QA",
};

const SHOP_BANNERS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCD740KyjKBJAFbHKE4lLum-goV6axVCyCVXlBnyBfc4VSicWYRFvW2_djY-n1BqUDnIB0D9S04WexrpKyxDZxBi86iQXsessP23RiqyLIQoQx7s7h6QSGOzm23oBFLN4_fLPSUshDNhs57E1WbcEEyvv5rJzErsoFwMFGEaRCXiXwuFv6EUlNAZoirPzFQNKSSrbzsY-NZgYdPjaofHIazoQOUqsDflgclQ1AO3dpYkBVCVkF5IKyqWg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfxtdKTv46GgwBqH4p8XRnhCmX3kaos28SoehjXE4qZhNxJPc-afn5THsKLOEgdm6WTfnjFfVIoo5j91GEUhNoKr2pRXunYnHwdA788B8Zcvx3DTVwg6zrCb2m5GiR8vs7IlHYqNPV062Ko-8_mPI0wbpzW04JLZlAASfoa8GLm_AWP2XdbKk7BHiOiyYx8DMj33lPNbIc8R8gxG2z9nXvVP_yHrTIIN20lPRFlK18Xqh9gkPuTv9k_Q",
];

const CATEGORIES = [
  ["checkroom", "의류"], ["steps", "신발"], ["brush", "뷰티"], ["devices", "전자제품"],
  ["restaurant", "식품"], ["watch", "액세서리"], ["weekend", "리빙"], ["sports_esports", "취미"],
];

const SHOPS = [
  ["Amazon", "미국", "세계 최대 규모의 종합 쇼핑몰", "인기 급상승"],
  ["Rakuten", "일본", "피규어·전자기기·잡화 특화", "포인트 2배"],
  ["Taobao", "중국", "가격과 상품 선택 폭이 큰 마켓", "종합 쇼핑"],
  ["AliExpress", "글로벌", "전 세계 배송을 지원하는 마켓", "무료배송 많음"],
];

function Icon({ children }) {
  return <span className="material-symbols-outlined" aria-hidden="true">{children}</span>;
}

function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form className="buyer-directory-search" onSubmit={onSubmit}>
      <Icon>search</Icon>
      <input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} />
      <button type="submit">검색</button>
    </form>
  );
}

export function BuyerProductsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submit(event) {
    event.preventDefault();
    if (query.trim()) navigate(`/buyer/estimate?product=${encodeURIComponent(query.trim())}`);
  }

  return (
    <Layout topbarTitle="상품 찾기" title="상품 찾기" description="인기 글로벌 상품을 둘러보거나 링크를 분석해 최종비용을 확인하세요.">
      <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={submit} placeholder="검색어 또는 상품 URL을 입력하세요" />
      <section className="buyer-directory-section">
        <h2>카테고리 탐색</h2>
        <div className="buyer-category-grid">
          {CATEGORIES.map(([icon, label]) => (
            <button key={label} type="button" onClick={() => navigate(`/buyer/estimate?product=${encodeURIComponent(label)}`)}>
              <Icon>{icon}</Icon><span>{label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="buyer-directory-section">
        <div className="buyer-section-title-row"><div><h2>해외 트렌딩 상품</h2><p>지금 가장 인기 있는 글로벌 아이템</p></div></div>
        <div className="buyer-feature-grid">
          <button className="buyer-feature-card large" type="button" onClick={() => navigate("/buyer/estimate?product=스마트홈 미니멀 공기청정기")}>
            <img src={PRODUCT_IMAGES.smartHome} alt="스마트홈 미니멀 공기청정기" />
            <span className="buyer-feature-overlay"><small>핫딜</small><strong>스마트홈 미니멀 공기청정기</strong><b>145,000원</b></span>
          </button>
          <button className="buyer-feature-card" type="button" onClick={() => navigate("/buyer/estimate?product=프리미엄 비건 스킨케어 세트")}>
            <img src={PRODUCT_IMAGES.skincare} alt="프리미엄 비건 스킨케어 세트" /><span><strong>프리미엄 비건 스킨케어 세트</strong><b>89,000원</b></span>
          </button>
          <button className="buyer-feature-card" type="button" onClick={() => navigate("/buyer/estimate?product=인체공학 무선 기계식 키보드")}>
            <img src={PRODUCT_IMAGES.keyboard} alt="인체공학 무선 기계식 키보드" /><span><strong>인체공학 무선 기계식 키보드</strong><b>210,000원</b></span>
          </button>
        </div>
      </section>
    </Layout>
  );
}

export function BuyerShopsPage() {
  return (
    <Layout topbarTitle="해외 쇼핑몰" title="해외 쇼핑몰" description="국가별 대표 쇼핑몰을 한곳에서 비교하고 상품 링크를 가져오세요.">
      <section className="buyer-shop-banners">
        <article style={{ backgroundImage: `url(${SHOP_BANNERS[0]})` }}><span>핫딜 특가</span><h2>아마존 Prime Day<br />사전예약 시작</h2><p>최대 50% 할인 혜택과 무료 직배송 찬스</p></article>
        <article style={{ backgroundImage: `url(${SHOP_BANNERS[1]})` }}><span>직구 연관</span><h2>일본 인기 디저트 기획전</h2><p>현지 직배송으로 신선하게</p></article>
      </section>
      <section className="buyer-directory-section">
        <h2>인기 쇼핑몰</h2>
        <div className="buyer-shop-grid">
          {SHOPS.map(([name, country, description, badge]) => (
            <article key={name}><span className="buyer-shop-country">{country}</span><div className="buyer-shop-logo">{name.slice(0, 1)}</div><h3>{name}</h3><p>{description}</p><footer><span>{badge}</span><button type="button">쇼핑하기 →</button></footer></article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export function BuyerAiPage() {
  const navigate = useNavigate();
  const products = [
    ["산업용 방수 LED 스트립 라이트 50m 롤", "조명/인테리어", "265,500원"],
    ["프리미엄 세라믹 머그컵 500개 벌크", "판촉/사무용품", "480,200원"],
    ["고급 가죽커버 다이어리 B5 200권", "문구/사무", "530,000원"],
  ];
  return (
    <Layout topbarTitle="AI 추천" title="나를 위한 스마트 소싱" description="구매 패턴과 통관 데이터를 바탕으로 비용 효율이 높은 상품을 추천합니다.">
      <section className="buyer-ai-spotlight">
        <img src={PRODUCT_IMAGES.industrial} alt="고정밀 산업용 커넥터 세트" />
        <div><span>BEST MATCH 98%</span><h2>고정밀 산업용 커넥터 세트</h2><p>과거 구매 내역 대비 단가 15% 절감 예상. 현재 재고와 도착센터까지 함께 분석했습니다.</p><dl><div><dt>상품가</dt><dd>$450.00</dd></div><div><dt>예상 배송비</dt><dd>$45.00</dd></div><div><dt>예상 관부가세</dt><dd>$54.45</dd></div><div><dt>AI 예측 총비용</dt><dd>$549.45</dd></div></dl><button type="button" onClick={() => navigate("/buyer/estimate?product=고정밀 산업용 커넥터 세트")}>상세 보기 및 구매</button></div>
      </section>
      <section className="buyer-directory-section"><h2>오늘의 AI 추천</h2><div className="buyer-ai-grid">{products.map(([name, category, price]) => <article key={name}><span><Icon>auto_awesome</Icon>{category}</span><h3>{name}</h3><p>상품가와 배송비, 관세를 반영한 예상 최종금액</p><strong>{price}</strong><button type="button" onClick={() => navigate(`/buyer/estimate?product=${encodeURIComponent(name)}`)}>분석하기</button></article>)}</div></section>
    </Layout>
  );
}

function useBuyerOrders() {
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api(`/api/orders?userId=${user.id}`).then((result) => setOrders(Array.isArray(result) ? result : [])).catch(() => setOrders([]));
  }, [user.id]);
  return orders;
}

export function BuyerCustomsPage() {
  const navigate = useNavigate();
  const orders = useBuyerOrders();
  const target = orders.find((order) => order.status === "customs") || orders[0];
  const duty = target?.ai_estimate?.breakdown?.duty_and_vat_krw || 28000;
  return (
    <Layout topbarTitle="통관·관세" title="통관 및 관세 현황" description="진행 중인 통관 내역과 납부해야 할 관세를 확인하세요.">
      <section className="buyer-customs-grid">
        <article className="buyer-duty-callout"><span><Icon>warning</Icon>관세 납부 요망</span><h2>결제가 필요한 항목이 있습니다.</h2><p>기한 내 미납 시 통관이 지연될 수 있습니다.</p><div><strong>{target?.product_name || "Nike Air Max 1"}</strong><b>{formatWon(duty)}</b></div><button type="button" onClick={() => navigate("/buyer/payments")}>카카오페이로 납부하기</button></article>
        <aside className="buyer-customs-summary"><h2>통관 요약</h2><div><span>심사 중</span><strong>{Math.max(orders.length, 2)}건</strong></div><div className="waiting"><span>납부 대기</span><strong>1건</strong></div><div className="done"><span>통관 완료</span><strong>14건</strong></div></aside>
      </section>
      <section className="buyer-table-card"><div className="buyer-section-title-row"><h2>진행 중인 항목</h2></div><div className="buyer-simple-table"><span>상품 정보</span><span>운송장 번호</span><span>상태</span><span>예상 세액</span>{orders.slice(0, 4).map((order) => <div className="buyer-table-row" key={order.id}><strong>{order.product_name}</strong><span>MOHE-{String(order.id).padStart(8, "0")}</span><span className="buyer-status-chip">통관 심사 중</span><b>{formatWon(order.ai_estimate?.breakdown?.duty_and_vat_krw || 0)}</b></div>)}</div></section>
    </Layout>
  );
}

export function BuyerForwardingPage() {
  const centers = [["US", "미국 (델라웨어)", "면세 지역으로 전자제품·의류 배송에 적합합니다."], ["JP", "일본 (도쿄)", "피규어·서적·생활용품을 빠르고 안전하게 배송합니다."], ["CN", "중국 (웨이하이)", "타오바오·알리익스프레스 직구에 최적화된 센터입니다."]];
  return (
    <Layout topbarTitle="MOHE 해외배송센터" title="MOHE 해외배송센터" description="해외 도착센터의 상품 보관과 합배송 신청을 관리하세요.">
      <div className="buyer-metric-grid"><article><Icon>inventory_2</Icon><span>센터 보관중</span><strong>5<small>건</small></strong></article><article><Icon>payments</Icon><span>결제 대기</span><strong>2<small>건</small></strong></article><article><Icon>package_2</Icon><span>합배송 가능</span><strong>3<small>건</small></strong></article></div>
      <section className="buyer-center-layout"><article className="buyer-table-card"><div className="buyer-section-title-row"><h2>보관 중인 상품</h2><button type="button">합배송 신청</button></div>{["Keychron Q1 Pro Mechanical Keyboard", "Muji Miller Ode Desk Lamp", "Anker Power Bank"].map((name, index) => <div className="buyer-center-item" key={name}><span><Icon>inventory</Icon></span><div><strong>{name}</strong><small>TRK{123456789 + index}</small></div><b>{index < 2 ? "실측 완료" : "입고 대기중"}</b></div>)}</article><aside><h2>MOHE 운영 센터</h2>{centers.map(([code, name, text]) => <article className="buyer-center-card" key={code}><span>{code}</span><strong>{name}</strong><p>{text}</p><footer>운영중</footer></article>)}</aside></section>
    </Layout>
  );
}

export function BuyerPaymentsPage() {
  const orders = useBuyerOrders();
  const payments = useMemo(() => orders.map((order) => ({ id: order.id, name: order.product_name, date: order.created_at, amount: order.ai_estimate?.breakdown?.total_estimated_krw, status: order.status === "paid" ? "결제완료" : "처리중" })), [orders]);
  return (
    <Layout topbarTitle="결제·납부내역" title="결제·납부내역" description="상품 결제와 관세·배송비 납부 내역을 한곳에서 관리하세요.">
      <div className="buyer-metric-grid"><article><Icon>account_balance_wallet</Icon><span>이번 달 결제</span><strong>{formatWon(payments.reduce((sum, item) => sum + (item.amount || 0), 0))}</strong></article><article><Icon>schedule</Icon><span>납부 대기중인 관세</span><strong>45,000원</strong></article><article><Icon>pie_chart</Icon><span>주요 결제수단</span><strong>카카오페이</strong></article></div>
      <section className="buyer-table-card"><div className="buyer-section-title-row"><h2>최근 내역</h2><button type="button">전체 내역 다운로드</button></div><div className="buyer-payment-list">{payments.length ? payments.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{formatDate(item.date)}</small></div><span>카카오페이</span><b>{formatWon(item.amount || 0)}</b><em>{item.status}</em></article>) : <div className="buyer-empty-inline">아직 결제 내역이 없습니다.</div>}</div></section>
    </Layout>
  );
}

export function BuyerProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  return (
    <Layout topbarTitle="마이페이지" title="마이페이지" description="프로필, 배송 주소와 결제 정보를 관리하세요.">
      <section className="buyer-profile-grid"><article className="buyer-profile-card"><span className="buyer-profile-avatar">{user.name?.slice(0, 1) || "M"}</span><h2>{user.name || "김모해"}</h2><p>{user.email || "buyer@mohe.demo"}</p><small>구매자 회원</small><button type="button">프로필 편집</button></article><article className="buyer-profile-link"><Icon>local_shipping</Icon><span>3건 진행중</span><h2>주문 내역</h2><p>구매 및 배송 내역을 확인하세요.</p><button type="button" onClick={() => navigate("/buyer/orders")}>주문 보기 →</button></article><article className="buyer-profile-link"><Icon>gavel</Icon><span>조회 필요</span><h2>통관 내역</h2><p>관세와 통관 상태를 관리하세요.</p><button type="button" onClick={() => navigate("/buyer/customs")}>통관 보기 →</button></article></section>
      <section className="buyer-profile-settings"><article><div><h2>배송지 주소</h2><p>서울특별시 강남구 비즈니스대로 123, 040512</p></div><button type="button">수정</button></article><article><div><h2>결제 수단</h2><p>카카오페이 · 기본 결제수단</p></div><button type="button">관리</button></article></section>
    </Layout>
  );
}
