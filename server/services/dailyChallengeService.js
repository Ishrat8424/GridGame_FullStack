const DailyChallenge =
  require("../models/DailyChallenge");

// =====================================================
// CHALLENGE POOL
// =====================================================

const challengePool = [
  {
    title: "Math Master",
    description:
      "Score at least 600 points in Math Blast.",
    game: "Math Blast",
    difficulty: "medium",
    challengeType: "score",
    target: 600,
    bonusXP: 50,
  },

  {
    title: "Quick Calculator",
    description:
      "Score at least 300 points in Math Blast.",
    game: "Math Blast",
    difficulty: "easy",
    challengeType: "score",
    target: 300,
    bonusXP: 30,
  },

  {
    title: "Tic Tac Toe Warrior",
    description:
      "Win a Medium Toon Tac Toe match.",
    game: "Toon Tac Toe",
    difficulty: "medium",
    challengeType: "win",
    target: 1,
    bonusXP: 50,
  },

  {
    title: "Impossible Challenger",
    description:
      "Win a Hard Toon Tac Toe match.",
    game: "Toon Tac Toe",
    difficulty: "hard",
    challengeType: "win",
    target: 1,
    bonusXP: 80,
  },

  {
    title: "Memory Champion",
    description:
      "Score at least 500 points in Flip & Match.",
    game: "Flip & Match",
    difficulty: "medium",
    challengeType: "score",
    target: 500,
    bonusXP: 50,
  },

  {
    title: "Sudoku Solver",
    description:
      "Complete a Medium Sudoku Mini puzzle.",
    game: "Sudoku Mini",
    difficulty: "medium",
    challengeType: "play",
    target: 1,
    bonusXP: 50,
  },

  {
    title: "Pattern Hunter",
    description:
      "Score at least 750 points in Pattern Puzzle.",
    game: "Pattern Puzzle",
    difficulty: "medium",
    challengeType: "score",
    target: 750,
    bonusXP: 55,
  },

  {
    title: "Grid Explorer",
    description:
      "Complete Grid Quest on Medium difficulty.",
    game: "Grid Quest",
    difficulty: "medium",
    challengeType: "play",
    target: 1,
    bonusXP: 60,
  },

  {
    title: "Grid Master",
    description:
      "Score at least 1500 points in Grid Quest.",
    game: "Grid Quest",
    difficulty: "hard",
    challengeType: "score",
    target: 1500,
    bonusXP: 80,
  },
];

// =====================================================
// GET DATE KEY
// =====================================================

function getDateKey(date = new Date()) {
  const year =
    date.getUTCFullYear();

  const month =
    String(
      date.getUTCMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getUTCDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// =====================================================
// GET DAY NUMBER
// Used to choose the same challenge for everyone
// on the same UTC calendar day.
// =====================================================

function getDayNumber(date = new Date()) {
  const utcDate =
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );

  return Math.floor(
    utcDate /
      (1000 * 60 * 60 * 24)
  );
}

// =====================================================
// GET / CREATE TODAY'S CHALLENGE
// =====================================================

async function getTodayChallenge() {
  const now = new Date();

  const dateKey =
    getDateKey(now);

  // Check if today's challenge already exists
  let challenge =
    await DailyChallenge.findOne({
      dateKey,
      active: true,
    });

  if (challenge) {
    return challenge;
  }

  // Pick challenge deterministically
  const index =
    getDayNumber(now) %
    challengePool.length;

  const selectedChallenge =
    challengePool[index];

  try {
    challenge =
      await DailyChallenge.create({
        dateKey,
        ...selectedChallenge,
      });

    return challenge;
  } catch (error) {
    // Two requests may try to create the same
    // daily challenge at the same time.
    if (error.code === 11000) {
      challenge =
        await DailyChallenge.findOne({
          dateKey,
        });

      if (challenge) {
        return challenge;
      }
    }

    throw error;
  }
}

// =====================================================
// CHECK WHETHER GAME RESULT COMPLETES CHALLENGE
// =====================================================

function doesResultCompleteChallenge(
  challenge,
  gameResult
) {
  if (!challenge || !gameResult) {
    return false;
  }

  // Correct game
  if (
    gameResult.game !==
    challenge.game
  ) {
    return false;
  }

  // Correct difficulty
  if (
    challenge.difficulty &&
    challenge.difficulty !==
      "normal" &&
    gameResult.difficulty !==
      challenge.difficulty
  ) {
    return false;
  }

  // =====================================================
  // PLAY / COMPLETE CHALLENGE
  // =====================================================

  if (
    challenge.challengeType ===
    "play"
  ) {
    return (
      gameResult.result ===
        "completed" ||
      gameResult.result ===
        "won"
    );
  }

  // =====================================================
  // SCORE CHALLENGE
  // =====================================================

  if (
    challenge.challengeType ===
    "score"
  ) {
    return (
      Number(gameResult.score) >=
      Number(challenge.target)
    );
  }

  // =====================================================
  // WIN CHALLENGE
  // =====================================================

  if (
    challenge.challengeType ===
    "win"
  ) {
    return (
      gameResult.result === "won"
    );
  }

  return false;
}

// =====================================================
// DATE HELPERS
// =====================================================

function isSameUTCDate(
  dateA,
  dateB
) {
  if (!dateA || !dateB) {
    return false;
  }

  return (
    getDateKey(
      new Date(dateA)
    ) ===
    getDateKey(
      new Date(dateB)
    )
  );
}

function isYesterdayUTC(
  previousDate,
  currentDate = new Date()
) {
  if (!previousDate) {
    return false;
  }

  const yesterday =
    new Date(currentDate);

  yesterday.setUTCDate(
    yesterday.getUTCDate() - 1
  );

  return (
    getDateKey(
      new Date(previousDate)
    ) ===
    getDateKey(yesterday)
  );
}

// =====================================================
// UPDATE DAILY STREAK
// =====================================================

function updateDailyStreak(
  user,
  now = new Date()
) {
  if (!user.dailyStreak) {
    user.dailyStreak = {
      current: 0,
      longest: 0,
      lastActiveDate: null,
    };
  }

  const lastActive =
    user.dailyStreak
      .lastActiveDate;

  // Already counted today
  if (
    lastActive &&
    isSameUTCDate(
      lastActive,
      now
    )
  ) {
    return;
  }

  // Continued from yesterday
  if (
    lastActive &&
    isYesterdayUTC(
      lastActive,
      now
    )
  ) {
    user.dailyStreak.current =
      (Number(
        user.dailyStreak
          .current
      ) || 0) + 1;
  } else {
    // First activity or streak broken
    user.dailyStreak.current =
      1;
  }

  user.dailyStreak.longest =
    Math.max(
      Number(
        user.dailyStreak
          .longest
      ) || 0,

      Number(
        user.dailyStreak
          .current
      ) || 0
    );

  user.dailyStreak.lastActiveDate =
    now;
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getTodayChallenge,
  doesResultCompleteChallenge,
  updateDailyStreak,
  getDateKey,
  isSameUTCDate,
};