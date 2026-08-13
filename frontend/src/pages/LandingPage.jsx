import { useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import useLanguage from "../context/useLanguage";
import "./LandingPage.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=86&w=2000";

const DASHBOARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPwVAn05hHQns8DXj7M3__wACdZ1VOAEkN06XwNwEDDc3W686habpPMt2j5oK3xo6kcundHsHUBXRl_thXxoVd8VYwWE9XtTY_5X7FmUzi6JgHxmQSIFD3QRgad7GQRkE6Csda-0eXVRGYAbsza_cxIETaGr-SxEhcy0HGZSNi2BPmhDpeYAl13xRVmRPC-kxuyQbVNszVDDgGyLGrdIw2vbQLoNn0p7u0Qseicfg6o2ycSome9JEPvw";

const PROCESS_STEPS = [
  { icon: "inventory_2", title: "상품 등록/연동", desc: "다양한 채널의 상품 정보를 한 곳에서 관리" },
  { icon: "shopping_cart_checkout", title: "주문 수집", desc: "글로벌 마켓의 주문을 실시간으로 취합" },
  { icon: "precision_manufacturing", title: "자동화 처리", desc: "AI 기반 최적 라우팅 및 출고 지시", highlight: true },
  { icon: "flight_takeoff", title: "국제 운송", desc: "항공/해상 운송 및 통관 프로세스" },
  { icon: "local_shipping", title: "라스트마일", desc: "현지 파트너사를 통한 정확한 배송" },
  { icon: "payments", title: "정산/통계", desc: "투명한 비용 정산 및 실적 분석" },
];

function Icon({ name }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <BrandLogo />
          </div>
          <div className="landing-nav-actions">
            <div className="lang-toggle">
              <button type="button" className={language === "ko" ? "active" : ""} onClick={() => setLanguage("ko")}>KO</button>
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            </div>
            <button type="button" className="landing-login-button" onClick={() => navigate("/login")}>
              <Icon name="login" /> {t("로그인 / 시작하기", "Log in / Get started")}
            </button>
            <button type="button" className="icon-button landing-alert" aria-label={t("알림", "Notifications")}><Icon name="notifications" /><i /></button>
            <button type="button" className="icon-button" aria-label={t("관부가세 계산기", "Duty calculator")}><Icon name="calculate" /></button>
            <button type="button" className="landing-profile-button" onClick={() => navigate("/login")} aria-label={t("프로필", "Profile")}><Icon name="person" /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag"><Icon name="public" /> KAKAO MOHE | {t("모두의 해외직구 PLATFORM", "GLOBAL SHOPPING PLATFORM")}</span>
            <h1>
              {language === "ko" ? (
                <><span className="hero-syllable">모</span>두의 <span className="hero-syllable">해</span>외직구,</>
              ) : "Global shopping for everyone,"}<br />
              <span className="accent">Kakao MOHE</span>
            </h1>
            <p>
              {t("'MOHE(모두의 해외직구)'는 복잡한 크로스보더 커머스와 직구를 누구나 쉽고 안전하게 이용할 수 있는 원스톱 플랫폼입니다. 해외 상품 탐색부터 AI 최적 소싱, 관부가세 간편결제 및 실시간 수입통관까지 모두를 위한 직구 경험을 제공합니다.", "MOHE is an all-in-one platform that makes cross-border commerce simple and safe for everyone—from product discovery and AI-powered sourcing to easy duty payments and real-time customs tracking.")}
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => navigate("/login")}>
                {t("시작하기 / 로그인", "Get started / Log in")} <Icon name="arrow_forward" />
              </button>
              <button type="button" className="hero-outline-action" onClick={() => navigate("/buyer/shops")}><Icon name="storefront" /> {t("해외 쇼핑몰 둘러보기", "Explore overseas shops")}</button>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section-head">
            <h2>단절 없는 물류 프로세스</h2>
            <p>Kakao MOHE는 파편화된 물류 단계를 하나의 매끄러운 파이프라인으로 연결하여, 기업의 운영 리소스를 최소화하고 가시성을 극대화합니다.</p>
          </div>
          <div className="process-grid">
            {PROCESS_STEPS.map((item) => (
              <article key={item.title} className={item.highlight ? "process-step highlight" : "process-step"}>
                <span className="process-step-icon"><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section-head left">
            <span className="section-tag">CORE TECHNOLOGY</span>
            <h2>MOHE AI Intelligence</h2>
            <p>단순한 관리를 넘어, 데이터를 기반으로 선제적인 의사결정을 지원합니다.</p>
          </div>
          <div className="bento-grid">
            <article className="bento-card wide">
              <span className="bento-icon"><Icon name="analytics" /></span>
              <h3>수요 예측 및 재고 최적화</h3>
              <p>과거 판매 데이터와 트렌드를 분석하여 재고 부족이나 과잉을 방지합니다. 적정 재고 수준을 유지하여 보관 비용을 절감하세요.</p>
              <div className="bento-stat"><span>Accuracy Rate</span><strong>94.2%</strong></div>
            </article>
            <article className="bento-card dark">
              <span className="bento-icon"><Icon name="route" /></span>
              <h3>스마트 라우팅</h3>
              <p>비용, 시간, 통관 리스크를 종합적으로 고려하여 가장 효율적인 배송 경로를 자동으로 제안합니다.</p>
            </article>
            <article className="bento-card">
              <span className="bento-icon light"><Icon name="warning" /></span>
              <h3>이상 탐지 알림</h3>
              <p>배송 지연, 통관 보류 등 예상치 못한 이슈를 실시간으로 감지하고 담당자에게 즉시 알림을 발송하여 신속한 대응을 돕습니다.</p>
            </article>
            <article className="bento-card wide image-card" style={{ backgroundImage: `url(${DASHBOARD_IMAGE})` }}>
              <div className="image-card-overlay" />
              <div className="image-card-content">
                <span className="bento-icon"><Icon name="dashboard" /></span>
                <h3>통합 대시보드</h3>
                <p>모든 물류 지표를 직관적인 UI로 한눈에 파악하세요. 사용자 맞춤형 위젯을 통해 필요한 데이터만 집중적으로 모니터링할 수 있습니다.</p>
                <button type="button" className="text-link-action">
                  자세히 보기 <Icon name="arrow_forward" />
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-cta">
          <h2>글로벌 비즈니스의 확장을 경험하세요</h2>
          <button type="button" className="primary-action" onClick={() => navigate("/login")}>
            셀러 계정 생성하기
          </button>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
