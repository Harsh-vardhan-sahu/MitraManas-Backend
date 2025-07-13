
const Song = require("../../domain/entities/song.js");
const { getAllSongs } = require("../../infrastructure/db/queries/songQueries.js");
const UseCaseInterface = require("../interfaces/UseCaseInterface.js");

class GetSongs extends UseCaseInterface {
  async execute() {
    const songRows = await getAllSongs();

    // 💥 DEBUG: Print image field from database
    console.log("Fetched song rows from DB:");
    songRows.forEach(song => console.log(`[${song.id}] ${song.title} -> ${song.image}`));

    return songRows.map(song => new Song({
      id: song.id,
      title: song.title,
      artist: song.artist,
      link: song.link,
      image: song.image, // ✅ this must pass through correctly now
    }));
  }
}

module.exports = GetSongs;
