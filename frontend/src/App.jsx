import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import BuyerHomePage from "./pages/BuyerHomePage";
import {
  BuyerAiPage,
  BuyerCustomsPage,
  BuyerForwardingPage,
  BuyerPaymentsPage,
  BuyerProductDetailPage,
  BuyerProductsPage,
  BuyerProfilePage,
  BuyerShopsPage,
} from "./pages/BuyerShowcasePages";
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
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

        <Route
          path="/buyer/home"
          element={
            <RoleRoute role="buyer">
              <BuyerHomePage />
            </RoleRoute>
          }
        />

        <Route
          path="/buyer/estimate"
          element={
            <RoleRoute role="buyer">
              <EstimatePage />
            </RoleRoute>
          }
        />

        <Route path="/buyer/products" element={<RoleRoute role="buyer"><BuyerProductsPage /></RoleRoute>} />
        <Route path="/buyer/shops" element={<RoleRoute role="buyer"><BuyerShopsPage /></RoleRoute>} />
        <Route path="/buyer/recommendations" element={<RoleRoute role="buyer"><BuyerAiPage /></RoleRoute>} />
        <Route path="/buyer/recommendations/:productId" element={<RoleRoute role="buyer"><BuyerProductDetailPage /></RoleRoute>} />
        <Route path="/buyer/customs" element={<RoleRoute role="buyer"><BuyerCustomsPage /></RoleRoute>} />
        <Route path="/buyer/forwarding" element={<RoleRoute role="buyer"><BuyerForwardingPage /></RoleRoute>} />
        <Route path="/buyer/payments" element={<RoleRoute role="buyer"><BuyerPaymentsPage /></RoleRoute>} />
        <Route path="/buyer/profile" element={<RoleRoute role="buyer"><BuyerProfilePage /></RoleRoute>} />

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
