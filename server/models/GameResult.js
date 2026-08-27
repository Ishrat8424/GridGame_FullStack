const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema(
  {
    // User who played the game
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Game name
    game: {
      type: String,
      required: true,
      trim: true,
    },

    // Game mode
    mode: {
      type: String,
      enum: [
        "solo",
        "computer",
        "normal",
      ],
      default: "normal",
    },

    // Difficulty
    difficulty: {
      type: String,
      enum: [
        "easy",
        "medium",
        "hard",
        "normal",
      ],
      default: "normal",
    },

    // Score achieved
    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Game outcome
    result: {
      type: String,
      enum: [
        "won",
        "lost",
        "completed",
      ],
      required: true,
    },

    // XP awarded by backend
    xpEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const GameResult = mongoose.model(
  "GameResult",
  gameResultSchema
);

module.exports = GameResult;