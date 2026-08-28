const GameResult = require("../models/GameResult");
const User = require("../models/User");

const {
  checkAndUnlockAchievements,
} = require("../services/achievementService");

const {
  calculateXP,
} = require("../services/xpService");

const {
  getTodayChallenge,
  doesResultCompleteChallenge,
  updateDailyStreak,
  isSameUTCDate,
} = require("../services/dailyChallengeService");

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
      metadata = {},
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !game ||
      typeof game !== "string" ||
      !game.trim() ||
      !result
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Game and result are required.",
      });
    }

    const allowedResults = [
      "won",
      "lost",
      "completed",
    ];

    if (
      !allowedResults.includes(result)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid game result.",
      });
    }

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
        message:
          "Invalid difficulty.",
      });
    }

    const allowedModes = [
      "solo",
      "computer",
      "normal",
    ];

    const finalMode =
      mode || "normal";

    if (
      !allowedModes.includes(
        finalMode
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid game mode.",
      });
    }

    // =====================================================
    // SCORE VALIDATION
    // =====================================================

    const finalScore =
      score === undefined ||
      score === null ||
      score === ""
        ? 0
        : Number(score);

    if (
      !Number.isFinite(finalScore) ||
      finalScore < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Score must be a valid non-negative number.",
      });
    }

    // =====================================================
    // METADATA VALIDATION
    // =====================================================

    if (
      typeof metadata !== "object" ||
      Array.isArray(metadata) ||
      metadata === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Metadata must be an object.",
      });
    }

    // =====================================================
    // GRID QUEST METADATA VALIDATION
    // =====================================================

    if (game === "Grid Quest") {
      const {
        starsCollected,
        totalStars,
        moves,
      } = metadata;

      if (
        starsCollected !== undefined &&
        (!Number.isFinite(
          Number(starsCollected)
        ) ||
          Number(starsCollected) < 0)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid stars collected.",
        });
      }

      if (
        totalStars !== undefined &&
        (!Number.isFinite(
          Number(totalStars)
        ) ||
          Number(totalStars) < 0)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid total stars.",
        });
      }

      if (
        moves !== undefined &&
        (!Number.isFinite(
          Number(moves)
        ) ||
          Number(moves) < 0)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid move count.",
        });
      }

      if (
        starsCollected !== undefined &&
        totalStars !== undefined &&
        Number(starsCollected) >
          Number(totalStars)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stars collected cannot exceed total stars.",
        });
      }
    }

    // =====================================================
    // NORMAL GAME XP
    // =====================================================

    const xpEarned =
      calculateXP({
        game: game.trim(),
        score: finalScore,
        result,
        difficulty:
          finalDifficulty,
        mode: finalMode,
      });

    // =====================================================
    // GET USER
    // =====================================================

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // =====================================================
    // NORMALIZE USER VALUES
    // =====================================================

    if (!user.stats) {
      user.stats = {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        bestStreak: 0,
        currentStreak: 0,
      };
    }

    user.stats.gamesPlayed =
      Number(
        user.stats.gamesPlayed
      ) || 0;

    user.stats.wins =
      Number(
        user.stats.wins
      ) || 0;

    user.stats.losses =
      Number(
        user.stats.losses
      ) || 0;

    user.stats.bestStreak =
      Number(
        user.stats.bestStreak
      ) || 0;

    user.stats.currentStreak =
      Number(
        user.stats.currentStreak
      ) || 0;

    user.xp =
      Number(user.xp) || 0;

    // =====================================================
    // CREATE GAME RESULT
    // =====================================================

    const gameResult =
      await GameResult.create({
        user: req.user._id,
        game: game.trim(),
        mode: finalMode,
        difficulty:
          finalDifficulty,
        score: finalScore,
        result,
        xpEarned,
        metadata,
      });

    // =====================================================
    // UPDATE NORMAL GAME STATS
    // =====================================================

    user.stats.gamesPlayed += 1;

    user.xp += xpEarned;

    // =====================================================
    // GAME WIN STREAK
    // This is separate from DAILY streak
    // =====================================================

    if (result === "won") {
      user.stats.wins += 1;

      user.stats.currentStreak +=
        1;

      if (
        user.stats
          .currentStreak >
        user.stats.bestStreak
      ) {
        user.stats.bestStreak =
          user.stats.currentStreak;
      }
    }

    if (result === "lost") {
      user.stats.losses += 1;

      user.stats.currentStreak =
        0;
    }

    // "completed" games like Sudoku / Grid Quest
    // do not modify wins/losses/game win streak.

    // =====================================================
    // DAILY ACTIVITY STREAK
    // =====================================================

    updateDailyStreak(user);

    // =====================================================
    // DAILY CHALLENGE
    // =====================================================

    let dailyChallengeCompleted =
      false;

    let dailyChallengeBonusXP = 0;

    let todayChallenge = null;

    try {
      todayChallenge =
        await getTodayChallenge();

      // Initialize old users safely
      if (!user.dailyChallenge) {
        user.dailyChallenge = {
          lastCompletedDate: null,
          totalCompleted: 0,
        };
      }

      user.dailyChallenge.totalCompleted =
        Number(
          user.dailyChallenge
            .totalCompleted
        ) || 0;

      // Has user already completed today's challenge?
      const alreadyCompletedToday =
        user.dailyChallenge
          .lastCompletedDate &&
        isSameUTCDate(
          user.dailyChallenge
            .lastCompletedDate,
          new Date()
        );

      // Check current game result
      const challengeMatched =
        doesResultCompleteChallenge(
          todayChallenge,
          gameResult
        );

      if (
        challengeMatched &&
        !alreadyCompletedToday
      ) {
        dailyChallengeCompleted =
          true;

        dailyChallengeBonusXP =
          Number(
            todayChallenge.bonusXP
          ) || 0;

        // Add challenge reward
        user.xp +=
          dailyChallengeBonusXP;

        // Mark challenge complete
        user.dailyChallenge
          .lastCompletedDate =
          new Date();

        user.dailyChallenge
          .totalCompleted += 1;
      }
    } catch (challengeError) {
      /*
       * IMPORTANT:
       * A daily challenge problem should NOT
       * prevent the player's normal game
       * result from being saved.
       */

      console.error(
        "Daily challenge processing error:",
        challengeError
      );
    }

    // =====================================================
    // UPDATE LEVEL
    // Includes normal XP + challenge bonus XP
    // =====================================================

    user.level =
      Math.floor(
        user.xp / 500
      ) + 1;

    // =====================================================
    // SAVE USER
    // =====================================================

    await user.save();

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================

    const unlockedAchievements =
      await checkAndUnlockAchievements(
        user,
        gameResult
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        dailyChallengeCompleted
          ? `Game saved! Daily challenge completed! +${dailyChallengeBonusXP} bonus XP 🎯`
          : "Game result saved successfully!",

      gameResult,

      unlockedAchievements,

      // =================================================
      // XP INFORMATION
      // =================================================

      rewards: {
        gameXP: xpEarned,

        dailyChallengeXP:
          dailyChallengeBonusXP,

        totalXP:
          xpEarned +
          dailyChallengeBonusXP,
      },

      // =================================================
      // DAILY CHALLENGE INFORMATION
      // =================================================

      dailyChallenge: todayChallenge
        ? {
            id:
              todayChallenge._id,

            title:
              todayChallenge.title,

            description:
              todayChallenge.description,

            game:
              todayChallenge.game,

            difficulty:
              todayChallenge.difficulty,

            challengeType:
              todayChallenge.challengeType,

            target:
              todayChallenge.target,

            bonusXP:
              todayChallenge.bonusXP,

            completed:
              dailyChallengeCompleted,

            alreadyCompleted:
              user.dailyChallenge
                ?.lastCompletedDate
                ? isSameUTCDate(
                    user.dailyChallenge
                      .lastCompletedDate,
                    new Date()
                  )
                : false,
          }
        : null,

      // =================================================
      // USER
      // =================================================

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

        dailyStreak:
          user.dailyStreak,

        dailyChallenge:
          user.dailyChallenge,
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
// =====================================================

const getGameHistory = async (
  req,
  res
) => {
  try {
    const page =
      Math.max(
        parseInt(
          req.query.page,
          10
        ) || 1,
        1
      );

    const requestedLimit =
      parseInt(
        req.query.limit,
        10
      ) || 8;

    const limit =
      Math.min(
        Math.max(
          requestedLimit,
          1
        ),
        50
      );

    const skip =
      (page - 1) * limit;

    const query = {
      user: req.user._id,
    };

    if (
      req.query.game &&
      req.query.game !== "all"
    ) {
      query.game =
        req.query.game;
    }

    const totalGames =
      await GameResult.countDocuments(
        query
      );

    const gameHistory =
      await GameResult.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalPages =
      Math.ceil(
        totalGames / limit
      );

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
        hasMore:
          page < totalPages,
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