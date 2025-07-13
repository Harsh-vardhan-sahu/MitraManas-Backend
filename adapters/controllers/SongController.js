const GetSongs = require("../../application/use-cases/GetSongs"); // ✅ match file name exactly!

class SongController {
  static async all(req, res) {
    try {
      const getSongs = new GetSongs(); // ✅ class name matches file
      const songs = await getSongs.execute();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SongController;
