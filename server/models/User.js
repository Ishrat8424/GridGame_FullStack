const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // ACCOUNT
    // =====================================================

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "🦊",
    },

    // =====================================================
// EMAIL VERIFICATION
// =====================================================

isEmailVerified: {
  type: Boolean,
  default: false,
},

emailVerificationToken: {
  type: String,
  default: null,
  select: false,
},

emailVerificationExpires: {
  type: Date,
  default: null,
  select: false,
},

// =====================================================
// PASSWORD RESET
// =====================================================

resetPasswordToken: {
  type: String,
  default: null,
  select: false,
},

resetPasswordExpires: {
  type: Date,
  default: null,
  select: false,
},

    // =====================================================
    // XP + LEVEL
    // =====================================================

    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    // =====================================================
    // GAME STATISTICS
    // =====================================================

    stats: {
      gamesPlayed: {
        type: Number,
        default: 0,
      },

      wins: {
        type: Number,
        default: 0,
      },

      losses: {
        type: Number,
        default: 0,
      },

      // Game win streak
      bestStreak: {
        type: Number,
        default: 0,
      },

      // Game win streak
      currentStreak: {
        type: Number,
        default: 0,
      },
    },

    // =====================================================
    // DAILY ACTIVITY STREAK
    // =====================================================

    dailyStreak: {
      current: {
        type: Number,
        default: 0,
        min: 0,
      },

      longest: {
        type: Number,
        default: 0,
        min: 0,
      },

      lastActiveDate: {
        type: Date,
        default: null,
      },
    },

    // =====================================================
    // DAILY CHALLENGE PROGRESS
    // =====================================================

    dailyChallenge: {
      lastCompletedDate: {
        type: Date,
        default: null,
      },

      totalCompleted: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.model(
    "User",
    userSchema
  );

module.exports = User;