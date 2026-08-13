// db/init.js
// SQLite 하나로 끝. 파일 하나가 DB 전체라서 팀원 노트북 옮겨도 그대로 동작함.
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../mohe.db'));

db.pragma('journal_mode = WAL');

// ── users: 해커톤용 최소 버전. 비밀번호 해시도 생략하고 그냥 평문 비교.
//    (제출용 데모니까 보안은 신경 안 씀. 실서비스면 bcrypt 필수)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer',   -- 'buyer' | 'business'
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// 기존 DB도 그대로 사용할 수 있도록 카카오 로그인용 컬럼을 점진적으로 추가한다.
const userColumns = db.prepare(`PRAGMA table_info(users)`).all();
const userColumnNames = new Set(userColumns.map((column) => column.name));

if (!userColumnNames.has('auth_provider')) {
  db.exec(`ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'local'`);
}
if (!userColumnNames.has('kakao_id')) {
  db.exec(`ALTER TABLE users ADD COLUMN kakao_id TEXT`);
}
if (!userColumnNames.has('profile_image')) {
  db.exec(`ALTER TABLE users ADD COLUMN profile_image TEXT`);
}

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id)`);

// ── orders: 상품구매탭에서 만들어지는 주문.
//    ai_estimate 컬럼에 AI가 뱉은 예측 결과를 JSON 문자열 그대로 저장.
//    (정규화 안 하고 JSON으로 퉁치는 이유: 시간 없을 때 스키마 변경 없이 필드 추가 가능)
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_url TEXT,
  origin_country TEXT,
  price_amount REAL NOT NULL,
  price_currency TEXT NOT NULL DEFAULT 'USD',
  shipping_mode TEXT NOT NULL DEFAULT 'forwarding', -- 'forwarding'(배대지) | 'direct'(직배송,관세만 대행)
  ai_estimate TEXT,        -- JSON string (AI 예측 결과 스냅샷)
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | shipping | customs | delivered
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

module.exports = db;
