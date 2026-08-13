import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import BrandLogo from "./BrandLogo";
import useLanguage from "../context/useLanguage";
import "../pages/BuyerPortal.css";

const BUSINESS_NAV = [
  { to: "/business/dashboard", ko: "홈", en: "Home", icon: "dashboard" },
  { to: "/business/orders", ko: "주문 관리", en: "Orders", icon: "package_2" },
  { to: "/business/logistics", ko: "배송대행지·재고", en: "Shipping Hubs · Inventory", icon: "local_shipping" },
  { to: "/business/revenue", ko: "분석", en: "Analytics", icon: "analytics" },
  { to: "/business/settings", ko: "설정/관리", en: "Settings", icon: "settings" },
  { to: "/business/inquiries", ko: "구매 문의", en: "Inquiries", icon: "support_agent" },
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

function Layout({ children, title, description, actions, topbarTitle, dashboard = false, hideHeading = false }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
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
          <BrandLogo tone="light" />
          <span className={isBusiness ? "seller-tag" : "buyer-brand-tag"}>
            {isBusiness ? "SELLER ACCOUNT" : "Buyer Portal"}
          </span>
        </div>

        <nav className="app-navigation" aria-label={t("주요 메뉴", "Main navigation")}>
          {isBusiness ? (
            BUSINESS_NAV.map((item) =>
              item.soon ? (
                <span key={item.to} className="nav-soon">
                  <Icon name={item.icon} />
                  {t(item.ko, item.en)}
                </span>
              ) : (
                <NavLink key={item.to} to={item.to}>
                  <Icon name={item.icon} />
                  {t(item.ko, item.en)}
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
          <button
            type="button"
            className="user-summary user-summary-link"
            onClick={() => navigate(isBusiness ? "/business/settings" : "/buyer/home")}
            aria-label={isBusiness ? t("설정 및 계정 관리로 이동", "Open account settings") : "구매자 홈으로 이동"}
          >
            <span className="user-avatar">{user.name?.slice(0, 1) || "M"}</span>
            <div>
              <strong>{user.name || t("사용자", "User")}</strong>
              <span>{isBusiness ? t("기업 운영자", "Business operator") : "구매자"}</span>
            </div>
            <Icon name="chevron_right" className="user-summary-arrow" />
          </button>
          <button type="button" className="text-button" onClick={logout}>
            {t("로그아웃", "Log out")}
          </button>
        </div>
      </aside>

      <div className="app-main">
        {!isBusiness && (
          <header className="buyer-topbar">
            <div className="buyer-topbar-leading">
              <BrandLogo compact />
              <strong>{topbarTitle || title}</strong>
            </div>
            <div className="buyer-utilities" aria-label="구매자 빠른 메뉴">
              <span title="배송 위치">⌖</span>
              <span title="알림">♢</span>
              <span className="buyer-utility-avatar">{user.name?.slice(0, 1) || "M"}</span>
            </div>
          </header>
        )}
        <header className="mobile-header">
          <div className="app-brand compact">
            <BrandLogo tone="light" compact />
          </div>
          <button type="button" className="text-button" onClick={logout}>
            {t("로그아웃", "Log out")}
          </button>
        </header>

        {isBusiness && (
          <header className="top-bar">
            <BrandLogo compact />
            <div className="top-bar-search">
              <Icon name="search" />
              <input type="text" placeholder={t("검색 (주문번호, 상품명)", "Search (order no., product)")} readOnly />
            </div>
            <div className="top-bar-actions">
              <div className="lang-toggle">
                <button
                  type="button"
                  className={language === "ko" ? "active" : ""}
                  aria-pressed={language === "ko"}
                  onClick={() => setLanguage("ko")}
                >
                  KO
                </button>
                <button
                  type="button"
                  className={language === "en" ? "active" : ""}
                  aria-pressed={language === "en"}
                  onClick={() => setLanguage("en")}
                >
                  EN
                </button>
              </div>
              <button type="button" className="icon-button" aria-hidden="true"><Icon name="notifications" /></button>
              <button type="button" className="icon-button" aria-hidden="true"><Icon name="help" /></button>
            </div>
          </header>
        )}

        <main className={`page-content ${dashboard ? "dashboard-page-content" : ""}`}>
          {!dashboard && !hideHeading && (
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
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
