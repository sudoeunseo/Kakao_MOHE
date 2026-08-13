import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import EstimatingResult from "../components/EstimatingResult";
import Layout from "../components/Layout";

function EstimatePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const [form, setForm] = useState({
    productName: "",
    productUrl: "",
    priceAmount: "",
    priceCurrency: "USD",
    originCountry: "US",
    shippingMode: "forwarding",
  });
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setEstimate(null);
    setError("");
  }

  function loadSampleProduct() {
    setForm({
      productName: "Nike Air Max 90 운동화",
      productUrl: "https://www.example.com/products/air-max-90",
      priceAmount: "180",
      priceCurrency: "USD",
      originCountry: "US",
      shippingMode: "forwarding",
    });
    setEstimate(null);
    setError("");
  }

  async function handleEstimate(event) {
    event.preventDefault();
    setEstimating(true);
    setError("");

    try {
      const result = await api("/api/estimate", {
        method: "POST",
        body: JSON.stringify({
          productName: form.productName,
          priceAmount: Number(form.priceAmount),
          priceCurrency: form.priceCurrency,
          originCountry: form.originCountry,
          shippingMode: form.shippingMode,
        }),
      });
      setEstimate(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setEstimating(false);
    }
  }

  function buildOrderPayload() {
    return {
      userId: user.id,
      productName: form.productName,
      productUrl: form.productUrl,
      originCountry: form.originCountry,
      priceAmount: Number(form.priceAmount),
      priceCurrency: form.priceCurrency,
      shippingMode: form.shippingMode,
      aiEstimate: estimate,
    };
  }

  async function handleOrder() {
    setOrderLoading(true);
    setError("");
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify(buildOrderPayload()),
      });
      navigate("/buyer/orders?created=1");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setOrderLoading(false);
    }
  }

  async function handleKakaoPay() {
    setPaymentLoading(true);
    setError("");
    const productMeta = buildOrderPayload();

    try {
      const result = await api("/api/kakaopay/ready", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          orderName: form.productName,
          amount: estimate.breakdown.total_estimated_krw,
          redirectBaseUrl: window.location.origin,
        }),
      });

      localStorage.setItem(
        "mohePendingPayment",
        JSON.stringify({
          partnerOrderId: result.partnerOrderId,
          productMeta,
        }),
      );

      const redirectUrl =
        window.innerWidth <= 720 && result.redirectUrlMobile
          ? result.redirectUrlMobile
          : result.redirectUrl;
      window.location.assign(redirectUrl);
    } catch (requestError) {
      setError(requestError.message);
      setPaymentLoading(false);
    }
  }

  return (
    <Layout
      title="AI 해외구매 비용 분석"
      description={`${user.name}님, 구매 전에 숨은 비용과 통관 위험을 먼저 확인하세요.`}
    >
      <div className="estimate-layout">
        <section className="content-card form-card">
          <div className="section-title">
            <span>STEP 1</span>
            <div>
              <h2>상품 정보 입력</h2>
              <p>상품 정보를 바탕으로 AI가 품목과 최종비용을 분석합니다.</p>
            </div>
            <button type="button" className="sample-button" onClick={loadSampleProduct}>
              운동화 예시 불러오기
            </button>
          </div>

          <form className="estimate-form" onSubmit={handleEstimate}>
            <label className="field full-field">
              <span>상품명</span>
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="예: Nike Air Max 90 운동화"
                required
              />
            </label>

            <label className="field full-field">
              <span>상품 URL <small>선택 · 주문 참고용</small></span>
              <input
                name="productUrl"
                type="url"
                value={form.productUrl}
                onChange={handleChange}
                placeholder="https://"
              />
              <small className="field-help">
                아래 정보를 직접 입력해 주세요.
              </small>
            </label>

            <label className="field">
              <span>상품 가격 <small>직접 입력</small></span>
              <input
                name="priceAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.priceAmount}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>통화</span>
              <select
                name="priceCurrency"
                value={form.priceCurrency}
                onChange={handleChange}
              >
                <option value="USD">USD · 미국 달러</option>
                <option value="JPY">JPY · 일본 엔</option>
                <option value="EUR">EUR · 유로</option>
                <option value="CNY">CNY · 중국 위안</option>
                <option value="KRW">KRW · 대한민국 원</option>
              </select>
            </label>

            <label className="field">
              <span>출발 국가</span>
              <select
                name="originCountry"
                value={form.originCountry}
                onChange={handleChange}
              >
                <option value="US">미국</option>
                <option value="JP">일본</option>
                <option value="CN">중국</option>
                <option value="DE">독일</option>
                <option value="GB">영국</option>
              </select>
            </label>

            <fieldset className="shipping-field">
              <legend>배송 방식</legend>
              <label className={form.shippingMode === "forwarding" ? "selected" : ""}>
                <input
                  type="radio"
                  name="shippingMode"
                  value="forwarding"
                  checked={form.shippingMode === "forwarding"}
                  onChange={handleChange}
                />
                <span>
                  <strong>배송대행</strong>
                  <small>해외 배송비까지 함께 예측</small>
                </span>
              </label>
              <label className={form.shippingMode === "direct" ? "selected" : ""}>
                <input
                  type="radio"
                  name="shippingMode"
                  value="direct"
                  checked={form.shippingMode === "direct"}
                  onChange={handleChange}
                />
                <span>
                  <strong>직배송</strong>
                  <small>관세와 통관 비용만 예측</small>
                </span>
              </label>
            </fieldset>

            {error && <div className="inline-error">{error}</div>}

            <button className="primary-action full-field" disabled={estimating}>
              {estimating ? (
                <>
                  <span className="button-spinner" /> AI가 분석하고 있습니다
                </>
              ) : (
                "AI 최종비용 예측하기"
              )}
            </button>
          </form>
        </section>

        <aside className="process-card">
          <span className="process-label">MOHE AI PROCESS</span>
          <h2>하나의 상품 정보로<br />통관 비용까지 계산해요</h2>
          <ol>
            <li><span>01</span><div><strong>품목 자동 분류</strong><p>상품명을 분석해 카테고리와 HS Code를 추정합니다.</p></div></li>
            <li><span>02</span><div><strong>관세·부가세 예측</strong><p>출발 국가와 면세 기준을 함께 검토합니다.</p></div></li>
            <li><span>03</span><div><strong>최종비용 산출</strong><p>배송비와 수수료까지 한 번에 합산합니다.</p></div></li>
          </ol>
        </aside>
      </div>

      {estimate && (
        <EstimatingResult
          estimate={estimate}
          onOrder={handleOrder}
          onKakaoPay={handleKakaoPay}
          orderLoading={orderLoading}
          paymentLoading={paymentLoading}
        />
      )}
    </Layout>
  );
}

export default EstimatePage;
