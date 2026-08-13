import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setError("카카오 로그인 확인 코드가 없습니다.");
      return;
    }

    api(`/api/auth/kakao/session?token=${encodeURIComponent(token)}`)
      .then((user) => {
        localStorage.setItem("moheUser", JSON.stringify(user));
        navigate("/buyer/estimate", { replace: true });
      })
      .catch((requestError) => setError(requestError.message));
  }, [navigate, searchParams]);

  return (
    <main className="payment-page">
      <section className="payment-card">
        <span className={`payment-symbol ${error ? "error" : ""}`}>
          {error ? "!" : "…"}
        </span>
        <span className="page-eyebrow">KAKAO LOGIN</span>
        <h1>{error ? "카카오 로그인을 완료하지 못했습니다" : "카카오 로그인 확인 중"}</h1>
        <p>{error || "카카오 계정 정보를 안전하게 확인하고 있습니다."}</p>
        {error && (
          <Link className="secondary-action link-action" to="/login">
            로그인 화면으로 돌아가기
          </Link>
        )}
      </section>
    </main>
  );
}

export default KakaoCallbackPage;
