import { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import useLanguage from "../context/useLanguage";

const bi = (ko, en) => ({ ko, en });

const INQUIRIES = [
  {
    id: "#9021",
    date: "2026.08.13 14:30",
    product: bi("[대량] 표준 팔레트 A", "[Bulk] Standard Pallet A"),
    buyer: bi("김 물류", "Kim Logistics"),
    title: bi("대량 주문 배송 시간 확인", "Delivery time for a bulk order"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("표준 팔레트 A 500개를 주문하면 부산 센터까지 배송되는 데 얼마나 걸릴까요?", "How long would it take to deliver 500 Standard Pallet A units to the Busan center?"), time: bi("오후 2:30", "2:30 PM") },
      { from: "buyer", text: bi("이번 달 안에 입고가 가능한지도 함께 확인 부탁드립니다.", "Please also confirm whether they can arrive within this month."), time: bi("오후 2:32", "2:32 PM") },
    ],
  },
  {
    id: "#9020",
    date: "2026.08.13 11:15",
    product: bi("산업용 선반 유닛", "Industrial Shelving Unit"),
    buyer: bi("서울 공급사", "Seoul Supply Co."),
    title: bi("적재 용량 사양 문의", "Load capacity specifications"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("선반 한 칸당 최대 적재 중량과 전체 허용 중량을 알려주세요.", "Please provide the maximum load per shelf and total load capacity."), time: bi("오전 11:15", "11:15 AM") },
      { from: "seller", text: bi("한 칸당 500kg, 유닛 전체 기준 최대 2,000kg입니다.", "The limit is 500 kg per shelf and 2,000 kg for the full unit."), time: bi("오전 11:42", "11:42 AM") },
    ],
  },
  {
    id: "#9019",
    date: "2026.08.12 16:45",
    product: bi("지게차 부품 번들", "Forklift Parts Bundle"),
    buyer: bi("부산 중공업", "Busan Heavy Industries"),
    title: bi("모델 X-200과의 호환성", "Compatibility with model X-200"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("이 부품이 X-200 2021년식 모델과 호환되는지 확인 부탁드립니다.", "Could you confirm compatibility with the 2021 X-200 model?"), time: bi("오후 4:45", "4:45 PM") },
      { from: "buyer", text: bi("호환된다면 설치 매뉴얼도 받을 수 있을까요?", "If compatible, could you also send the installation manual?"), time: bi("오후 4:47", "4:47 PM") },
    ],
  },
  {
    id: "#9018",
    date: "2026.08.12 09:20",
    product: bi("포장용 테이프 (500롤)", "Packing Tape (500 rolls)"),
    buyer: bi("글로벌 무역 파트너스", "Global Trade Partners"),
    title: bi("대량 할인 가격 요청", "Bulk discount request"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("500롤 단위로 월 2회 정기 구매할 예정입니다. 할인이 가능할까요?", "We plan to purchase 500 rolls twice a month. Is a bulk discount available?"), time: bi("오전 9:20", "9:20 AM") },
      { from: "seller", text: bi("정기 발주 조건으로 공급가에서 8% 할인이 가능합니다.", "An 8% discount is available for recurring orders."), time: bi("오전 10:05", "10:05 AM") },
    ],
  },
  {
    id: "#9017",
    date: "2026.08.11 17:10",
    product: bi("일본 한정 과일 젤리", "Japan Limited Fruit Jelly"),
    buyer: bi("도쿄 셀렉트", "Tokyo Select"),
    title: bi("오사카 배송대행지 입고 일정", "Osaka shipping hub arrival schedule"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("다음 주 오사카 배송대행지에 입고할 수 있는 수량을 알려주세요.", "How many units can arrive at the Osaka shipping hub next week?"), time: bi("오후 5:10", "5:10 PM") },
    ],
  },
  {
    id: "#9016",
    date: "2026.08.11 13:25",
    product: bi("프리미엄 녹차 세트", "Premium Green Tea Set"),
    buyer: bi("마루 상점", "Maru Store"),
    title: bi("선물 포장 옵션 문의", "Gift wrapping options"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("기업 선물용 포장과 메시지 카드 추가가 가능한가요?", "Can you add corporate gift wrapping and message cards?"), time: bi("오후 1:25", "1:25 PM") },
      { from: "seller", text: bi("네, 주문별 메시지 카드도 함께 신청할 수 있습니다.", "Yes, a custom message card can be requested for each order."), time: bi("오후 1:48", "1:48 PM") },
    ],
  },
  {
    id: "#9015",
    date: "2026.08.10 15:40",
    product: bi("캐릭터 머그컵 24개입", "Character Mugs, Pack of 24"),
    buyer: bi("하늘 유통", "Haneul Distribution"),
    title: bi("파손 보상 기준 확인", "Damage compensation policy"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("국제 운송 중 파손된 상품의 보상 기준을 확인하고 싶습니다.", "Please clarify the compensation policy for damage during international shipping."), time: bi("오후 3:40", "3:40 PM") },
    ],
  },
  {
    id: "#9014",
    date: "2026.08.10 10:05",
    product: bi("스테인리스 텀블러", "Stainless Steel Tumblers"),
    buyer: bi("제이앤코", "J&Co"),
    title: bi("상품 검수 사진 요청", "Product inspection photos"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("출고 전에 상품과 포장 상태 사진을 받을 수 있을까요?", "Could we receive photos of the products and packaging before dispatch?"), time: bi("오전 10:05", "10:05 AM") },
      { from: "seller", text: bi("검수 완료 후 사진을 문의 내역에 첨부해 드리겠습니다.", "We will attach inspection photos to this inquiry after the inspection."), time: bi("오전 10:31", "10:31 AM") },
    ],
  },
  {
    id: "#9013",
    date: "2026.08.09 18:20",
    product: bi("한정판 스니커즈", "Limited Edition Sneakers"),
    buyer: bi("어반 컬렉트", "Urban Collect"),
    title: bi("정품 검수 서비스 문의", "Authenticity inspection service"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("배송대행지에서 정품 검수 후 출고할 수 있나요?", "Can the shipping hub verify authenticity before dispatch?"), time: bi("오후 6:20", "6:20 PM") },
    ],
  },
  {
    id: "#9012",
    date: "2026.08.09 14:10",
    product: bi("휴대용 미니 선풍기", "Portable Mini Fans"),
    buyer: bi("온리마켓", "Only Market"),
    title: bi("배터리 포함 상품 운송", "Shipping products with batteries"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("배터리가 포함된 상품도 항공 운송이 가능한가요?", "Can products containing batteries be shipped by air?"), time: bi("오후 2:10", "2:10 PM") },
      { from: "seller", text: bi("인증 서류 확인 후 전용 운송편으로 접수할 수 있습니다.", "After checking certification documents, we can use a dedicated shipping method."), time: bi("오후 2:36", "2:36 PM") },
    ],
  },
  {
    id: "#9011",
    date: "2026.08.08 12:50",
    product: bi("세라믹 식기 세트", "Ceramic Tableware Set"),
    buyer: bi("리빙하우스", "Living House"),
    title: bi("완충 포장 추가 비용", "Extra protective packaging fee"),
    status: "waiting",
    messages: [
      { from: "buyer", text: bi("파손 방지를 위한 이중 완충 포장 비용을 안내해 주세요.", "Please provide the fee for double protective packaging."), time: bi("오후 12:50", "12:50 PM") },
    ],
  },
  {
    id: "#9010",
    date: "2026.08.08 08:45",
    product: bi("유기농 스낵 박스", "Organic Snack Box"),
    buyer: bi("그린바스켓", "Green Basket"),
    title: bi("식품 통관 서류 확인", "Food customs documents"),
    status: "completed",
    messages: [
      { from: "buyer", text: bi("한국 통관에 필요한 식품 관련 서류 목록을 받을 수 있을까요?", "Could you send the list of food documents required for Korean customs?"), time: bi("오전 8:45", "8:45 AM") },
      { from: "seller", text: bi("필요 서류와 작성 예시를 이메일로 전달했습니다.", "We sent the required documents and examples by email."), time: bi("오전 9:12", "9:12 AM") },
    ],
  },
];

