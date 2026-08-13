import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Icon from "./Icon";
import "../pages/BuyerPortal.css";

const BUSINESS_NAV = [
  { to: "/business/dashboard", label: "홈", icon: "dashboard" },
  { to: "/business/orders", label: "주문 관리", icon: "package_2" },
  { to: "/business/logistics", label: "물류 관리", icon: "local_shipping" },
  { label: "배송대행지 관리", icon: "home_work", soon: true },
  { to: "/business/revenue", label: "분석", icon: "analytics" },
  { to: "/business/inquiries", label: "구매 문의", icon: "support_agent" },
  { label: "설정/관리", icon: "settings", soon: true },
];

const BUYER_MENU = [
  ["/buyer/home", "⌂", "홈"],
  ["/buyer/estimate", "⌕", "상품 분석·관세 계산"],
  ["/buyer/orders", "▤", "내 주문·배송 조회"],
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
                  <Icon name={item.icon} />
                  {item.label}
                  <small>준비중</small>
                </span>
              ) : (
                <NavLink key={item.to} to={item.to}>
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              ),
            )
          ) : (
            BUYER_MENU.map(([to, icon, label]) => (
              <NavLink key={to} to={to}>
                <span className="buyer-nav-icon" aria-hidden="true">{icon}</span>
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

        {isBusiness && (
          <header className="top-bar">
            <div className="top-bar-search">
              <Icon name="search" />
              <input type="text" placeholder="주문, 재고 검색..." readOnly />
            </div>
            <div className="top-bar-actions">
              <div className="lang-toggle">
                <button type="button" className="active">KO</button>
                <button type="button">EN</button>
              </div>
              <button type="button" className="icon-button" aria-hidden="true"><Icon name="notifications" /></button>
              <button type="button" className="icon-button" aria-hidden="true"><Icon name="help" /></button>
            </div>
          </header>
        )}

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
