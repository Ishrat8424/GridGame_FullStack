const User = require("../models/User");

const {
  getTodayChallenge,
  isSameUTCDate,
} = require("../services/dailyChallengeService");

// =====================================================
// GET TODAY'S DAILY CHALLENGE
// GET /api/daily-challenge
// =====================================================

const getDailyChallenge = async (req, res) => {
  try {
    // =====================================================
    // GET USER
    // =====================================================

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================================
    // GET TODAY'S CHALLENGE
    // =====================================================

    const challenge =
      await getTodayChallenge();

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message:
          "No daily challenge available.",
      });
    }

    // =====================================================
    // CHECK COMPLETION
    // =====================================================

    const lastCompletedDate =
      user.dailyChallenge
        ?.lastCompletedDate;

    const completedToday =
      lastCompletedDate
        ? isSameUTCDate(
            lastCompletedDate,
            new Date()
          )
        : false;

    // =====================================================
    // DAILY STREAK
    // =====================================================

    const currentStreak =
      Number(
        user.dailyStreak?.current
      ) || 0;

    const longestStreak =
      Number(
        user.dailyStreak?.longest
      ) || 0;

    const totalCompleted =
      Number(
        user.dailyChallenge
          ?.totalCompleted
      ) || 0;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      challenge: {
        id: challenge._id,

        dateKey:
          challenge.dateKey,

        title:
          challenge.title,

        description:
          challenge.description,

        game:
          challenge.game,

        difficulty:
          challenge.difficulty,

        challengeType:
          challenge.challengeType,

        target:
          challenge.target,

        bonusXP:
          challenge.bonusXP,

        completed:
          completedToday,
      },

      streak: {
        current:
          currentStreak,

        longest:
          longestStreak,

        lastActiveDate:
          user.dailyStreak
            ?.lastActiveDate ||
          null,
      },

      stats: {
        totalCompleted,
      },
    });
  } catch (error) {
    console.error(
      "Get daily challenge error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load today's challenge.",
    });
  }
};

module.exports = {
  getDailyChallenge,
};