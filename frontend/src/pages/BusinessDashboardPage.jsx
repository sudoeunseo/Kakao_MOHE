import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import LoadingSpinner from "../components/LoadingSpinner";
import { getOrderDisplay } from "../utils/orderDisplay";
import useLanguage from "../context/useLanguage";

const STATUS_STEPS = [
  { key: "pending", ko: "소싱 접수", en: "Sourcing", icon: "shopping_cart" },
  { key: "paid", ko: "배송대행지 검수", en: "Hub Inspection", icon: "inventory_2" },
  { key: "shipping", ko: "국제운송", en: "International", icon: "flight_takeoff", tone: "accent" },
  { key: "customs", ko: "통관", en: "Customs", icon: "policy", tone: "danger" },
  { key: "domestic", ko: "국내배송", en: "Domestic", icon: "local_shipping" },
  { key: "delivered", ko: "셀러 입고", en: "Seller Intake", icon: "check_circle" },
];

function formatRevenue(value, language) {
  if (value >= 100000000) return language === "en" ? `₩${(value / 1000000).toFixed(1)}M` : `₩${(value / 100000000).toFixed(1)}억`;
  if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`;
  return `₩${Math.round(value).toLocaleString(language === "en" ? "en-US" : "ko-KR")}`;
}

function BusinessDashboardPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [trend, setTrend] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api("/api/orders/all");
      setOrders(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrend = useCallback(async () => {
    setTrendLoading(true);
    setTrendError("");
    try {
      const result = await api("/api/business-trend");
      setTrend(result);
    } catch (requestError) {
      setTrendError(requestError.message);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadTrend();
  }, [loadOrders, loadTrend]);

  const metrics = useMemo(() => {
    const statusCounts = STATUS_STEPS.reduce((acc, step) => {
      acc[step.key] = orders.filter((order) => order.status === step.key).length;
      return acc;
    }, {});
    const riskOrders = orders.filter((order) => (order.ai_estimate?.risk_notes?.length || 0) > 0);
    return {
      statusCounts,
      paid: statusCounts.paid || 0,
      inTransit: statusCounts.shipping || 0,
      riskOrders,
      todayRevenue: orders.reduce(
        (sum, order) =>
          sum +
          (order.ai_estimate?.breakdown?.total_estimated_krw ||
            (order.price_currency === "KRW" ? Number(order.price_amount) : 0) ||
            0),
        0,
      ),
    };
  }, [orders]);

  const briefingItems = useMemo(() => {
    const growth = trend?.growth_categories?.[0];
    const recommendation = trend?.recommendations?.[0];

    return [
      {
        icon: "flight_land",
        title: t("물류 지연 경고", "Logistics Delay Alert"),
        text:
          metrics.statusCounts.customs > 0
            ? t(`현재 통관 단계에 ${metrics.statusCounts.customs}건이 있습니다. 지연 가능 주문을 우선 확인해 주세요.`, `${metrics.statusCounts.customs} orders are currently in customs. Review orders at risk of delay first.`)
            : t("현재 통관 단계에서 확인된 지연 주문은 없습니다.", "No delayed orders have been detected at customs."),
      },
      {
        icon: "trending_up",
        title: t("수요 급증 감지", "Demand Surge Detection"),
        text: growth
          ? t(`${growth.category}: ${growth.reason}`, "A high-growth product category has been detected from cumulative order data.")
          : trendLoading
            ? t("누적 주문 데이터를 분석해 수요 변화를 찾고 있습니다.", "Analyzing cumulative orders for changes in demand.")
            : t("충분한 주문 데이터가 쌓이면 성장 품목을 안내합니다.", "Growth products will appear once enough order data is available."),
      },
      {
        icon: "hub",
        title: t("배송대행지 이용 최적화", "Shipping Hub Optimization"),
        text:
          (language === "ko" && recommendation) ||
          (trendError
            ? t("AI 연결이 지연되고 있습니다. 잠시 후 최신 운영 제안을 다시 확인해 주세요.", "The AI connection is delayed. Please check the latest recommendation again shortly.")
            : t("카카오 MOHE 배송대행지별 구매·검수·배송 조건을 비교해 유리한 소싱 경로를 준비하고 있습니다.", "Comparing purchasing, inspection, and shipping conditions across Kakao MOHE hubs to find the best sourcing route.")),
      },
    ];
  }, [language, metrics.statusCounts.customs, t, trend, trendError, trendLoading]);

  return (
    <Layout title={t("홈", "Home")} dashboard>
      {loading ? (
        <LoadingSpinner label={t("통합 주문 데이터를 불러오고 있습니다", "Loading consolidated order data")} />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>{t("운영 데이터를 불러오지 못했습니다.", "Could not load operational data.")}</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadOrders}>{t("다시 시도", "Try again")}</button>
        </div>
      ) : (
        <>
          <section className="kpi-grid dashboard-kpi-grid">
            <article className="kpi-card">
              <div className="kpi-card-head"><span>{t("오늘 소싱 주문", "Today's Sourcing Orders")}</span></div>
              <strong>{orders.length}<small>{t("건", "")}</small></strong>
            </article>
            <article className="kpi-card">
              <div className="kpi-card-head"><span>{t("배송대행지 검수", "Hub Inspections")}</span></div>
              <strong>{metrics.paid}<small>{t("건", "")}</small></strong>
            </article>
            <article className="kpi-card">
              <div className="kpi-card-head"><span>{t("배송 중", "In Transit")}</span></div>
              <strong>{metrics.inTransit}<small>{t("건", "")}</small></strong>
            </article>
            <article className="kpi-card warn">
              <div className="kpi-card-head"><span><Icon name="warning" /> {t("통관 이슈", "Customs Issues")}</span></div>
              <strong>{metrics.riskOrders.length}<small>{t("건", "")}</small></strong>
            </article>
            <article className="kpi-card">
              <div className="kpi-card-head"><span>{t("예상 소싱 비용", "Estimated Sourcing Cost")}</span></div>
              <strong>{formatRevenue(metrics.todayRevenue, language)}</strong>
            </article>
          </section>

          <section className="home-grid">
            <div className="content-card dashboard-status-card">
              <div className="card-heading-row">
                <div><h2>{t("소싱·입고 현황", "Sourcing & Intake Status")}</h2></div>
                <button className="text-link-action" onClick={() => navigate("/business/orders")}>{t("상세보기", "View details")} <Icon name="chevron_right" /></button>
              </div>
              <div className="dashboard-flow">
                {STATUS_STEPS.map((step, index) => {
                  const count = metrics.statusCounts[step.key] || 0;
                  return (
                    <div key={step.key} className={`dashboard-flow-step ${step.tone || ""}`}>
                      <div className="dashboard-flow-icon">
                        <Icon name={step.icon} />
                      </div>
                      <strong>{t(step.ko, step.en)}</strong>
                      <span>{count.toLocaleString(language === "en" ? "en-US" : "ko-KR")}</span>
                      {index < STATUS_STEPS.length - 1 && <i aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="content-card action-card">
              <div className="card-heading-row">
                <div className="action-card-title"><Icon name="assignment_late" /><h2>{t("확인이 필요한 업무", "Tasks Requiring Attention")}</h2></div>
              </div>
              {metrics.riskOrders.length === 0 ? (
                <p className="action-empty">{t("현재 AI가 감지한 통관 위험 주문이 없습니다.", "No customs-risk orders are currently detected by AI.")}</p>
              ) : (
                <ul className="action-list">
                  {metrics.riskOrders.slice(0, 4).map((order) => {
                    const display = getOrderDisplay(order, language);
                    return (
                      <li key={order.id}>
                        <span className="action-icon"><Icon name="error" /></span>
                        <div>
                          <strong>{display.product}</strong>
                          <small>#{String(order.id).padStart(4, "0")} · {display.risk}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <button className="secondary-action compact-action nav-action" onClick={() => navigate("/business/orders")}>
                {t("전체 보기", "View all")}
              </button>
            </div>
          </section>

          <section className="dashboard-ai-briefing">
            <div className="dashboard-ai-heading">
              <h2><Icon name="bolt" /> {t("모해 AI 브리핑", "MOHE AI Briefing")}</h2>
              <span>{t("AI 분석 완료", "AI Analysis Complete")}</span>
            </div>
            <div className="dashboard-ai-grid">
              {briefingItems.map((item) => (
                <article key={item.title}>
                  <h3><Icon name={item.icon} /> {item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <button className="dashboard-ai-more" onClick={() => navigate("/business/revenue")}>
              {t("상세 분석 보기", "View detailed analysis")} <Icon name="arrow_forward" />
            </button>
          </section>
        </>
      )}
    </Layout>
  );
}

export default BusinessDashboardPage;
