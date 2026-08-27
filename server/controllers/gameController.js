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
// =====================================================

const saveGameResult = async (req, res) => {
  try {
    const {
      game,
      score,
      result,
      difficulty,
      mode,
    } = req.body;

    // =================================================
    // VALIDATE REQUIRED FIELDS
    // =================================================

    if (!game || !result) {
      return res.status(400).json({
        success: false,
        message: "Game and result are required.",
      });
    }

    // =================================================
    // VALIDATE RESULT
    // =================================================

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

    // =================================================
    // VALIDATE DIFFICULTY
    // =================================================

    const allowedDifficulties = [
      "easy",
      "medium",
      "hard",
      "normal",
    ];

    const finalDifficulty =
      difficulty || "normal";

    if (
      !allowedDifficulties.includes(
        finalDifficulty
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty.",
      });
    }

    // =================================================
    // VALIDATE MODE
    // =================================================

    const allowedModes = [
      "solo",
      "computer",
      "normal",
    ];

    const finalMode =
      mode || "normal";

    if (!allowedModes.includes(finalMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game mode.",
      });
    }

    // =================================================
    // SCORE
    // =================================================

    const finalScore = Number(score) || 0;

    if (finalScore < 0) {
      return res.status(400).json({
        success: false,
        message: "Score cannot be negative.",
      });
    }

    // =================================================
    // XP
    // =================================================

    const xpEarned = calculateXP({
      game,
      score: finalScore,
      result,
      difficulty: finalDifficulty,
      mode: finalMode,
    });

    // =================================================
    // USER
    // =================================================

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =================================================
    // CREATE GAME RESULT
    // =================================================

    const gameResult =
      await GameResult.create({
        user: req.user._id,

        game,

        mode: finalMode,

        difficulty:
          finalDifficulty,

        score: finalScore,

        result,

        xpEarned,
      });

    // =================================================
    // UPDATE USER STATS
    // =================================================

    user.stats.gamesPlayed += 1;

    user.xp += xpEarned;

    // WIN
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

    // LOSS
    if (result === "lost") {
      user.stats.losses += 1;

      user.stats.currentStreak = 0;
    }

    // =================================================
    // LEVEL
    // =================================================

    user.level =
      Math.floor(user.xp / 500) + 1;

    await user.save();

    // =================================================
    // ACHIEVEMENTS
    // =================================================

    const unlockedAchievements =
      await checkAndUnlockAchievements(
        user,
        gameResult
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Game result saved successfully!",

      gameResult,

      unlockedAchievements,

      user: {
        id: user._id,

        username:
          user.username,

        email:
          user.email,

        avatar:
          user.avatar,

        xp:
          user.xp,

        level:
          user.level,

        stats:
          user.stats,
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
// GET /api/games/history?page=1&limit=8
// =====================================================

const getGameHistory = async (req, res) => {
  try {
    // =================================================
    // PAGINATION
    // =================================================

    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const requestedLimit =
      parseInt(req.query.limit, 10) || 8;

    // Prevent someone requesting thousands at once
    const limit = Math.min(
      Math.max(requestedLimit, 1),
      50
    );

    const skip =
      (page - 1) * limit;

    // =================================================
    // OPTIONAL GAME FILTER
    // =================================================

    const query = {
      user: req.user._id,
    };

    if (
      req.query.game &&
      req.query.game !== "all"
    ) {
      query.game = req.query.game;
    }

    // =================================================
    // GET TOTAL
    // =================================================

    const totalGames =
      await GameResult.countDocuments(
        query
      );

    // =================================================
    // GET HISTORY
    // =================================================

    const gameHistory =
      await GameResult.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    // =================================================
    // PAGINATION INFO
    // =================================================

    const totalPages =
      Math.ceil(
        totalGames / limit
      );

    const hasMore =
      page < totalPages;

    return res.status(200).json({
      success: true,

      count:
        gameHistory.length,

      games:
        gameHistory,

      pagination: {
        page,
        limit,
        totalGames,
        totalPages,
        hasMore,
      },
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