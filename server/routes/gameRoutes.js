const express = require("express");

const {
  saveGameResult,
  getGameHistory,
} = require("../controllers/gameController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Save completed game
router.post("/result", protect, saveGameResult);

// Get logged-in player's game history
router.get("/history", protect, getGameHistory);

module.exports = router;