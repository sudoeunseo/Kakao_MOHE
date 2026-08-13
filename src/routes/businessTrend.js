// routes/businessTrend.js
// 기업 대시보드의 "수익 예측" 화면에서 호출. GET으로만 열어둠 (입력값 없이 서버가 DB 집계해서 예측).

const express = require('express');
const router = express.Router();
const { predictBusinessTrend } = require('../ai/predictBusinessTrend');

router.get('/', async (req, res) => {
  try {
    const result = await predictBusinessTrend();
    return res.json(result);
  } catch (err) {
    console.error('[business-trend] AI 호출 실패:', err.message);
    return res.status(502).json({ error: '수요·수익 예측에 실패했습니다.', detail: err.message });
  }
});

module.exports = router;
