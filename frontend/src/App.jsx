import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import EstimatePage from "./pages/EstimatePage";
import BuyerOrdersPage from "./pages/BuyerOrdersPage";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailPage from "./pages/PaymentFailPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import "./App.css";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("moheUser"));
  } catch {
    return null;
  }
}

function RoleRoute({ role, children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    const destination =
      user.role === "business"
        ? "/business/dashboard"
        : "/buyer/estimate";

    return <Navigate to={destination} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

        <Route
          path="/buyer/estimate"
          element={
            <RoleRoute role="buyer">
              <EstimatePage />
            </RoleRoute>
          }
        />

        <Route
          path="/buyer/orders"
          element={
            <RoleRoute role="buyer">
              <BuyerOrdersPage />
            </RoleRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <RoleRoute role="buyer">
              <PaymentSuccessPage />
            </RoleRoute>
          }
        />

        <Route
          path="/pages/payment-success.html"
          element={
            <RoleRoute role="buyer">
              <PaymentSuccessPage />
            </RoleRoute>
          }
        />

        <Route path="/payment/fail" element={<PaymentFailPage />} />
        <Route path="/pages/payment-fail.html" element={<PaymentFailPage />} />
        <Route path="/pages/payment-cancel.html" element={<PaymentFailPage />} />

        <Route
          path="/business/dashboard"
          element={
            <RoleRoute role="business">
              <BusinessDashboardPage />
            </RoleRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
