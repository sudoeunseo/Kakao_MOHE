import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, getApiUrl } from "../api/client";
import { KakaoTalkIcon } from "../logistics/components/KakaoTalkIcon";
import { Logo } from "../logistics/components/Logo";
import "../logistics/logistics.css";

const DEMO_ACCOUNTS = {
  buyer: { email: "buyer@mohe.demo", password: "1234", name: "김모해", role: "buyer" },
  business: { email: "business@mohe.demo", password: "1234", name: "모해물류", role: "business" },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState("");
  const [error, setError] = useState(searchParams.get("kakao_error") || "");
  const [kakaoStatus, setKakaoStatus] = useState({ loading: true, configured: false });

  useEffect(() => {
    api("/api/auth/kakao/status")
      .then((status) => setKakaoStatus({ loading: false, ...status }))
      .catch(() => setKakaoStatus({ loading: false, configured: false }));
  }, []);

  function moveToUserPage(user) {
    localStorage.setItem("moheUser", JSON.stringify(user));
    navigate(user.role === "business" ? "/business/dashboard" : "/buyer/home", { replace: true });
  }

  async function loginDemo(role) {
    const account = DEMO_ACCOUNTS[role];
    try {
      await api("/api/auth/signup", { method: "POST", body: JSON.stringify(account) });
    } catch (signupError) {
      if (!signupError.message.includes("이미 가입")) throw signupError;
    }
    return api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: account.email, password: account.password }),
    });
  }

  async function handleRoleLogin(role) {
    setError("");
    setLoading(role);
    try {
      const user = form.email && form.password
        ? await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) })
        : await loginDemo(role);
      moveToUserPage(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  function handleKakaoLogin() {
    setError("");
    setLoading("kakao");
    window.location.assign(getApiUrl("/api/auth/kakao/start"));
  }

  return (
    <div className="logistics-root min-h-screen bg-[#F8F9FB] text-[#191c1e]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E1E2E4] bg-[#F8F9FB] px-5 shadow-sm md:px-8">
        <Logo size="md" onClick={() => navigate("/")} />
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-[#E1E2E4] bg-[#f2f4f6] p-1 sm:flex">
            <span className="rounded-full bg-[#FFCD00] px-3.5 py-1 text-xs font-bold">KO</span>
            <span className="px-3.5 py-1 text-xs font-bold text-gray-500">EN</span>
          </div>
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-1.5 rounded-xl bg-[#1E2A44] px-4 py-2 text-xs font-bold text-white">
            <span className="material-symbols-outlined text-base">home</span> 메인 홈으로
          </button>
        </div>
      </header>

      <div className="flex min-h-screen w-full pt-16">
        <section className="relative hidden w-1/2 items-end justify-center overflow-hidden bg-[#08152e] p-12 lg:flex">
          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08152e] via-[#08152e]/50 to-transparent" />
          <div className="relative z-10 mb-8 max-w-lg text-white">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">글로벌 커머스의 시작</h1>
            <p className="text-base font-normal leading-relaxed text-gray-200">Kakao MOHE와 함께 전 세계 크로스보더 커머스를 경험하세요.<br />안정적이고 혁신적인 스마트 물류 및 소싱 솔루션을 제공합니다.</p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-[#F8F9FB] p-6 lg:w-1/2">
          <div className="w-full max-w-md rounded-3xl border border-[#E1E2E4] bg-white p-8 shadow-lg md:p-10">
            <div className="mb-8 flex justify-center"><Logo size="lg" onClick={() => navigate("/")} /></div>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); handleRoleLogin("buyer"); }}>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-gray-600">이메일 또는 아이디</label>
                <input id="email" type="email" value={form.email} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} placeholder="example@kakao.com" autoComplete="email" className="h-[46px] w-full rounded-xl border border-[#E1E2E4] bg-[#F8F9FB] px-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1E2A44]" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-gray-600">비밀번호</label>
                <input id="password" type="password" value={form.password} onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))} placeholder="비밀번호를 입력해주세요" autoComplete="current-password" className="h-[46px] w-full rounded-xl border border-[#E1E2E4] bg-[#F8F9FB] px-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1E2A44]" />
              </div>
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600" role="alert">{error}</p>}
              <div className="space-y-2.5 pt-2">
                <button type="submit" disabled={Boolean(loading)} className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#FFCD00] text-sm font-bold text-[#191919] shadow-sm hover:bg-yellow-400 disabled:opacity-60"><span className="material-symbols-outlined text-lg">login</span>{loading === "buyer" ? "로그인 중..." : "구매자로 로그인"}</button>
                <button type="button" disabled={Boolean(loading)} onClick={() => handleRoleLogin("business")} className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E2A44] text-sm font-bold text-white shadow-sm hover:bg-[#08152e] disabled:opacity-60"><span className="material-symbols-outlined text-lg">storefront</span>{loading === "business" ? "로그인 중..." : "판매자로 로그인"}</button>
              </div>
            </form>
            <div className="my-6 flex items-center"><div className="flex-grow border-t border-[#E1E2E4]" /><span className="px-4 text-xs font-semibold text-gray-400">또는</span><div className="flex-grow border-t border-[#E1E2E4]" /></div>
            <button type="button" onClick={handleKakaoLogin} disabled={Boolean(loading) || kakaoStatus.loading || !kakaoStatus.configured} className="mb-4 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border border-yellow-300 bg-[#FEE500] text-sm font-black text-[#191919] shadow-md hover:bg-[#FADA00] disabled:cursor-not-allowed disabled:opacity-60"><KakaoTalkIcon className="h-7 w-7 shrink-0 rounded-lg" /><span>{loading === "kakao" ? "카카오 로그인으로 이동 중..." : kakaoStatus.loading ? "카카오 로그인 확인 중..." : kakaoStatus.configured ? "카카오 계정으로 간편로그인" : "카카오 로그인 설정 필요"}</span></button>
            {!kakaoStatus.loading && !kakaoStatus.configured && <p className="mb-4 text-center text-[11px] text-red-500">서버의 카카오 REST API 키 설정을 확인해 주세요.</p>}
            <div className="mb-8 flex items-center justify-center gap-4 text-xs font-medium text-gray-600"><span>아이디 찾기</span><i className="h-3 w-px bg-gray-300" /><span>비밀번호 재설정</span><i className="h-3 w-px bg-gray-300" /><button type="button" onClick={handleKakaoLogin} className="font-bold">카카오 빠른 회원가입</button></div>
            <div className="text-center text-[11px] font-normal text-gray-400"><p className="mb-1.5">© 2026 MOHE Logistics Core. All rights reserved.</p><p>이용약관　|　개인정보처리방침</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}
