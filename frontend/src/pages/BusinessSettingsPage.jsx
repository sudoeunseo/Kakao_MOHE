import { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import useLanguage from "../context/useLanguage";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVEJmuehURTUSlykmBcbUyUfy1jitjj-FybjPn4n6ku4aYG5rMnHlH5Fsieuh4EQQcclC7qFRsKmcrAVALmlnLX25c0EEUjwdiSvRFD3Rh2bb6UWC1zsWfWLWu9aoq7YTOuq15Eed21P09kLqulX9p_WMS2mIEcusb8USV78Xu48lbCMfKSJ2KuFbPpQQSKvtID-xRIMjjGDpwKYIWoQOPpWz9RwXXtGQRgfyrgv5ctE7y7SdVZCKbkw";

const MEMBERS = [
  { initial: "김", nameKo: "김카카오 (본인)", nameEn: "Kim Kakao (You)", roleKo: "최고 관리자", roleEn: "Super Admin", own: true },
  { initial: "이", nameKo: "이담당", nameEn: "Lee Operations", roleKo: "물류 담당자", roleEn: "Logistics Manager" },
  { initial: "박", nameKo: "박정산", nameEn: "Park Finance", roleKo: "초대 대기중...", roleEn: "Invitation pending...", pending: true },
];

const FULFILLMENT_STAGES = [
  { icon: "shopping_bag", titleKo: "해외 상품 소싱", titleEn: "Overseas Sourcing", detailKo: "판매할 상품 구매 요청", detailEn: "Request products to sell", statusKo: "셀러 요청", statusEn: "Seller Request" },
  { icon: "warehouse", titleKo: "MOHE 배송대행지", titleEn: "MOHE Shipping Hub", detailKo: "카카오 운영 해외 센터", detailEn: "Kakao-operated overseas center", statusKo: "카카오 운영", statusEn: "Kakao Operated" },
  { icon: "forklift", titleKo: "MOHE 전담 픽커", titleEn: "MOHE Dedicated Picker", detailKo: "구매 · 검수 · 합포장", detailEn: "Purchase, inspect, consolidate", statusKo: "서비스 포함", statusEn: "Included" },
  { icon: "flight_takeoff", titleKo: "국제배송·통관", titleEn: "Shipping & Customs", detailKo: "운송 및 수입 절차 대행", detailEn: "Shipping and import processing", statusKo: "MOHE 대행", statusEn: "MOHE Managed" },
  { icon: "inventory_2", titleKo: "셀러 입고·판매", titleEn: "Seller Intake & Sales", detailKo: "국내 재고 확보 후 판매", detailEn: "Sell from domestic inventory", statusKo: "기업 판매", statusEn: "Business Sales" },
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
  const { language, t } = useLanguage();
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

  function openPostcodeSearch() {
    const Postcode = window.kakao?.Postcode;

    if (!Postcode) {
      showNotice(t("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "Could not load address search. Please try again shortly."));
      return;
    }

    new Postcode({
      oncomplete: (data) => {
        const selectedAddress = data.userSelectedType === "R"
          ? data.roadAddress
          : data.jibunAddress;

        updateCompany("address", selectedAddress || data.address);
        showNotice(t("사업장 주소를 입력했습니다.", "Business address selected."));
      },
    }).open();
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
      showNotice(t("모든 항목을 입력해 주세요.", "Please complete all fields."));
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
    showNotice(type === "forwarding"
      ? t("기본 해외 배송대행지를 수정했습니다.", "Default overseas hub updated.")
      : t("판매 재고 수령지를 수정했습니다.", "Inventory receiving location updated."));
  }

  return (
    <Layout title={t("설정/관리", "Settings")} hideHeading>
      <div className="settings-page">
        <header className="settings-page-heading">
          <span aria-hidden="true" />
          <h1>{t("설정/관리", "Settings")}</h1>
        </header>

        {notice && <div className="settings-toast"><Icon name="check_circle" /> {notice}</div>}

        <div className="settings-grid">
          <div className="settings-column">
            <section className="settings-card account-settings-card">
              <h2><Icon name="person" /> {t("계정 설정", "Account Settings")}</h2>
              <div className="settings-profile">
                <div className="settings-profile-image">
                  <img src={PROFILE_IMAGE} alt={t("관리자 프로필", "Administrator profile")} />
                  <button type="button" aria-label={t("프로필 사진 변경", "Change profile photo")} onClick={() => showNotice(t("프로필 사진 변경 기능을 준비 중입니다.", "Profile photo editing is coming soon."))}>
                    <Icon name="edit" />
                  </button>
                </div>
                <div>
                  <strong>{user.name || "김카카오"}</strong>
                  <span>{t("관리자", "Administrator")} (Admin)</span>
                </div>
              </div>

              <div className="settings-fields">
                <label>
                  <span>{t("이메일", "Email")}</span>
                  <div className="settings-readonly-field">
                    <b>{user.email || "admin@mohe.kakao.com"}</b>
                    <small>{t("인증됨", "Verified")}</small>
                  </div>
                </label>
                <label>
                  <span>{t("연락처", "Phone")}</span>
                  <div className="settings-readonly-field"><b>010-1234-5678</b></div>
                </label>
              </div>

              <button type="button" className="settings-outline-button" onClick={() => showNotice(t("비밀번호 변경 안내를 전송했습니다.", "Password reset instructions sent."))}>
                <Icon name="lock_reset" /> {t("비밀번호 변경", "Change Password")}
              </button>
            </section>

            <section className="settings-card company-settings-card">
              <h2><Icon name="domain" /> {t("기업 정보", "Company Information")}</h2>
              <div className="settings-form">
                <label>
                  <span>{t("사업자등록번호", "Business Registration No.")}</span>
                  <input type="text" value="123-45-67890" disabled />
                </label>
                <div className="settings-form-row">
                  <label>
                    <span>{t("상호명", "Company Name")}</span>
                    <input value={company.name} onChange={(event) => updateCompany("name", event.target.value)} />
                  </label>
                  <label>
                    <span>{t("대표자명", "Representative")}</span>
                    <input value={company.owner} onChange={(event) => updateCompany("owner", event.target.value)} />
                  </label>
                </div>
                <label>
                  <span>{t("사업장 주소", "Business Address")}</span>
                  <div className="settings-address-row">
                    <input value={company.address} onChange={(event) => updateCompany("address", event.target.value)} />
                    <button type="button" onClick={openPostcodeSearch}>{t("주소 검색", "Find Address")}</button>
                  </div>
                </label>
              </div>
              <button type="button" className="settings-primary-button" onClick={() => showNotice(t("정산 계좌 관리 화면을 준비 중입니다.", "Settlement account management is coming soon."))}>
                <Icon name="account_balance" /> {t("정산 계좌 관리", "Manage Settlement Account")}
              </button>
            </section>
          </div>

          <div className="settings-column settings-column-wide">
            <section className="settings-card logistics-settings-card">
              <div className="settings-card-heading">
                <h2><Icon name="local_shipping" /> {t("배송대행지 서비스 설정", "Shipping Hub Service Settings")}</h2>
                <button type="button" onClick={() => showNotice(t("물류 설정 상세 기능을 준비 중입니다.", "Detailed logistics settings are coming soon."))}>{t("자세히 보기", "View details")}</button>
              </div>

              <div className="fulfillment-network">
                <div className="fulfillment-network-heading">
                  <div>
                    <span>KAKAO MOHE FORWARDING SERVICE</span>
                    <h3>{t("카카오 MOHE 배송대행지 서비스", "Kakao MOHE Shipping Hub Service")}</h3>
                    <p>{t("기업 셀러가 판매할 해외 상품을 요청하면 카카오가 구매부터 검수·합배송·통관·국내 입고까지 지원합니다.", "Kakao supports business sellers from overseas purchasing through inspection, consolidation, customs, and domestic intake.")}</p>
                  </div>
                  <span className="network-status"><i /> {t("카카오 운영", "Kakao Operated")}</span>
                </div>
                <div className="fulfillment-stage-grid">
                  {FULFILLMENT_STAGES.map((stage, index) => (
                    <article key={stage.titleEn}>
                      <span className="fulfillment-stage-icon"><Icon name={stage.icon} /></span>
                      <strong>{language === "en" ? stage.titleEn : stage.titleKo}</strong>
                      <small>{language === "en" ? stage.detailEn : stage.detailKo}</small>
                      <b>{language === "en" ? stage.statusEn : stage.statusKo}</b>
                      {index < FULFILLMENT_STAGES.length - 1 && <Icon name="chevron_right" className="fulfillment-stage-arrow" />}
                    </article>
                  ))}
                </div>
                <div className="route-optimizer">
                  <span className="route-optimizer-icon"><Icon name="route" /></span>
                  <div>
                    <strong>{t("MOHE 최적 소싱·배송 플랜 추천", "MOHE Optimal Sourcing & Shipping Plan")}</strong>
                    <p>{t("해외 구매가, 배송대행지 수수료, 픽커 작업, 운임과 통관 비용을 비교해 셀러에게 가장 유리한 플랜을 추천합니다.", "Compare purchase price, hub fees, picker work, freight, and customs costs to recommend the best plan.")}</p>
                  </div>
                  <Toggle label="" enabled={autoOptimize} onClick={() => setAutoOptimize((current) => !current)} />
                </div>
              </div>

              <EditableLocation
                title={t("기본 해외 배송대행지", "Default Overseas Shipping Hub")}
                badge="DEFAULT"
                summary={`${locations.forwardingCity} · ${locations.forwardingCenter}`}
                editing={editingLocation === "forwarding"}
                muted
                fields={[
                  { key: "forwardingCity", label: t("도시·지역", "City / Region"), value: locationDraft.forwardingCity || "", placeholder: "Los Angeles, CA" },
                  { key: "forwardingCenter", label: t("배송대행지 이름", "Hub Name"), value: locationDraft.forwardingCenter || "", placeholder: "MOHE West Coast Forwarding Center" },
                ]}
                onEdit={() => startLocationEdit("forwarding")}
                onChange={updateLocationDraft}
                onCancel={cancelLocationEdit}
                onSave={(event) => saveLocation(event, "forwarding")}
                editHelp={t("수정할 정보를 입력한 뒤 저장해 주세요.", "Enter the updated information, then save.")}
                editLabel={t("수정", "Edit")}
                cancelLabel={t("취소", "Cancel")}
                saveLabel={t("저장", "Save")}
              />
              <EditableLocation
                title={t("판매 재고 기본 수령지", "Default Inventory Receiving Location")}
                summary={`${locations.inventoryAddress} · ${locations.inventoryLabel}`}
                editing={editingLocation === "inventory"}
                fields={[
                  { key: "inventoryAddress", label: t("수령지 주소", "Receiving Address"), value: locationDraft.inventoryAddress || "", placeholder: t("도로명 주소를 입력하세요", "Enter a street address") },
                  { key: "inventoryLabel", label: t("수령지 이름", "Location Name"), value: locationDraft.inventoryLabel || "", placeholder: t("예: 셀러 국내 입고지", "e.g. Seller Domestic Intake") },
                ]}
                onEdit={() => startLocationEdit("inventory")}
                onChange={updateLocationDraft}
                onCancel={cancelLocationEdit}
                onSave={(event) => saveLocation(event, "inventory")}
                editHelp={t("수정할 정보를 입력한 뒤 저장해 주세요.", "Enter the updated information, then save.")}
                editLabel={t("수정", "Edit")}
                cancelLabel={t("취소", "Cancel")}
                saveLabel={t("저장", "Save")}
              />

              <div className="carrier-settings">
                <h3>{t("판매 주문용 국내 택배사", "Domestic Carriers for Sales Orders")}</h3>
                <div>
                  <span className="carrier-chip"><b className="cj">CJ</b> {t("CJ대한통운", "CJ Logistics")} <Icon name="close" /></span>
                  <span className="carrier-chip"><b className="lg">LG</b> {t("로젠택배", "Logen")} <Icon name="close" /></span>
                  <button type="button" className="carrier-add" onClick={() => showNotice(t("배송 파트너 추가 기능을 준비 중입니다.", "Adding shipping partners is coming soon."))}><Icon name="add" /> {t("배송 파트너 추가", "Add Shipping Partner")}</button>
                </div>
              </div>
            </section>

            <div className="settings-small-grid">
              <section className="settings-card notification-settings-card">
                <h2><Icon name="notifications_active" /> {t("알림 설정", "Notification Settings")}</h2>
                <div className="notification-group">
                  <h3>{t("주문/배송 알림", "Order & Shipping Alerts")}</h3>
                  <Toggle label={t("이메일 수신", "Email Notifications")} enabled={notifications.email} onClick={() => toggleNotification("email")} />
                  <Toggle label={t("SMS/알림톡 수신", "SMS / Kakao Alerts")} enabled={notifications.sms} onClick={() => toggleNotification("sms")} />
                </div>
                <div className="notification-group">
                  <h3>{t("문의/CS 알림", "Inquiry & Support Alerts")}</h3>
                  <Toggle label={t("앱 푸시 알림", "App Push Notifications")} enabled={notifications.push} onClick={() => toggleNotification("push")} />
                </div>
              </section>

              <section className="settings-card permission-settings-card">
                <div className="settings-card-heading">
                  <h2><Icon name="manage_accounts" /> {t("권한 관리", "Access Management")}</h2>
                  <button type="button" className="permission-add" aria-label={t("관리자 추가", "Add administrator")} onClick={() => showNotice(t("관리자 초대 기능을 준비 중입니다.", "Administrator invitations are coming soon."))}><Icon name="add" /></button>
                </div>
                <div className="permission-list">
                  {MEMBERS.map((member) => (
                    <div key={member.nameEn} className={`${member.own ? "own" : ""} ${member.pending ? "pending" : ""}`.trim()}>
                      <span>{member.initial}</span>
                      <div><strong>{language === "en" ? member.nameEn : member.nameKo}</strong><small>{language === "en" ? member.roleEn : member.roleKo}</small></div>
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

function EditableLocation({ title, badge, summary, editing, muted = false, fields, onEdit, onChange, onCancel, onSave, editHelp, editLabel, cancelLabel, saveLabel }) {
  if (!editing) {
    return (
      <div className={`settings-location ${muted ? "default-location" : ""}`}>
        <div>
          <strong>{title} {badge && <small>{badge}</small>}</strong>
          <span>{summary}</span>
        </div>
        <button type="button" aria-label={`${title} ${editLabel}`} onClick={onEdit}><Icon name="edit" /></button>
      </div>
    );
  }

  return (
    <form className={`settings-location settings-location-editing ${muted ? "default-location" : ""}`} onSubmit={onSave}>
      <div className="settings-location-edit-heading">
        <strong>{title} {badge && <small>{badge}</small>}</strong>
        <span>{editHelp}</span>
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
        <button type="button" onClick={onCancel}>{cancelLabel}</button>
        <button type="submit">{saveLabel}</button>
      </div>
    </form>
  );
}

export default BusinessSettingsPage;
