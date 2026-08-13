import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const BUSINESS_NAV = [
  { to: "/business/dashboard", label: "홈·대시보드" },
  { to: "/business/orders", label: "주문 관리" },
  { label: "배송대행지 관리", soon: true },
  { to: "/business/revenue", label: "통계·분석" },
  { label: "설정·관리", soon: true },
  { label: "구매 문의", soon: true },
];

function Layout({ children, title, description, actions }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const isBusiness = user.role === "business";

  function logout() {
    localStorage.removeItem("moheUser");
    localStorage.removeItem("mohePendingPayment");
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="app-brand">
          <span className="app-brand-mark">
            <img src={logo} alt="Kakao MOHE" />
          </span>
          {isBusiness && <span className="seller-tag">SELLER ACCOUNT</span>}
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
            <>
              <NavLink to="/buyer/estimate">AI 상품 분석</NavLink>
              <NavLink to="/buyer/orders">내 주문</NavLink>
            </>
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
                {isBusiness ? "BUSINESS CONTROL TOWER" : "SMART GLOBAL PURCHASE"}
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
