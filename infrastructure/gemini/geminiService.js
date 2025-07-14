require("dotenv").config();
const axios = require("axios");
const QuotesRepository = require("../../application/interfaces/QuotesRepository");

// ✅ List of all API keys
const GEMINI_KEYS = process.env.GEMINI_KEYS.split(",");
const MODEL = "gemini-2.5-flash";

// 🔁 Auto-rotate keys on quota failure (403/429)
async function safeGenerateContent(prompt, keyIndex = 0, retryCount = 0) {
  if (keyIndex >= GEMINI_KEYS.length) {
    throw new Error("❌ All Gemini API keys have been exhausted.");
  }

  const apiKey = GEMINI_KEYS[keyIndex];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty response from Gemini");

    return text.replace(/```json|```/g, "").trim();
  } catch (err) {
    const status = err.response?.status;

    // 🔁 Rotate to next key if quota/rate limit hit
    if ((status === 429 || status === 403) && keyIndex + 1 < GEMINI_KEYS.length) {
      console.warn(`⚠️ Quota hit on key ${keyIndex + 1}. Trying next key...`);
      return safeGenerateContent(prompt, keyIndex + 1);
    }

    // ⏳ Retry on temporary error (503)
    if (status === 503 && retryCount < 3) {
      console.warn(`⚠️ Gemini service busy. Retrying in 15s... Attempt ${retryCount + 1}`);
      await new Promise((res) => setTimeout(res, 15000));
      return safeGenerateContent(prompt, keyIndex, retryCount + 1);
    }

    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    throw new Error("Gemini AI generation failed");
  }
}

// ✅ Gemini Quote & Mood Generator
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

    try {
      const text = await safeGenerateContent(prompt);
      const json = JSON.parse(text);

      if (!json?.morningQuote || !json?.noonQuote || !json?.eveningQuote) {
        throw new Error("Incomplete quote data from Gemini");
      }

      return json;
    } catch (err) {
      console.warn("⚠️ Fallback to default daily quotes.");
      return {
        morningQuote: "Begin your day with a deep breath and a quiet mind.",
        noonQuote: "Pause, breathe, and let go of tension.",
        eveningQuote: "Let the day fade with calm and gratitude.",
      };
    }
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

    try {
      const text = await safeGenerateContent(prompt);
      const json = JSON.parse(text);

      if (!json?.text || typeof json.text !== "string") {
        throw new Error("Invalid mood advice response");
      }

      return json;
    } catch (err) {
      console.warn("⚠️ Fallback to default mood message.");
      return {
        text: "Take a moment to pause, breathe deeply, and be kind to yourself. You matter.",
      };
    }
  }
}

module.exports = GeminiApi;
