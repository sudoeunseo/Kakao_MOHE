const ORDER_DISPLAY_FALLBACKS = {
  1: {
    product: { ko: "Nike Air Max 스니커즈", en: "Nike Air Max Sneakers" },
    category: { ko: "신발/스니커즈", en: "Shoes / Sneakers" },
    risks: {
      ko: ["미국발 상품으로 수입 신고 및 관부가세 확인이 필요합니다.", "개인 사용 목적과 수량 기준을 확인해 주세요."],
      en: ["Import declaration, duties, and taxes must be checked for this U.S. product.", "Please confirm the permitted quantity and intended use."],
    },
  },
  2: {
    product: { ko: "프랑스 향수 100ml", en: "French Perfume 100ml" },
    category: { ko: "향수/화장품", en: "Perfume / Cosmetics" },
    risks: {
      ko: ["향수는 용량 및 위험물 배송 기준 확인이 필요합니다.", "항공 운송 제한 여부와 성분 신고 서류를 확인해 주세요."],
      en: ["Volume and hazardous-goods shipping rules must be checked for perfume.", "Please verify air-shipping restrictions and ingredient documents."],
    },
  },
  3: {
    product: { ko: "Sony WF-1000XM5", en: "Sony WF-1000XM5" },
    category: { ko: "전자제품", en: "Electronics" },
    risks: {
      ko: ["일본발 전자제품으로 통관 서류와 관부가세 확인이 필요합니다.", "배터리 포함 제품의 국제운송 기준을 확인해 주세요."],
      en: ["Customs documents, duties, and taxes must be checked for this Japanese electronic product.", "Please verify international shipping rules for products containing batteries."],
    },
  },
};

export function isBrokenText(value) {
  if (typeof value !== "string" || !value.trim()) return true;
  const brokenCharacters = (value.match(/[?�]/g) || []).length;
  return brokenCharacters >= 2 || brokenCharacters / value.length > 0.08;
}

export function getOrderDisplay(order, language = "ko") {
  const locale = language === "en" ? "en" : "ko";
  const fallback = ORDER_DISPLAY_FALLBACKS[order.id] || {
    product: { ko: "상품 정보 확인 필요", en: "Product information required" },
    category: { ko: "품목 분류 확인 필요", en: "Category review required" },
    risks: {
      ko: ["통관 위험 상세 내용을 다시 확인해 주세요."],
      en: ["Please review the customs risk details."],
    },
  };
  const sourceRisks = order.ai_estimate?.risk_notes || [];
  const risks = locale === "ko" && sourceRisks.length > 0 && sourceRisks.every((risk) => !isBrokenText(risk))
    ? sourceRisks
    : fallback.risks[locale];

  return {
    product: isBrokenText(order.product_name) ? fallback.product[locale] : order.product_name,
    category: locale === "en" || isBrokenText(order.ai_estimate?.category) ? fallback.category[locale] : order.ai_estimate.category,
    risks,
    risk: risks[0],
  };
}
