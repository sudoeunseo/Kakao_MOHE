import Layout from "../components/Layout";
import Icon from "../components/Icon";
import useLanguage from "../context/useLanguage";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-0X78bKP6AK0Msygy-8L1KDzyeA8bpxmZqk1YM_2I550pcwV5sqKtUfdIR84E-GBtAsENKJxlCZp3EVI-ep2NBOcP2bn63PNtrbXU-SWqlupnnUhX4eAs1QmKt8Cm_PHKoNW8DR8V_d51z2MjdLHpHY0uUCdpsmDzb9Gc9hKNl7CDQVkV5aQPBxMpk-aH1TzjX84TOUyXVoEurAOQy1zD0br0p2yASpTGQbTmPp7AdFxFpIdxscrlQ";
const SNEAKER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGcxlYnMuUCmkNpWPUouEbfP56BnHhMQxyRW2YWHwTt9G1gpot_uFDFexShOhDK1t2aDqEO-oGbZ5tgP_gWRX-6GyftuoleMhPefAbv428SjctdFxKMt31Ay-nK7AJamb7cSGG8YKSbscQIy3D_JHaMzfIK7brLIN-NtgIB5-WvSK_G8YekAFDCeeJthhAhWGFDIxO6hcySPydRHHSgbgaSVbBQU-J69bp6QpyHt1pd0mp4X8HYrZPEg";

const HUBS = [
  { ko: "인천 글로벌 센터", en: "Incheon Global Center", descKo: "아시아 태평양 핵심 거점", descEn: "Asia-Pacific core hub", rate: 72, statusKo: "정상", statusEn: "Normal", tone: "ok" },
  { ko: "로스앤젤레스 허브", en: "Los Angeles Hub", descKo: "미주 물류 거점", descEn: "Americas logistics hub", rate: 91, statusKo: "혼잡", statusEn: "Busy", tone: "warn" },
  { ko: "상하이 센터", en: "Shanghai Center", descKo: "중화권 및 동아시아 분배", descEn: "Greater China and East Asia distribution", rate: 64, statusKo: "여유", statusEn: "Available", tone: "good" },
];

const NODES = [
  { ko: "인천 (72%)", en: "Incheon (72%)", top: "40%", left: "80%", tone: "ok" },
  { ko: "로스앤젤레스 (91%)", en: "Los Angeles (91%)", top: "35%", left: "20%", tone: "warn" },
  { ko: "상하이 (64%)", en: "Shanghai (64%)", top: "45%", left: "75%", tone: "good" },
  { ko: "로테르담 (45%)", en: "Rotterdam (45%)", top: "30%", left: "50%", tone: "info" },
];

const INVENTORY_ROWS = [
  { name: "Nike Air Force 1 '07", sku: "NK-AF1-07-WHT", categoryKo: "신발/스니커즈", categoryEn: "Shoes / Sneakers", total: "12,240", available: "11,100", locationKo: "인천 글로벌 / A-12", locationEn: "Incheon Global / A-12", statusKo: "정상", statusEn: "Normal" },
  { name: "Nike Air Max 1", sku: "NK-AM1-BW-270", categoryKo: "신발/스니커즈", categoryEn: "Shoes / Sneakers", total: "6", available: "2", locationKo: "로스앤젤레스 / C-04", locationEn: "Los Angeles / C-04", statusKo: "부족 임박", statusEn: "Low Stock", warn: true },
  { name: "Adidas Stan Smith", sku: "AD-SS-GRN-260", categoryKo: "신발/스니커즈", categoryEn: "Shoes / Sneakers", total: "8,500", available: "8,200", locationKo: "상하이 센터 / B-02", locationEn: "Shanghai Center / B-02", statusKo: "정상", statusEn: "Normal" },
  { name: "Essential Basic Tee (White)", sku: "AP-TEE-WHT-L", categoryKo: "의류/상의", categoryEn: "Apparel / Tops", total: "32,000", available: "29,500", locationKo: "로테르담 / A-01", locationEn: "Rotterdam / A-01", statusKo: "입고중", statusEn: "Inbound" },
];

