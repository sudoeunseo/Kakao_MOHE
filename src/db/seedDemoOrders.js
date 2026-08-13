const DEMO_ORDERS = [
  {
    key: 'haribo-mega-roulette',
    productName: 'Haribo Mega-Roulette Box',
    originCountry: 'DE',
    priceAmount: 118,
    priceCurrency: 'EUR',
    status: 'pending',
    createdAt: '2026-08-12 09:24:00',
    estimate: estimate('식품/간식', '1704', 8, 174900, 21000, 31480, 5247, 'medium', [
      '식품류는 원재료와 국내 반입 기준 확인이 필요합니다.',
      '대량 주문으로 사업자 통관 대상 여부를 확인해 주세요.',
    ]),
  },
  {
    key: 'muji-aroma-diffuser',
    productName: 'MUJI Ultrasonic Aroma Diffuser',
    originCountry: 'JP',
    priceAmount: 14900,
    priceCurrency: 'JPY',
    status: 'paid',
    createdAt: '2026-08-11 15:42:00',
    estimate: estimate('생활가전', '8509', 8, 141700, 18000, 25506, 4251, 'high', [
      '전기용품 안전인증 대상 여부를 확인해 주세요.',
      '제품 정격 전압과 국내 사용 가능 여부 확인이 필요합니다.',
    ]),
  },
  {
    key: 'patagonia-retro-x',
    productName: 'Patagonia Classic Retro-X Jacket',
    originCountry: 'US',
    priceAmount: 229,
    priceCurrency: 'USD',
    status: 'shipping',
    createdAt: '2026-08-10 11:08:00',
    estimate: estimate('의류/아우터', '6201', 13, 309150, 32000, 64922, 9275, 'high', [
      '섬유 혼용률과 원산지 표시 자료를 준비해 주세요.',
      '의류 수입 신고 시 브랜드 정품 증빙을 확인할 수 있습니다.',
    ]),
  },
  {
    key: 'le-labo-santal-33',
    productName: 'Le Labo Santal 33 Eau de Parfum 50ml',
    originCountry: 'US',
    priceAmount: 235,
    priceCurrency: 'USD',
    status: 'customs',
    createdAt: '2026-08-09 16:31:00',
    estimate: estimate('향수/화장품', '3303', 6.5, 317250, 29000, 55590, 9518, 'medium', [
      '향수는 항공 위험물 운송 기준을 확인해야 합니다.',
      '화장품 책임판매 및 성분 신고 대상 여부를 확인해 주세요.',
    ]),
  },
  {
    key: 'aesop-hand-balm',
    productName: 'Aesop Resurrection Hand Balm Set',
    originCountry: 'AU',
    priceAmount: 128,
    priceCurrency: 'AUD',
    status: 'delivered',
    createdAt: '2026-08-08 10:17:00',
    estimate: estimate('화장품/바디케어', '3304', 6.5, 111360, 19000, 22813, 3341, 'high', [
      '화장품 성분표와 한글 표시사항을 확인해 주세요.',
    ]),
  },
  {
    key: 'lego-polaroid-camera',
    productName: 'LEGO Ideas Polaroid OneStep SX-70 Camera',
    originCountry: 'DK',
    priceAmount: 79.99,
    priceCurrency: 'EUR',
    status: 'paid',
    createdAt: '2026-08-07 14:53:00',
    estimate: estimate('완구/취미', '9503', 0, 118385, 21000, 11839, 3552, 'high', [
      '완구류 KC 인증 대상 연령과 부품 구성을 확인해 주세요.',
    ]),
  },
  {
    key: 'nintendo-switch-oled',
    productName: 'Nintendo Switch OLED Model',
    originCountry: 'JP',
    priceAmount: 37980,
    priceCurrency: 'JPY',
    status: 'shipping',
    createdAt: '2026-08-06 12:05:00',
    estimate: estimate('전자제품/게임기', '9504', 0, 360810, 26000, 36081, 10824, 'high', [
      '무선통신 기능이 포함된 전자제품의 적합성평가 여부를 확인해 주세요.',
      '리튬 배터리 포함 제품의 항공 운송 기준 확인이 필요합니다.',
    ]),
  },
  {
    key: 'dyson-airwrap',
    productName: 'Dyson Airwrap Multi-Styler',
    originCountry: 'GB',
    priceAmount: 479.99,
    priceCurrency: 'GBP',
    status: 'customs',
    createdAt: '2026-08-05 17:19:00',
    estimate: estimate('미용가전', '8516', 8, 863982, 39000, 155517, 25919, 'medium', [
      '전기용품 안전인증과 국내 전압 호환 여부를 확인해 주세요.',
      '고가 상품으로 과세가격 증빙이 필요할 수 있습니다.',
    ]),
  },
  {
    key: 'keychron-q1-pro',
    productName: 'Keychron Q1 Pro Mechanical Keyboard',
    originCountry: 'CN',
    priceAmount: 199,
    priceCurrency: 'USD',
    status: 'delivered',
    createdAt: '2026-08-04 08:46:00',
    estimate: estimate('전자제품/키보드', '8471', 0, 268650, 24000, 26865, 8060, 'high', [
      '블루투스 기능이 포함되어 전파인증 대상 여부 확인이 필요합니다.',
    ]),
  },
];

