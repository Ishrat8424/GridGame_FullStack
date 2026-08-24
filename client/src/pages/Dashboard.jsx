import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

function Dashboard() {
  const { user, loading } = useAuth();

  const [recentGames, setRecentGames] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] =
    useState(true);

  // Fetch game history
  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await api.get("/games/history");

        setRecentGames(response.data.games);
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

  // Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get("/achievements");

        setAchievements(
          response.data.achievements
        );
      } catch (error) {
        console.error(
          "Failed to fetch achievements:",
          error
        );
      } finally {
        setAchievementsLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Loading user
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

  // Real MongoDB user data
  const player = {
    username: user.username,
    level: user.level,
    xp: user.xp,

    nextLevelXP: user.level * 500,

    gamesPlayed:
      user.stats?.gamesPlayed || 0,

    wins:
      user.stats?.wins || 0,

    losses:
      user.stats?.losses || 0,

    bestStreak:
      user.stats?.bestStreak || 0,
  };

  const winRate =
    player.gamesPlayed > 0
      ? Math.round(
          (player.wins /
            player.gamesPlayed) *
            100
        )
      : 0;

  const xpPercentage = Math.min(
    (player.xp /
      player.nextLevelXP) *
      100,
    100
  );

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-12 pt-28 md:px-12">

        {/* HEADER */}
        <section className="mb-10">

          <p className="font-mono font-black tracking-[0.2em]">
            PLAYER DASHBOARD
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-2">
            Hey, {player.username}! 👋
          </h1>

          <p className="text-lg mt-3">
            Ready for another
            brain-training session?
          </p>

        </section>

        {/* PLAYER LEVEL */}
        <section className="bg-pink-500 border-2 border-slate-950 rounded-3xl p-7 md:p-9 shadow-[7px_7px_0_#111827]">

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

          {/* XP BAR */}
          <div className="mt-7 h-6 bg-white border-2 border-slate-950 rounded-full overflow-hidden">

            <div
              className="h-full bg-cyan-300 transition-all duration-500"
              style={{
                width: `${xpPercentage}%`,
              }}
            />

          </div>

        </section>

        {/* STAT CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

          <StatCard
            icon="🎮"
            value={player.gamesPlayed}
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
            value={player.bestStreak}
            label="Best Streak"
            color="bg-violet-200"
          />

        </section>

        {/* RECENT GAMES + ACHIEVEMENTS */}
        <section className="grid lg:grid-cols-2 gap-8 mt-12">

          {/* RECENT GAMES */}
          <div>

            <div className="flex items-end justify-between mb-5">

              <div>

                <p className="font-mono font-bold tracking-widest text-sm">
                  YOUR ACTIVITY
                </p>

                <h2 className="text-3xl font-black">
                  Recent Games
                </h2>

              </div>

              <button
                type="button"
                className="font-black hover:text-pink-600"
              >
                VIEW ALL →
              </button>

            </div>

            <div className="space-y-4">

              {historyLoading ? (

                <div className="bg-white border-2 border-slate-950 rounded-2xl p-6">

                  <p className="font-black">
                    Loading recent games...
                  </p>

                </div>

              ) : recentGames.length === 0 ? (

                <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]">

                  <p className="font-black text-xl">
                    No games played yet 🎮
                  </p>

                  <p className="text-slate-600 mt-2">
                    Play your first GameGrid
                    challenge to see your
                    activity here.
                  </p>

                </div>

              ) : (

                recentGames.map((game) => (

                  <div
                    key={game._id}
                    className="bg-white border-2 border-slate-950 rounded-2xl p-5 flex items-center justify-between shadow-[4px_4px_0_#111827]"
                  >

                    <div className="flex items-center gap-4">

                      <div className="text-4xl">
                        {getGameIcon(
                          game.game
                        )}
                      </div>

                      <div>

                        <h3 className="font-black text-xl">
                          {game.game}
                        </h3>

                        <p className="font-semibold text-slate-600">
                          {formatResult(
                            game.result
                          )}{" "}
                          • Score{" "}
                          {game.score}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(
                            game.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="font-black text-lg">
                      +{game.xpEarned} XP
                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

          {/* ACHIEVEMENTS */}
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

                <div className="bg-white border-2 border-slate-950 rounded-2xl p-6">

                  <p className="font-black">
                    Loading achievements...
                  </p>

                </div>

              ) : achievements.length === 0 ? (

                <div className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]">

                  <p className="font-black text-xl">
                    No achievements yet 🏆
                  </p>

                  <p className="text-slate-600 mt-2">
                    Keep playing GameGrid to
                    unlock your first
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
                          {
                            achievement.title
                          }
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

        {/* QUICK PLAY */}
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
                Play another challenge and
                earn more XP.
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

// STAT CARD
function StatCard({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div
      className={`${color} border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0_#111827]`}
    >

      <div className="text-4xl">
        {icon}
      </div>

      <p className="text-4xl font-black mt-4">
        {value}
      </p>

      <p className="font-bold mt-1">
        {label}
      </p>

    </div>
  );
}

// GAME ICON
function getGameIcon(gameName) {
  const icons = {
    "Math Blast": "🧮",
    "Toon Tac Toe": "⭕",
    "Flip & Match": "🃏",
    "Pattern Puzzle": "🧠",
    "Grid Quest": "🧭",
    "Sudoku Mini": "🔢",
  };

  return icons[gameName] || "🎮";
}

// FORMAT RESULT
function formatResult(result) {
  if (result === "won") {
    return "Won";
  }

  if (result === "lost") {
    return "Lost";
  }

  return "Completed";
}

// FORMAT DATE
function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleDateString();
}

export default Dashboard;