function LogisticsPreviewPage() {
  const { language, t } = useLanguage();
  return (
    <Layout
      title={t("배송대행지·재고 관리", "Shipping Hubs & Inventory")}
      description={t("카카오 MOHE가 운영하는 해외 배송대행지의 구매·검수·배송 진행과 국내 판매 재고를 확인합니다.", "Monitor purchasing, inspection, and shipping at Kakao MOHE overseas hubs, along with domestic selling inventory.")}
      actions={<span className="preview-badge">{t("PREVIEW · 데모 화면", "PREVIEW · DEMO")}</span>}
    >
      <p className="preview-notice">
        {t("아래 정보는 카카오 MOHE 배송대행지 서비스 이용 화면을 위한 데모 데이터입니다.", "The information below is demo data for the Kakao MOHE shipping hub service.")}
      </p>

      <div className="logistics-top-grid">
        <section className="content-card map-card">
          <div className="card-heading-row">
            <div><span>MOHE FORWARDING</span><h2>{t("카카오 MOHE 해외 배송대행지", "Kakao MOHE Overseas Hubs")}</h2></div>
          </div>
          <div className="map-frame">
            <img src={MAP_IMAGE} alt={t("카카오 MOHE 해외 배송대행지 지도", "Kakao MOHE overseas hub map")} />
            {NODES.map((node) => (
              <div key={node.en} className={`map-node ${node.tone}`} style={{ top: node.top, left: node.left }}>
                <span className="map-node-dot" />
                <span className="map-node-label">{node[language]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hub-list">
          <h2>{t("이용 가능한 MOHE 센터", "Available MOHE Centers")}</h2>
          {HUBS.map((hub) => (
            <article key={hub.en} className="content-card hub-card">
              <div className="hub-card-head">
                <div>
                  <strong>{language === "en" ? hub.en : hub.ko}</strong>
                  <small>{language === "en" ? hub.descEn : hub.descKo}</small>
                </div>
                <span className={`hub-status ${hub.tone}`}>{language === "en" ? hub.statusEn : hub.statusKo}</span>
              </div>
              <div className="hub-rate-row"><span>{t("가동률", "Utilization")}</span><span>{hub.rate}%</span></div>
              <div className="hub-rate-track"><div className={`hub-rate-fill ${hub.tone}`} style={{ width: `${hub.rate}%` }} /></div>
            </article>
          ))}
        </section>
      </div>

      <h2 className="section-heading"><Icon name="auto_awesome" className="section-heading-icon" /> {t("MOHE AI 인사이트", "MOHE AI Insights")}</h2>
      <div className="ai-insight-grid">
        <article className="ai-insight-card recommend">
          <div className="ai-insight-title"><Icon name="lightbulb" /><h3>{t("배송대행지 선택 추천", "Shipping Hub Recommendation")}</h3></div>
          <p>{t("현재 로스앤젤레스 MOHE 배송대행지가 혼잡합니다. 미주 상품 소싱 건을 시애틀 MOHE 센터로 변경하면 입고와 검수 지연을 줄일 수 있습니다.", "The Los Angeles MOHE hub is currently congested. Routing U.S. sourcing orders through the Seattle MOHE Center can reduce intake and inspection delays.")}</p>
          <div className="ai-insight-footer">
            <div><small>{t("예상 운송비 절감", "Estimated shipping savings")}</small><strong className="positive">- ₩4,200,000</strong></div>
            <button type="button" className="kakao-action compact-action">{t("배정 승인", "Approve route")}</button>
          </div>
        </article>
        <article className="ai-insight-card alert">
          <div className="ai-insight-title"><Icon name="trending_down" /><h3>{t("재고 부족 예상 알림", "Low Stock Forecast")}</h3></div>
          <p>{t("최근 3일간 글로벌 판매 속도 분석 결과, 특정 품목의 재고가 48시간 내 소진될 것으로 예측됩니다.", "Based on global sales velocity over the last three days, this item may sell out within 48 hours.")}</p>
          <div className="stock-alert-row">
            <img src={SNEAKER_IMAGE} alt="Nike Air Max 1" />
            <div>
              <strong>Nike Air Max 1 (Black/White)</strong>
              <small>SKU: NK-AM1-BW-270</small>
            </div>
            <div className="stock-alert-numbers">
              <strong className="negative">{t("예상 잔여: 6개", "Estimated remaining: 6")}</strong>
              <small>{t("권장 입고: 150개", "Recommended intake: 150")}</small>
            </div>
          </div>
        </article>
      </div>

      <div className="card-heading-row no-border">
        <div><span>SELLING INVENTORY</span><h2>{t("판매용 입고 재고", "Selling Inventory")}</h2></div>
        <div className="inventory-actions">
          <button type="button" className="secondary-action compact-action"><Icon name="download" /> {t("내보내기", "Export")}</button>
          <button type="button" className="kakao-action compact-action">{t("재고 실사 등록", "Add stock count")}</button>
        </div>
      </div>

      <section className="metric-grid">
        <article className="metric-card"><span>{t("총 재고 (단위: 개)", "Total Inventory")}</span><strong>1,226,442</strong></article>
        <article className="metric-card"><span>{t("가용 재고", "Available")}</span><strong>1,124,105</strong></article>
        <article className="metric-card"><span>{t("입고 예정", "Inbound")}</span><strong>142,330</strong></article>
        <article className="metric-card warning-metric"><span>{t("재고 부족 예상 품목", "Low-stock Items")}</span><strong>42<small>SKUs</small></strong></article>
      </section>

      <section className="content-card orders-table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>{t("상품명/SKU", "Product / SKU")}</th><th>{t("카테고리", "Category")}</th><th>{t("총 재고", "Total")}</th><th>{t("가용", "Available")}</th><th>{t("보관 위치", "Location")}</th><th>{t("상태", "Status")}</th></tr>
            </thead>
            <tbody>
              {INVENTORY_ROWS.map((row) => (
                <tr key={row.sku} className={row.warn ? "warn-row" : ""}>
                  <td><strong>{row.name}</strong><small>{row.sku}</small></td>
                  <td>{language === "en" ? row.categoryEn : row.categoryKo}</td>
                  <td>{row.total}</td>
                  <td>{row.available}</td>
                  <td>{language === "en" ? row.locationEn : row.locationKo}</td>
                  <td><span className={`status-tag ${row.warn ? "warn" : ""}`}>{language === "en" ? row.statusEn : row.statusKo}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><small>{t("전체 12,248개 중 1-4 표시", "Showing 1–4 of 12,248")}</small></div>
      </section>
    </Layout>
  );
}

export default LogisticsPreviewPage;