const PAGE_SIZE = 4;

function InquiriesPreviewPage() {
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [draft, setDraft] = useState("");
  const [sentReplies, setSentReplies] = useState({});
  const pageCount = Math.ceil(INQUIRIES.length / PAGE_SIZE);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleInquiries = INQUIRIES.slice(firstIndex, firstIndex + PAGE_SIZE);
  const localize = (value) => (typeof value === "string" ? value : value[language]);

  function goToPage(page) {
    const nextPage = Math.min(Math.max(page, 1), pageCount);
    setCurrentPage(nextPage);
    closeConversation();
  }

  function closeConversation() {
    setSelectedInquiry(null);
    setDraft("");
  }

  function sendReply(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedInquiry) return;

    const time = new Intl.DateTimeFormat(language === "en" ? "en-US" : "ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());

    setSentReplies((current) => ({
      ...current,
      [selectedInquiry.id]: [
        ...(current[selectedInquiry.id] || []),
        { from: "seller", text, time },
      ],
    }));
    setDraft("");
  }

  const conversation = selectedInquiry
    ? [...selectedInquiry.messages, ...(sentReplies[selectedInquiry.id] || [])]
    : [];

  return (
    <Layout
      title={t("구매 문의", "Purchase Inquiries")}
      description={t("구매자 문의를 접수하고 처리 상태를 관리합니다.", "Receive buyer inquiries and manage their resolution status.")}
      actions={<span className="preview-badge">{t("PREVIEW · 데모 화면", "PREVIEW · DEMO")}</span>}
    >
      <p className="preview-notice">
        {t("문의 접수/답변 기능은 아직 백엔드에 연동되지 않아, 아래 목록은 디자인 데모용 예시 데이터입니다.", "Inquiry and reply features are not connected to the backend yet. The list below contains demo data.")}
      </p>

      <section className="metric-grid three">
        <article className="metric-card"><span>{t("총 문의", "Total inquiries")}</span><strong>1,248</strong><p>{t("이번 주 +12%", "+12% this week")}</p></article>
        <article className="metric-card warning-metric"><span>{t("답변 대기중", "Awaiting reply")}</span><strong className="negative">42</strong><p>{t("긴급", "Urgent")}</p></article>
        <article className="metric-card"><span>{t("오늘 해결됨", "Resolved today")}</span><strong>156</strong><p>{t("우수한 응답 시간", "Excellent response time")}</p></article>
      </section>

      <section className="content-card orders-table-card">
        <div className="inquiry-filters">
          <input type="text" placeholder="2026.08.01 - 2026.08.31" readOnly />
          <select disabled defaultValue="all">
            <option value="all">{t("모든 상태", "All statuses")}</option>
          </select>
          <div className="inquiry-search">
            <Icon name="search" />
            <input type="text" placeholder={t("구매자 또는 상품 검색...", "Search buyer or product...")} readOnly />
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>{t("날짜", "Date")}</th><th>{t("상품명", "Product")}</th><th>{t("구매자 이름", "Buyer")}</th><th>{t("문의 제목", "Subject")}</th><th>{t("상태", "Status")}</th><th /></tr>
            </thead>
            <tbody>
              {visibleInquiries.map((row) => {
                const isWaiting = row.status === "waiting" && !sentReplies[row.id]?.length;
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.date}</td>
                    <td><strong>{localize(row.product)}</strong></td>
                    <td>{localize(row.buyer)}</td>
                    <td>{localize(row.title)}</td>
                    <td>
                      <span className={`status-tag ${isWaiting ? "warn" : "ok"}`}>
                        {isWaiting ? t("답변대기", "Awaiting reply") : t("답변완료", "Answered")}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="inquiry-open-button"
                        aria-label={`${localize(row.buyer)} ${t("고객과의 대화 열기", "open conversation")}`}
                        onClick={() => setSelectedInquiry(row)}
                      >
                        <Icon name="chevron_right" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <small>
            {t(
              `총 1,248개 항목 중 ${firstIndex + 1}에서 ${firstIndex + visibleInquiries.length}까지 표시중`,
              `Showing ${firstIndex + 1}–${firstIndex + visibleInquiries.length} of 1,248 items`,
            )}
          </small>
          <div className="pagination" aria-label={t("문의 페이지", "Inquiry pages")}>
            <button type="button" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label={t("이전 페이지", "Previous page")}><Icon name="chevron_left" /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                type="button"
                key={page}
                className={currentPage === page ? "current" : ""}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <button type="button" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)} aria-label={t("다음 페이지", "Next page")}><Icon name="chevron_right" /></button>
          </div>
        </div>
      </section>

      {selectedInquiry && (
        <div className="conversation-backdrop" role="presentation" onMouseDown={closeConversation}>
          <aside className="conversation-panel" role="dialog" aria-modal="true" aria-labelledby="conversation-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="conversation-header">
              <div className="conversation-customer">
                <span className="conversation-avatar">{localize(selectedInquiry.buyer).slice(0, 1)}</span>
                <div>
                  <strong id="conversation-title">{localize(selectedInquiry.buyer)}</strong>
                  <span>{selectedInquiry.id} · {localize(selectedInquiry.product)}</span>
                </div>
              </div>
              <button type="button" className="conversation-close" aria-label={t("대화 닫기", "Close conversation")} onClick={closeConversation}>
                <Icon name="close" />
              </button>
            </header>

            <section className="conversation-subject">
              <span>{t("문의 제목", "Inquiry subject")}</span>
              <strong>{localize(selectedInquiry.title)}</strong>
            </section>

            <div className="conversation-messages">
              <div className="conversation-date">{selectedInquiry.date.slice(0, 10)}</div>
              {conversation.map((message, index) => (
                <div key={`${localize(message.time)}-${index}`} className={`conversation-message ${message.from}`}>
                  {message.from === "buyer" && <span className="message-avatar">{localize(selectedInquiry.buyer).slice(0, 1)}</span>}
                  <div>
                    <p>{localize(message.text)}</p>
                    <time>{localize(message.time)}</time>
                  </div>
                </div>
              ))}
            </div>

            <form className="conversation-reply" onSubmit={sendReply}>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t("고객에게 보낼 답변을 입력하세요.", "Write a reply to the customer.")} rows="3" />
              <div>
                <small>{t("데모 화면에서는 입력한 답변이 현재 화면에만 저장됩니다.", "In this demo, your reply is saved only on the current screen.")}</small>
                <button type="submit" disabled={!draft.trim()}>
                  {t("답변 보내기", "Send reply")} <Icon name="send" />
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </Layout>
  );
}

export default InquiriesPreviewPage;
