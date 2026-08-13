import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./LandingPage.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzbIIBdle2zib_6FINaSKmLNoq6C086rSWO4Ih_x56HyUzoVIvX7Evd9EcKNZRXbh00lmFuSeo_eoSesO9cb8t6S8JLyyZNn5ad3eQQHkHVDjhZU3FA49nKXMoY9vsjJUn7UNUhwwm8jdHWfyorWDwIbLo1C_qKjxrLKg45ymicsqiEadsrEVF1_ytLMK6g7lgnB7KZnjZ0Nlt9SDw20FBSCan_by61l7SdSPe7lodtEkJe93Rdmv-Sg";

const DASHBOARD_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPwVAn05hHQns8DXj7M3__wACdZ1VOAEkN06XwNwEDDc3W686habpPMt2j5oK3xo6kcundHsHUBXRl_thXxoVd8VYwWE9XtTY_5X7FmUzi6JgHxmQSIFD3QRgad7GQRkE6Csda-0eXVRGYAbsza_cxIETaGr-SxEhcy0HGZSNi2BPmhDpeYAl13xRVmRPC-kxuyQbVNszVDDgGyLGrdIw2vbQLoNn0p7u0Qseicfg6o2ycSome9JEPvw";

const NAV_LINKS = ["홈/대시보드", "주문관리", "배송대행지 관리", "통계/분석"];

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

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={logo} alt="Kakao MOHE" />
          </div>
          <nav aria-label="주요 메뉴 미리보기">
            {NAV_LINKS.map((label, index) => (
              <span key={label} className={index === 0 ? "active" : ""}>{label}</span>
            ))}
          </nav>
          <div className="landing-nav-actions">
            <div className="lang-toggle">
              <button type="button" className="active">KO</button>
              <button type="button">EN</button>
            </div>
            <button type="button" className="icon-button" aria-hidden="true"><Icon name="notifications" /></button>
            <button type="button" className="icon-button" aria-hidden="true"><Icon name="help" /></button>
            <button type="button" className="icon-button" onClick={() => navigate("/login")} title="로그인">
              <Icon name="person" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag">SELLER PORTAL</span>
            <h1>
              글로벌 물류를<br />
              <span className="accent">하나의 흐름으로</span>
            </h1>
            <p>
              복잡한 크로스보더 이커머스 운영을 단순화합니다. Kakao MOHE는 주문부터 배송, 정산까지 모든 과정을
              투명하고 효율적으로 관리할 수 있는 통합 솔루션을 제공합니다.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => navigate("/login")}>
                시작하기 <Icon name="arrow_forward" />
              </button>
              <button type="button" className="hero-outline-action">도입 문의</button>
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
