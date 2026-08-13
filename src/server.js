// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const estimateRoutes = require('./routes/estimate');
const orderRoutes = require('./routes/orders');
const kakaopayRoutes = require('./routes/kakaopay');
const customsDelayRoutes = require('./routes/customsDelay');
const businessTrendRoutes = require('./routes/businessTrend');
const productRoutes = require('./routes/product');

const app = express();
app.use(cors()); // 프론트 로컬 dev 서버(다른 포트)에서 붙을 수 있게 전체 허용. 데모용이라 OK.
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kakaopay', kakaopayRoutes);
app.use('/api/customs-delay', customsDelayRoutes);
app.use('/api/business-trend', businessTrendRoutes);
app.use('/api/product', productRoutes);

// Render에서는 React 빌드 결과도 같은 Express 서버에서 제공한다.
// 로컬 개발은 기존처럼 Vite(5173) + Express(4000)를 각각 실행할 수 있다.
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // React Router의 /buyer/*, /business/* 같은 직접 접근도 index.html로 연결한다.
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    return next();
  });
}

// 존재하지 않는 라우트
app.use((req, res) => {
  res.status(404).json({ error: `${req.method} ${req.originalUrl} 라우트를 찾을 수 없습니다.` });
});

// 라우트 핸들러에서 던진 에러가 여기로 모임 (각 라우트의 개별 try/catch를 못 빠져나온 경우의 안전망)
app.use((err, req, res, next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.', detail: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Kakao MOHE backend running on http://localhost:${PORT}`);
});
