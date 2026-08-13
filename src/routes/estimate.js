// routes/estimate.js
// 상품구매탭에서 "가져오기 → 예측" 버튼 누르면 호출되는 엔드포인트.
// DB에 저장하지 않고 바로 결과만 반환 (주문 확정은 별도로 /api/orders POST).

const express = require('express');
const router = express.Router();
const { estimateCost } = require('../ai/estimateCost');

router.post('/', async (req, res) => {
  const { productName, priceAmount, priceCurrency, originCountry, shippingMode } = req.body;

  if (!productName || !priceAmount || !originCountry) {
    return res.status(400).json({
      error: 'productName, priceAmount, originCountry는 필수입니다.',
    });
  }

  try {
    const result = await estimateCost({
      productName,
      priceAmount: Number(priceAmount),
      priceCurrency: priceCurrency || 'USD',
      originCountry,
      shippingMode: shippingMode === 'direct' ? 'direct' : 'forwarding',
    });

    return res.json(result);
  } catch (err) {
    console.error('[estimate] AI 호출 실패:', err.message);
    return res.status(502).json({ error: 'AI 예측에 실패했습니다.', detail: err.message });
  }
});

module.exports = router;
