const express = require('express');
const router = express.Router();
const meditationtechController = require('../controllers/meditationtechController');

router.get('/techniques', meditationtechController.getTechniques);

module.exports = router;
