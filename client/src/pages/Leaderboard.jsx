import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

function Leaderboard() {
  const {
    user,
    loading,
  } = useAuth();

  const [
    players,
    setPlayers,
  ] = useState([]);

  const [
    leaderboardLoading,
    setLeaderboardLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("xp");

  // =====================================================
  // FETCH LEADERBOARD
  // =====================================================

  useEffect(() => {
    const fetchLeaderboard =
      async () => {
        try {
          setLeaderboardLoading(true);
          setError("");

          const response =
            await api.get(
              "/leaderboard?limit=50"
            );

          setPlayers(
            response.data
              .leaderboard || []
          );
        } catch (error) {
          console.error(
            "Failed to fetch leaderboard:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Failed to load leaderboard."
          );
        } finally {
          setLeaderboardLoading(false);
        }
      };

    fetchLeaderboard();
  }, []);

  // =====================================================
  // SORT PLAYERS
  // =====================================================

  const rankedPlayers =
    useMemo(() => {
      const sortedPlayers =
        [...players];

      if (filter === "wins") {
        sortedPlayers.sort(
          (a, b) =>
            (b.stats?.wins || 0) -
              (a.stats?.wins || 0) ||
            (b.xp || 0) -
              (a.xp || 0)
        );
      } else {
        sortedPlayers.sort(
          (a, b) =>
            (b.xp || 0) -
              (a.xp || 0) ||
            (b.stats?.wins || 0) -
              (a.stats?.wins || 0)
        );
      }

      return sortedPlayers.map(
        (player, index) => ({
          ...player,
          displayRank:
            index + 1,
        })
      );
    }, [
      players,
      filter,
    ]);

  // =====================================================
  // TOP 3
  // =====================================================

  const topThree =
    rankedPlayers.slice(0, 3);

  // =====================================================
  // CURRENT PLAYER
  // =====================================================

  const currentPlayer =
    rankedPlayers.find(
      (player) =>
        String(player._id) ===
        String(user?._id)
    );

  // =====================================================
  // AUTH LOADING
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

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 sm:px-6 pb-14 pt-28 md:px-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="text-center">

          <p className="font-mono font-black tracking-[0.25em]">
            GAMEGRID RANKINGS
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-3">
            LEADERBOARD 🏆
          </h1>

          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Play games, earn XP and
            climb your way to the top
            of the arcade.
          </p>

        </section>

        {/* =================================================
            FILTER BUTTONS
        ================================================= */}

        <section className="flex flex-wrap justify-center gap-3 mt-9">

          <button
            type="button"
            onClick={() =>
              setFilter("xp")
            }
            className={`border-2 border-slate-950 px-5 py-2 rounded-xl font-black transition ${
              filter === "xp"
                ? "bg-slate-950 text-white shadow-[3px_3px_0_#ec4899]"
                : "bg-white hover:bg-cyan-200"
            }`}
          >
            ⭐ Global XP
          </button>

          <button
            type="button"
            disabled
            title="Weekly leaderboard coming soon"
            className="bg-white border-2 border-slate-950 px-5 py-2 rounded-xl font-black opacity-50 cursor-not-allowed"
          >
            📅 Weekly
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("wins")
            }
            className={`border-2 border-slate-950 px-5 py-2 rounded-xl font-black transition ${
              filter === "wins"
                ? "bg-slate-950 text-white shadow-[3px_3px_0_#22d3ee]"
                : "bg-white hover:bg-pink-200"
            }`}
          >
            🏆 Most Wins
          </button>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mt-10 bg-red-100 border-2 border-red-500 rounded-2xl p-5 text-red-700 font-black">
            ❌ {error}
          </div>

        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {leaderboardLoading ? (

          <section className="mt-14">

            <div className="bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[6px_6px_0_#111827]">

              <div className="text-5xl">
                🏆
              </div>

              <p className="text-xl font-black mt-4">
                Loading leaderboard...
              </p>

            </div>

          </section>

        ) : rankedPlayers.length ===
          0 ? (

          <section className="mt-14">

            <div className="bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[6px_6px_0_#111827]">

              <div className="text-6xl">
                🎮
              </div>

              <h2 className="text-2xl font-black mt-4">
                No players yet
              </h2>

              <p className="text-slate-600 mt-2">
                Play a GameGrid challenge
                and become the first
                leaderboard champion.
              </p>

            </div>

          </section>

        ) : (

          <>
            {/* =================================================
                TOP 3
            ================================================= */}

            <section className="grid md:grid-cols-3 gap-6 mt-14 items-end">

              {topThree.map(
                (player) => {

                  const styles = {
                    1: {
                      bg:
                        "bg-yellow-200",
                      medal:
                        "🥇",
                      height:
                        "md:min-h-[340px]",
                    },

                    2: {
                      bg:
                        "bg-cyan-300",
                      medal:
                        "🥈",
                      height:
                        "md:min-h-[300px]",
                    },

                    3: {
                      bg:
                        "bg-orange-300",
                      medal:
                        "🥉",
                      height:
                        "md:min-h-[280px]",
                    },
                  };

                  const style =
                    styles[
                      player.displayRank
                    ];

                  const isCurrentUser =
                    String(
                      player._id
                    ) ===
                    String(
                      user?._id
                    );

                  return (
                    <div
                      key={
                        player._id
                      }
                      className={`${style.bg} ${style.height}
                        border-2 border-slate-950 rounded-3xl p-7
                        text-center shadow-[7px_7px_0_#111827]
                        ${
                          player.displayRank ===
                          1
                            ? "md:order-2"
                            : ""
                        }
                        ${
                          player.displayRank ===
                          2
                            ? "md:order-1"
                            : ""
                        }
                        ${
                          player.displayRank ===
                          3
                            ? "md:order-3"
                            : ""
                        }
                      `}
                    >

                      <div className="text-5xl">
                        {style.medal}
                      </div>

                      <div className="w-24 h-24 mx-auto mt-5 bg-white border-2 border-slate-950 rounded-full flex items-center justify-center text-5xl">

                        {player.avatar ||
                          "🦊"}

                      </div>

                      <div className="flex items-center justify-center gap-2 mt-5">

                        <h2 className="text-2xl font-black break-all">
                          {player.username}
                        </h2>

                        {isCurrentUser && (

                          <span className="bg-pink-500 text-white border border-slate-950 rounded-full px-2 py-1 text-xs font-black">
                            YOU
                          </span>

                        )}

                      </div>

                      <p className="font-bold mt-1">
                        Level{" "}
                        {player.level ||
                          1}
                      </p>

                      <p className="text-3xl font-black mt-5">
                        {(player.xp ||
                          0
                        ).toLocaleString()}{" "}
                        XP
                      </p>

                      <p className="font-semibold">
                        {player.stats
                          ?.wins || 0}{" "}
                        Wins
                      </p>

                      <p className="text-sm font-bold mt-2">
                        🔥{" "}
                        {player.stats
                          ?.bestStreak ||
                          0}{" "}
                        Best Streak
                      </p>

                    </div>
                  );
                }
              )}

            </section>

            {/* =================================================
                FULL RANKING
            ================================================= */}

            <section className="mt-16">

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">

                <div>

                  <p className="font-mono font-bold tracking-widest">
                    TOP PLAYERS
                  </p>

                  <h2 className="text-4xl font-black">
                    Arcade Rankings
                  </h2>

                </div>

                <p className="font-black">
                  {rankedPlayers.length}{" "}
                  Players
                </p>

              </div>

              <div className="space-y-4">

                {rankedPlayers.map(
                  (player) => {

                    const isCurrentUser =
                      String(
                        player._id
                      ) ===
                      String(
                        user?._id
                      );

                    return (
                      <div
                        key={
                          player._id
                        }
                        className={`border-2 border-slate-950 rounded-2xl p-4 md:p-6 shadow-[4px_4px_0_#111827] flex items-center gap-3 sm:gap-4 ${
                          isCurrentUser
                            ? "bg-pink-200"
                            : "bg-white"
                        }`}
                      >

                        {/* RANK */}

                        <div className="w-12 text-center text-xl sm:text-2xl font-black shrink-0">

                          {getRankDisplay(
                            player.displayRank
                          )}

                        </div>

                        {/* AVATAR */}

                        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-cyan-200 border-2 border-slate-950 rounded-full flex items-center justify-center text-2xl sm:text-3xl">

                          {player.avatar ||
                            "🦊"}

                        </div>

                        {/* PLAYER */}

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-black text-lg md:text-xl truncate">
                              {
                                player.username
                              }
                            </h3>

                            {isCurrentUser && (

                              <span className="bg-slate-950 text-white rounded-full px-2 py-1 text-xs font-black">
                                YOU
                              </span>

                            )}

                          </div>

                          <p className="text-sm font-semibold text-slate-600 mt-1">
                            Level{" "}
                            {player.level ||
                              1}
                            {" • "}
                            {player.stats
                              ?.wins ||
                              0}{" "}
                            Wins
                          </p>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm font-bold text-slate-600">

                            <span>
                              🎮{" "}
                              {player.stats
                                ?.gamesPlayed ||
                                0}
                            </span>

                            <span>
                              📈{" "}
                              {player.stats
                                ?.winRate ||
                                0}
                              %
                            </span>

                            <span>
                              🔥{" "}
                              {player.stats
                                ?.bestStreak ||
                                0}
                            </span>

                          </div>

                        </div>

                        {/* XP */}

                        <div className="text-right shrink-0">

                          <p className="font-black text-lg md:text-xl">
                            {(player.xp ||
                              0
                            ).toLocaleString()}
                          </p>

                          <p className="font-bold text-sm">
                            XP
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>
          </>
        )}

        {/* =================================================
            CURRENT PLAYER
        ================================================= */}

        {!leaderboardLoading && (
          <section className="mt-12 bg-pink-500 border-2 border-slate-950 rounded-2xl p-6 shadow-[6px_6px_0_#111827]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div>

                <p className="font-mono font-black tracking-widest text-sm">
                  YOUR RANK
                </p>

                {currentPlayer ? (
                  <>
                    <h2 className="text-3xl font-black mt-1">
                      #
                      {
                        currentPlayer.displayRank
                      }{" "}
                      {user?.avatar ||
                        "🎮"}{" "}
                      {
                        currentPlayer.username
                      }
                    </h2>

                    <p className="font-semibold mt-2">
                      You currently have{" "}
                      <span className="font-black">
                        {(
                          currentPlayer.xp ||
                          0
                        ).toLocaleString()}{" "}
                        XP
                      </span>
                      . Keep playing to
                      climb higher!
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black mt-1">
                      Keep Playing! 🎮
                    </h2>

                    <p className="font-semibold mt-2">
                      Earn more XP to
                      climb the GameGrid
                      leaderboard.
                    </p>
                  </>
                )}

              </div>

              <a
                href="/#games"
                className="bg-slate-950 text-white border-2 border-slate-950 px-6 py-3 rounded-xl font-black text-center hover:-translate-y-1 transition shadow-[3px_3px_0_#22d3ee]"
              >
                PLAY GAMES →
              </a>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

// =====================================================
// RANK DISPLAY
// =====================================================

function getRankDisplay(rank) {
  if (rank === 1) {
    return "🥇";
  }

  if (rank === 2) {
    return "🥈";
  }

  if (rank === 3) {
    return "🥉";
  }

  return `#${rank}`;
}

export default Leaderboard;