const EXPANDED_PRODUCTS = [
  { key: 'sony-camera', name: 'Sony Alpha ZV-E10 Camera Kit', country: 'JP', amount: 89800, currency: 'JPY', category: '전자제품', hs: '8525', duty: 0, krw: 852100, shipping: 31000, dutyVat: 85210, confidence: 'high' },
  { key: 'new-balance', name: 'New Balance 990v6 Sneakers', country: 'US', amount: 199, currency: 'USD', category: '신발/스니커즈', hs: '6404', duty: 13, krw: 268650, shipping: 26000, dutyVat: 56417, confidence: 'high' },
  { key: 'royce-chocolate', name: 'ROYCE Nama Chocolate Assortment', country: 'JP', amount: 12800, currency: 'JPY', category: '식품/간식', hs: '1806', duty: 8, krw: 121600, shipping: 19000, dutyVat: 21888, confidence: 'medium' },
  { key: 'cosrx-set', name: 'COSRX Advanced Snail Skincare Set', country: 'US', amount: 89, currency: 'USD', category: '화장품/바디케어', hs: '3304', duty: 6.5, krw: 120150, shipping: 17000, dutyVat: 23429, confidence: 'high' },
  { key: 'braun-shaver', name: 'Braun Series 9 Pro Electric Shaver', country: 'DE', amount: 329, currency: 'EUR', category: '미용가전', hs: '8510', duty: 8, krw: 487000, shipping: 28000, dutyVat: 87660, confidence: 'high' },
  { key: 'north-face-jacket', name: 'The North Face Nuptse Jacket', country: 'GB', amount: 280, currency: 'GBP', category: '의류/아우터', hs: '6201', duty: 13, krw: 504000, shipping: 34000, dutyVat: 105840, confidence: 'high' },
  { key: 'gundam-model', name: 'Bandai MG Gundam Model Kit', country: 'JP', amount: 9200, currency: 'JPY', category: '완구/취미', hs: '9503', duty: 0, krw: 87400, shipping: 16000, dutyVat: 8740, confidence: 'high' },
  { key: 'logitech-keyboard', name: 'Logitech MX Mechanical Keyboard', country: 'US', amount: 169, currency: 'USD', category: '전자제품/키보드', hs: '8471', duty: 0, krw: 228150, shipping: 22000, dutyVat: 22815, confidence: 'high' },
  { key: 'diptyque-candle', name: 'Diptyque Baies Scented Candle', country: 'FR', amount: 68, currency: 'EUR', category: '향수/화장품', hs: '3406', duty: 6.5, krw: 100640, shipping: 18000, dutyVat: 19625, confidence: 'medium' },
  { key: 'delonghi-coffee', name: 'DeLonghi Dedica Coffee Machine', country: 'IT', amount: 249, currency: 'EUR', category: '생활가전', hs: '8516', duty: 8, krw: 368520, shipping: 36000, dutyVat: 66334, confidence: 'high' },
];

