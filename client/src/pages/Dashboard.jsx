import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

function Dashboard() {
  const {
    user,
    loading,
  } = useAuth();

  const [
    recentGames,
    setRecentGames,
  ] = useState([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    achievements,
    setAchievements,
  ] = useState([]);

  const [
    achievementsLoading,
    setAchievementsLoading,
  ] = useState(true);

  // =====================================================
  // FETCH RECENT 8 GAMES
  // =====================================================

  useEffect(() => {
    const fetchGameHistory =
      async () => {
        try {
          setHistoryLoading(true);

          const response =
            await api.get(
              "/games/history?page=1&limit=8"
            );

          setRecentGames(
            response.data.games || []
          );
        } catch (error) {
          console.error(
            "Failed to fetch game history:",
            error
          );
        } finally {
          setHistoryLoading(false);
        }
      };

    if (user) {
      fetchGameHistory();
    }
  }, [user]);

  // =====================================================
  // FETCH ACHIEVEMENTS
  // =====================================================

  useEffect(() => {
    const fetchAchievements =
      async () => {
        try {
          const response =
            await api.get(
              "/achievements"
            );

          setAchievements(
            response.data
              .achievements || []
          );
        } catch (error) {
          console.error(
            "Failed to fetch achievements:",
            error
          );
        } finally {
          setAchievementsLoading(
            false
          );
        }
      };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">

        <p className="text-2xl font-black">
          Loading player...
        </p>

      </div>
    );
  }

  if (!user) {
    return null;
  }

  // =====================================================
  // PLAYER
  // =====================================================

  const player = {
    username:
      user.username,

    level:
      user.level || 1,

    xp:
      user.xp || 0,

    nextLevelXP:
      (user.level || 1) * 500,

    gamesPlayed:
      user.stats?.gamesPlayed || 0,

    wins:
      user.stats?.wins || 0,

    losses:
      user.stats?.losses || 0,

    bestStreak:
      user.stats?.bestStreak || 0,
  };

  // =====================================================
  // WIN RATE
  // =====================================================

  const winRate =
    player.gamesPlayed > 0
      ? Math.round(
          (player.wins /
            player.gamesPlayed) *
            100
        )
      : 0;

  // =====================================================
  // XP
  // =====================================================

  const xpPercentage =
    Math.min(
      (player.xp /
        player.nextLevelXP) *
        100,
      100
    );

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-7xl px-5 sm:px-6 pb-12 pt-28 md:px-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-10">

          <p className="font-mono font-black tracking-[0.2em]">
            PLAYER DASHBOARD
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-2">
            Hey, {player.username}! 👋
          </h1>

          <p className="text-lg mt-3">
            Ready for another
            brain-training session?
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <a
              href="/#games"
              className="inline-flex items-center gap-2 bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[4px_4px_0_#ec4899] hover:-translate-y-1 transition"
            >
              <span aria-hidden="true">🎮</span>
              Start playing
            </a>

            <Link
              to="/activity"
              className="inline-flex items-center gap-2 bg-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black hover:-translate-y-1 transition"
            >
              <span aria-hidden="true">📊</span>
              View activity
            </Link>

          </div>

        </section>

        {/* =================================================
            LEVEL
        ================================================= */}

        <section className="bg-pink-500 border-2 border-slate-950 rounded-3xl p-6 md:p-9 shadow-[7px_7px_0_#111827]">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 bg-yellow-300 border-2 border-slate-950 rounded-full flex items-center justify-center text-4xl">
                {user.avatar || "🎮"}
              </div>

              <div>

                <p className="font-black tracking-widest">
                  CURRENT LEVEL
                </p>

                <h2 className="text-4xl font-black">
                  Level {player.level}
                </h2>

              </div>

            </div>

            <div className="md:text-right">

              <p className="font-black text-xl">
                {player.xp} /{" "}
                {player.nextLevelXP} XP
              </p>

              <p className="font-semibold">
                {Math.max(
                  player.nextLevelXP -
                    player.xp,
                  0
                )}{" "}
                XP until next level
              </p>

            </div>

          </div>

          <div
            className="mt-7 h-6 bg-white border-2 border-slate-950 rounded-full overflow-hidden"
            role="progressbar"
            aria-label={`Experience progress to level ${player.level + 1}`}
            aria-valuemin="0"
            aria-valuemax={player.nextLevelXP}
            aria-valuenow={Math.min(player.xp, player.nextLevelXP)}
          >

            <div
              className="h-full bg-cyan-300 transition-all duration-500"
              style={{
                width:
                  `${xpPercentage}%`,
              }}
            />

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">

          <StatCard
            icon="🎮"
            value={
              player.gamesPlayed
            }
            label="Games Played"
            color="bg-cyan-300"
          />

          <StatCard
            icon="🏆"
            value={player.wins}
            label="Wins"
            color="bg-orange-300"
          />

          <StatCard
            icon="📈"
            value={`${winRate}%`}
            label="Win Rate"
            color="bg-emerald-200"
          />

          <StatCard
            icon="🔥"
            value={
              player.bestStreak
            }
            label="Best Streak"
            color="bg-violet-200"
          />

        </section>

        {/* =================================================
            ACTIVITY + ACHIEVEMENTS
        ================================================= */}

        <section className="grid lg:grid-cols-2 gap-8 mt-12">

          {/* ===============================================
              RECENT ACTIVITY
          =============================================== */}

          <div>

            <div className="flex items-end justify-between gap-4 mb-5">

              <div>

                <p className="font-mono font-bold tracking-widest text-sm">
                  YOUR ACTIVITY
                </p>

                <h2 className="text-3xl font-black">
                  Recent Games
                </h2>

              </div>

              <Link
                to="/activity"
                className="font-black whitespace-nowrap hover:text-pink-600 transition"
              >
                VIEW ALL →
              </Link>

            </div>

            <div className="space-y-4">

              {historyLoading ? (

                <ActivityMessage>
                  Loading recent games...
                </ActivityMessage>

              ) : recentGames.length ===
                0 ? (

                <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]">

                  <p className="font-black text-xl">
                    No games played yet 🎮
                  </p>

                  <p className="text-slate-600 mt-2">
                    Play your first
                    GameGrid challenge
                    to see your activity
                    here.
                  </p>

                  <a
                    href="/#games"
                    className="inline-flex mt-5 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-4 py-2 font-black hover:-translate-y-1 transition"
                  >
                    Choose a game →
                  </a>

                </div>

              ) : (

                recentGames.map(
                  (game) => (

                    <GameActivityCard
                      key={game._id}
                      game={game}
                    />

                  )
                )

              )}

            </div>

          </div>

          {/* ===============================================
              ACHIEVEMENTS
          =============================================== */}

          <div>

            <div className="mb-5">

              <p className="font-mono font-bold tracking-widest text-sm">
                TROPHY CABINET
              </p>

              <h2 className="text-3xl font-black">
                Achievements
              </h2>

            </div>

            <div className="space-y-4">

              {achievementsLoading ? (

                <ActivityMessage>
                  Loading achievements...
                </ActivityMessage>

              ) : achievements.length ===
                0 ? (

                <div className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]">

                  <p className="font-black text-xl">
                    No achievements yet 🏆
                  </p>

                  <p className="text-slate-600 mt-2">
                    Keep playing GameGrid
                    to unlock your first
                    achievement.
                  </p>

                </div>

              ) : (

                achievements.map(
                  (achievement) => (

                    <div
                      key={
                        achievement._id
                      }
                      className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-5 flex items-center gap-5 shadow-[4px_4px_0_#111827]"
                    >

                      <div className="w-16 h-16 shrink-0 bg-yellow-300 border-2 border-slate-950 rounded-full flex items-center justify-center text-3xl">

                        {achievement.icon}

                      </div>

                      <div>

                        <h3 className="font-black text-xl">
                          {achievement.title}
                        </h3>

                        <p className="text-slate-600">
                          {
                            achievement.description
                          }
                        </p>

                        {achievement.unlockedAt && (

                          <p className="text-xs text-slate-500 mt-1">
                            Unlocked{" "}
                            {formatDate(
                              achievement.unlockedAt
                            )}
                          </p>

                        )}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK PLAY
        ================================================= */}

        <section className="mt-14 bg-slate-950 text-white rounded-3xl border-2 border-slate-950 p-8 md:p-10 shadow-[7px_7px_0_#ec4899]">

          <p className="text-cyan-300 font-mono font-bold tracking-widest">
            BACK TO THE ARCADE
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-2">

            <div>

              <h2 className="text-4xl font-black">
                Ready to Level Up?
              </h2>

              <p className="text-slate-300 mt-2">
                Play another challenge
                and earn more XP.
              </p>

            </div>

            <a
              href="/#games"
              className="bg-yellow-300 text-slate-950 border-2 border-white rounded-xl px-7 py-3 font-black hover:-translate-y-1 transition text-center"
            >
              🎮 PLAY NOW
            </a>

          </div>

        </section>

      </main>

    </div>
  );
}

// =====================================================
// ACTIVITY CARD
// =====================================================

function GameActivityCard({
  game,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#111827]">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3 sm:gap-4 min-w-0">

          <div className="text-3xl sm:text-4xl shrink-0">
            {getGameIcon(
              game.game
            )}
          </div>

          <div className="min-w-0">

            <h3 className="font-black text-lg sm:text-xl">
              {game.game}
            </h3>

            <p className="font-semibold text-sm sm:text-base text-slate-600 mt-1">

              {formatResult(
                game.result
              )}

              {game.mode &&
                game.mode !==
                  "normal" && (
                  <>
                    {" • "}
                    {formatMode(
                      game.mode
                    )}
                  </>
                )}

              {game.difficulty &&
                game.difficulty !==
                  "normal" && (
                  <>
                    {" • "}
                    {formatDifficulty(
                      game.difficulty
                    )}
                  </>
                )}

            </p>

            <p className="font-bold text-sm mt-1">
              Score {game.score}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {formatDate(
                game.createdAt
              )}
            </p>

          </div>

        </div>

        <div className="font-black text-base sm:text-lg whitespace-nowrap">
          +{game.xpEarned || 0} XP
        </div>

      </div>

    </div>
  );
}

// =====================================================
// MESSAGE
// =====================================================

function ActivityMessage({
  children,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-2xl p-6">
      <p className="font-black">
        {children}
      </p>
    </div>
  );
}

// =====================================================
// STAT
// =====================================================

function StatCard({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div
      className={`${color} border-2 border-slate-950 rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0_#111827]`}
    >

      <div className="text-3xl sm:text-4xl">
        {icon}
      </div>

      <p className="text-3xl sm:text-4xl font-black mt-4">
        {value}
      </p>

      <p className="font-bold mt-1 text-sm sm:text-base">
        {label}
      </p>

    </div>
  );
}

// =====================================================
// HELPERS
// =====================================================

function getGameIcon(gameName) {
  const icons = {
    "Math Blast": "🧮",
    "Toon Tac Toe": "⭕",
    "Flip & Match": "🃏",
    "Pattern Puzzle": "🧠",
    "Grid Quest": "🧭",
    "Sudoku Mini": "🔢",
  };

  return (
    icons[gameName] ||
    "🎮"
  );
}

function formatResult(result) {
  if (result === "won") {
    return "Won";
  }

  if (result === "lost") {
    return "Lost";
  }

  return "Completed";
}

function formatDifficulty(
  difficulty
) {
  if (!difficulty) {
    return "";
  }

  return (
    difficulty
      .charAt(0)
      .toUpperCase() +
    difficulty.slice(1)
  );
}

function formatMode(mode) {
  if (mode === "computer") {
    return "Vs Computer";
  }

  if (mode === "solo") {
    return "Solo";
  }

  return "";
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default Dashboard;