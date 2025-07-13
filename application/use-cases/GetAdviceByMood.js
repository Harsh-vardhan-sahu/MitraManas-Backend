const UseCaseInterface = require("../interfaces/UseCaseInterface");

class GetAdviceByMood extends UseCaseInterface {
  constructor(quoteRepository) {
    super();
    this.quoteRepository = quoteRepository;
  }

  async execute(mood) {
    const quotesData = await this.quoteRepository.getAdvicebyMood(mood);
    return quotesData; // ✅ Don't wrap with Meditation
  }
}

module.exports = GetAdviceByMood;
