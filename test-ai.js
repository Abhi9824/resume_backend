require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hi",
    });
    console.log("Success:", response.text);
  } catch (err) {
    if (err.status === 404) {
       console.log("404 Error - checking available models...");
       // The new SDK model listing (if available) or raw fetch
       const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
       const data = await res.json();
       console.log("Available models:", data.models?.map(m => m.name.replace('models/', '')).join(', '));
    } else {
       console.error("Error details:", err);
    }
  }
}
test();
