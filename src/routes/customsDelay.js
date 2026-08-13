// routes/customsDelay.js
// 상품구매탭 결과 화면이나 배송조회 화면에서 "통관 지연 예측 보기" 같은 형태로 호출.

const express = require('express');
const router = express.Router();
const { predictCustomsDelay } = require('../ai/predictCustomsDelay');

router.post('/', async (req, res) => {
  const { productName, category, originCountry, isDutyFreeLikely } = req.body;

  if (!productName || !originCountry) {
    return res.status(400).json({ error: 'productName, originCountry는 필수입니다.' });
  }

  try {
    const result = await predictCustomsDelay({
      productName,
      category,
      originCountry,
      isDutyFreeLikely: Boolean(isDutyFreeLikely),
    });
    return res.json(result);
  } catch (err) {
    console.error('[customs-delay] AI 호출 실패:', err.message);
    return res.status(502).json({ error: '통관 지연 예측에 실패했습니다.', detail: err.message });
  }
});

module.exports = router;
