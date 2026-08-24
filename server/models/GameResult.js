const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    result: {
      type: String,
      enum: ["won", "lost", "completed"],
      required: true,
    },

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