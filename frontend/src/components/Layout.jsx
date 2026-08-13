import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../pages/BuyerPortal.css";

const BUSINESS_NAV = [
  { to: "/business/dashboard", label: "홈·대시보드" },
  { to: "/business/orders", label: "주문 관리" },
  { label: "배송대행지 관리", soon: true },
  { to: "/business/revenue", label: "통계·분석" },
  { label: "설정·관리", soon: true },
  { label: "구매 문의", soon: true },
];

const BUYER_MENU = [
  ["/buyer/home", "home", "홈"],
  ["/buyer/products", "search", "상품 찾기"],
  ["/buyer/shops", "storefront", "해외 쇼핑몰"],
  ["/buyer/recommendations", "smart_toy", "AI 추천"],
  ["/buyer/estimate", "calculate", "관세 계산하기"],
  ["/buyer/orders", "local_shipping", "배송조회"],
  ["/buyer/customs", "gavel", "통관·관세"],
  ["/buyer/forwarding", "hub", "MOHE 해외배송센터"],
  ["/buyer/payments", "receipt_long", "결제·납부내역"],
  ["/buyer/profile", "person", "마이페이지"],
];

function Layout({ children, title, description, actions, topbarTitle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const isBusiness = user.role === "business";

  function logout() {
    localStorage.removeItem("moheUser");
    localStorage.removeItem("mohePendingPayment");
    navigate("/login", { replace: true });
  }

  return (
    <div className={`app-shell ${isBusiness ? "business-shell" : "buyer-shell"}`}>
      <aside className={`sidebar ${isBusiness ? "business-sidebar" : "buyer-sidebar"}`}>
        <div className="app-brand">
          <span className="app-brand-mark">
            <img src={logo} alt="Kakao MOHE" />
          </span>
          <span className={isBusiness ? "seller-tag" : "buyer-brand-tag"}>
            {isBusiness ? "SELLER ACCOUNT" : "Buyer Portal"}
          </span>
        </div>

        <nav className="app-navigation" aria-label="주요 메뉴">
          {isBusiness ? (
            BUSINESS_NAV.map((item) =>
              item.soon ? (
                <span key={item.label} className="nav-soon">
                  {item.label}
                  <small>준비중</small>
                </span>
              ) : (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ),
            )
          ) : (
            BUYER_MENU.map(([to, icon, label]) => (
              <NavLink key={to} to={to} end={to === "/buyer/home"}>
                <span className="buyer-nav-icon material-symbols-outlined" aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-summary">
            <span className="user-avatar">{user.name?.slice(0, 1) || "M"}</span>
            <div>
              <strong>{user.name || "사용자"}</strong>
              <span>{isBusiness ? "기업 운영자" : "구매자"}</span>
            </div>
          </div>
          <button type="button" className="text-button" onClick={logout}>
            로그아웃
          </button>
        </div>
      </aside>

      <div className="app-main">
        {!isBusiness && (
          <header className="buyer-topbar">
            <strong>{topbarTitle || title}</strong>
            <div className="buyer-utilities" aria-label="구매자 빠른 메뉴">
              <span title="배송 위치">⌖</span>
              <span title="알림">♢</span>
              <span className="buyer-utility-avatar">{user.name?.slice(0, 1) || "M"}</span>
            </div>
          </header>
        )}
        <header className="mobile-header">
          <div className="app-brand compact">
            <span className="app-brand-mark">
              <img src={logo} alt="Kakao MOHE" />
            </span>
          </div>
          <button type="button" className="text-button" onClick={logout}>
            로그아웃
          </button>
        </header>

        <main className="page-content">
          <header className="page-heading">
            <div>
              <span className="page-eyebrow">
                {isBusiness ? "BUSINESS CONTROL TOWER" : "KAKAO MOHE · BUYER PORTAL"}
              </span>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
