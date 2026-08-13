import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import { BuyerProductDetailPage } from "./pages/BuyerShowcasePages";
import EstimatePage from "./pages/EstimatePage";
import BuyerOrdersPage from "./pages/BuyerOrdersPage";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import BusinessOrdersPage from "./pages/BusinessOrdersPage";
import BusinessRevenuePage from "./pages/BusinessRevenuePage";
import BusinessSettingsPage from "./pages/BusinessSettingsPage";
import LogisticsPreviewPage from "./pages/LogisticsPreviewPage";
import InquiriesPreviewPage from "./pages/InquiriesPreviewPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailPage from "./pages/PaymentFailPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import B2CPortalPage from "./logistics/B2CPortalPage";
import LogisticsLandingPage from "./logistics/LogisticsLandingPage";
import LanguageProvider from "./context/LanguageProvider";
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
        : "/buyer/home";

    return <Navigate to={destination} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
        <Route path="/" element={<LogisticsLandingPage />} />

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

        <Route path="/buyer/recommendations/:productId" element={<RoleRoute role="buyer"><BuyerProductDetailPage /></RoleRoute>} />

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
          path="/buyer/*"
          element={
            <RoleRoute role="buyer">
              <B2CPortalPage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/dashboard"
          element={
            <RoleRoute role="business">
              <BusinessDashboardPage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/orders"
          element={
            <RoleRoute role="business">
              <BusinessOrdersPage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/revenue"
          element={
            <RoleRoute role="business">
              <BusinessRevenuePage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/logistics"
          element={
            <RoleRoute role="business">
              <LogisticsPreviewPage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/inquiries"
          element={
            <RoleRoute role="business">
              <InquiriesPreviewPage />
            </RoleRoute>
          }
        />

        <Route
          path="/business/settings"
          element={
            <RoleRoute role="business">
              <BusinessSettingsPage />
            </RoleRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
