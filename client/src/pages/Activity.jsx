import {
  useEffect,
  useEffectEvent,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const filters = [
  {
    label: "All",
    value: "all",
    icon: "🎮",
  },

  {
    label: "Math Blast",
    value: "Math Blast",
    icon: "🧮",
  },

  {
    label: "Tic Tac Toe",
    value: "Toon Tac Toe",
    icon: "⭕",
  },

  {
    label: "Flip & Match",
    value: "Flip & Match",
    icon: "🃏",
  },

  {
    label: "Sudoku Mini",
    value: "Sudoku Mini",
    icon: "🔢",
  },

  {
    label: "Pattern Puzzle",
    value: "Pattern Puzzle",
    icon: "🧩",
  },

  {
    label: "Grid Quest",
    value: "Grid Quest",
    icon: "🧭",
  },
];

function Activity() {
  const {
    user,
    loading,
  } = useAuth();

  const [
    games,
    setGames,
  ] = useState([]);

  const [
    selectedGame,
    setSelectedGame,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    hasMore,
    setHasMore,
  ] = useState(false);

  const [
    totalGames,
    setTotalGames,
  ] = useState(0);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =====================================================
  // FETCH ACTIVITY
  // =====================================================

  const fetchActivity = async ({
    requestedPage = 1,
    game = selectedGame,
    append = false,
  } = {}) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setHistoryLoading(true);
      }

      setError("");

      let url =
        `/games/history?page=${requestedPage}&limit=20`;

      if (game !== "all") {
        url +=
          `&game=${encodeURIComponent(
            game
          )}`;
      }

      const response =
        await api.get(url);

      const newGames =
        response.data.games || [];

      if (append) {
        setGames(
          (previousGames) => [
            ...previousGames,
            ...newGames,
          ]
        );
      } else {
        setGames(newGames);
      }

      setPage(requestedPage);

      setHasMore(
        response.data
          .pagination
          ?.hasMore || false
      );

      setTotalGames(
        response.data
          .pagination
          ?.totalGames || 0
      );
    } catch (err) {
      console.error(
        "Failed to fetch activity:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Failed to load activity."
      );
    } finally {
      setHistoryLoading(false);

      setLoadingMore(false);
    }
  };

  const refreshActivity = useEffectEvent(() => {
    void fetchActivity({
      requestedPage: 1,
      game: selectedGame,
      append: false,
    });
  });

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const timer = setTimeout(() => {
      refreshActivity();
    }, 0);

    return () =>
      clearTimeout(timer);
  }, [
    user,
    selectedGame,
  ]);

  // =====================================================
  // FILTER
  // =====================================================

  const handleFilterChange = (
    value
  ) => {
    if (
      value === selectedGame
    ) {
      return;
    }

    setGames([]);

    setPage(1);

    setHasMore(false);

    setSelectedGame(value);
  };

  // =====================================================
  // LOAD MORE
  // =====================================================

  const handleLoadMore = () => {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    fetchActivity({
      requestedPage:
        page + 1,

      game:
        selectedGame,

      append:
        true,
    });
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">

        <p className="text-2xl font-black">
          Loading activity...
        </p>

      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-5xl px-5 sm:px-6 pb-14 pt-28 md:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>

          <Link
            to="/dashboard"
            className="font-black hover:text-pink-600 transition"
          >
            ← DASHBOARD
          </Link>

          <p className="font-mono font-black tracking-[0.2em] mt-8">
            PLAYER HISTORY
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-2">
            All Activity 🎮
          </h1>

          <p className="text-lg mt-3 text-slate-700">
            See your complete GameGrid
            journey.
          </p>

        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mt-8 bg-pink-500 border-2 border-slate-950 rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0_#111827]">

          <p className="font-mono font-black tracking-widest text-sm">
            ACTIVITY SUMMARY
          </p>

          <p className="text-3xl font-black mt-2">
            {totalGames}
          </p>

          <p className="font-bold">
            {selectedGame === "all"
              ? "Games in history"
              : `${selectedGame} games`}
          </p>

        </section>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="mt-9">

          <p className="font-mono font-black tracking-widest text-sm">
            FILTER ACTIVITY
          </p>

          <div className="flex gap-3 overflow-x-auto pb-3 mt-4">

            {filters.map(
              (filter) => (

                <button
                  key={
                    filter.value
                  }
                  type="button"
                  onClick={() =>
                    handleFilterChange(
                      filter.value
                    )
                  }
                  className={`shrink-0 border-2 border-slate-950 rounded-xl px-4 py-3 font-black transition ${
                    selectedGame ===
                    filter.value
                      ? "bg-slate-950 text-white shadow-[3px_3px_0_#ec4899]"
                      : "bg-white hover:bg-cyan-200"
                  }`}
                >
                  {filter.icon}{" "}
                  {filter.label}
                </button>

              )
            )}

          </div>

        </section>

        {/* =================================================
            ACTIVITY
        ================================================= */}

        <section className="mt-8">

          <div className="flex items-end justify-between gap-4 mb-5">

            <div>

              <p className="font-mono font-black tracking-widest text-sm">
                HISTORY
              </p>

              <h2 className="text-3xl font-black">
                {selectedGame ===
                "all"
                  ? "All Games"
                  : selectedGame}
              </h2>

            </div>

            <p className="font-bold text-sm">
              {totalGames} total
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 font-bold text-red-700 mb-5">
              ❌ {error}
            </div>

          )}

          {/* LOADING */}

          {historyLoading ? (

            <div className="bg-white border-2 border-slate-950 rounded-2xl p-7">

              <p className="font-black">
                Loading your activity...
              </p>

            </div>

          ) : games.length === 0 ? (

            /* EMPTY */

            <div className="bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[5px_5px_0_#111827]">

              <div className="text-6xl">
                🎮
              </div>

              <h3 className="text-2xl font-black mt-4">
                No activity found
              </h3>

              <p className="text-slate-600 mt-2">
                Play a GameGrid challenge
                and your results will
                appear here.
              </p>

              <Link
                to="/"
                className="inline-block mt-6 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black shadow-[3px_3px_0_#111827]"
              >
                🎮 PLAY A GAME
              </Link>

            </div>

          ) : (

            /* HISTORY */

            <div className="space-y-4">

              {games.map(
                (game) => (

                  <ActivityCard
                    key={game._id}
                    game={game}
                  />

                )
              )}

            </div>

          )}

          {/* =================================================
              LOAD MORE
          ================================================= */}

          {!historyLoading &&
            games.length > 0 &&
            hasMore && (

            <div className="text-center mt-8">

              <button
                type="button"
                onClick={
                  handleLoadMore
                }
                disabled={
                  loadingMore
                }
                className="bg-cyan-300 border-2 border-slate-950 rounded-xl px-8 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loadingMore
                  ? "LOADING..."
                  : "LOAD MORE ↓"}

              </button>

            </div>

          )}

          {!historyLoading &&
            games.length > 0 &&
            !hasMore && (

            <p className="text-center font-bold text-slate-600 mt-8">
              🎉 You've reached the
              end of your activity.
            </p>

          )}

        </section>

      </main>

    </div>
  );
}

