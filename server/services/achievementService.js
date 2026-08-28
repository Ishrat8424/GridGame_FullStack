const Achievement = require("../models/Achievement");

const achievementRules = [
  // =====================================================
  // GENERAL ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "first_win",
    title: "First Win",
    description: "Win your first GameGrid game.",
    icon: "🏆",

    check: (user) =>
      user.stats.wins >= 1,
  },

  {
    achievementId: "getting_started",
    title: "Getting Started",
    description: "Play 5 GameGrid games.",
    icon: "🎮",

    check: (user) =>
      user.stats.gamesPlayed >= 5,
  },

  {
    achievementId: "hot_streak",
    title: "Hot Streak",
    description: "Win 5 games in a row.",
    icon: "🔥",

    check: (user) =>
      user.stats.bestStreak >= 5,
  },

  {
    achievementId: "brain_trainer",
    title: "Brain Trainer",
    description: "Play 25 GameGrid games.",
    icon: "🧠",

    check: (user) =>
      user.stats.gamesPlayed >= 25,
  },

  {
    achievementId: "arcade_master",
    title: "Arcade Master",
    description: "Win 50 GameGrid games.",
    icon: "👑",

    check: (user) =>
      user.stats.wins >= 50,
  },

  {
    achievementId: "xp_hunter",
    title: "XP Hunter",
    description: "Earn 1000 XP.",
    icon: "⭐",

    check: (user) =>
      user.xp >= 1000,
  },

  // =====================================================
  // TOON TAC TOE ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "medium_master",
    title: "Medium Master",
    description:
      "Win a Toon Tac Toe match on Medium difficulty.",
    icon: "😎",

    checkGame: (gameResult) =>
      gameResult.game === "Toon Tac Toe" &&
      gameResult.difficulty === "medium" &&
      gameResult.result === "won",
  },

  {
    achievementId: "hard_survivor",
    title: "Hard Survivor",
    description:
      "Force a draw against Hard Toon Tac Toe AI.",
    icon: "🛡️",

    checkGame: (gameResult) =>
      gameResult.game === "Toon Tac Toe" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "hard_victory",
    title: "Hard Victory",
    description:
      "Defeat Toon Tac Toe on Hard difficulty.",
    icon: "👑",

    checkGame: (gameResult) =>
      gameResult.game === "Toon Tac Toe" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "won",
  },

  // =====================================================
  // SUDOKU MINI ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "sudoku_starter",
    title: "Sudoku Starter",
    description:
      "Complete your first Sudoku Mini puzzle.",
    icon: "🔢",

    checkGame: (gameResult) =>
      gameResult.game === "Sudoku Mini" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "sudoku_medium_solver",
    title: "4x4 Solver",
    description:
      "Complete a Medium 4x4 Sudoku Mini puzzle.",
    icon: "😎",

    checkGame: (gameResult) =>
      gameResult.game === "Sudoku Mini" &&
      gameResult.difficulty === "medium" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "sudoku_logic_master",
    title: "Logic Master",
    description:
      "Complete a Hard 6x6 Sudoku Mini puzzle.",
    icon: "🧠",

    checkGame: (gameResult) =>
      gameResult.game === "Sudoku Mini" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "sudoku_perfect_solver",
    title: "Perfect Solver",
    description:
      "Score 1200 points on a Hard Sudoku Mini puzzle.",
    icon: "✨",

    checkGame: (gameResult) =>
      gameResult.game === "Sudoku Mini" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed" &&
      gameResult.score >= 1200,
  },

  // =====================================================
  // FLIP & MATCH ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "memory_rookie",
    title: "Memory Rookie",
    description:
      "Complete your first Flip & Match game.",
    icon: "🃏",

    checkGame: (gameResult) =>
      gameResult.game === "Flip & Match",
  },

  {
    achievementId: "memory_master",
    title: "Memory Master",
    description:
      "Score 850 or more in Solo Flip & Match.",
    icon: "🧠",

    checkGame: (gameResult) =>
      gameResult.game === "Flip & Match" &&
      gameResult.mode === "solo" &&
      gameResult.score >= 850,
  },

  {
    achievementId: "ai_challenger",
    title: "AI Challenger",
    description:
      "Win a Flip & Match game against the computer.",
    icon: "🤖",

    checkGame: (gameResult) =>
      gameResult.game === "Flip & Match" &&
      gameResult.mode === "computer" &&
      gameResult.result === "won",
  },

  {
    achievementId: "hard_memory_master",
    title: "Hard Memory Master",
    description:
      "Defeat the Flip & Match computer on Hard difficulty.",
    icon: "🏆",

    checkGame: (gameResult) =>
      gameResult.game === "Flip & Match" &&
      gameResult.mode === "computer" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "won",
  },

  // =====================================================
  // PATTERN PUZZLE ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "pattern_beginner",
    title: "Pattern Beginner",
    description:
      "Complete your first Pattern Puzzle challenge.",
    icon: "🧩",

    checkGame: (gameResult) =>
      gameResult.game === "Pattern Puzzle" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "pattern_medium_master",
    title: "Pattern Master",
    description:
      "Complete a Medium Pattern Puzzle challenge.",
    icon: "😎",

    checkGame: (gameResult) =>
      gameResult.game === "Pattern Puzzle" &&
      gameResult.difficulty === "medium" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "pattern_logic_pro",
    title: "Logic Pro",
    description:
      "Complete a Hard Pattern Puzzle challenge.",
    icon: "🧠",

    checkGame: (gameResult) =>
      gameResult.game === "Pattern Puzzle" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "pattern_perfectionist",
    title: "Pattern Perfectionist",
    description:
      "Score 1300 or more on Hard Pattern Puzzle.",
    icon: "✨",

    checkGame: (gameResult) =>
      gameResult.game === "Pattern Puzzle" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed" &&
      gameResult.score >= 1300,
  },

  // =====================================================
  // GRID QUEST ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "grid_first_explorer",
    title: "First Explorer",
    description:
      "Complete your first Grid Quest maze.",
    icon: "🧭",

    checkGame: (gameResult) =>
      gameResult.game === "Grid Quest" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "grid_medium_explorer",
    title: "Maze Explorer",
    description:
      "Complete a Medium Grid Quest maze.",
    icon: "🗺️",

    checkGame: (gameResult) =>
      gameResult.game === "Grid Quest" &&
      gameResult.difficulty === "medium" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "grid_hard_master",
    title: "Maze Master",
    description:
      "Complete a Hard Grid Quest maze.",
    icon: "🧠",

    checkGame: (gameResult) =>
      gameResult.game === "Grid Quest" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed",
  },

  {
    achievementId: "grid_score_master",
    title: "Grid Champion",
    description:
      "Score 1500 or more in Grid Quest.",
    icon: "🏆",

    checkGame: (gameResult) =>
      gameResult.game === "Grid Quest" &&
      gameResult.result === "completed" &&
      gameResult.score >= 1500,
  },

  {
    achievementId: "grid_hard_legend",
    title: "Grid Legend",
    description:
      "Score 2000 or more on Hard Grid Quest.",
    icon: "👑",

    checkGame: (gameResult) =>
      gameResult.game === "Grid Quest" &&
      gameResult.difficulty === "hard" &&
      gameResult.result === "completed" &&
      gameResult.score >= 2000,
  },

  // =====================================================
  // GRID QUEST METADATA ACHIEVEMENTS
  // =====================================================

  {
    achievementId: "grid_star_collector",
    title: "Star Collector",
    description:
      "Collect every star in a Grid Quest maze.",
    icon: "⭐",

    checkGame: (gameResult) => {
      if (
        gameResult.game !== "Grid Quest" ||
        gameResult.result !== "completed"
      ) {
        return false;
      }

      const metadata =
        gameResult.metadata || {};

      const starsCollected =
        Number(metadata.starsCollected) || 0;

      const totalStars =
        Number(metadata.totalStars) || 0;

      return (
        totalStars > 0 &&
        starsCollected === totalStars
      );
    },
  },

  {
    achievementId: "grid_efficient_explorer",
    title: "Efficient Explorer",
    description:
      "Complete a Grid Quest maze in 25 moves or fewer.",
    icon: "👣",

    checkGame: (gameResult) => {
      if (
        gameResult.game !== "Grid Quest" ||
        gameResult.result !== "completed"
      ) {
        return false;
      }

      const metadata =
        gameResult.metadata || {};

      const moves =
        Number(metadata.moves);

      if (
        !Number.isFinite(moves)
      ) {
        return false;
      }

      return moves <= 25;
    },
  },

  {
    achievementId: "grid_perfect_quest",
    title: "Perfect Quest",
    description:
      "Collect every star and finish Grid Quest in 25 moves or fewer.",
    icon: "💎",

    checkGame: (gameResult) => {
      if (
        gameResult.game !== "Grid Quest" ||
        gameResult.result !== "completed"
      ) {
        return false;
      }

      const metadata =
        gameResult.metadata || {};

      const starsCollected =
        Number(metadata.starsCollected) || 0;

      const totalStars =
        Number(metadata.totalStars) || 0;

      const moves =
        Number(metadata.moves);

      const collectedAllStars =
        totalStars > 0 &&
        starsCollected === totalStars;

      const efficient =
        Number.isFinite(moves) &&
        moves <= 25;

      return (
        collectedAllStars &&
        efficient
      );
    },
  },

  {
    achievementId: "grid_hard_star_master",
    title: "Hard Star Master",
    description:
      "Collect every star in a Hard Grid Quest maze.",
    icon: "🌟",

    checkGame: (gameResult) => {
      if (
        gameResult.game !== "Grid Quest" ||
        gameResult.difficulty !== "hard" ||
        gameResult.result !== "completed"
      ) {
        return false;
      }

      const metadata =
        gameResult.metadata || {};

      const starsCollected =
        Number(metadata.starsCollected) || 0;

      const totalStars =
        Number(metadata.totalStars) || 0;

      return (
        totalStars > 0 &&
        starsCollected === totalStars
      );
    },
  },
];

