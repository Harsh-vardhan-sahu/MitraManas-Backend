require("dotenv").config();
const axios = require("axios");
const QuotesRepository = require("../../application/interfaces/QuotesRepository");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function safeGenerateContent(prompt, retryCount = 0) {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    });

    const candidates = response.data.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.replace(/```json|```/g, "").trim();
  } catch (err) {
    if ((retryCount < 3) && (err.response?.status === 429 || err.response?.status === 503)) {
      console.warn(`⚠️ Gemini API busy. Retrying after 15 seconds... Attempt ${retryCount + 1}`);
      await new Promise(res => setTimeout(res, 15000));
      return safeGenerateContent(prompt, retryCount + 1);
    }
    console.error("❌ Error from Gemini API:", err.response?.data || err.message);
    throw new Error("Gemini AI generation failed");
  }
}

class GeminiApi extends QuotesRepository {
  async getDailyQuotes() {
    const prompt = `
Please provide three inspirational quotes for meditation, one for each part of the day: morning, noon, and evening.
Respond only in this JSON format:
{
  "morningQuote": "Your morning quote here",
  "noonQuote": "Your noon quote here",
  "eveningQuote": "Your evening quote here"
}
Return only the JSON. No extra text.
`;
    const text = await safeGenerateContent(prompt);
    return JSON.parse(text);
  }

  async getAdvicebyMood(mood) {
    const prompt = `
The user is feeling "${mood}". Provide empathetic, calming meditation advice.
Respond only in this JSON format:
{
  "text": "Meditation or mental health tip for this mood"
}
Return only JSON. No extra text.
`;

    const text = await safeGenerateContent(prompt);
    const json = JSON.parse(text);

    // Add a fallback in case Gemini returns bad data
    if (!json?.text || typeof json.text !== "string") {
      console.warn("⚠️ Invalid or missing 'text' in Gemini mood message response. Using default fallback.");
      return { text: "Take a moment to breathe deeply and know that you're not alone." };
    }

    return json;
  }
}

module.exports = GeminiApi;
