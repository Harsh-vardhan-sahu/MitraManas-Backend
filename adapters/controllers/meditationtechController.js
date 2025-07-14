const techniques = require('../../data/meditationTechniques.json');

exports.getTechniques = (req, res) => {
  res.json(techniques);
};
