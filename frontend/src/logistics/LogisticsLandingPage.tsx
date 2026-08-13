import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "./components/Header";
import { initialUserProfile } from "./data/mockData";
import type { UserProfile, ViewType } from "./types";
import { LandingView } from "./views/LandingView";
import "./logistics.css";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("moheUser") || "null");
  } catch {
    return null;
  }
}

function LogisticsLandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<"KO" | "EN">("KO");
  const storedUser = useMemo(readStoredUser, []);
  const userProfile: UserProfile = {
    ...initialUserProfile,
    name: storedUser?.name || initialUserProfile.name,
    email: storedUser?.email || initialUserProfile.email,
    role: storedUser?.role === "business" ? "판매자 관리자" : "구매자",
    avatarUrl: storedUser?.profile_image || initialUserProfile.avatarUrl,
    customsCode: storedUser?.customsCode || initialUserProfile.customsCode,
  };

  function handleNavigate(view: ViewType) {
    const destinations: Partial<Record<ViewType, string>> = {
      landing: "/",
      login: "/login",
      mypage: "/buyer/home",
      search: "/buyer/products",
      shopping: "/buyer/shops",
      payments: "/buyer/payments",
      warehouse: "/buyer/forwarding",
      "ai-sourcing": "/buyer/recommendations",
      calculator: "/buyer/estimate",
      seller: "/business/dashboard",
    };

    navigate(destinations[view] || "/");
  }

  function handleLogout() {
    localStorage.removeItem("moheUser");
    localStorage.removeItem("mohePendingPayment");
    navigate("/login", { replace: true });
  }

  return (
    <div className="logistics-root">
      <Header
        currentView="landing"
        onNavigate={handleNavigate}
        userProfile={userProfile}
        lang={lang}
        onToggleLang={setLang}
        isLoggedIn={Boolean(storedUser)}
        onLogout={handleLogout}
      />
      <main className="min-h-screen w-full">
        <LandingView onNavigate={handleNavigate} />
      </main>
    </div>
  );
}

export default LogisticsLandingPage;
