import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { CustomsCalculatorModal } from "./components/CustomsCalculatorModal";
import { Header } from "./components/Header";
import { NewAddressModal } from "./components/NewAddressModal";
import { RequestProductModal } from "./components/RequestProductModal";
import { Sidebar } from "./components/Sidebar";
import { LanguageProvider } from "./context/LanguageContext";
import {
  aiSourcingItems,
  initialAddresses,
  initialCards,
  initialPackages,
  initialTransactions,
  initialUserProfile,
  recommendedProducts,
  shoppingMalls,
} from "./data/mockData";
import type { ShippingAddress, Transaction, UserProfile, ViewType } from "./types";
import { AISourcingView } from "./views/AISourcingView";
import { MyPageView } from "./views/MyPageView";
import { PaymentsView } from "./views/PaymentsView";
import { SearchProductView } from "./views/SearchProductView";
import { ShoppingMallsView } from "./views/ShoppingMallsView";
import { WarehouseView } from "./views/WarehouseView";
import "./logistics.css";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("moheUser") || "{}");
  } catch {
    return {};
  }
}

function viewFromPath(pathname: string): ViewType {
  if (pathname.startsWith("/buyer/products")) return "search";
  if (pathname.startsWith("/buyer/shops")) return "shopping";
  if (pathname.startsWith("/buyer/recommendations")) return "ai-sourcing";
  if (pathname.startsWith("/buyer/forwarding")) return "warehouse";
  if (pathname.startsWith("/buyer/payments") || pathname.startsWith("/buyer/customs")) return "payments";
  return "mypage";
}

