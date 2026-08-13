import Layout from "../components/Layout";
import Icon from "../components/Icon";

const INQUIRIES = [
  { id: "#9021", date: "2023.10.24 14:30", product: "[대량] 표준 팔레트 A", buyer: "김 물류", title: "대량 주문에 대한 배송 시간 확인", status: "답변대기" },
  { id: "#9020", date: "2023.10.24 11:15", product: "산업용 선반 유닛", buyer: "서울 공급사", title: "적재 용량에 대한 사양 문의", status: "답변완료" },
  { id: "#9019", date: "2023.10.23 16:45", product: "지게차 부품 번들", buyer: "부산 중공업", title: "모델 X-200과의 호환성", status: "답변대기" },
  { id: "#9018", date: "2023.10.23 09:20", product: "포장용 테이프 (500 롤)", buyer: "글로벌 무역 파트너스", title: "대량 할인 가격 요청", status: "답변완료" },
];

function InquiriesPreviewPage() {
  return (
    <Layout
      title="구매 문의"
      description="구매자 문의를 접수하고 처리 상태를 관리합니다."
      actions={<span className="preview-badge">PREVIEW · 데모 화면</span>}
    >
      <p className="preview-notice">
        문의 접수/답변 기능은 아직 백엔드에 연동되지 않아, 아래 목록은 디자인 데모용 예시 데이터입니다.
      </p>

      <section className="metric-grid three">
        <article className="metric-card"><span>총 문의</span><strong>1,248</strong><p>이번 주 +12%</p></article>
        <article className="metric-card warning-metric"><span>답변 대기중</span><strong className="negative">42</strong><p>긴급</p></article>
        <article className="metric-card"><span>오늘 해결됨</span><strong>156</strong><p>우수한 응답 시간</p></article>
      </section>

      <section className="content-card orders-table-card">
        <div className="inquiry-filters">
          <input type="text" placeholder="2023.10.01 - 2023.10.31" readOnly />
          <select disabled defaultValue="all">
            <option value="all">모든 상태</option>
          </select>
          <div className="inquiry-search">
            <Icon name="search" />
            <input type="text" placeholder="구매자 또는 상품 검색..." readOnly />
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>날짜</th><th>상품명</th><th>구매자 이름</th><th>문의 제목</th><th>상태</th><th /></tr>
            </thead>
            <tbody>
              {INQUIRIES.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.date}</td>
                  <td><strong>{row.product}</strong></td>
                  <td>{row.buyer}</td>
                  <td>{row.title}</td>
                  <td><span className={`status-tag ${row.status === "답변대기" ? "warn" : "ok"}`}>{row.status}</span></td>
                  <td><Icon name="chevron_right" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <small>총 1,248개 항목 중 1에서 4까지 표시중</small>
          <div className="pagination">
            <button type="button" disabled><Icon name="chevron_left" /></button>
            <button type="button" className="current">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button"><Icon name="chevron_right" /></button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default InquiriesPreviewPage;
