import Layout from "../components/Layout";
import Icon from "../components/Icon";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-0X78bKP6AK0Msygy-8L1KDzyeA8bpxmZqk1YM_2I550pcwV5sqKtUfdIR84E-GBtAsENKJxlCZp3EVI-ep2NBOcP2bn63PNtrbXU-SWqlupnnUhX4eAs1QmKt8Cm_PHKoNW8DR8V_d51z2MjdLHpHY0uUCdpsmDzb9Gc9hKNl7CDQVkV5aQPBxMpk-aH1TzjX84TOUyXVoEurAOQy1zD0br0p2yASpTGQbTmPp7AdFxFpIdxscrlQ";
const SNEAKER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGcxlYnMuUCmkNpWPUouEbfP56BnHhMQxyRW2YWHwTt9G1gpot_uFDFexShOhDK1t2aDqEO-oGbZ5tgP_gWRX-6GyftuoleMhPefAbv428SjctdFxKMt31Ay-nK7AJamb7cSGG8YKSbscQIy3D_JHaMzfIK7brLIN-NtgIB5-WvSK_G8YekAFDCeeJthhAhWGFDIxO6hcySPydRHHSgbgaSVbBQU-J69bp6QpyHt1pd0mp4X8HYrZPEg";

const HUBS = [
  { name: "인천 글로벌 센터", desc: "아시아 태평양 핵심 거점", rate: 72, status: "정상", tone: "ok" },
  { name: "로스앤젤레스 허브", desc: "미주 물류 거점", rate: 91, status: "혼잡", tone: "warn" },
  { name: "상하이 센터", desc: "중화권 및 동아시아 분배", rate: 64, status: "여유", tone: "good" },
];

const NODES = [
  { label: "인천 (72%)", top: "40%", left: "80%", tone: "ok" },
  { label: "로스앤젤레스 (91%)", top: "35%", left: "20%", tone: "warn" },
  { label: "상하이 (64%)", top: "45%", left: "75%", tone: "good" },
  { label: "로테르담 (45%)", top: "30%", left: "50%", tone: "info" },
];

const INVENTORY_ROWS = [
  { name: "Nike Air Force 1 '07", sku: "NK-AF1-07-WHT", category: "신발/스니커즈", total: "12,240", available: "11,100", location: "인천 글로벌 / A-12", status: "정상" },
  { name: "Nike Air Max 1", sku: "NK-AM1-BW-270", category: "신발/스니커즈", total: "6", available: "2", location: "로스앤젤레스 / C-04", status: "부족 임박", warn: true },
  { name: "Adidas Stan Smith", sku: "AD-SS-GRN-260", category: "신발/스니커즈", total: "8,500", available: "8,200", location: "상하이 센터 / B-02", status: "정상" },
  { name: "Essential Basic Tee (White)", sku: "AP-TEE-WHT-L", category: "의류/상의", total: "32,000", available: "29,500", location: "로테르담 / A-01", status: "입고중" },
];

