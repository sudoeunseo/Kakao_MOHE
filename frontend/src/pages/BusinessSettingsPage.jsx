import { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVEJmuehURTUSlykmBcbUyUfy1jitjj-FybjPn4n6ku4aYG5rMnHlH5Fsieuh4EQQcclC7qFRsKmcrAVALmlnLX25c0EEUjwdiSvRFD3Rh2bb6UWC1zsWfWLWu9aoq7YTOuq15Eed21P09kLqulX9p_WMS2mIEcusb8USV78Xu48lbCMfKSJ2KuFbPpQQSKvtID-xRIMjjGDpwKYIWoQOPpWz9RwXXtGQRgfyrgv5ctE7y7SdVZCKbkw";

const MEMBERS = [
  { initial: "김", name: "김카카오 (본인)", role: "최고 관리자", own: true },
  { initial: "이", name: "이담당", role: "물류 담당자" },
  { initial: "박", name: "박정산", role: "초대 대기중...", pending: true },
];

const FULFILLMENT_STAGES = [
  { icon: "shopping_bag", title: "해외 상품 소싱", detail: "판매할 상품 구매 요청", status: "셀러 요청" },
  { icon: "warehouse", title: "MOHE 배송대행지", detail: "카카오 운영 해외 센터", status: "카카오 운영" },
  { icon: "forklift", title: "MOHE 전담 픽커", detail: "구매 · 검수 · 합포장", status: "서비스 포함" },
  { icon: "flight_takeoff", title: "국제배송·통관", detail: "운송 및 수입 절차 대행", status: "MOHE 대행" },
  { icon: "inventory_2", title: "셀러 입고·판매", detail: "국내 재고 확보 후 판매", status: "기업 판매" },
];

const DEFAULT_LOCATIONS = {
  forwardingCity: "Los Angeles, CA",
  forwardingCenter: "MOHE West Coast Forwarding Center",
  inventoryAddress: "경기도 성남시 분당구 판교역로 166",
  inventoryLabel: "셀러 국내 입고지",
};

function getStoredLocations() {
  try {
    return {
      ...DEFAULT_LOCATIONS,
      ...JSON.parse(localStorage.getItem("moheBusinessLocations") || "{}"),
    };
  } catch {
    return DEFAULT_LOCATIONS;
  }
}

function BusinessSettingsPage() {
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const [company, setCompany] = useState({
    name: "(주)카카오모헤 물류",
    owner: "김대표",
    address: "경기도 성남시 분당구 판교역로 166",
  });
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: false });
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [locations, setLocations] = useState(getStoredLocations);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationDraft, setLocationDraft] = useState({});
  const [notice, setNotice] = useState("");

  function updateCompany(field, value) {
    setCompany((current) => ({ ...current, [field]: value }));
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function toggleNotification(key) {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  }

  function startLocationEdit(type) {
    setEditingLocation(type);
    setLocationDraft({ ...locations });
  }

  function updateLocationDraft(field, value) {
    setLocationDraft((current) => ({ ...current, [field]: value }));
  }

  function cancelLocationEdit() {
    setEditingLocation(null);
    setLocationDraft({});
  }

  function saveLocation(event, type) {
    event.preventDefault();
    const fields = type === "forwarding"
      ? ["forwardingCity", "forwardingCenter"]
      : ["inventoryAddress", "inventoryLabel"];

    if (fields.some((field) => !locationDraft[field]?.trim())) {
      showNotice("모든 항목을 입력해 주세요.");
      return;
    }

    const nextLocations = {
      ...locations,
      ...Object.fromEntries(fields.map((field) => [field, locationDraft[field].trim()])),
    };
    setLocations(nextLocations);
    localStorage.setItem("moheBusinessLocations", JSON.stringify(nextLocations));
    setEditingLocation(null);
    setLocationDraft({});
    showNotice(type === "forwarding" ? "기본 해외 배송대행지를 수정했습니다." : "판매 재고 수령지를 수정했습니다.");
  }

  return (
    <Layout title="설정/관리" hideHeading>
      <div className="settings-page">
        <header className="settings-page-heading">
          <span aria-hidden="true" />
          <h1>설정/관리</h1>
        </header>

        {notice && <div className="settings-toast"><Icon name="check_circle" /> {notice}</div>}

        <div className="settings-grid">
          <div className="settings-column">
            <section className="settings-card account-settings-card">
              <h2><Icon name="person" /> 계정 설정</h2>
              <div className="settings-profile">
                <div className="settings-profile-image">
                  <img src={PROFILE_IMAGE} alt="관리자 프로필" />
                  <button type="button" aria-label="프로필 사진 변경" onClick={() => showNotice("프로필 사진 변경 기능을 준비 중입니다.")}>
                    <Icon name="edit" />
                  </button>
                </div>
                <div>
                  <strong>{user.name || "김카카오"}</strong>
                  <span>관리자 (Admin)</span>
                </div>
              </div>

              <div className="settings-fields">
                <label>
                  <span>이메일</span>
                  <div className="settings-readonly-field">
                    <b>{user.email || "admin@mohe.kakao.com"}</b>
                    <small>인증됨</small>
                  </div>
                </label>
                <label>
                  <span>연락처</span>
                  <div className="settings-readonly-field"><b>010-1234-5678</b></div>
                </label>
              </div>

              <button type="button" className="settings-outline-button" onClick={() => showNotice("비밀번호 변경 안내를 전송했습니다.")}>
                <Icon name="lock_reset" /> 비밀번호 변경
              </button>
            </section>

            <section className="settings-card company-settings-card">
              <h2><Icon name="domain" /> 기업 정보</h2>
              <div className="settings-form">
                <label>
                  <span>사업자등록번호</span>
                  <input type="text" value="123-45-67890" disabled />
                </label>
                <div className="settings-form-row">
                  <label>
                    <span>상호명</span>
                    <input value={company.name} onChange={(event) => updateCompany("name", event.target.value)} />
                  </label>
                  <label>
                    <span>대표자명</span>
                    <input value={company.owner} onChange={(event) => updateCompany("owner", event.target.value)} />
                  </label>
                </div>
                <label>
                  <span>사업장 주소</span>
                  <div className="settings-address-row">
                    <input value={company.address} onChange={(event) => updateCompany("address", event.target.value)} />
                    <button type="button" onClick={() => showNotice("주소 검색 기능을 준비 중입니다.")}>주소 검색</button>
                  </div>
                </label>
              </div>
              <button type="button" className="settings-primary-button" onClick={() => showNotice("정산 계좌 관리 화면을 준비 중입니다.")}>
                <Icon name="account_balance" /> 정산 계좌 관리
              </button>
            </section>
          </div>

          <div className="settings-column settings-column-wide">
            <section className="settings-card logistics-settings-card">
              <div className="settings-card-heading">
                <h2><Icon name="local_shipping" /> 배송대행지 서비스 설정</h2>
                <button type="button" onClick={() => showNotice("물류 설정 상세 기능을 준비 중입니다.")}>자세히 보기</button>
              </div>

              <div className="fulfillment-network">
                <div className="fulfillment-network-heading">
                  <div>
                    <span>KAKAO MOHE FORWARDING SERVICE</span>
                    <h3>카카오 MOHE 배송대행지 서비스</h3>
                    <p>기업 셀러가 판매할 해외 상품을 요청하면 카카오가 구매부터 검수·합배송·통관·국내 입고까지 지원합니다.</p>
                  </div>
                  <span className="network-status"><i /> 카카오 운영</span>
                </div>
                <div className="fulfillment-stage-grid">
                  {FULFILLMENT_STAGES.map((stage, index) => (
                    <article key={stage.title}>
                      <span className="fulfillment-stage-icon"><Icon name={stage.icon} /></span>
                      <strong>{stage.title}</strong>
                      <small>{stage.detail}</small>
                      <b>{stage.status}</b>
                      {index < FULFILLMENT_STAGES.length - 1 && <Icon name="chevron_right" className="fulfillment-stage-arrow" />}
                    </article>
                  ))}
                </div>
                <div className="route-optimizer">
                  <span className="route-optimizer-icon"><Icon name="route" /></span>
                  <div>
                    <strong>MOHE 최적 소싱·배송 플랜 추천</strong>
                    <p>해외 구매가, 배송대행지 수수료, 픽커 작업, 운임과 통관 비용을 비교해 셀러에게 가장 유리한 플랜을 추천합니다.</p>
                  </div>
                  <Toggle label="" enabled={autoOptimize} onClick={() => setAutoOptimize((current) => !current)} />
                </div>
              </div>

              <EditableLocation
                title="기본 해외 배송대행지"
                badge="DEFAULT"
                summary={`${locations.forwardingCity} · ${locations.forwardingCenter}`}
                editing={editingLocation === "forwarding"}
                muted
                fields={[
                  { key: "forwardingCity", label: "도시·지역", value: locationDraft.forwardingCity || "", placeholder: "예: Los Angeles, CA" },
                  { key: "forwardingCenter", label: "배송대행지 이름", value: locationDraft.forwardingCenter || "", placeholder: "예: MOHE West Coast Forwarding Center" },
                ]}
                onEdit={() => startLocationEdit("forwarding")}
                onChange={updateLocationDraft}
                onCancel={cancelLocationEdit}
                onSave={(event) => saveLocation(event, "forwarding")}
              />
              <EditableLocation
                title="판매 재고 기본 수령지"
                summary={`${locations.inventoryAddress} · ${locations.inventoryLabel}`}
                editing={editingLocation === "inventory"}
                fields={[
                  { key: "inventoryAddress", label: "수령지 주소", value: locationDraft.inventoryAddress || "", placeholder: "도로명 주소를 입력하세요" },
                  { key: "inventoryLabel", label: "수령지 이름", value: locationDraft.inventoryLabel || "", placeholder: "예: 셀러 국내 입고지" },
                ]}
                onEdit={() => startLocationEdit("inventory")}
                onChange={updateLocationDraft}
                onCancel={cancelLocationEdit}
                onSave={(event) => saveLocation(event, "inventory")}
              />

              <div className="carrier-settings">
                <h3>판매 주문용 국내 택배사</h3>
                <div>
                  <span className="carrier-chip"><b className="cj">CJ</b> CJ대한통운 <Icon name="close" /></span>
                  <span className="carrier-chip"><b className="lg">LG</b> 로젠택배 <Icon name="close" /></span>
                  <button type="button" className="carrier-add" onClick={() => showNotice("배송 파트너 추가 기능을 준비 중입니다.")}><Icon name="add" /> 배송 파트너 추가</button>
                </div>
              </div>
            </section>

            <div className="settings-small-grid">
              <section className="settings-card notification-settings-card">
                <h2><Icon name="notifications_active" /> 알림 설정</h2>
                <div className="notification-group">
                  <h3>주문/배송 알림</h3>
                  <Toggle label="이메일 수신" enabled={notifications.email} onClick={() => toggleNotification("email")} />
                  <Toggle label="SMS/알림톡 수신" enabled={notifications.sms} onClick={() => toggleNotification("sms")} />
                </div>
                <div className="notification-group">
                  <h3>문의/CS 알림</h3>
                  <Toggle label="앱 푸시 알림" enabled={notifications.push} onClick={() => toggleNotification("push")} />
                </div>
              </section>

              <section className="settings-card permission-settings-card">
                <div className="settings-card-heading">
                  <h2><Icon name="manage_accounts" /> 권한 관리</h2>
                  <button type="button" className="permission-add" aria-label="관리자 추가" onClick={() => showNotice("관리자 초대 기능을 준비 중입니다.")}><Icon name="add" /></button>
                </div>
                <div className="permission-list">
                  {MEMBERS.map((member) => (
                    <div key={member.name} className={`${member.own ? "own" : ""} ${member.pending ? "pending" : ""}`.trim()}>
                      <span>{member.initial}</span>
                      <div><strong>{member.name}</strong><small>{member.role}</small></div>
                      <Icon name="more_vert" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Toggle({ label, enabled, onClick }) {
  return (
    <div className="settings-toggle-row">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={enabled} className={enabled ? "enabled" : ""} onClick={onClick}>
        <i />
      </button>
    </div>
  );
}

function EditableLocation({ title, badge, summary, editing, muted = false, fields, onEdit, onChange, onCancel, onSave }) {
  if (!editing) {
    return (
      <div className={`settings-location ${muted ? "default-location" : ""}`}>
        <div>
          <strong>{title} {badge && <small>{badge}</small>}</strong>
          <span>{summary}</span>
        </div>
        <button type="button" aria-label={`${title} 수정`} onClick={onEdit}><Icon name="edit" /></button>
      </div>
    );
  }

  return (
    <form className={`settings-location settings-location-editing ${muted ? "default-location" : ""}`} onSubmit={onSave}>
      <div className="settings-location-edit-heading">
        <strong>{title} {badge && <small>{badge}</small>}</strong>
        <span>수정할 정보를 입력한 뒤 저장해 주세요.</span>
      </div>
      <div className="settings-location-fields">
        {fields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            <input
              type="text"
              value={field.value}
              placeholder={field.placeholder}
              onChange={(event) => onChange(field.key, event.target.value)}
              autoFocus={field === fields[0]}
            />
          </label>
        ))}
      </div>
      <div className="settings-location-actions">
        <button type="button" onClick={onCancel}>취소</button>
        <button type="submit">저장</button>
      </div>
    </form>
  );
}

export default BusinessSettingsPage;
