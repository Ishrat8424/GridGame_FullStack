const express = require("express");

const {
  getDailyChallenge,
} = require("../controllers/dailyChallengeController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET TODAY'S DAILY CHALLENGE
// GET /api/daily-challenge
// =====================================================

router.get(
  "/",
  protect,
  getDailyChallenge
);

module.exports = router;