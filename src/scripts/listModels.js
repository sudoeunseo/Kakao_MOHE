// scripts/listModels.js
//
// 이전 버전은 ai.models.list()를 썼는데, 지금 설치된 @google/genai 버전(0.3.x)에는
// 그 메서드가 없다 (list is not a function 에러 원인). SDK 버전마다 지원 API가 달라서
// 목록 조회 대신, 자주 쓰이는 모델 이름 후보들을 하나씩 실제로 호출해보고
// 어떤 이름이 이 API 키/계정에서 동작하는지 직접 찾아주는 방식으로 바꿨다.
//
// 실행: node src/scripts/listModels.js

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
];

async function tryModel(ai, modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: '안녕이라고만 짧게 대답해줘.',
    });
    const text = response.text?.trim();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 .env에 없습니다. 먼저 키를 넣어주세요.');
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  console.log('아래 후보 모델들을 하나씩 실제로 호출해봅니다 (몇 초 걸릴 수 있음)...\n');

  const working = [];

  for (const modelName of CANDIDATE_MODELS) {
    process.stdout.write(`- ${modelName} ... `);
    const result = await tryModel(ai, modelName);
    if (result.ok) {
      console.log(`✅ 성공 (응답: "${result.text}")`);
      working.push(modelName);
    } else {
      const shortErr = result.error.split('\n')[0].slice(0, 80);
      console.log(`❌ 실패 (${shortErr})`);
    }
  }

  console.log('\n──────────────────────────');
  if (working.length > 0) {
    console.log(`사용 가능한 모델: ${working.join(', ')}`);
    console.log(`\n.env 파일에 아래 줄을 추가하세요:`);
    console.log(`GEMINI_MODEL=${working[0]}`);
  } else {
    console.log('사용 가능한 모델을 하나도 찾지 못했습니다.');
    console.log('API 키가 올바른지, https://aistudio.google.com 에서 키 상태를 다시 확인해보세요.');
  }
}

main();
