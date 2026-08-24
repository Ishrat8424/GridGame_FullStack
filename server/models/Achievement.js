const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    achievementId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "🏆",
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from unlocking
// the same achievement multiple times.
achievementSchema.index(
  {
    user: 1,
    achievementId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Achievement",
  achievementSchema
);