function LogisticsPreviewPage() {
  return (
    <Layout
      title="배송대행지·재고 관리"
      description="카카오 MOHE가 운영하는 해외 배송대행지의 구매·검수·배송 진행과 국내 판매 재고를 확인합니다."
      actions={<span className="preview-badge">PREVIEW · 데모 화면</span>}
    >
      <p className="preview-notice">
        아래 정보는 카카오 MOHE 배송대행지 서비스 이용 화면을 위한 데모 데이터입니다.
      </p>

      <div className="logistics-top-grid">
        <section className="content-card map-card">
          <div className="card-heading-row">
            <div><span>MOHE FORWARDING</span><h2>카카오 MOHE 해외 배송대행지</h2></div>
          </div>
          <div className="map-frame">
            <img src={MAP_IMAGE} alt="카카오 MOHE 해외 배송대행지 지도" />
            {NODES.map((node) => (
              <div key={node.label} className={`map-node ${node.tone}`} style={{ top: node.top, left: node.left }}>
                <span className="map-node-dot" />
                <span className="map-node-label">{node.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hub-list">
          <h2>이용 가능한 MOHE 센터</h2>
          {HUBS.map((hub) => (
            <article key={hub.name} className="content-card hub-card">
              <div className="hub-card-head">
                <div>
                  <strong>{hub.name}</strong>
                  <small>{hub.desc}</small>
                </div>
                <span className={`hub-status ${hub.tone}`}>{hub.status}</span>
              </div>
              <div className="hub-rate-row"><span>가동률</span><span>{hub.rate}%</span></div>
              <div className="hub-rate-track"><div className={`hub-rate-fill ${hub.tone}`} style={{ width: `${hub.rate}%` }} /></div>
            </article>
          ))}
        </section>
      </div>

      <h2 className="section-heading"><Icon name="auto_awesome" className="section-heading-icon" /> MOHE AI 인사이트</h2>
      <div className="ai-insight-grid">
        <article className="ai-insight-card recommend">
          <div className="ai-insight-title"><Icon name="lightbulb" /><h3>배송대행지 선택 추천</h3></div>
          <p>현재 로스앤젤레스 MOHE 배송대행지가 혼잡합니다. 미주 상품 소싱 건을 <strong>시애틀 MOHE 센터</strong>로 변경하면 입고와 검수 지연을 줄일 수 있습니다.</p>
          <div className="ai-insight-footer">
            <div><small>예상 운송비 절감</small><strong className="positive">- ₩4,200,000</strong></div>
            <button type="button" className="kakao-action compact-action">배정 승인</button>
          </div>
        </article>
        <article className="ai-insight-card alert">
          <div className="ai-insight-title"><Icon name="trending_down" /><h3>재고 부족 예상 알림</h3></div>
          <p>최근 3일간 글로벌 판매 속도 분석 결과, 특정 품목의 재고가 48시간 내 소진될 것으로 예측됩니다.</p>
          <div className="stock-alert-row">
            <img src={SNEAKER_IMAGE} alt="Nike Air Max 1" />
            <div>
              <strong>Nike Air Max 1 (Black/White)</strong>
              <small>SKU: NK-AM1-BW-270</small>
            </div>
            <div className="stock-alert-numbers">
              <strong className="negative">예상 잔여: 6개</strong>
              <small>권장 입고: 150개</small>
            </div>
          </div>
        </article>
      </div>

      <div className="card-heading-row no-border">
        <div><span>SELLING INVENTORY</span><h2>판매용 입고 재고</h2></div>
        <div className="inventory-actions">
          <button type="button" className="secondary-action compact-action"><Icon name="download" /> 내보내기</button>
          <button type="button" className="kakao-action compact-action">재고 실사 등록</button>
        </div>
      </div>

      <section className="metric-grid">
        <article className="metric-card"><span>총 재고 (단위: 개)</span><strong>1,226,442</strong></article>
        <article className="metric-card"><span>가용 재고</span><strong>1,124,105</strong></article>
        <article className="metric-card"><span>입고 예정</span><strong>142,330</strong></article>
        <article className="metric-card warning-metric"><span>재고 부족 예상 품목</span><strong>42<small>SKUs</small></strong></article>
      </section>

      <section className="content-card orders-table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>상품명/SKU</th><th>카테고리</th><th>총 재고</th><th>가용</th><th>보관 위치</th><th>상태</th></tr>
            </thead>
            <tbody>
              {INVENTORY_ROWS.map((row) => (
                <tr key={row.sku} className={row.warn ? "warn-row" : ""}>
                  <td><strong>{row.name}</strong><small>{row.sku}</small></td>
                  <td>{row.category}</td>
                  <td>{row.total}</td>
                  <td>{row.available}</td>
                  <td>{row.location}</td>
                  <td><span className={`status-tag ${row.warn ? "warn" : ""}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><small>전체 12,248개 중 1-4 표시</small></div>
      </section>
    </Layout>
  );
}

export default LogisticsPreviewPage;
