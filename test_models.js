const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config({ path: 'c:/Users/abhij/Ai_Projects_2026/ai-resume-analyzer/backend/.env' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const results = {};

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Say hello',
      config: { maxOutputTokens: 10 }
    });
    results[modelName] = 'SUCCESS';
  } catch (e) {
    results[modelName] = 'FAILED: ' + e.message;
  }
}

async function main() {
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.5-pro',
    'gemini-pro'
  ];

  for (const model of modelsToTest) {
    await testModel(model);
  }
  fs.writeFileSync('models_result.json', JSON.stringify(results, null, 2));
}

main();
