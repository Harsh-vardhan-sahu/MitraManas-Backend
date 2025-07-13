const GetAdviceByMood = require("../../application/use-cases/GetAdviceByMood");
const GetDailyQuotes = require("../../application/use-cases/GetDailyQuotes");
const GeminiApi = require("../../infrastructure/gemini/geminiService.js");


class MeditationController {
  static async dailyQuote(req, res) {
    try {
      const quoteRepository = new GeminiApi();
      const getDailyQuotes = new GetDailyQuotes(quoteRepository);
      const quotes = await getDailyQuotes.execute();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async myMood(req, res) {
    try {
      const { mood } = req.params;
      const quoteRepository = new GeminiApi();
      const getAdvicebyMood = new GetAdviceByMood(quoteRepository);
      const quotes = await getAdvicebyMood.execute(mood);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MeditationController;
