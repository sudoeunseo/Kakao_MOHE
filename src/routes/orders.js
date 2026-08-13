// routes/orders.js
// 주문 확정(POST) + 마이페이지/주문관리용 조회(GET)

const express = require('express');
const router = express.Router();
const db = require('../db/init');

// 주문 생성 — 프론트에서 /api/estimate 결과를 그대로 ai_estimate에 넣어서 보냄
router.post('/', (req, res) => {
  const {
    userId,
    productName,
    productUrl,
    originCountry,
    priceAmount,
    priceCurrency,
    shippingMode,
    aiEstimate, // 객체로 오면 여기서 JSON.stringify
  } = req.body;

  if (!userId || !productName || !priceAmount) {
    return res.status(400).json({ error: 'userId, productName, priceAmount는 필수입니다.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO orders
        (user_id, product_name, product_url, origin_country, price_amount, price_currency, shipping_mode, ai_estimate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'paid')
    `);
    // 데모 흐름: 결제 연동 없이 주문 생성 = 곧바로 'paid' 처리 (카카오페이는 화면만, 실연동 안 함)
    const result = stmt.run(
      userId,
      productName,
      productUrl || null,
      originCountry || null,
      priceAmount,
      priceCurrency || 'USD',
      shippingMode || 'forwarding',
      aiEstimate ? JSON.stringify(aiEstimate) : null
    );

    const order = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(result.lastInsertRowid);
    order.ai_estimate = order.ai_estimate ? JSON.parse(order.ai_estimate) : null;

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 특정 유저의 주문 목록 (마이페이지)
router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId 쿼리 파라미터가 필요합니다.' });
  }

  const rows = db
    .prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`)
    .all(userId);

  const orders = rows.map((o) => ({
    ...o,
    ai_estimate: o.ai_estimate ? JSON.parse(o.ai_estimate) : null,
  }));

  return res.json(orders);
});

// 기업(비즈니스) 계정용: 전체 주문 목록 (주문관리 화면)
router.get('/all', (req, res) => {
  const rows = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`).all();
  const orders = rows.map((o) => ({
    ...o,
    ai_estimate: o.ai_estimate ? JSON.parse(o.ai_estimate) : null,
  }));
  return res.json(orders);
});

// 주문 하나만 조회 — 결제 완료 화면 등 단건 조회가 필요한 곳에서 사용
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const order = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
  if (!order) {
    return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.' });
  }

  order.ai_estimate = order.ai_estimate ? JSON.parse(order.ai_estimate) : null;
  return res.json(order);
});

const ORDER_STATUSES = ['pending', 'paid', 'shipping', 'customs', 'delivered'];

// 주문 상태 변경 — 기업(비즈니스) 주문관리 화면에서 "배송중/통관중/배송완료"로 전환할 때 사용
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status는 ${ORDER_STATUSES.join(' | ')} 중 하나여야 합니다.` });
  }

  const result = db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.' });
  }

  const order = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
  order.ai_estimate = order.ai_estimate ? JSON.parse(order.ai_estimate) : null;

  return res.json(order);
});

module.exports = router;