// =====================================================
// ACTIVITY CARD
// =====================================================

function ActivityCard({
  game,
}) {
  return (
    <article className="bg-white border-2 border-slate-950 rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#111827]">

      <div className="flex items-start justify-between gap-3 sm:gap-5">

        {/* LEFT */}

        <div className="flex items-start gap-3 sm:gap-5 min-w-0">

          <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-cyan-200 border-2 border-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl">

            {getGameIcon(
              game.game
            )}

          </div>

          <div className="min-w-0">

            <h3 className="font-black text-lg sm:text-xl">
              {game.game}
            </h3>

            {/* TAGS */}

            <div className="flex flex-wrap gap-2 mt-2">

              <ActivityTag
                text={
                  formatResult(
                    game.result
                  )
                }
              />

              {game.mode &&
                game.mode !==
                  "normal" && (

                <ActivityTag
                  text={
                    formatMode(
                      game.mode
                    )
                  }
                />

              )}

              {game.difficulty &&
                game.difficulty !==
                  "normal" && (

                <ActivityTag
                  text={
                    `${formatDifficulty(
                      game.difficulty
                    )} Mode`
                  }
                />

              )}

            </div>

            <p className="font-bold mt-3">
              🎯 Score{" "}
              {game.score || 0}
            </p>

            {game.game === "Grid Quest" &&
              game.metadata && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <ActivityTag
                    text={`⭐ ${Number(
                      game.metadata.starsCollected
                    ) || 0}/${Number(
                      game.metadata.totalStars
                    ) || 0} Stars`}
                  />

                  <ActivityTag
                    text={`👣 ${Number(
                      game.metadata.moves
                    ) || 0} Moves`}
                  />
                </div>
              )}

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {formatDateTime(
                game.createdAt
              )}
            </p>

          </div>

        </div>

        {/* XP */}

        <div className="shrink-0 bg-yellow-200 border-2 border-slate-950 rounded-xl px-3 py-2 text-center">

          <p className="font-black text-base sm:text-lg whitespace-nowrap">
            +{game.xpEarned || 0}
          </p>

          <p className="text-xs font-black">
            XP
          </p>

        </div>

      </div>

    </article>
  );
}

// =====================================================
// TAG
// =====================================================

function ActivityTag({
  text,
}) {
  return (
    <span className="bg-slate-100 border border-slate-300 rounded-full px-3 py-1 text-xs font-black">
      {text}
    </span>
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
    "Pattern Puzzle": "🧩",
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
    return "🏆 Won";
  }

  if (result === "lost") {
    return "❌ Lost";
  }

  return "✅ Completed";
}

function formatMode(mode) {
  if (mode === "computer") {
    return "🤖 Vs Computer";
  }

  if (mode === "solo") {
    return "👤 Solo";
  }

  return "";
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

function formatDateTime(date) {
  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

export default Activity;