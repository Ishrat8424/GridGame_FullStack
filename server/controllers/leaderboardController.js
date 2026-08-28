const User = require("../models/User");

// =====================================================
// GET GLOBAL LEADERBOARD
// GET /api/leaderboard
// =====================================================

const getLeaderboard = async (req, res) => {
  try {
    // Optional query:
    // /api/leaderboard?limit=20

    let limit = Number(req.query.limit) || 20;

    // Prevent huge requests
    limit = Math.min(Math.max(limit, 1), 100);

    // =====================================================
    // FETCH TOP PLAYERS
    // =====================================================

    const users = await User.find()
      .select(
        "username avatar xp level stats.gamesPlayed stats.wins stats.losses stats.bestStreak"
      )
      .sort({
        xp: -1,
        "stats.wins": -1,
        "stats.gamesPlayed": 1,
        createdAt: 1,
      })
      .limit(limit)
      .lean();

    // =====================================================
    // FORMAT LEADERBOARD
    // =====================================================

    const leaderboard = users.map((user, index) => {
      const gamesPlayed =
        Number(user.stats?.gamesPlayed) || 0;

      const wins =
        Number(user.stats?.wins) || 0;

      const losses =
        Number(user.stats?.losses) || 0;

      const bestStreak =
        Number(user.stats?.bestStreak) || 0;

      const winRate =
        gamesPlayed > 0
          ? Math.round(
              (wins / gamesPlayed) * 100
            )
          : 0;

      return {
        rank: index + 1,

        _id: user._id,

        username: user.username,

        avatar:
          user.avatar || "🦊",

        xp:
          Number(user.xp) || 0,

        level:
          Number(user.level) || 1,

        stats: {
          gamesPlayed,
          wins,
          losses,
          bestStreak,
          winRate,
        },
      };
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      count:
        leaderboard.length,

      leaderboard,
    });
  } catch (error) {
    console.error(
      "Leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load leaderboard.",
    });
  }
};

module.exports = {
  getLeaderboard,
};