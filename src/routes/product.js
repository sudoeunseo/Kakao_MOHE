const express = require('express');
const router = express.Router();
const { analyzeProductUrl } = require('../ai/analyzeProductUrl');

router.post('/analyze', async (req, res) => {
  const productUrl = String(req.body.productUrl || '').trim();

  if (!productUrl) {
    return res.status(400).json({ error: '분석할 상품 URL을 입력해 주세요.' });
  }

  try {
    const result = await analyzeProductUrl(productUrl);
    return res.json(result);
  } catch (error) {
    console.error('[product/analyze] 상품 URL 분석 실패:', error.message);
    return res.status(422).json({
      error: error.message || '상품 정보를 자동으로 가져오지 못했습니다.',
      detail: error.message,
    });
  }
});

module.exports = router;