// =====================================================
// CHECK AND UNLOCK ACHIEVEMENTS
// =====================================================

const checkAndUnlockAchievements = async (
  user,
  gameResult = null
) => {
  const unlockedAchievements = [];

  for (const rule of achievementRules) {
    let unlocked = false;

    // =================================================
    // GENERAL USER ACHIEVEMENT
    // =================================================

    if (
      typeof rule.check === "function" &&
      rule.check(user)
    ) {
      unlocked = true;
    }

    // =================================================
    // GAME-SPECIFIC ACHIEVEMENT
    // =================================================

    if (
      typeof rule.checkGame === "function" &&
      gameResult &&
      rule.checkGame(gameResult)
    ) {
      unlocked = true;
    }

    // =================================================
    // NOT UNLOCKED
    // =================================================

    if (!unlocked) {
      continue;
    }

    // =================================================
    // CHECK IF ALREADY UNLOCKED
    // =================================================

    const existingAchievement =
      await Achievement.findOne({
        user: user._id,
        achievementId:
          rule.achievementId,
      });

    if (existingAchievement) {
      continue;
    }

    // =================================================
    // CREATE ACHIEVEMENT
    // =================================================

    const achievement =
      await Achievement.create({
        user: user._id,

        achievementId:
          rule.achievementId,

        title:
          rule.title,

        description:
          rule.description,

        icon:
          rule.icon,
      });

    unlockedAchievements.push(
      achievement
    );
  }

  return unlockedAchievements;
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  checkAndUnlockAchievements,
};