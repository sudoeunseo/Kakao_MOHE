# Kakao MOHE Backend (해커톤 스타터)

## 빠른 시작

```bash
npm install
cp .env.example .env
# .env 열어서 GEMINI_API_KEY 채워넣기 (https://aistudio.google.com 에서 무료 발급)
npm run dev
```

서버는 기본적으로 http://localhost:4000 에서 뜬다.

## 엔드포인트

| Method | URL | 설명 |
|---|---|---|
| GET | `/health` | 서버 살아있는지 확인 |
| POST | `/api/auth/signup` | 회원가입 `{email, password, name, role}` (role: buyer\|business) |
| POST | `/api/auth/login` | 로그인 `{email, password}` → `{id, email, name, role}` 반환. **프론트는 이 role로 화면 분기** |
| POST | `/api/estimate` | AI 비용예측 `{productName, priceAmount, priceCurrency, originCountry, shippingMode}` → 예측 JSON |
| POST | `/api/orders` | 주문 생성 (결제 연동 없이 즉시 'paid' 처리) |
| GET | `/api/orders?userId=1` | 특정 유저 주문 목록 (마이페이지용) |
| GET | `/api/orders/all` | 전체 주문 목록 (기업/비즈니스 주문관리 화면용) |

## 설계 원칙 (시간 없을 때 왜 이렇게 짰는지)

- **DB는 SQLite 파일 1개.** 서버 설치, 계정 만들기 없음. `mohe.db` 파일이 곧 DB 전체라 팀원 노트북 옮겨도 그대로 동작.
- **인증은 세션/JWT 없이 로그인 응답의 `role` 그대로 신뢰.** 프론트가 `localStorage`에 저장해서 이후 요청에 넘기면 됨. 시간 남으면 JWT로 교체 가능하지만 데모에는 불필요.
- **결제(카카오페이) 연동 안 함.** `/api/orders` POST가 곧 "결제 성공"이라고 간주하고 바로 `status: 'paid'`로 저장. 프론트에서는 "카카오페이로 결제하기" 버튼 → 로딩 스피너 1~2초 → 성공 화면 → 이 API 호출, 이런 식으로 **UX만 진짜처럼** 만들면 충분함.
- **AI는 딱 1개(최종 비용 예측)만 실제 LLM 호출.** 문서에 정리된 6개 AI 중 나머지 5개(통관지연/수요예측/배차최적화/물류센터배정/수익예측)는 발표자료에 "향후 확장" 다이어그램으로만 넣는 걸 추천. 심사 배점상 AI는 20점이고 "1개 이상"이면 충족 조건 만족.
- **AI 모델은 Google Gemini(무료 티어).** `gemini-2.5-flash` 모델 + `responseSchema`로 출력 JSON 구조를 강제해서, 마크다운이나 잡담이 섞여 파싱이 깨지는 문제를 원천 차단함. 키는 https://aistudio.google.com 에서 신용카드 등록 없이 즉시 발급 가능.
- **ai_estimate 컬럼은 JSON 문자열로 통째로 저장.** 스키마 마이그레이션 없이 AI 응답 필드가 바뀌어도 즉시 대응 가능.

## 프론트 연동 팁

1. 로그인 성공 시 받은 `role`이 `'business'`면 기업용(다크 콘솔) 화면으로, `'buyer'`면 구매자용 화면으로 라우팅.
2. 상품구매탭: `/api/estimate` 호출 → 결과를 화면에 브레이크다운으로 보여줌 → "구매 대행 요청" 버튼 누르면 그 결과를 그대로 `/api/orders` POST body의 `aiEstimate`에 넣어서 주문 확정.
3. 마이페이지: `/api/orders?userId=` 로 리스트 받아서 카드로 렌더.
4. 기업 주문관리: `/api/orders/all` 로 전체 리스트 받아서 테이블/채팅형 카드로 렌더.

## "이 모델은 더 이상 제공되지 않습니다" 에러가 날 때

Google이 계정별로 열어주는 Gemini 모델이 종종 바뀝니다. `gemini-2.5-flash`가 404로 막히면:

```bash
node src/scripts/listModels.js
```

이 명령어를 실행하면 지금 내 API 키로 실제 호출 가능한 모델 이름이 그대로 출력됩니다. 거기서 하나를 골라 `.env`에 추가하세요:

```
GEMINI_MODEL=gemini-flash-latest
```

(`estimateCost.js`는 `.env`의 `GEMINI_MODEL` 값이 있으면 그걸 우선 쓰고, 없으면 `gemini-flash-latest`를 기본값으로 시도합니다.)



`src/ai/estimateCost.js`의 `SYSTEM_PROMPT`만 수정하면 됨. 같은 패턴(시스템 프롬프트에 "반드시 이 JSON 스키마로만 응답" 박아넣기)으로 통관지연 예측, 수요예측 등 추가 AI 파일을 `src/ai/` 밑에 더 만들 수 있음. 예: `predictCustomsDelay.js`, `predictDemand.js`.
