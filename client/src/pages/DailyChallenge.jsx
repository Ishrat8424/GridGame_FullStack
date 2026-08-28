import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function DailyChallenge() {
  const navigate = useNavigate();

  const [
    challenge,
    setChallenge,
  ] = useState(null);

  const [
    streak,
    setStreak,
  ] = useState({
    current: 0,
    longest: 0,
    lastActiveDate: null,
  });

  const [
    stats,
    setStats,
  ] = useState({
    totalCompleted: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // =====================================================
  // FETCH DAILY CHALLENGE
  // =====================================================

  useEffect(() => {
    const fetchChallenge =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/daily-challenge"
            );

          setChallenge(
            response.data
              .challenge || null
          );

          setStreak(
            response.data.streak || {
              current: 0,
              longest: 0,
              lastActiveDate: null,
            }
          );

          setStats(
            response.data.stats || {
              totalCompleted: 0,
            }
          );
        } catch (error) {
          console.error(
            "Daily challenge error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Failed to load today's challenge."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchChallenge();
  }, []);

  // =====================================================
  // GAME ROUTES
  // =====================================================

  const getGameRoute = (
    game
  ) => {
    const routes = {
      "Math Blast":
        "/games/math-blast",

      "Toon Tac Toe":
        "/games/tic-tac-toe",

      "Flip & Match":
        "/games/flip-match",

      "Sudoku Mini":
        "/games/sudoku-mini",

      "Pattern Puzzle":
        "/games/pattern-puzzle",

      "Grid Quest":
        "/games/grid-quest",
    };

    return routes[game] || "/";
  };

  // =====================================================
  // GAME ICON
  // =====================================================

  const getGameIcon = (
    game
  ) => {
    const icons = {
      "Math Blast": "🧮",
      "Toon Tac Toe": "⭕",
      "Flip & Match": "🃏",
      "Sudoku Mini": "🔢",
      "Pattern Puzzle": "🧩",
      "Grid Quest": "🗺️",
    };

    return icons[game] || "🎮";
  };

  // =====================================================
  // PLAY CHALLENGE
  // =====================================================

  const handlePlayChallenge =
    () => {
      if (!challenge) {
        return;
      }

      navigate(
        getGameRoute(
          challenge.game
        )
      );
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <div className="min-h-screen flex items-center justify-center px-5">

          <div className="bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[7px_7px_0_#111827]">

            <div className="text-6xl animate-bounce">
              🎯
            </div>

            <p className="text-xl font-black mt-4">
              Loading today's
              challenge...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-3xl px-5 pt-32 pb-12">

          <div className="bg-red-100 border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[7px_7px_0_#111827]">

            <div className="text-6xl">
              😵
            </div>

            <h1 className="text-3xl font-black mt-4">
              Challenge unavailable
            </h1>

            <p className="font-semibold mt-3">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="inline-block mt-6 bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black"
            >
              ← Dashboard
            </Link>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 sm:px-6 md:px-12 pt-28 pb-16">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="text-center">

          <p className="font-mono font-black tracking-[0.22em]">
            GAMEGRID DAILY
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3">
            DAILY CHALLENGE 🎯
          </h1>

          <p className="text-lg max-w-2xl mx-auto mt-4 font-semibold">
            Complete today's mission,
            earn bonus XP and keep your
            daily streak alive.
          </p>

        </section>

        {/* =================================================
            MAIN CHALLENGE
        ================================================= */}

        {challenge && (
          <section className="mt-12">

            <div
              className={`border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[8px_8px_0_#111827] ${
                challenge.completed
                  ? "bg-green-200"
                  : "bg-white"
              }`}
            >

              {/* TOP BAR */}

              <div className="bg-slate-950 text-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">

                <p className="font-black tracking-widest">
                  TODAY'S MISSION
                </p>

                {challenge.completed ? (
                  <span className="bg-green-300 text-slate-950 border-2 border-white rounded-full px-4 py-1 font-black">
                    ✓ COMPLETED
                  </span>
                ) : (
                  <span className="bg-pink-500 border-2 border-white rounded-full px-4 py-1 font-black">
                    ACTIVE
                  </span>
                )}

              </div>

              <div className="p-6 sm:p-9">

                <div className="flex flex-col md:flex-row gap-7 md:items-center">

                  {/* ICON */}

                  <div className="shrink-0">

                    <div className="w-28 h-28 bg-cyan-200 border-2 border-slate-950 rounded-3xl flex items-center justify-center text-6xl shadow-[5px_5px_0_#111827]">

                      {getGameIcon(
                        challenge.game
                      )}

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1">

                    <p className="font-mono font-black tracking-widest text-sm">
                      {challenge.game}
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-black mt-2">
                      {challenge.title}
                    </h2>

                    <p className="text-lg font-semibold text-slate-700 mt-3">
                      {
                        challenge.description
                      }
                    </p>

                    {/* TAGS */}

                    <div className="flex flex-wrap gap-3 mt-5">

                      <ChallengeTag
                        text={`🎮 ${challenge.game}`}
                      />

                      <ChallengeTag
                        text={`⚡ ${formatDifficulty(
                          challenge.difficulty
                        )}`}
                      />

                      <ChallengeTag
                        text={`🎯 ${getTargetText(
                          challenge
                        )}`}
                      />

                    </div>

                  </div>

                </div>

                {/* REWARD */}

                <div className="grid sm:grid-cols-2 gap-4 mt-8">

                  <div className="bg-yellow-200 border-2 border-slate-950 rounded-2xl p-5">

                    <p className="font-mono font-black text-sm tracking-widest">
                      REWARD
                    </p>

                    <p className="text-3xl font-black mt-1">
                      ⭐ +
                      {challenge.bonusXP} XP
                    </p>

                  </div>

                  <div
                    className={`border-2 border-slate-950 rounded-2xl p-5 ${
                      challenge.completed
                        ? "bg-green-300"
                        : "bg-pink-200"
                    }`}
                  >

                    <p className="font-mono font-black text-sm tracking-widest">
                      STATUS
                    </p>

                    <p className="text-2xl font-black mt-1">
                      {challenge.completed
                        ? "✅ Completed!"
                        : "⏳ Not Completed"}
                    </p>

                  </div>

                </div>

                {/* BUTTON */}

                <div className="mt-8">

                  {challenge.completed ? (
                    <div className="bg-green-300 border-2 border-slate-950 rounded-2xl p-5 text-center">

                      <p className="text-2xl font-black">
                        🎉 Mission Complete!
                      </p>

                      <p className="font-semibold mt-1">
                        You've claimed today's{" "}
                        {challenge.bonusXP} bonus XP.
                        Come back tomorrow for
                        another challenge!
                      </p>

                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        handlePlayChallenge
                      }
                      className="w-full sm:w-auto bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-8 py-4 text-lg font-black shadow-[5px_5px_0_#111827] hover:-translate-y-1 hover:shadow-[7px_7px_0_#111827] transition"
                    >
                      PLAY CHALLENGE →
                    </button>
                  )}

                </div>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            STREAK STATS
        ================================================= */}

        <section className="grid sm:grid-cols-3 gap-5 mt-10">

          <StatCard
            icon="🔥"
            value={
              streak.current || 0
            }
            label="Current Streak"
            description="Consecutive active days"
            bg="bg-orange-200"
          />

          <StatCard
            icon="🏆"
            value={
              streak.longest || 0
            }
            label="Longest Streak"
            description="Your personal best"
            bg="bg-cyan-200"
          />

          <StatCard
            icon="🎯"
            value={
              stats.totalCompleted ||
              0
            }
            label="Challenges Done"
            description="Daily missions completed"
            bg="bg-pink-200"
          />

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section className="mt-12 bg-white border-2 border-slate-950 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#111827]">

          <p className="font-mono font-black tracking-widest text-sm">
            DAILY RULES
          </p>

          <h2 className="text-3xl font-black mt-1">
            How It Works 🕹️
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <RuleCard
              number="01"
              title="Check Mission"
              text="A new GameGrid challenge appears every day."
            />

            <RuleCard
              number="02"
              title="Beat The Goal"
              text="Play the required game and complete today's objective."
            />

            <RuleCard
              number="03"
              title="Earn Bonus XP"
              text="Complete it once to claim the daily bonus XP reward."
            />

          </div>

        </section>

        {/* =================================================
            BACK
        ================================================= */}

        <div className="text-center mt-10">

          <Link
            to="/dashboard"
            className="font-black hover:text-pink-500 transition"
          >
            ← BACK TO DASHBOARD
          </Link>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// CHALLENGE TAG
// =====================================================

function ChallengeTag({
  text,
}) {
  return (
    <span className="bg-cyan-100 border-2 border-slate-950 rounded-full px-4 py-2 text-sm font-black">
      {text}
    </span>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  value,
  label,
  description,
  bg,
}) {
  return (
    <div
      className={`${bg} border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0_#111827]`}
    >

      <div className="text-4xl">
        {icon}
      </div>

      <p className="text-4xl font-black mt-3">
        {value}
      </p>

      <p className="font-black mt-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-600 mt-1">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// RULE CARD
// =====================================================

function RuleCard({
  number,
  title,
  text,
}) {
  return (
    <div className="bg-yellow-100 border-2 border-slate-950 rounded-2xl p-5">

      <span className="font-mono font-black text-pink-500">
        {number}
      </span>

      <h3 className="font-black text-xl mt-2">
        {title}
      </h3>

      <p className="font-semibold text-slate-600 mt-2">
        {text}
      </p>

    </div>
  );
}

// =====================================================
// DIFFICULTY
// =====================================================

function formatDifficulty(
  difficulty
) {
  if (!difficulty) {
    return "Normal";
  }

  return (
    difficulty
      .charAt(0)
      .toUpperCase() +
    difficulty.slice(1)
  );
}

// =====================================================
// TARGET TEXT
// =====================================================

function getTargetText(
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
    return "Win the Game";
  }

  if (
    challenge.challengeType ===
    "play"
  ) {
    return "Complete Game";
  }

  return "Complete Goal";
}

export default DailyChallenge;