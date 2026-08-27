import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

// =====================================================
// CELL TYPES
// =====================================================

const EMPTY = 0;
const WALL = 1;
const STAR = 2;
const START = 3;
const GOAL = 4;

// =====================================================
// MAZE CONFIG
// =====================================================

const mazeConfig = {
  easy: {
    size: 5,
    maxMoves: 25,

    mazes: [
      [
        [3, 0, 1, 0, 2],
        [1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1],
        [2, 1, 1, 0, 0],
        [0, 0, 0, 0, 4],
      ],

      [
        [3, 0, 0, 1, 0],
        [1, 1, 0, 1, 2],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [2, 0, 0, 0, 4],
      ],

      [
        [3, 0, 2, 0, 0],
        [1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 2],
        [0, 0, 0, 0, 4],
      ],
    ],
  },

  medium: {
    size: 7,
    maxMoves: 45,

    mazes: [
      [
        [3, 0, 1, 0, 2, 0, 0],
        [1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [2, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 4],
      ],

      [
        [3, 0, 0, 1, 0, 0, 2],
        [1, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0, 0],
        [2, 0, 0, 0, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 0, 2, 1, 0, 0, 4],
      ],

      [
        [3, 0, 1, 0, 0, 2, 0],
        [0, 0, 1, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 1],
        [2, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 0, 2, 0, 0, 0, 4],
      ],
    ],
  },

  hard: {
    size: 9,
    maxMoves: 70,

    mazes: [
      [
        [3, 0, 1, 0, 2, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 0],
        [2, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 4],
      ],

      [
        [3, 0, 0, 1, 0, 0, 2, 0, 0],
        [1, 1, 0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0, 0, 0],
        [2, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 2, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 2, 0, 0, 0, 4],
      ],

      [
        [3, 0, 1, 0, 0, 2, 0, 1, 0],
        [0, 0, 1, 0, 1, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 1, 1, 0],
        [2, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 1, 0, 4],
      ],
    ],
  },
};

// =====================================================
// COMPONENT
// =====================================================

function GridQuest() {
  const { updateUser } = useAuth();

  const [screen, setScreen] =
    useState("difficulty");

  const [difficulty, setDifficulty] =
    useState(null);

  const [maze, setMaze] =
    useState([]);

  const [playerPosition, setPlayerPosition] =
    useState({
      row: 0,
      col: 0,
    });

  const [moves, setMoves] =
    useState(0);

  const [starsCollected, setStarsCollected] =
    useState(0);

  const [totalStars, setTotalStars] =
    useState(0);

  const [lastMazeIndex, setLastMazeIndex] =
    useState({
      easy: -1,
      medium: -1,
      hard: -1,
    });

  const [saving, setSaving] =
    useState(false);

  const [xpEarned, setXpEarned] =
    useState(0);

  const [finalScore, setFinalScore] =
    useState(0);

  const [error, setError] =
    useState("");

  const [
    unlockedAchievements,
    setUnlockedAchievements,
  ] = useState([]);

  // =====================================================
  // CURRENT CONFIG
  // =====================================================

  const currentConfig =
    difficulty
      ? mazeConfig[difficulty]
      : null;

  const size =
    currentConfig?.size || 5;

  const maxMoves =
    currentConfig?.maxMoves || 25;

  // =====================================================
  // PROGRESS
  // =====================================================

  const starProgress = useMemo(() => {
    if (totalStars === 0) {
      return 0;
    }

    return Math.round(
      (starsCollected /
        totalStars) *
        100
    );
  }, [
    starsCollected,
    totalStars,
  ]);

  // =====================================================
  // START GAME
  // =====================================================

  const startGame = (
    selectedDifficulty
  ) => {
    const config =
      mazeConfig[
        selectedDifficulty
      ];

    let randomIndex = 0;

    if (
      config.mazes.length > 1
    ) {
      do {
        randomIndex =
          Math.floor(
            Math.random() *
              config.mazes.length
          );
      } while (
        randomIndex ===
        lastMazeIndex[
          selectedDifficulty
        ]
      );
    }

    setLastMazeIndex(
      (previous) => ({
        ...previous,

        [selectedDifficulty]:
          randomIndex,
      })
    );

    const selectedMaze =
      config.mazes[
        randomIndex
      ].map(
        (row) => [...row]
      );

    const start =
      findCell(
        selectedMaze,
        START
      );

    const stars =
      countCells(
        selectedMaze,
        STAR
      );

    setDifficulty(
      selectedDifficulty
    );

    setMaze(
      selectedMaze
    );

    setPlayerPosition(
      start
    );

    setMoves(0);

    setStarsCollected(0);

    setTotalStars(
      stars
    );

    setSaving(false);

    setXpEarned(0);

    setFinalScore(0);

    setError("");

    setUnlockedAchievements([]);

    setScreen("game");
  };

  // =====================================================
  // MOVE PLAYER
  // =====================================================

  const movePlayer = (
    deltaRow,
    deltaCol
  ) => {
    if (
      saving ||
      screen !== "game"
    ) {
      return;
    }

    const newRow =
      playerPosition.row +
      deltaRow;

    const newCol =
      playerPosition.col +
      deltaCol;

    // Bounds
    if (
      newRow < 0 ||
      newRow >= size ||
      newCol < 0 ||
      newCol >= size
    ) {
      return;
    }

    const target =
      maze[newRow][newCol];

    // Wall
    if (
      target === WALL
    ) {
      return;
    }

    const nextMoves =
      moves + 1;

    setMoves(
      nextMoves
    );

    const newMaze =
      maze.map(
        (row) => [...row]
      );

    let nextStars =
      starsCollected;

    // Collect star
    if (
      target === STAR
    ) {
      nextStars += 1;

      setStarsCollected(
        nextStars
      );

      newMaze[newRow][
        newCol
      ] = EMPTY;

      setMaze(
        newMaze
      );
    }

    setPlayerPosition({
      row:
        newRow,

      col:
        newCol,
    });

    // Goal reached
    if (
      target === GOAL
    ) {
      finishGame({
        finalMoves:
          nextMoves,

        finalStars:
          nextStars,
      });
    }
  };

  // =====================================================
  // KEYBOARD CONTROLS
  // =====================================================

  useEffect(() => {
    if (
      screen !== "game"
    ) {
      return;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key ===
          "ArrowUp" ||
        event.key.toLowerCase() ===
          "w"
      ) {
        event.preventDefault();

        movePlayer(
          -1,
          0
        );
      }

      if (
        event.key ===
          "ArrowDown" ||
        event.key.toLowerCase() ===
          "s"
      ) {
        event.preventDefault();

        movePlayer(
          1,
          0
        );
      }

      if (
        event.key ===
          "ArrowLeft" ||
        event.key.toLowerCase() ===
          "a"
      ) {
        event.preventDefault();

        movePlayer(
          0,
          -1
        );
      }

      if (
        event.key ===
          "ArrowRight" ||
        event.key.toLowerCase() ===
          "d"
      ) {
        event.preventDefault();

        movePlayer(
          0,
          1
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    screen,
    maze,
    playerPosition,
    moves,
    starsCollected,
    saving,
    difficulty,
  ]);

  // =====================================================
  // FINISH GAME
  // =====================================================

  const finishGame = async ({
    finalMoves,
    finalStars,
  }) => {
    try {
      setSaving(true);

      setError("");

      const score =
        calculateGridScore({
          difficulty,
          moves:
            finalMoves,
          maxMoves,
          starsCollected:
            finalStars,
          totalStars,
        });

      setFinalScore(
        score
      );

      const response =
        await api.post(
          "/games/result",
          {
            game:
              "Grid Quest",

            score,

            result:
              "completed",

            difficulty,

            mode:
              "solo",
          }
        );

      updateUser(
        response.data.user
      );

      setXpEarned(
        response.data
          .gameResult
          .xpEarned
      );

      setUnlockedAchievements(
        response.data
          .unlockedAchievements ||
          []
      );

      setScreen(
        "result"
      );
    } catch (err) {
      console.error(
        "Failed to save Grid Quest:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Quest completed, but the result could not be saved."
      );

      setScreen(
        "result"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESTART
  // =====================================================

  const restartGame = () => {
    startGame(
      difficulty
    );
  };

  // =====================================================
  // CHANGE LEVEL
  // =====================================================

  const changeDifficulty = () => {
    setDifficulty(null);

    setMaze([]);

    setScreen(
      "difficulty"
    );
  };

  // =====================================================
  // DIFFICULTY SCREEN
  // =====================================================

  if (
    screen ===
    "difficulty"
  ) {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-5xl px-5 pb-10 pt-24 md:px-10">

          <section className="text-center">

            <p className="font-mono font-black tracking-[0.2em] text-sm">
              GAME 05 / PATHFINDING
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3">
              GRID QUEST 🧭
            </h1>

            <p className="mt-4 text-base md:text-lg">
              Navigate the maze,
              collect stars and
              reach the finish.
            </p>

          </section>

          <section className="grid sm:grid-cols-3 gap-5 mt-10">

            <DifficultyCard
              icon="🙂"
              title="Easy"
              board="5 × 5"
              description="Small maze with fewer obstacles."
              color="bg-green-200"
              onClick={() =>
                startGame(
                  "easy"
                )
              }
            />

            <DifficultyCard
              icon="😎"
              title="Medium"
              board="7 × 7"
              description="More walls and more route planning."
              color="bg-orange-200"
              onClick={() =>
                startGame(
                  "medium"
                )
              }
            />

            <DifficultyCard
              icon="🔥"
              title="Hard"
              board="9 × 9"
              description="Large maze with tougher paths and more stars."
              color="bg-red-200"
              onClick={() =>
                startGame(
                  "hard"
                )
              }
            />

          </section>

          <section className="mt-10 bg-white border-2 border-slate-950 rounded-2xl p-6 max-w-3xl mx-auto shadow-[4px_4px_0_#111827]">

            <h2 className="font-black text-xl">
              How to Play
            </h2>

            <div className="mt-3 space-y-2 text-slate-600">

              <p>
                🚀 You are the
                explorer.
              </p>

              <p>
                🏁 Reach the goal
                to complete the
                quest.
              </p>

              <p>
                ⭐ Collect stars
                for bonus score.
              </p>

              <p>
                ⬛ Walls cannot be
                crossed.
              </p>

              <p>
                Use arrow buttons,
                arrow keys or WASD.
              </p>

            </div>

          </section>

          <div className="mt-10 text-center">

            <Link
              to="/"
              className="font-black hover:text-pink-600"
            >
              ← Back to Arcade
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (
    screen === "result"
  ) {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-3xl px-5 pb-10 pt-24">

          <section className="bg-white border-2 border-slate-950 rounded-3xl p-7 md:p-10 text-center shadow-[8px_8px_0_#111827]">

            <div className="text-7xl">
              🏁
            </div>

            <p className="font-mono font-black tracking-widest mt-5">
              QUEST COMPLETE
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-3">
              You Escaped! 🎉
            </h1>

            <p className="capitalize font-bold mt-3">
              {difficulty}
              {" • "}
              {size}×{size}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">

              <ResultStat
                icon="🎯"
                value={
                  finalScore
                }
                label="Score"
                color="bg-orange-200"
              />

              <ResultStat
                icon="👣"
                value={
                  moves
                }
                label="Moves"
                color="bg-cyan-200"
              />

              <ResultStat
                icon="⭐"
                value={`${starsCollected}/${totalStars}`}
                label="Stars"
                color="bg-yellow-200"
              />

              <ResultStat
                icon="⚡"
                value={`+${xpEarned}`}
                label="XP"
                color="bg-pink-200"
              />

            </div>

            {error && (

              <div className="mt-5 bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                ❌ {error}
              </div>

            )}

            {unlockedAchievements.length >
              0 && (

              <div className="mt-8">

                <p className="font-black tracking-widest">
                  NEW ACHIEVEMENTS
                </p>

                <div className="space-y-3 mt-4">

                  {unlockedAchievements.map(
                    (
                      achievement
                    ) => (

                      <div
                        key={
                          achievement._id
                        }
                        className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-4"
                      >

                        <div className="text-3xl">
                          {
                            achievement.icon
                          }
                        </div>

                        <h3 className="font-black mt-2">
                          {
                            achievement.title
                          }
                        </h3>

                        <p className="text-sm text-slate-600 mt-1">
                          {
                            achievement.description
                          }
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            <div className="grid sm:grid-cols-3 gap-3 mt-8">

              <button
                type="button"
                onClick={
                  restartGame
                }
                className="bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[3px_3px_0_#111827]"
              >
                🔁 Play Again
              </button>

              <button
                type="button"
                onClick={
                  changeDifficulty
                }
                className="bg-cyan-300 border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[3px_3px_0_#111827]"
              >
                🎯 Change Level
              </button>

              <Link
                to="/dashboard"
                className="bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black"
              >
                📊 Dashboard
              </Link>

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =====================================================
  // GAME SCREEN
  // =====================================================

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-4xl px-3 sm:px-6 pb-10 pt-20 md:pt-24">

        {/* TOP */}

        <div className="flex items-center justify-between gap-3 mb-6">

          <button
            type="button"
            onClick={
              changeDifficulty
            }
            className="font-black text-sm sm:text-base"
          >
            ← Levels
          </button>

          <div className="text-center">

            <h1 className="text-lg sm:text-2xl font-black">
              Grid Quest 🧭
            </h1>

            <p className="text-xs font-bold capitalize">
              {difficulty}
              {" • "}
              {size}×{size}
            </p>

          </div>

          <button
            type="button"
            onClick={
              restartGame
            }
            className="font-black text-sm sm:text-base"
          >
            Restart ↻
          </button>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">

          <CompactStat
            icon="👣"
            value={moves}
            label="Moves"
          />

          <CompactStat
            icon="⭐"
            value={`${starsCollected}/${totalStars}`}
            label="Stars"
          />

          <CompactStat
            icon="📈"
            value={`${starProgress}%`}
            label="Collected"
          />

        </div>

        {/* BOARD */}

        <section className="bg-cyan-300 border-2 border-slate-950 rounded-3xl p-2 sm:p-5 shadow-[7px_7px_0_#111827]">

          <div
            className="grid mx-auto"
            style={{
              gridTemplateColumns:
                `repeat(${size}, minmax(0, 1fr))`,

              maxWidth:
                size === 9
                  ? "600px"
                  : size === 7
                  ? "520px"
                  : "400px",
            }}
          >

            {maze.map(
              (
                row,
                rowIndex
              ) =>
                row.map(
                  (
                    cell,
                    colIndex
                  ) => {
                    const isPlayer =
                      playerPosition.row ===
                        rowIndex &&
                      playerPosition.col ===
                        colIndex;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square border border-slate-950 flex items-center justify-center font-black ${
                          size === 9
                            ? "text-lg sm:text-2xl"
                            : "text-2xl sm:text-3xl"
                        } ${getCellStyle(
                          cell
                        )}`}
                      >
                        {isPlayer
                          ? "🚀"
                          : getCellIcon(
                              cell
                            )}
                      </div>
                    );
                  }
                )
            )}

          </div>

        </section>

        {/* CONTROLS */}

        <section className="mt-6 flex flex-col items-center gap-2">

          <ControlButton
            icon="⬆️"
            onClick={() =>
              movePlayer(
                -1,
                0
              )
            }
          />

          <div className="flex gap-2">

            <ControlButton
              icon="⬅️"
              onClick={() =>
                movePlayer(
                  0,
                  -1
                )
              }
            />

            <ControlButton
              icon="⬇️"
              onClick={() =>
                movePlayer(
                  1,
                  0
                )
              }
            />

            <ControlButton
              icon="➡️"
              onClick={() =>
                movePlayer(
                  0,
                  1
                )
              }
            />

          </div>

        </section>

        <p className="text-center text-sm font-bold text-slate-600 mt-5">
          Desktop: Arrow Keys /
          WASD
        </p>

      </main>

    </div>
  );
}

// =====================================================
// SCORE
// =====================================================

function calculateGridScore({
  difficulty,
  moves,
  maxMoves,
  starsCollected,
  totalStars,
}) {
  let baseScore = 500;

  if (
    difficulty === "easy"
  ) {
    baseScore = 500;
  }

  if (
    difficulty ===
    "medium"
  ) {
    baseScore = 800;
  }

  if (
    difficulty === "hard"
  ) {
    baseScore = 1200;
  }

  // Efficient movement bonus
  const remainingMoves =
    Math.max(
      maxMoves - moves,
      0
    );

  const moveBonus =
    remainingMoves * 10;

  // Star bonus
  const starBonus =
    starsCollected * 100;

  // All stars bonus
  const perfectStarBonus =
    totalStars > 0 &&
    starsCollected ===
      totalStars
      ? 200
      : 0;

  return (
    baseScore +
    moveBonus +
    starBonus +
    perfectStarBonus
  );
}

// =====================================================
// HELPERS
// =====================================================

function findCell(
  maze,
  type
) {
  for (
    let row = 0;
    row < maze.length;
    row++
  ) {
    for (
      let col = 0;
      col < maze[row].length;
      col++
    ) {
      if (
        maze[row][col] ===
        type
      ) {
        return {
          row,
          col,
        };
      }
    }
  }

  return {
    row: 0,
    col: 0,
  };
}

function countCells(
  maze,
  type
) {
  let count = 0;

  maze.forEach(
    (row) => {
      row.forEach(
        (cell) => {
          if (
            cell === type
          ) {
            count++;
          }
        }
      );
    }
  );

  return count;
}

function getCellIcon(cell) {
  if (cell === WALL) {
    return "";
  }

  if (cell === STAR) {
    return "⭐";
  }

  if (cell === GOAL) {
    return "🏁";
  }

  return "";
}

function getCellStyle(cell) {
  if (cell === WALL) {
    return "bg-slate-950";
  }

  if (cell === STAR) {
    return "bg-yellow-200";
  }

  if (cell === GOAL) {
    return "bg-green-300";
  }

  if (cell === START) {
    return "bg-white";
  }

  return "bg-white";
}

// =====================================================
// UI COMPONENTS
// =====================================================

function DifficultyCard({
  icon,
  title,
  board,
  description,
  color,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} border-2 border-slate-950 rounded-3xl p-6 text-left shadow-[6px_6px_0_#111827] hover:-translate-y-1 transition`}
    >

      <div className="text-5xl">
        {icon}
      </div>

      <h2 className="text-2xl font-black mt-4">
        {title}
      </h2>

      <p className="font-black mt-2">
        {board}
      </p>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {description}
      </p>

      <p className="font-black mt-6">
        START →
      </p>

    </button>
  );
}

function CompactStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-xl p-3 text-center shadow-[3px_3px_0_#111827]">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="text-2xl font-black">
        {value}
      </p>

      <p className="text-xs font-bold">
        {label}
      </p>

    </div>
  );
}

function ResultStat({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div
      className={`${color} border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0_#111827]`}
    >

      <div className="text-3xl">
        {icon}
      </div>

      <p className="text-3xl font-black mt-2">
        {value}
      </p>

      <p className="font-bold text-sm">
        {label}
      </p>

    </div>
  );
}

function ControlButton({
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-slate-950 rounded-2xl text-3xl flex items-center justify-center shadow-[4px_4px_0_#111827] active:translate-y-1 active:shadow-none transition"
    >
      {icon}
    </button>
  );
}

export default GridQuest;