const UseCaseInterface = require("../interfaces/UseCaseInterface");

class GetDailyQuotes extends UseCaseInterface {
  constructor(quoteRepository) {
    super();
    this.quoteRepository = quoteRepository;
  }

  async execute() {
    const quotesData = await this.quoteRepository.getDailyQuotes();
    // ✅ Just return the data, it's already a JS object
    return quotesData;
  }
}

module.exports = GetDailyQuotes;