export default function B2CPortalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = readStoredUser();
  const [lang, setLang] = useState<"KO" | "EN">("KO");
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    ...initialUserProfile,
    name: storedUser.name || initialUserProfile.name,
    email: storedUser.email || initialUserProfile.email,
    role: "기업 구매자",
    avatarUrl: storedUser.profile_image || initialUserProfile.avatarUrl,
    customsCode: storedUser.customsCode || initialUserProfile.customsCode,
  }));
  const [addresses, setAddresses] = useState(initialAddresses);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [packages] = useState(initialPackages);
  const [isCustomsCalcOpen, setIsCustomsCalcOpen] = useState(false);
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [isRequestProductOpen, setIsRequestProductOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentStarting = useRef(false);
  const currentView = viewFromPath(location.pathname);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    if (!storedUser.id) return;
    api(`/api/orders?userId=${storedUser.id}`)
      .then((orders) => {
        if (!Array.isArray(orders) || !orders.length) return;
        const realTransactions: Transaction[] = orders.map((order) => ({
          id: `order-${order.id}`,
          category: "관세",
          title: order.product_name,
          orderNumber: `MOHE-${String(order.id).padStart(8, "0")}`,
          paymentMethod: order.status === "paid" ? "카카오페이" : "-",
          amount: Number(order.ai_estimate?.breakdown?.total_estimated_krw || order.price_amount || 0),
          status: order.status === "paid" ? "결제완료" : "결제대기",
          date: String(order.created_at || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
        }));
        setTransactions([...realTransactions, ...initialTransactions]);
      })
      .catch(() => {});
  }, [storedUser.id]);

  function showToast(message: string) {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  }

  function handleLogout() {
    localStorage.removeItem("moheUser");
    localStorage.removeItem("mohePendingPayment");
    navigate("/login", { replace: true });
  }

  function handleNavigate(view: ViewType) {
    if (view === "calculator") {
      setIsCustomsCalcOpen(true);
      return;
    }
    if (view === "login") {
      handleLogout();
      return;
    }
    const destinations: Partial<Record<ViewType, string>> = {
      landing: "/",
      mypage: "/buyer/home",
      search: "/buyer/products",
      shopping: "/buyer/shops",
      payments: "/buyer/payments",
      warehouse: "/buyer/forwarding",
      "ai-sourcing": "/buyer/recommendations",
    };
    navigate(destinations[view] || "/buyer/home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpdateUserProfile(updated: Partial<UserProfile>) {
    setUserProfile((previous) => {
      const next = { ...previous, ...updated };
      localStorage.setItem("moheUser", JSON.stringify({
        ...storedUser,
        name: next.name,
        profile_image: next.avatarUrl,
        customsCode: next.customsCode,
      }));
      return next;
    });
  }

  function handleAddAddress(newAddress: ShippingAddress) {
    setAddresses((previous) => [
      ...(newAddress.isDefault ? previous.map((address) => ({ ...address, isDefault: false })) : previous),
      newAddress,
    ]);
    showToast(`배송지 '${newAddress.title}' 주소가 추가되었습니다.`);
  }

  async function startKakaoPayment(title: string, amount: number, category: Transaction["category"]) {
    if (paymentStarting.current) return;
    paymentStarting.current = true;
    showToast("카카오페이 테스트 결제창을 준비하고 있습니다.");
    const productMeta = {
      userId: storedUser.id,
      productName: title,
      productUrl: "",
      originCountry: category === "관세" ? "US" : "",
      priceAmount: amount,
      priceCurrency: "KRW",
      shippingMode: category === "해외배송비" ? "forwarding" : "direct",
      aiEstimate: {
        category,
        summary: `${title} ${category} 결제`,
        breakdown: {
          product_price_krw: category === "관세" ? amount : 0,
          international_shipping_krw: category === "해외배송비" ? amount : 0,
          duty_and_vat_krw: category === "관세" ? amount : 0,
          platform_fee_krw: 0,
          total_estimated_krw: amount,
        },
      },
    };
    try {
      const result = await api("/api/kakaopay/ready", {
        method: "POST",
        body: JSON.stringify({
          userId: storedUser.id,
          orderName: title,
          amount: Math.max(100, Math.round(amount)),
          redirectBaseUrl: window.location.origin,
        }),
      });
      localStorage.setItem("mohePendingPayment", JSON.stringify({
        partnerOrderId: result.partnerOrderId,
        productMeta,
      }));
      const redirectUrl = window.innerWidth <= 720 && result.redirectUrlMobile
        ? result.redirectUrlMobile
        : result.redirectUrl;
      if (!redirectUrl) throw new Error("카카오페이 결제 URL을 받지 못했습니다.");
      window.location.assign(redirectUrl);
    } catch (error) {
      paymentStarting.current = false;
      showToast(error instanceof Error ? error.message : "결제창을 준비하지 못했습니다.");
    }
  }

  function handlePayTransaction(id: string) {
    const transaction = transactions.find((item) => item.id === id)
      || transactions.find((item) => item.status === "결제대기");
    if (!transaction) return showToast("결제할 항목을 찾지 못했습니다.");
    startKakaoPayment(transaction.title, transaction.amount, transaction.category);
  }

  function handlePayShipping(packageIds: string[]) {
    const selected = packages.filter((item) => packageIds.includes(item.id));
    const totalKrw = Math.round(selected.reduce((sum, item) => sum + item.shippingFeeUsd, 0) * 1380);
    if (!selected.length || totalKrw <= 0) return showToast("결제할 배송 상품을 선택해 주세요.");
    startKakaoPayment(`${selected.length}개 상품 묶음 해외 배송비`, totalKrw, "해외배송비");
  }

  return (
    <LanguageProvider lang={lang} onLangChange={setLang}>
      <div className="logistics-root min-h-screen bg-[#F8F9FB] text-[#191c1e] font-sans antialiased selection:bg-[#FFCD00] selection:text-[#191919]">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-2xl border border-[#FFCD00]/40 bg-[#08152e] px-5 py-3 text-white shadow-2xl" role="status">
            <span className="material-symbols-outlined text-xl text-[#FFCD00]">check_circle</span>
            <p className="text-xs font-semibold">{toastMessage}</p>
          </div>
        )}
        <Header currentView={currentView} onNavigate={handleNavigate} userProfile={userProfile} lang={lang} onToggleLang={setLang} isLoggedIn onLogout={handleLogout} />
        <Sidebar currentView={currentView} onNavigate={handleNavigate} userProfile={userProfile} />
        <main className="min-h-screen w-full">
          {currentView === "mypage" && <MyPageView userProfile={userProfile} onUpdateUserProfile={handleUpdateUserProfile} addresses={addresses} cards={initialCards} onOpenNewAddressModal={() => setIsNewAddressOpen(true)} onNavigate={handleNavigate} showToast={showToast} />}
          {currentView === "search" && <SearchProductView recommendedProducts={recommendedProducts} onOpenRequestModal={() => setIsRequestProductOpen(true)} onNavigate={handleNavigate} showToast={showToast} />}
          {currentView === "shopping" && <ShoppingMallsView malls={shoppingMalls} onNavigate={handleNavigate} showToast={showToast} />}
          {currentView === "payments" && <PaymentsView transactions={transactions} onPayTransaction={handlePayTransaction} onNavigate={handleNavigate} showToast={showToast} />}
          {currentView === "warehouse" && <WarehouseView packages={packages} onPayShipping={handlePayShipping} onNavigate={handleNavigate} showToast={showToast} />}
          {currentView === "ai-sourcing" && <AISourcingView items={aiSourcingItems} onNavigate={handleNavigate} showToast={showToast} />}
        </main>
        <CustomsCalculatorModal isOpen={isCustomsCalcOpen} onClose={() => setIsCustomsCalcOpen(false)} userCustomsCode={userProfile.customsCode} />
        <NewAddressModal isOpen={isNewAddressOpen} onClose={() => setIsNewAddressOpen(false)} onAddAddress={handleAddAddress} />
        <RequestProductModal isOpen={isRequestProductOpen} onClose={() => setIsRequestProductOpen(false)} onRequestSubmitted={(productName) => showToast(`'${productName}' 상품 소싱 요청을 등록했습니다.`)} />
      </div>
    </LanguageProvider>
  );
}
