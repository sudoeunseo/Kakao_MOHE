// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const estimateRoutes = require('./routes/estimate');
const orderRoutes = require('./routes/orders');
const kakaopayRoutes = require('./routes/kakaopay');
const customsDelayRoutes = require('./routes/customsDelay');
const businessTrendRoutes = require('./routes/businessTrend');

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Kakao MOHE backend running on http://localhost:${PORT}`);
});
