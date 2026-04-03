// Emotion API Routes
const express = require('express');
const router = express.Router();
const {
  getEmotionData,
  saveEmotion,
  getHistory,
  getAnalytics,
  clearHistory,
} = require('../controllers/emotionController');

// GET /api/emotion/:name – brain regions + intensity for a given emotion
router.get('/emotion/:name', getEmotionData);

// POST /api/emotion – record a user emotion selection
router.post('/emotion', saveEmotion);

// GET /api/history – retrieve past emotion selections
router.get('/history', getHistory);

// DELETE /api/history – clear past emotion selections
router.delete('/history', clearHistory);

// GET /api/analytics – aggregated stats for dashboard
router.get('/analytics', getAnalytics);

module.exports = router;

