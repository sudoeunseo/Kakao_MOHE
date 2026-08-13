import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, getApiUrl } from "../api/client";
import logo from "../assets/logo.png";
import "./LoginPage.css";

const DEMO_ACCOUNTS = {
  buyer: {
    email: "buyer@mohe.demo",
    password: "1234",
    name: "김모해",
    role: "buyer",
  },
  business: {
    email: "business@mohe.demo",
    password: "1234",
    name: "모해물류",
    role: "business",
  },
};

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

    if (user.role === "business") {
      navigate("/business/dashboard", { replace: true });
    } else {
      navigate("/buyer/home", { replace: true });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading("login");

    try {
      const user = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      moveToUserPage(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  async function handleDemoLogin(role) {
    const account = DEMO_ACCOUNTS[role];

    setError("");
    setLoading(role);

    try {
      // 데모 계정이 없으면 먼저 회원가입합니다.
      try {
        await api("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(account),
        });
      } catch (signupError) {
        // 이미 가입된 계정이면 그대로 로그인합니다.
        if (!signupError.message.includes("이미 가입")) {
          throw signupError;
        }
      }

      const user = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: account.email,
          password: account.password,
        }),
      });

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
    <main className="login-page">
      <section className="login-introduction">
        <div className="brand">
          <span className="brand-mark">
            <img src={logo} alt="Kakao MOHE" />
          </span>
        </div>

        <div className="introduction-content">
          <span className="eyebrow">Kakao T Global Flow</span>

          <h1>
            해외구매의 시작부터
            <br />
            배송 완료까지 한 번에
          </h1>

          <p>
            AI가 최종 구매비용과 통관 위험을 예측하고,
            구매자의 주문을 기업 물류 운영과 연결합니다.
          </p>

          <div className="feature-list">
            <div>
              <strong>AI 비용 예측</strong>
              <span>관세·배송비·수수료를 미리 확인</span>
            </div>

            <div>
              <strong>통합 주문 관리</strong>
              <span>구매자와 기업이 하나의 주문으로 연결</span>
            </div>

            <div>
              <strong>카카오페이</strong>
              <span>예상 금액 확인 후 간편하게 결제</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-heading">
            <img className="mobile-brand" src={logo} alt="Kakao MOHE" />
            <h2>로그인</h2>
            <p>MOHE 서비스를 시작해 보세요.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              autoComplete="email"
              required
            />

            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />

            {error && <p className="error-message">{error}</p>}

            <button
              className="login-button"
              type="submit"
              disabled={Boolean(loading)}
            >
              {loading === "login" ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <button
            type="button"
            className="kakao-login-button"
            onClick={handleKakaoLogin}
            disabled={Boolean(loading) || kakaoStatus.loading || !kakaoStatus.configured}
          >
            <span className="kakao-talk-mark" aria-hidden="true">●</span>
            {loading === "kakao"
              ? "카카오 로그인으로 이동 중..."
              : kakaoStatus.loading
                ? "카카오 로그인 확인 중..."
                : kakaoStatus.configured
                  ? "카카오로 시작하기"
                  : "카카오 로그인 설정 필요"}
          </button>

          {!kakaoStatus.loading && !kakaoStatus.configured && (
            <p className="kakao-config-notice">
              서버의 KAKAO_REST_API_KEY를 설정하면 버튼이 활성화됩니다.
            </p>
          )}

          <div className="divider">
            <span>또는 데모 계정으로 시작</span>
          </div>

          <div className="demo-buttons">
            <button
              type="button"
              className="demo-button buyer"
              onClick={() => handleDemoLogin("buyer")}
              disabled={Boolean(loading)}
            >
              <strong>
                {loading === "buyer"
                  ? "접속 중..."
                  : "구매자 화면 체험"}
              </strong>
              <span>AI 해외구매 비용 예측</span>
            </button>

            <button
              type="button"
              className="demo-button business"
              onClick={() => handleDemoLogin("business")}
              disabled={Boolean(loading)}
            >
              <strong>
                {loading === "business"
                  ? "접속 중..."
                  : "기업 화면 체험"}
              </strong>
              <span>주문·물류 운영 대시보드</span>
            </button>
          </div>

          <p className="demo-notice">
            데모 버튼을 누르면 테스트 계정이 자동으로 생성됩니다.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
