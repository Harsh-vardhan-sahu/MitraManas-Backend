
const db = require('..');


const getAllSongs = async () => {
  const result = await db.query('SELECT * FROM songs');
  //console.log(result.rows);
  return result.rows;
};
//getAllSongs()
module.exports={getAllSongs}