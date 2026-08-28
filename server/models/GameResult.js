const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER WHO PLAYED THE GAME
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================================
    // GAME NAME
    // =====================================================

    game: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // GAME MODE
    // =====================================================

    mode: {
      type: String,
      enum: [
        "solo",
        "computer",
        "normal",
      ],
      default: "normal",
    },

    // =====================================================
    // DIFFICULTY
    // =====================================================

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

    // =====================================================
    // SCORE
    // =====================================================

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // GAME RESULT
    // =====================================================

    result: {
      type: String,
      enum: [
        "won",
        "lost",
        "completed",
      ],
      required: true,
    },

    // =====================================================
    // XP AWARDED BY BACKEND
    // =====================================================

    xpEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // GAME-SPECIFIC METADATA
    // =====================================================
    //
    // This allows different games to store additional
    // information without changing the schema each time.
    //
    // Example for Grid Quest:
    //
    // metadata: {
    //   starsCollected: 4,
    //   totalStars: 4,
    //   moves: 26
    // }
    //
    // Example for another future game:
    //
    // metadata: {
    //   timeTaken: 45,
    //   correctAnswers: 8,
    //   totalQuestions: 10
    // }
    //
    // =====================================================

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// MODEL
// =====================================================

const GameResult = mongoose.model(
  "GameResult",
  gameResultSchema
);

module.exports = GameResult;