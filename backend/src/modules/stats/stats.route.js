const express = require('express');
const router = express.Router();
const statsController = require('./stats.controller');

// Public route — no auth required
router.get('/summary', statsController.getSummary);

module.exports = router;
