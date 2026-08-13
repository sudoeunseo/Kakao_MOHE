import { NavLink, useNavigate } from "react-router-dom";

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
          <span className="app-brand-mark">M</span>
          <div>
            <strong>Kakao MOHE</strong>
            <span>Global Flow</span>
          </div>
        </div>

        <nav className="app-navigation" aria-label="주요 메뉴">
          {isBusiness ? (
            <NavLink to="/business/dashboard">운영 대시보드</NavLink>
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
            <span className="app-brand-mark">M</span>
            <strong>Kakao MOHE</strong>
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
