// routes/auth.js
// 해커톤용 초간단 인증: 세션/JWT 없이 로그인 성공 시 user 객체를 그대로 돌려줌.
// 프론트는 이 user.id를 localStorage 등에 저장해서 이후 요청마다 넘겨주면 됨.
// (시간 남으면 JWT로 교체. 지금은 "역할 분기"가 되는 것 자체가 중요함)

const express = require('express');
const router = express.Router();
const db = require('../db/init');

// 회원가입
router.post('/signup', (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password, name은 필수입니다.' });
  }
  if (role && !['buyer', 'business'].includes(role)) {
    return res.status(400).json({ error: "role은 'buyer' 또는 'business'만 가능합니다." });
  }

  try {
    const stmt = db.prepare(
      `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(email, password, name, role || 'buyer');

    return res.status(201).json({
      id: result.lastInsertRowid,
      email,
      name,
      role: role || 'buyer',
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
    }
    return res.status(500).json({ error: err.message });
  }
});

// 로그인 — 계정 유형(role)에 따라 프론트가 buyer/business 화면으로 분기
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db
    .prepare(`SELECT id, email, name, role FROM users WHERE email = ? AND password = ?`)
    .get(email, password);

  if (!user) {
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  return res.json(user); // { id, email, name, role }
});

module.exports = router;
