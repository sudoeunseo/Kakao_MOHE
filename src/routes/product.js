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
    let message = error.message || '상품 정보를 자동으로 가져오지 못했습니다.';
    if (/quota|rate limit|resource exhausted/i.test(message)) {
      message = 'Gemini API 사용량이 잠시 초과되었습니다. 잠시 후 다시 시도해 주세요.';
    } else if (/abort|timeout|시간/i.test(message)) {
      message = '상품 페이지 분석 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
    }

    return res.status(422).json({
      error: message,
      detail: error.message,
    });
  }
});

module.exports = router;