const STATUS_ROTATION = ['paid', 'shipping', 'delivered', 'paid', 'customs', 'shipping', 'delivered'];

const ADDITIONAL_DEMO_ORDERS = Array.from({ length: 21 }, (_, index) => {
  const product = EXPANDED_PRODUCTS[index % EXPANDED_PRODUCTS.length];
  const batch = Math.floor(index / EXPANDED_PRODUCTS.length) + 1;
  const dateOffset = Math.floor(index * 2 / 3);
  const date = new Date(Date.UTC(2026, 7, 3 - dateOffset));
  const amountFactor = 1 + (((index % 5) - 2) * 0.035);
  const productKrw = Math.round(product.krw * amountFactor);
  const shipping = product.shipping + ((index % 4) * 1800);
  const dutyAndVat = Math.round(product.dutyVat * amountFactor);
  const fee = Math.max(3000, Math.round(productKrw * 0.03));

  return {
    key: `history-${product.key}-${batch}-${index + 1}`,
    productName: `${product.name} · Batch ${batch}`,
    originCountry: product.country,
    priceAmount: product.amount,
    priceCurrency: product.currency,
    status: STATUS_ROTATION[index % STATUS_ROTATION.length],
    createdAt: `${formatSqlDate(date)} ${String(8 + (index % 10)).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}:00`,
    estimate: estimate(product.category, product.hs, product.duty, productKrw, shipping, dutyAndVat, fee, product.confidence, [
      '상업용 수량과 수입 신고 요건을 확인해 주세요.',
      '카카오 MOHE 배송대행지 검수 기준이 적용된 예상치입니다.',
    ]),
  };
});

const ALL_DEMO_ORDERS = [...DEMO_ORDERS, ...ADDITIONAL_DEMO_ORDERS];

function formatSqlDate(date) {
  return date.toISOString().slice(0, 10);
}

function estimate(category, hsCode, dutyRate, productPrice, shipping, dutyAndVat, fee, confidence, risks) {
  return {
    category,
    hs_code_guess: hsCode,
    duty_rate_percent: dutyRate,
    is_duty_free_likely: dutyRate === 0,
    breakdown: {
      product_price_krw: productPrice,
      intl_shipping_krw: shipping,
      duty_and_vat_krw: dutyAndVat,
      platform_fee_krw: fee,
      total_estimated_krw: productPrice + shipping + dutyAndVat + fee,
    },
    confidence,
    risk_notes: risks,
    note: '카카오 MOHE 배송대행지 이용 기준 예상 비용입니다.',
  };
}

function seedDemoOrders(db) {
  const buyer = db.prepare(`SELECT id FROM users WHERE role = 'buyer' ORDER BY id DESC LIMIT 1`).get()
    || db.prepare(`SELECT id FROM users ORDER BY id LIMIT 1`).get();

  if (!buyer) return 0;

  const exists = db.prepare(`SELECT 1 FROM orders WHERE product_url = ? LIMIT 1`);
  const insert = db.prepare(`
    INSERT INTO orders
      (user_id, product_name, product_url, origin_country, price_amount, price_currency, shipping_mode, ai_estimate, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'forwarding', ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    let inserted = 0;
    ALL_DEMO_ORDERS.forEach((order) => {
      const productUrl = `demo://order/${order.key}`;
      if (exists.get(productUrl)) return;
      insert.run(
        buyer.id,
        order.productName,
        productUrl,
        order.originCountry,
        order.priceAmount,
        order.priceCurrency,
        JSON.stringify(order.estimate),
        order.status,
        order.createdAt,
      );
      inserted += 1;
    });
    return inserted;
  });

  return seed();
}

module.exports = { seedDemoOrders };
