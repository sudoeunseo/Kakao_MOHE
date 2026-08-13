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
    DEMO_ORDERS.forEach((order) => {
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
