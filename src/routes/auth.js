// routes/auth.js
// 해커톤용 초간단 인증: 세션/JWT 없이 로그인 성공 시 user 객체를 그대로 돌려줌.
// 프론트는 이 user.id를 localStorage 등에 저장해서 이후 요청마다 넘겨주면 됨.
// (시간 남으면 JWT로 교체. 지금은 "역할 분기"가 되는 것 자체가 중요함)

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db/init');

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

// 해커톤용 단일 서버 구성: OAuth state와 일회용 로그인 교환 코드를 잠시 메모리에 보관한다.
const pendingKakaoStates = new Map();
const pendingLoginSessions = new Map();

function kakaoConfig() {
  const port = process.env.PORT || 4000;
  const renderUrl = (process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');
  const frontendUrl = (
    process.env.FRONTEND_URL ||
    renderUrl ||
    'http://localhost:5173'
  ).replace(/\/$/, '');

  return {
    restApiKey: process.env.KAKAO_REST_API_KEY,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirectUri:
      process.env.KAKAO_REDIRECT_URI ||
      (renderUrl ? `${renderUrl}/api/auth/kakao/callback` : null) ||
      `http://localhost:${port}/api/auth/kakao/callback`,
    frontendUrl,
  };
}

function cleanupExpiredOAuthData() {
  const now = Date.now();
  for (const [key, value] of pendingKakaoStates) {
    if (value.expiresAt < now) pendingKakaoStates.delete(key);
  }
  for (const [key, value] of pendingLoginSessions) {
    if (value.expiresAt < now) pendingLoginSessions.delete(key);
  }
}

function frontendLoginError(res, message) {
  const { frontendUrl } = kakaoConfig();
  return res.redirect(`${frontendUrl}/login?kakao_error=${encodeURIComponent(message)}`);
}

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

// 프론트가 카카오 로그인 설정 여부를 확인할 때 사용한다.
router.get('/kakao/status', (req, res) => {
  const config = kakaoConfig();
  return res.json({
    configured: Boolean(config.restApiKey),
    redirectUri: config.redirectUri,
  });
});

// 카카오 인가 화면으로 이동한다.
router.get('/kakao/start', (req, res) => {
  const config = kakaoConfig();
  if (!config.restApiKey) {
    return frontendLoginError(res, '카카오 REST API 키가 서버에 설정되지 않았습니다.');
  }

  cleanupExpiredOAuthData();
  const state = crypto.randomBytes(24).toString('hex');
  pendingKakaoStates.set(state, { expiresAt: Date.now() + 5 * 60 * 1000 });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.restApiKey,
    redirect_uri: config.redirectUri,
    state,
  });

  return res.redirect(`${KAKAO_AUTHORIZE_URL}?${params.toString()}`);
});

// 카카오가 인가 코드를 전달하는 서버 콜백이다.
router.get('/kakao/callback', async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;
  const config = kakaoConfig();

  if (error) {
    return frontendLoginError(
      res,
      error === 'access_denied' ? '카카오 로그인이 취소되었습니다.' : errorDescription || error,
    );
  }

  cleanupExpiredOAuthData();
  if (!state || !pendingKakaoStates.has(state)) {
    return frontendLoginError(res, '로그인 요청이 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.');
  }
  pendingKakaoStates.delete(state);

  if (!code || !config.restApiKey) {
    return frontendLoginError(res, '카카오 로그인에 필요한 인가 정보가 없습니다.');
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.restApiKey,
      redirect_uri: config.redirectUri,
      code: String(code),
    });
    if (config.clientSecret) {
      tokenParams.set('client_secret', config.clientSecret);
    }

    const tokenResponse = await fetch(KAKAO_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: tokenParams,
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[kakao/login] 토큰 발급 실패:', tokenData);
      throw new Error(tokenData.error_description || '카카오 토큰 발급에 실패했습니다.');
    }

    const userResponse = await fetch(KAKAO_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const kakaoUser = await userResponse.json();
    if (!userResponse.ok || !kakaoUser.id) {
      console.error('[kakao/login] 사용자 조회 실패:', kakaoUser);
      throw new Error(kakaoUser.msg || '카카오 사용자 정보를 가져오지 못했습니다.');
    }

    const kakaoId = String(kakaoUser.id);
    const account = kakaoUser.kakao_account || {};
    const profile = account.profile || {};
    const email = account.email || `kakao_${kakaoId}@kakao.local`;
    const name = profile.nickname || `카카오 사용자 ${kakaoId.slice(-4)}`;
    const profileImage = profile.profile_image_url || profile.thumbnail_image_url || null;

    let user = db
      .prepare(`SELECT id, email, name, role, profile_image FROM users WHERE kakao_id = ?`)
      .get(kakaoId);

    if (!user) {
      const emailUser = account.email
        ? db.prepare(`SELECT id FROM users WHERE email = ?`).get(account.email)
        : null;

      if (emailUser) {
        db.prepare(`
          UPDATE users
          SET kakao_id = ?, auth_provider = 'kakao', name = ?, profile_image = ?
          WHERE id = ?
        `).run(kakaoId, name, profileImage, emailUser.id);
        user = db
          .prepare(`SELECT id, email, name, role, profile_image FROM users WHERE id = ?`)
          .get(emailUser.id);
      } else {
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const result = db.prepare(`
          INSERT INTO users (email, password, name, role, auth_provider, kakao_id, profile_image)
          VALUES (?, ?, ?, 'buyer', 'kakao', ?, ?)
        `).run(email, randomPassword, name, kakaoId, profileImage);
        user = db
          .prepare(`SELECT id, email, name, role, profile_image FROM users WHERE id = ?`)
          .get(result.lastInsertRowid);
      }
    } else {
      db.prepare(`UPDATE users SET name = ?, profile_image = ? WHERE id = ?`)
        .run(name, profileImage, user.id);
      user = { ...user, name, profile_image: profileImage };
    }

    const loginToken = crypto.randomBytes(32).toString('hex');
    pendingLoginSessions.set(loginToken, {
      user,
      expiresAt: Date.now() + 2 * 60 * 1000,
    });

    return res.redirect(
      `${config.frontendUrl}/auth/kakao/callback?token=${encodeURIComponent(loginToken)}`,
    );
  } catch (callbackError) {
    console.error('[kakao/login] 콜백 처리 실패:', callbackError.message);
    return frontendLoginError(res, callbackError.message);
  }
});

// 브라우저 URL에는 사용자 정보를 직접 싣지 않고 일회용 코드로 한 번만 교환한다.
router.get('/kakao/session', (req, res) => {
  cleanupExpiredOAuthData();
  const token = String(req.query.token || '');
  const session = pendingLoginSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: '카카오 로그인 정보가 만료되었습니다. 다시 로그인해 주세요.' });
  }

  pendingLoginSessions.delete(token);
  return res.json(session.user);
});

module.exports = router;
