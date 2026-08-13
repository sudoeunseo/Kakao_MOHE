// routes/kakaopay.js
//
// 카카오페이 "단건결제" 연동. 흐름은 3단계:
//   1) POST /api/kakaopay/ready  → 우리 서버가 카카오페이에 "결제 준비" 요청 → 결제창 URL 받음
//   2) 프론트가 그 URL로 사용자를 보냄 (새 창 또는 리다이렉트) → 사용자가 카카오톡/카드로 결제
//   3) 결제 완료 후 카카오가 approval_url(우리가 지정한 성공 콜백)로 되돌려보냄
//      → 그 화면에서 POST /api/kakaopay/approve 호출 → 카카오페이에 "승인" 요청 → 최종 결제 확정
//
// 테스트 모드: CID를 카카오 공식 테스트용 값인 'TC0ONETIME'으로 고정.
// 이 CID는 사업자 심사 없이 시크릿키만 있으면 누구나 쓸 수 있는 개발용 코드라
// 해커톤처럼 실제 사업자 등록 없이 "진짜 결제창"까지 붙여보는 데 적합함.
// (실서비스 전환 시에는 카카오에서 발급받은 정식 CID로만 바꾸면 됨, 코드 구조는 동일)

const express = require('express');
const router = express.Router();
const db = require('../db/init');

const KAKAOPAY_HOST = 'https://open-api.kakaopay.com';
const CID = process.env.KAKAOPAY_CID || 'TC0ONETIME';
const SECRET_KEY = process.env.KAKAOPAY_SECRET_KEY;

// 결제 준비 단계에서 만든 tid를 잠깐 들고 있어야 approve 때 필요함.
// 해커톤 단순화를 위해 메모리에만 저장 (서버 재시작하면 날아감 — 데모 목적엔 충분).
const pendingPayments = new Map(); // partner_order_id -> { tid, ... }

function authHeaders() {
  if (!SECRET_KEY) {
    throw new Error('KAKAOPAY_SECRET_KEY가 .env에 설정되어 있지 않습니다.');
  }
  return {
    Authorization: `SECRET_KEY ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ── 1) 결제 준비
// body: { userId, orderName, amount, redirectBaseUrl }
// redirectBaseUrl: 프론트 배포 주소 (예: https://mohe-frontend.vercel.app). 로컬 개발이면 http://localhost:5500 등.
router.post('/ready', async (req, res) => {
  const { userId, orderName, amount, redirectBaseUrl } = req.body;

  if (!userId || !orderName || !amount || !redirectBaseUrl) {
    return res.status(400).json({ error: 'userId, orderName, amount, redirectBaseUrl은 필수입니다.' });
  }

  // 주문건마다 구분할 임시 ID (실제 orders 테이블 저장은 approve 성공 후에 함)
  const partnerOrderId = `mohe_${Date.now()}`;
  const partnerUserId = String(userId);

  const payload = {
    cid: CID,
    partner_order_id: partnerOrderId,
    partner_user_id: partnerUserId,
    item_name: orderName,
    quantity: 1,
    total_amount: Math.round(amount), // 원 단위, 정수 필수
    tax_free_amount: 0,
    approval_url: `${redirectBaseUrl}/pages/payment-success.html?partner_order_id=${partnerOrderId}`,
    cancel_url: `${redirectBaseUrl}/pages/payment-cancel.html`,
    fail_url: `${redirectBaseUrl}/pages/payment-fail.html`,
  };

  try {
    const response = await fetch(`${KAKAOPAY_HOST}/online/v1/payment/ready`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('[kakaopay/ready] 실패:', data);
      return res.status(502).json({ error: '카카오페이 결제 준비 실패', detail: data });
    }

    // tid를 partnerOrderId와 묶어서 잠깐 보관 (approve 단계에서 필요)
    pendingPayments.set(partnerOrderId, {
      tid: data.tid,
      partnerUserId,
      userId,
      orderName,
      amount: Math.round(amount),
      createdAt: Date.now(),
    });

    return res.json({
      tid: data.tid,
      partnerOrderId,
      // 사용자를 이 URL로 이동시키면 카카오페이 결제창이 뜸.
      // PC 브라우저용: next_redirect_pc_url, 모바일 웹: next_redirect_mobile_url
      redirectUrl: data.next_redirect_pc_url,
      redirectUrlMobile: data.next_redirect_mobile_url,
    });
  } catch (err) {
    console.error('[kakaopay/ready] 에러:', err.message);
    return res.status(502).json({ error: '카카오페이 통신 실패', detail: err.message });
  }
});

// ── 2) 결제 승인 (approval_url로 리다이렉트된 후, 프론트가 pg_token과 함께 호출)
// body: { partnerOrderId, pgToken, productMeta }
// productMeta: 주문 저장에 필요한 나머지 정보(productUrl, originCountry, shippingMode, aiEstimate 등)
router.post('/approve', async (req, res) => {
  const { partnerOrderId, pgToken, productMeta } = req.body;

  if (!partnerOrderId || !pgToken) {
    return res.status(400).json({ error: 'partnerOrderId, pgToken은 필수입니다.' });
  }

  const pending = pendingPayments.get(partnerOrderId);
  if (!pending) {
    return res.status(404).json({ error: '결제 준비 정보를 찾을 수 없습니다 (서버 재시작 또는 만료).' });
  }

  const payload = {
    cid: CID,
    tid: pending.tid,
    partner_order_id: partnerOrderId,
    partner_user_id: pending.partnerUserId,
    pg_token: pgToken,
  };

  try {
    const response = await fetch(`${KAKAOPAY_HOST}/online/v1/payment/approve`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('[kakaopay/approve] 실패:', data);
      return res.status(502).json({ error: '카카오페이 결제 승인 실패', detail: data });
    }

    // 승인 성공 → 이제 실제 주문을 DB에 저장 (status: 'paid')
    const meta = productMeta || {};
    const stmt = db.prepare(`
      INSERT INTO orders
        (user_id, product_name, product_url, origin_country, price_amount, price_currency, shipping_mode, ai_estimate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'paid')
    `);
    const result = stmt.run(
      pending.userId,
      pending.orderName,
      meta.productUrl || null,
      meta.originCountry || null,
      meta.priceAmount || pending.amount,
      meta.priceCurrency || 'KRW',
      meta.shippingMode || 'forwarding',
      meta.aiEstimate ? JSON.stringify(meta.aiEstimate) : null
    );

    pendingPayments.delete(partnerOrderId);

    const order = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(result.lastInsertRowid);
    order.ai_estimate = order.ai_estimate ? JSON.parse(order.ai_estimate) : null;

    return res.json({ payment: data, order });
  } catch (err) {
    console.error('[kakaopay/approve] 에러:', err.message);
    return res.status(502).json({ error: '카카오페이 통신 실패', detail: err.message });
  }
});

module.exports = router;
