import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import EstimatingResult from "../components/EstimatingResult";
import Layout from "../components/Layout";

const CURRENCY_OPTIONS = [
  ["USD", "미국 달러"],
  ["JPY", "일본 엔"],
  ["EUR", "유로"],
  ["CNY", "중국 위안"],
  ["KRW", "대한민국 원"],
  ["GBP", "영국 파운드"],
  ["CAD", "캐나다 달러"],
  ["AUD", "호주 달러"],
];

const COUNTRY_OPTIONS = [
  ["US", "미국"],
  ["JP", "일본"],
  ["CN", "중국"],
  ["KR", "대한민국"],
  ["DE", "독일"],
  ["GB", "영국"],
  ["FR", "프랑스"],
  ["IT", "이탈리아"],
  ["ES", "스페인"],
  ["CA", "캐나다"],
  ["AU", "호주"],
];

const CONFIDENCE_LABEL = {
  high: "신뢰도 높음",
  medium: "신뢰도 보통",
  low: "확인 필요",
};

function EstimatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("moheUser") || "{}");
  const [form, setForm] = useState(() => ({
    productName: searchParams.get("product") || "",
    productUrl: searchParams.get("url") || "",
    priceAmount: "",
    priceCurrency: "USD",
    originCountry: "",
    shippingMode: "forwarding",
  }));
  const [estimate, setEstimate] = useState(null);
  const [productAnalysis, setProductAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [analyzingUrl, setAnalyzingUrl] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (name === "productUrl") setProductAnalysis(null);
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
    setProductAnalysis(null);
    setEstimate(null);
    setError("");
  }

  async function handleProductUrlAnalysis() {
    if (!form.productUrl) {
      setError("분석할 상품 URL을 입력해 주세요.");
      return;
    }

    setAnalyzingUrl(true);
    setProductAnalysis(null);
    setEstimate(null);
    setError("");

    try {
      const result = await api("/api/product/analyze", {
        method: "POST",
        body: JSON.stringify({ productUrl: form.productUrl }),
      });

      setForm((previous) => ({
        ...previous,
        productName: result.productName || previous.productName,
        priceAmount: result.priceAmount ? String(result.priceAmount) : previous.priceAmount,
        priceCurrency: result.priceCurrency || previous.priceCurrency,
        originCountry: result.originCountry || previous.originCountry,
      }));
      setProductAnalysis(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAnalyzingUrl(false);
    }
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
      topbarTitle="상품 분석·관세 계산"
      title="관세·최종비용 계산하기"
      description={`${user.name}님, 상품 링크를 입력하면 AI가 상품 정보와 통관 비용을 한 번에 분석합니다.`}
    >
      <div className={`estimate-layout ${estimate ? "has-result" : ""}`}>
        <section className="content-card form-card">
          <div className="section-title">
            <span>AI ANALYSIS</span>
            <div>
              <h2>상품 정보 입력</h2>
              <p>URL 자동 분석 결과를 확인한 뒤 예상 최종비용을 계산하세요.</p>
            </div>
            <button type="button" className="sample-button" onClick={loadSampleProduct}>
              운동화 예시 불러오기
            </button>
          </div>

          <form className="estimate-form" onSubmit={handleEstimate}>
            <label className="field full-field">
              <span>상품 URL <small>AI 자동 입력</small></span>
              <div className="url-analysis-row">
                <input
                  name="productUrl"
                  type="url"
                  value={form.productUrl}
                  onChange={handleChange}
                  placeholder="https://www.amazon.com/..."
                />
                <button
                  type="button"
                  className="url-analysis-button"
                  onClick={handleProductUrlAnalysis}
                  disabled={analyzingUrl || !form.productUrl}
                >
                  {analyzingUrl ? (
                    <><span className="button-spinner" /> 분석 중</>
                  ) : (
                    "AI로 정보 가져오기"
                  )}
                </button>
              </div>
              <small className="field-help">
                공개된 상품 페이지에서 상품명·가격·통화·출발 국가를 찾아 자동으로 채웁니다.
              </small>
            </label>

            {productAnalysis && (
              <div className={`url-analysis-result ${productAnalysis.confidence || "low"}`}>
                <div>
                  <strong>상품 정보 자동 입력 완료</strong>
                  <span>{CONFIDENCE_LABEL[productAnalysis.confidence] || "확인 필요"}</span>
                </div>
                <p>{productAnalysis.analysisSource}</p>
                {productAnalysis.warning && <small>{productAnalysis.warning}</small>}
                <small>자동 입력값은 판매 페이지와 결제 단계에서 한 번 더 확인해 주세요.</small>
              </div>
            )}

            <label className="field full-field">
              <span>상품명 <small>{productAnalysis?.productName ? "자동 입력됨" : ""}</small></span>
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="URL 분석 또는 직접 입력"
                required
              />
            </label>

            <label className="field">
              <span>상품 가격 <small>{productAnalysis?.priceAmount ? "자동 입력됨" : ""}</small></span>
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
                {!CURRENCY_OPTIONS.some(([code]) => code === form.priceCurrency) && (
                  <option value={form.priceCurrency}>{form.priceCurrency}</option>
                )}
                {CURRENCY_OPTIONS.map(([code, label]) => (
                  <option key={code} value={code}>{code} · {label}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>출발 국가</span>
              <select
                name="originCountry"
                value={form.originCountry}
                onChange={handleChange}
                required
              >
                <option value="">출발 국가 선택</option>
                {!COUNTRY_OPTIONS.some(([code]) => code === form.originCountry) && form.originCountry && (
                  <option value={form.originCountry}>{form.originCountry}</option>
                )}
                {COUNTRY_OPTIONS.map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
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

        {estimate ? (
          <EstimatingResult
            estimate={estimate}
            onOrder={handleOrder}
            onKakaoPay={handleKakaoPay}
            orderLoading={orderLoading}
            paymentLoading={paymentLoading}
          />
        ) : (
          <aside className="process-card">
            <span className="process-label">MOHE AI PROCESS</span>
            <h2>하나의 상품 정보로<br />통관 비용까지 계산해요</h2>
            <ol>
              <li><span>01</span><div><strong>품목 자동 분류</strong><p>상품명을 분석해 카테고리와 HS Code를 추정합니다.</p></div></li>
              <li><span>02</span><div><strong>관세·부가세 예측</strong><p>출발 국가와 면세 기준을 함께 검토합니다.</p></div></li>
              <li><span>03</span><div><strong>최종비용 산출</strong><p>배송비와 수수료까지 한 번에 합산합니다.</p></div></li>
            </ol>
          </aside>
        )}
      </div>
    </Layout>
  );
}

export default EstimatePage;
