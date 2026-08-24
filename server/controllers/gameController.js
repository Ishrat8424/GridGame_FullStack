const GameResult = require("../models/GameResult");
const User = require("../models/User");

const {
  checkAndUnlockAchievements,
} = require("../services/achievementService");

const {
  calculateXP,
} = require("../services/xpService");

// =====================================================
// SAVE GAME RESULT
// POST /api/games/result
// Protected route
// =====================================================

const saveGameResult = async (req, res) => {
  try {
    const {
      game,
      score,
      result,
    } = req.body;

    // 1. Validate required fields
    if (!game || !result) {
      return res.status(400).json({
        success: false,
        message: "Game and result are required.",
      });
    }

    // 2. Validate result type
    const allowedResults = [
      "won",
      "lost",
      "completed",
    ];

    if (!allowedResults.includes(result)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game result.",
      });
    }

    // 3. Normalize score
    const finalScore = Number(score) || 0;

    if (finalScore < 0) {
      return res.status(400).json({
        success: false,
        message: "Score cannot be negative.",
      });
    }

    // 4. Calculate XP on backend
   const xpEarned = calculateXP({
  game,
  score: finalScore,
  result,
});

    // 5. Save game history
    const gameResult = await GameResult.create({
      user: req.user._id,
      game,
      score: finalScore,
      result,
      xpEarned,
    });

    // 6. Get current user
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 7. Increase games played
    user.stats.gamesPlayed += 1;

    // 8. Add XP
    user.xp += xpEarned;

    // 9. WIN
    if (result === "won") {
      user.stats.wins += 1;
      user.stats.currentStreak += 1;

      if (
        user.stats.currentStreak >
        user.stats.bestStreak
      ) {
        user.stats.bestStreak =
          user.stats.currentStreak;
      }
    }

    // 10. LOSS
    if (result === "lost") {
      user.stats.losses += 1;
      user.stats.currentStreak = 0;
    }

    // completed currently does not change
    // wins/losses/current streak

    // 11. Recalculate level
    user.level =
      Math.floor(user.xp / 500) + 1;

    // 12. Save updated user
    await user.save();

    // 13. Check achievements
    const unlockedAchievements =
      await checkAndUnlockAchievements(user);

    // 14. Return updated data
    return res.status(201).json({
      success: true,
      message:
        "Game result saved successfully!",

      gameResult,

      unlockedAchievements,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error(
      "Save game result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while saving game result.",
    });
  }
};

// =====================================================
// GET GAME HISTORY
// GET /api/games/history
// Protected route
// =====================================================

const getGameHistory = async (
  req,
  res
) => {
  try {
    const gameHistory =
      await GameResult.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(10);

    return res.status(200).json({
      success: true,
      count: gameHistory.length,
      games: gameHistory,
    });
  } catch (error) {
    console.error(
      "Get game history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching game history.",
    });
  }
};

module.exports = {
  saveGameResult,
  getGameHistory,
};