const mongoose = require("mongoose");

const dailyChallengeSchema =
  new mongoose.Schema(
    {
      dateKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      game: {
        type: String,
        required: true,
        trim: true,
      },

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

      challengeType: {
        type: String,
        enum: [
          "play",
          "score",
          "win",
        ],
        required: true,
      },

      target: {
        type: Number,
        default: 1,
        min: 0,
      },

      bonusXP: {
        type: Number,
        default: 50,
        min: 0,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const DailyChallenge =
  mongoose.model(
    "DailyChallenge",
    dailyChallengeSchema
  );

module.exports =
  DailyChallenge;