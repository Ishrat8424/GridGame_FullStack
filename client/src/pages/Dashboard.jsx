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

  // =====================================================
  // RECENT GAMES
  // =====================================================

  const [
    recentGames,
    setRecentGames,
  ] = useState([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  const [
    achievements,
    setAchievements,
  ] = useState([]);

  const [
    achievementsLoading,
    setAchievementsLoading,
  ] = useState(true);

  // =====================================================
  // DAILY CHALLENGE
  // =====================================================

  const [
    dailyChallenge,
    setDailyChallenge,
  ] = useState(null);

  const [
    dailyChallengeLoading,
    setDailyChallengeLoading,
  ] = useState(true);

  const [
    dailyChallengeError,
    setDailyChallengeError,
  ] = useState("");

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
          setAchievementsLoading(
            true
          );

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
  // FETCH DAILY CHALLENGE
  // =====================================================

  useEffect(() => {
    const fetchDailyChallenge =
      async () => {
        try {
          setDailyChallengeLoading(
            true
          );

          setDailyChallengeError(
            ""
          );

          const response =
            await api.get(
              "/daily-challenge"
            );

          setDailyChallenge({
            challenge:
              response.data
                .challenge || null,

            streak:
              response.data
                .streak || {
                current: 0,
                longest: 0,
                lastActiveDate:
                  null,
              },

            stats:
              response.data
                .stats || {
                totalCompleted: 0,
              },
          });
        } catch (error) {
          console.error(
            "Failed to fetch daily challenge:",
            error
          );

          setDailyChallengeError(
            error.response?.data
              ?.message ||
              "Daily challenge unavailable."
          );
        } finally {
          setDailyChallengeLoading(
            false
          );
        }
      };

    if (user) {
      fetchDailyChallenge();
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

    gamesPlayed:
      user.stats
        ?.gamesPlayed || 0,

    wins:
      user.stats
        ?.wins || 0,

    losses:
      user.stats
        ?.losses || 0,

    bestStreak:
      user.stats
        ?.bestStreak || 0,
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
  // XP PROGRESS
  // Backend level formula:
  // Math.floor(totalXP / 500) + 1
  // =====================================================

  const XP_PER_LEVEL = 500;

  const currentLevelStartXP =
    (player.level - 1) *
    XP_PER_LEVEL;

  const nextLevelXP =
    player.level *
    XP_PER_LEVEL;

  const xpIntoCurrentLevel =
    Math.max(
      player.xp -
        currentLevelStartXP,
      0
    );

  const xpRemaining =
    Math.max(
      nextLevelXP -
        player.xp,
      0
    );

  const xpPercentage =
    Math.min(
      Math.max(
        (xpIntoCurrentLevel /
          XP_PER_LEVEL) *
          100,
        0
      ),
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
              <span aria-hidden="true">
                🎮
              </span>

              Start playing
            </a>

            <Link
              to="/daily-challenge"
              className="inline-flex items-center gap-2 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
            >
              <span aria-hidden="true">
                🎯
              </span>

              Daily Challenge
            </Link>

            <Link
              to="/activity"
              className="inline-flex items-center gap-2 bg-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black hover:-translate-y-1 transition"
            >
              <span aria-hidden="true">
                📊
              </span>

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

                {user.avatar ||
                  "🎮"}

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
                {xpIntoCurrentLevel} /{" "}
                {XP_PER_LEVEL} XP
              </p>

              <p className="font-semibold">
                {xpRemaining} XP until
                next level
              </p>

              <p className="text-sm font-bold mt-1">
                Total XP:{" "}
                {player.xp.toLocaleString()}
              </p>

            </div>

          </div>

          <div
            className="mt-7 h-6 bg-white border-2 border-slate-950 rounded-full overflow-hidden"
            role="progressbar"
            aria-label={`Experience progress to level ${
              player.level + 1
            }`}
            aria-valuemin="0"
            aria-valuemax={
              XP_PER_LEVEL
            }
            aria-valuenow={
              Math.min(
                xpIntoCurrentLevel,
                XP_PER_LEVEL
              )
            }
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
            GAME STATS
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
            value={
              player.wins
            }
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
            label="Best Win Streak"
            color="bg-violet-200"
          />

        </section>

        {/* =================================================
            DAILY CHALLENGE
        ================================================= */}

        <section className="mt-12">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">

            <div>

              <p className="font-mono font-black tracking-widest text-sm">
                GAMEGRID DAILY
              </p>

              <h2 className="text-3xl font-black">
                Today's Challenge 🎯
              </h2>

            </div>

            <Link
              to="/daily-challenge"
              className="font-black whitespace-nowrap hover:text-pink-600 transition"
            >
              VIEW →
            </Link>

          </div>

          {dailyChallengeLoading ? (

            <div className="bg-white border-2 border-slate-950 rounded-3xl p-6 shadow-[6px_6px_0_#111827]">

              <p className="font-black">
                🎯 Loading today's
                challenge...
              </p>

            </div>

          ) : dailyChallengeError ? (

            <div className="bg-red-100 border-2 border-slate-950 rounded-3xl p-6 shadow-[6px_6px_0_#111827]">

              <p className="font-black">
                ⚠️{" "}
                {dailyChallengeError}
              </p>

              <Link
                to="/daily-challenge"
                className="inline-block mt-4 font-black underline"
              >
                Try challenge page →
              </Link>

            </div>

          ) : dailyChallenge
            ?.challenge ? (

            <DailyChallengeCard
              challenge={
                dailyChallenge.challenge
              }
              streak={
                dailyChallenge.streak
              }
              stats={
                dailyChallenge.stats
              }
            />

          ) : (

            <div className="bg-white border-2 border-slate-950 rounded-3xl p-6 shadow-[6px_6px_0_#111827]">

              <p className="font-black text-xl">
                No challenge available
                today 🎯
              </p>

              <p className="text-slate-600 mt-2">
                Check back later for a
                new GameGrid mission.
              </p>

            </div>

          )}

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
                className="self-start sm:self-auto font-black whitespace-nowrap hover:text-pink-600 transition"
              >
                VIEW ALL →
              </Link>

            </div>

            <div className="space-y-4">

              {historyLoading ? (

                <ActivityMessage>
                  Loading recent
                  games...
                </ActivityMessage>

              ) : recentGames.length ===
                0 ? (

                <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]">

                  <p className="font-black text-xl">
                    No games played yet
                    🎮
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
                    No achievements yet
                    🏆
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
// DAILY CHALLENGE CARD
// =====================================================

function DailyChallengeCard({
  challenge,
  streak,
  stats,
}) {
  const completed =
    Boolean(
      challenge.completed
    );

  return (
    <div
      className={`border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[7px_7px_0_#111827] ${
        completed
          ? "bg-emerald-200"
          : "bg-white"
      }`}
    >

      <div className="grid lg:grid-cols-[1fr_auto]">

        {/* CHALLENGE DETAILS */}

        <div className="p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row gap-5">

            <div className="w-20 h-20 shrink-0 bg-cyan-300 border-2 border-slate-950 rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0_#111827]">

              {getGameIcon(
                challenge.game
              )}

            </div>

            <div className="flex-1 min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <span className="bg-slate-950 text-white rounded-full px-3 py-1 text-xs font-black uppercase">

                  {challenge.difficulty ||
                    "normal"}

                </span>

                {completed ? (

                  <span className="bg-emerald-400 border border-slate-950 rounded-full px-3 py-1 text-xs font-black">
                    ✓ COMPLETED
                  </span>

                ) : (

                  <span className="bg-pink-500 text-white border border-slate-950 rounded-full px-3 py-1 text-xs font-black">
                    ACTIVE
                  </span>

                )}

              </div>

              <h3 className="text-2xl sm:text-3xl font-black mt-3">

                {challenge.title}

              </h3>

              <p className="font-semibold text-slate-600 mt-2">

                {challenge.description}

              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <span className="bg-yellow-200 border-2 border-slate-950 rounded-xl px-4 py-2 font-black">

                  ⭐ +
                  {challenge.bonusXP ||
                    0}{" "}
                  XP

                </span>

                <span className="bg-cyan-100 border-2 border-slate-950 rounded-xl px-4 py-2 font-black">

                  🎮 {challenge.game}

                </span>

                <span className="bg-violet-100 border-2 border-slate-950 rounded-xl px-4 py-2 font-black">

                  🎯{" "}
                  {getChallengeTarget(
                    challenge
                  )}

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* DAILY STATS */}

        <div className="bg-pink-200 border-t-2 lg:border-t-0 lg:border-l-2 border-slate-950 p-6 min-w-[250px]">

          <p className="font-mono font-black tracking-widest text-xs">
            DAILY PROGRESS
          </p>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 mt-4">

            <MiniDailyStat
              icon="🔥"
              value={
                streak?.current || 0
              }
              label="Daily Streak"
            />

            <MiniDailyStat
              icon="🏆"
              value={
                streak?.longest || 0
              }
              label="Best Daily"
            />

            <MiniDailyStat
              icon="🎯"
              value={
                stats?.totalCompleted ||
                0
              }
              label="Completed"
            />

          </div>

        </div>

      </div>

      {/* ACTION BAR */}

      <div className="border-t-2 border-slate-950 bg-yellow-100 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <p className="font-black">

          {completed
            ? "🎉 Today's bonus XP has been claimed!"
            : "Complete today's mission and earn bonus XP!"}

        </p>

        <Link
          to="/daily-challenge"
          className={`border-2 border-slate-950 rounded-xl px-5 py-2.5 font-black text-center shadow-[3px_3px_0_#111827] hover:-translate-y-1 transition ${
            completed
              ? "bg-emerald-300"
              : "bg-pink-500 text-white"
          }`}
        >

          {completed
            ? "VIEW CHALLENGE →"
            : "START CHALLENGE →"}

        </Link>

      </div>

    </div>
  );
}

// =====================================================
// MINI DAILY STAT
// =====================================================

function MiniDailyStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-xl p-3">

      <div className="flex items-center gap-2">

        <span className="text-xl">
          {icon}
        </span>

        <span className="text-xl font-black">
          {value}
        </span>

      </div>

      <p className="text-xs font-black text-slate-600 mt-1">
        {label}
      </p>

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

            <p className="font-bold text-sm mt-2">

              🎯 Score{" "}
              {game.score || 0}

            </p>

            {/* GRID QUEST METADATA */}

            {game.game ===
              "Grid Quest" &&
              game.metadata && (

                <div className="flex flex-wrap gap-2 mt-2">

                  <span className="bg-yellow-100 border border-slate-300 rounded-full px-2.5 py-1 text-xs font-black">

                    ⭐{" "}
                    {Number(
                      game.metadata
                        .starsCollected
                    ) || 0}
                    /
                    {Number(
                      game.metadata
                        .totalStars
                    ) || 0}{" "}
                    Stars

                  </span>

                  <span className="bg-cyan-100 border border-slate-300 rounded-full px-2.5 py-1 text-xs font-black">

                    👣{" "}
                    {Number(
                      game.metadata
                        .moves
                    ) || 0}{" "}
                    Moves

                  </span>

                </div>

              )}

            <p className="text-xs text-slate-500 mt-2">

              {formatDate(
                game.createdAt
              )}

            </p>

          </div>

        </div>

        <div className="font-black text-base sm:text-lg whitespace-nowrap">

          +
          {game.xpEarned || 0}{" "}
          XP

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
// STAT CARD
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
// GAME ICON
// =====================================================

function getGameIcon(
  gameName
) {
  const icons = {
    "Math Blast": "🧮",
    "Toon Tac Toe": "⭕",
    "Flip & Match": "🃏",
    "Pattern Puzzle": "🧩",
    "Grid Quest": "🧭",
    "Sudoku Mini": "🔢",
  };

  return (
    icons[gameName] ||
    "🎮"
  );
}

// =====================================================
// CHALLENGE TARGET
// =====================================================

function getChallengeTarget(
  challenge
) {
  if (
    challenge.challengeType ===
    "score"
  ) {
    return `Score ${challenge.target}+`;
  }

  if (
    challenge.challengeType ===
    "win"
  ) {
    return "Win Game";
  }

  if (
    challenge.challengeType ===
    "play"
  ) {
    return "Complete Game";
  }

  return "Complete Goal";
}

// =====================================================
// RESULT
// =====================================================

function formatResult(
  result
) {
  if (result === "won") {
    return "Won";
  }

  if (result === "lost") {
    return "Lost";
  }

  return "Completed";
}

// =====================================================
// DIFFICULTY
// =====================================================

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

// =====================================================
// MODE
// =====================================================

function formatMode(mode) {
  if (mode === "computer") {
    return "Vs Computer";
  }

  if (mode === "solo") {
    return "Solo";
  }

  return "";
}

// =====================================================
// DATE
// =====================================================

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