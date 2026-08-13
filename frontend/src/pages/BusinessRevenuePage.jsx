import { useCallback, useEffect, useState } from "react";
import { api, formatWon } from "../api/client";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

function BusinessRevenuePage() {
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrend = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api("/api/business-trend");
      setTrend(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  const stats = trend?.__stats;

  return (
    <Layout
      title="수익·수요 분석"
      description="누적 주문 데이터를 기반으로 AI가 다음 달 매출·순이익과 성장 카테고리를 예측합니다."
      actions={
        <button className="secondary-action compact-action" onClick={loadTrend}>
          다시 예측하기
        </button>
      }
    >
      {loading ? (
        <LoadingSpinner label="AI가 누적 주문을 분석하고 있습니다" />
      ) : error ? (
        <div className="empty-state error-state">
          <strong>수요·수익 예측에 실패했습니다.</strong>
          <p>{error}</p>
          <button className="secondary-action" onClick={loadTrend}>다시 시도</button>
        </div>
      ) : (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <span>누적 주문</span>
              <strong>{stats?.totalOrders ?? 0}<small>건</small></strong>
              <p>지금까지 결제 완료된 전체 주문</p>
            </article>
            <article className="metric-card">
              <span>누적 대행 수수료 매출</span>
              <strong>{formatWon(stats?.totalRevenue)}</strong>
              <p>플랫폼 수수료 합산 기준</p>
            </article>
            <article className="metric-card accent-metric">
              <span>AI 예측 다음달 매출</span>
              <strong>{formatWon(trend.estimated_next_month_revenue_krw)}</strong>
              <p>수수료 매출 기준 추정</p>
            </article>
            <article className="metric-card accent-metric">
              <span>AI 예측 다음달 순이익</span>
              <strong>{formatWon(trend.estimated_next_month_profit_krw)}</strong>
              <p>운영비 비율 반영 추정</p>
            </article>
          </section>

          <section className="ai-briefing wide-briefing">
            <div className="card-heading-row">
              <div><span>MOHE AI SUMMARY</span><h2>{trend.summary}</h2></div>
              <span className={`confidence-tag ${trend.confidence}`}>신뢰도 {trend.confidence}</span>
            </div>
            {(stats?.totalOrders || 0) < 5 && (
              <p className="action-empty">
                누적 주문이 적어 예측 신뢰도가 낮게 반영되어 있습니다. 주문이 쌓일수록 예측이 정교해집니다.
              </p>
            )}
          </section>

          <div className="revenue-grid">
            <section className="content-card">
              <div className="card-heading-row">
                <div><span>REAL DATA</span><h2>카테고리별 주문 현황</h2></div>
                <small>누적 상위 5개</small>
              </div>
              {stats?.topCategories?.length ? (
                <ul className="category-list">
                  {stats.topCategories.map((item) => (
                    <li key={item.category}>
                      <strong>{item.category}</strong>
                      <span>{item.count}건</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="action-empty">아직 카테고리 데이터가 없습니다.</p>
              )}
            </section>

            <section className="content-card">
              <div className="card-heading-row">
                <div><span>AI FORECAST</span><h2>성장 예상 카테고리</h2></div>
              </div>
              {trend.growth_categories?.length ? (
                <ul className="category-list growth">
                  {trend.growth_categories.map((item) => (
                    <li key={item.category}>
                      <strong>{item.category}</strong>
                      <p>{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="action-empty">아직 뚜렷한 성장 신호가 감지되지 않았습니다.</p>
              )}
            </section>
          </div>

          <section className="content-card recommendation-card">
            <div className="card-heading-row">
              <div><span>NEXT ACTION</span><h2>재고·물류 준비 제안</h2></div>
            </div>
            {trend.recommendations?.length ? (
              <ul className="briefing-list wide">
                {trend.recommendations.map((rec) => <li key={rec}>{rec}</li>)}
              </ul>
            ) : (
              <p className="action-empty">현재 추가로 제안할 사항이 없습니다.</p>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}

export default BusinessRevenuePage;
