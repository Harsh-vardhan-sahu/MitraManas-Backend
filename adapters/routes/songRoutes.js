const express = require('express');
const SongController = require('../controllers/SongController');
//const SongController = require('../../controllers/songController'); // Match exact name
const router = express.Router();

console.log('SongController:', SongController);
console.log('SongController.all:', SongController.all);

router.get('/all', SongController.all);

module.exports = router;