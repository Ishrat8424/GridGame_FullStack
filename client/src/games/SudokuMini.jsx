import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

// =====================================================
// SUDOKU CONFIGURATION
// =====================================================

const sudokuConfig = {
  easy: {
  size: 3,
  numbers: [1, 2, 3],
  boxRows: 1,
  boxCols: 3,

  puzzles: [
    {
      puzzle: [
        [1, 0, 3],
        [0, 3, 1],
        [3, 1, 0],
      ],
      solution: [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2],
      ],
    },

    {
      puzzle: [
        [0, 2, 3],
        [2, 0, 1],
        [3, 1, 0],
      ],
      solution: [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2],
      ],
    },

    {
      puzzle: [
        [1, 0, 0],
        [0, 3, 1],
        [0, 1, 2],
      ],
      solution: [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2],
      ],
    },

    {
      puzzle: [
        [0, 2, 0],
        [2, 0, 1],
        [0, 1, 2],
      ],
      solution: [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2],
      ],
    },
  ],
},

  medium: {
    size: 4,
    numbers: [1, 2, 3, 4],
    boxRows: 2,
    boxCols: 2,

    puzzles: [
      {
        puzzle: [
          [1, 0, 0, 4],
          [0, 4, 1, 0],
          [0, 1, 4, 0],
          [4, 0, 0, 1],
        ],
        solution: [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 1],
        ],
      },

      {
        puzzle: [
          [0, 2, 3, 0],
          [3, 0, 0, 2],
          [2, 0, 0, 3],
          [0, 3, 2, 0],
        ],
        solution: [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 1],
        ],
      },

      {
        puzzle: [
          [1, 0, 3, 0],
          [0, 4, 0, 2],
          [2, 0, 4, 0],
          [0, 3, 0, 1],
        ],
        solution: [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 1],
        ],
      },
    ],
  },

  hard: {
  size: 6,
  numbers: [1, 2, 3, 4, 5, 6],
  boxRows: 2,
  boxCols: 3,

  puzzles: [
    {
      puzzle: [
        [1, 0, 0, 4, 0, 6],
        [0, 5, 6, 0, 2, 0],
        [2, 0, 4, 5, 0, 1],
        [0, 6, 0, 2, 3, 0],
        [3, 0, 5, 6, 0, 2],
        [0, 1, 0, 3, 4, 0],
      ],

      solution: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 4, 5, 6, 1],
        [5, 6, 1, 2, 3, 4],
        [3, 4, 5, 6, 1, 2],
        [6, 1, 2, 3, 4, 5],
      ],
    },

    {
      puzzle: [
        [0, 2, 0, 4, 5, 0],
        [4, 0, 6, 0, 0, 3],
        [0, 3, 4, 0, 6, 0],
        [5, 0, 0, 2, 0, 4],
        [0, 4, 5, 0, 1, 0],
        [6, 0, 2, 3, 0, 5],
      ],

      solution: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 4, 5, 6, 1],
        [5, 6, 1, 2, 3, 4],
        [3, 4, 5, 6, 1, 2],
        [6, 1, 2, 3, 4, 5],
      ],
    },

    {
      puzzle: [
        [1, 0, 3, 0, 5, 0],
        [0, 5, 0, 1, 0, 3],
        [2, 0, 4, 0, 6, 0],
        [0, 6, 0, 2, 0, 4],
        [3, 0, 5, 0, 1, 0],
        [0, 1, 0, 3, 0, 5],
      ],

      solution: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 4, 5, 6, 1],
        [5, 6, 1, 2, 3, 4],
        [3, 4, 5, 6, 1, 2],
        [6, 1, 2, 3, 4, 5],
      ],
    },
  ],
},
};

function SudokuMini() {
  const { updateUser } = useAuth();

  // =====================================================
  // SCREEN
  // difficulty → game → result
  // =====================================================

  const [screen, setScreen] =
    useState("difficulty");

  const [difficulty, setDifficulty] =
    useState(null);

  const [lastPuzzleIndex, setLastPuzzleIndex] =
    useState({});

  // =====================================================
  // GAME STATE
  // =====================================================

  const [board, setBoard] =
    useState([]);

  const [
    initialBoard,
    setInitialBoard,
  ] = useState([]);

  const [solution, setSolution] =
    useState([]);

  const [mistakes, setMistakes] =
    useState(0);

  const [checks, setChecks] =
    useState(0);

  const [message, setMessage] =
    useState("");

  // =====================================================
  // RESULT
  // =====================================================

  const [saving, setSaving] =
    useState(false);

  const [xpEarned, setXpEarned] =
    useState(0);

  const [
    finalScore,
    setFinalScore,
  ] = useState(0);

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
      ? sudokuConfig[
          difficulty
        ]
      : null;

  const size =
    currentConfig?.size || 3;

  const numbers =
    currentConfig?.numbers ||
    [1, 2, 3];

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress = useMemo(() => {
    if (
      board.length === 0 ||
      initialBoard.length === 0
    ) {
      return 0;
    }

    let editableCells = 0;
    let filledCells = 0;

    for (
      let row = 0;
      row < board.length;
      row++
    ) {
      for (
        let col = 0;
        col <
        board[row].length;
        col++
      ) {
        if (
          initialBoard[row][
            col
          ] === 0
        ) {
          editableCells++;

          if (
            board[row][col] !==
            0
          ) {
            filledCells++;
          }
        }
      }
    }

    if (
      editableCells === 0
    ) {
      return 100;
    }

    return Math.round(
      (filledCells /
        editableCells) *
        100
    );
  }, [
    board,
    initialBoard,
  ]);

  // =====================================================
  // START GAME
  // =====================================================

const startGame = (selectedDifficulty) => {
  const config =
    sudokuConfig[selectedDifficulty];

  const puzzleCount =
    config.puzzles.length;

  let randomIndex;

  // If there is only one puzzle,
  // simply use that one.
  if (puzzleCount === 1) {
    randomIndex = 0;
  } else {
    do {
      randomIndex =
        Math.floor(
          Math.random() *
            puzzleCount
        );
    } while (
      randomIndex ===
      lastPuzzleIndex[
        selectedDifficulty
      ]
    );
  }

  const selectedPuzzle =
    config.puzzles[randomIndex];

  setLastPuzzleIndex(
    (previous) => ({
      ...previous,

      [selectedDifficulty]:
        randomIndex,
    })
  );

  const copiedPuzzle =
    selectedPuzzle.puzzle.map(
      (row) => [...row]
    );

  const copiedSolution =
    selectedPuzzle.solution.map(
      (row) => [...row]
    );

  setDifficulty(
    selectedDifficulty
  );

  setBoard(
    copiedPuzzle
  );

  setInitialBoard(
    copiedPuzzle.map(
      (row) => [...row]
    )
  );

  setSolution(
    copiedSolution
  );

  setMistakes(0);

  setChecks(0);

  setMessage("");

  setSaving(false);

  setXpEarned(0);

  setFinalScore(0);

  setError("");

  setUnlockedAchievements([]);

  setScreen("game");
};

  // =====================================================
  // CELL CHANGE
  // =====================================================

  const handleCellChange = (
    rowIndex,
    colIndex,
    value
  ) => {
    if (
      initialBoard[rowIndex][
        colIndex
      ] !== 0
    ) {
      return;
    }

    if (value === "") {
      const newBoard =
        board.map(
          (row) => [...row]
        );

      newBoard[rowIndex][
        colIndex
      ] = 0;

      setBoard(newBoard);

      setMessage("");

      return;
    }

    const numericValue =
      Number(value);

    if (
      !numbers.includes(
        numericValue
      )
    ) {
      return;
    }

    const newBoard =
      board.map(
        (row) => [...row]
      );

    newBoard[rowIndex][
      colIndex
    ] = numericValue;

    setBoard(newBoard);

    setMessage("");
  };

  // =====================================================
  // CHECK ANSWER
  // =====================================================

  const checkAnswer = async () => {
    const nextChecks =
      checks + 1;

    setChecks(
      nextChecks
    );

    const hasEmptyCell =
      board.some(
        (row) =>
          row.some(
            (value) =>
              value === 0
          )
      );

    if (hasEmptyCell) {
      setMessage(
        "⚠️ Complete all empty cells first."
      );

      return;
    }

    // Verify Sudoku rules
    const validRules =
      validateSudokuBoard(
        board,
        currentConfig
      );

    const matchesSolution =
      board.every(
        (
          row,
          rowIndex
        ) =>
          row.every(
            (
              value,
              colIndex
            ) =>
              value ===
              solution[
                rowIndex
              ][colIndex]
          )
      );

    if (
      !validRules ||
      !matchesSolution
    ) {
      setMistakes(
        (previous) =>
          previous + 1
      );

      setMessage(
        "❌ Some numbers are incorrect. Check rows, columns and boxes."
      );

      return;
    }

    setMessage(
      "✅ Perfect! Puzzle solved."
    );

    await finishGame(
      nextChecks
    );
  };

  // =====================================================
  // FINISH GAME
  // =====================================================

  const finishGame = async (
    finalChecks
  ) => {
    try {
      setSaving(true);

      setError("");

      const score =
        calculateScore({
          difficulty,
          mistakes,
          checks:
            finalChecks,
        });

      setFinalScore(
        score
      );

      const response =
        await api.post(
          "/games/result",
          {
            game:
              "Sudoku Mini",

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
        "Failed to save Sudoku result:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Puzzle solved, but the result could not be saved."
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

    setBoard([]);

    setInitialBoard([]);

    setSolution([]);

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
              GAME 05 / LOGIC
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3">
              SUDOKU MINI 🔢
            </h1>

            <p className="mt-4 text-base md:text-lg">
              Choose your challenge
              and solve the grid.
            </p>

          </section>

          <section className="grid sm:grid-cols-3 gap-5 mt-10">

            <DifficultyCard
              icon="🙂"
              title="Easy"
              board="3 × 3"
              numbers="Numbers 1–3"
              description="A quick beginner-friendly logic puzzle."
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
              board="4 × 4"
              numbers="Numbers 1–4"
              description="Rows, columns and 2×2 boxes must be unique."
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
              board="6 × 6"
              numbers="Numbers 1–6"
              description="Larger board with 2×3 Sudoku boxes."
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
                🟢 Easy: each row
                and column uses
                numbers 1–3 once.
              </p>

              <p>
                🟡 Medium: each row,
                column and 2×2 box
                uses numbers 1–4
                once.
              </p>

              <p>
                🔴 Hard: each row,
                column and 2×3 box
                uses numbers 1–6
                once.
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
              🎉
            </div>

            <p className="font-mono font-black tracking-widest mt-5">
              PUZZLE COMPLETE
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-3">
              Sudoku Solved!
            </h1>

            <p className="capitalize font-bold mt-3">
              {difficulty} Mode
              {" • "}
              {size}×{size}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">

              <ResultStat
                icon="🎯"
                value={
                  finalScore
                }
                label="Score"
                color="bg-orange-200"
              />

              <ResultStat
                icon="⚡"
                value={`+${xpEarned}`}
                label="XP"
                color="bg-yellow-200"
              />

              <ResultStat
                icon="❌"
                value={
                  mistakes
                }
                label="Mistakes"
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

                        <span className="text-3xl">
                          {
                            achievement.icon
                          }
                        </span>

                        <h3 className="font-black mt-2">
                          {
                            achievement.title
                          }
                        </h3>

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

        {/* TOP BAR */}

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
              Sudoku Mini 🔢
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
            icon="📈"
            value={`${progress}%`}
            label="Complete"
          />

          <CompactStat
            icon="❌"
            value={mistakes}
            label="Mistakes"
          />

          <CompactStat
            icon="🔍"
            value={checks}
            label="Checks"
          />

        </div>

        {/* SUDOKU BOARD */}

        <section className="bg-cyan-300 border-2 border-slate-950 rounded-3xl p-3 sm:p-6 shadow-[7px_7px_0_#111827]">

          <div
            className="grid mx-auto"
            style={{
              gridTemplateColumns:
                `repeat(${size}, minmax(0, 1fr))`,

              maxWidth:
                size === 6
                  ? "560px"
                  : size === 4
                  ? "430px"
                  : "330px",
            }}
          >

            {board.map(
              (
                row,
                rowIndex
              ) =>
                row.map(
                  (
                    value,
                    colIndex
                  ) => {
                    const fixed =
                      initialBoard[
                        rowIndex
                      ][
                        colIndex
                      ] !== 0;

                    const boxClasses =
                      getBoxBorderClasses(
                        rowIndex,
                        colIndex,
                        currentConfig
                      );

                    return (
                      <input
                        key={`${rowIndex}-${colIndex}`}
                        type="number"
                        min="1"
                        max={size}
                        inputMode="numeric"
                        value={
                          value === 0
                            ? ""
                            : value
                        }
                        onChange={(
                          event
                        ) =>
                          handleCellChange(
                            rowIndex,
                            colIndex,
                            event
                              .target
                              .value
                          )
                        }
                        disabled={
                          fixed
                        }
                        className={`
                          aspect-square
                          w-full
                          text-center
                          font-black
                          outline-none
                          border-slate-950
                          ${boxClasses}
                          ${
                            size === 6
                              ? "text-xl sm:text-2xl"
                              : "text-2xl sm:text-4xl"
                          }
                          ${
                            fixed
                              ? "bg-slate-950 text-white"
                              : "bg-white focus:bg-pink-100"
                          }
                          disabled:cursor-not-allowed
                        `}
                      />
                    );
                  }
                )
            )}

          </div>

        </section>

        {/* NUMBER GUIDE */}

        <section className="mt-5 flex flex-wrap items-center justify-center gap-2">

          <span className="font-black mr-1">
            Numbers:
          </span>

          {numbers.map(
            (number) => (

              <span
                key={
                  number
                }
                className="w-9 h-9 bg-white border-2 border-slate-950 rounded-lg flex items-center justify-center font-black"
              >
                {number}
              </span>

            )
          )}

        </section>

        {/* MESSAGE */}

        {message && (

          <div className="mt-5 bg-white border-2 border-slate-950 rounded-xl p-4 text-center font-black">
            {message}
          </div>

        )}

        {/* CHECK */}

        <button
          type="button"
          onClick={
            checkAnswer
          }
          disabled={saving}
          className="w-full mt-6 bg-pink-500 text-white border-2 border-slate-950 rounded-xl py-4 font-black text-lg shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition disabled:opacity-60"
        >
          {saving
            ? "SAVING..."
            : "CHECK ANSWER ✓"}
        </button>

        {/* RULE */}

        <section className="mt-8 bg-white border-2 border-slate-950 rounded-2xl p-5">

          <p className="font-black">
            💡 Current Rules
          </p>

          <p className="text-slate-600 mt-2 text-sm">

            Every row and column
            must contain numbers
            1–{size} exactly once.

            {difficulty ===
              "medium" &&
              " Every 2×2 box must also contain 1–4 exactly once."}

            {difficulty ===
              "hard" &&
              " Every 2×3 box must also contain 1–6 exactly once."}

          </p>

        </section>

      </main>

    </div>
  );
}

// =====================================================
// VALIDATE SUDOKU BOARD
// =====================================================

function validateSudokuBoard(
  board,
  config
) {
  if (!config) {
    return false;
  }

  const {
    size,
    numbers,
    boxRows,
    boxCols,
  } = config;

  // Rows
  for (
    let row = 0;
    row < size;
    row++
  ) {
    if (
      !containsAllNumbers(
        board[row],
        numbers
      )
    ) {
      return false;
    }
  }

  // Columns
  for (
    let col = 0;
    col < size;
    col++
  ) {
    const column =
      [];

    for (
      let row = 0;
      row < size;
      row++
    ) {
      column.push(
        board[row][col]
      );
    }

    if (
      !containsAllNumbers(
        column,
        numbers
      )
    ) {
      return false;
    }
  }

  // Boxes
  if (
    boxRows > 1 ||
    boxCols < size
  ) {
    for (
      let startRow = 0;
      startRow < size;
      startRow += boxRows
    ) {
      for (
        let startCol = 0;
        startCol < size;
        startCol += boxCols
      ) {
        const box =
          [];

        for (
          let row = 0;
          row < boxRows;
          row++
        ) {
          for (
            let col = 0;
            col < boxCols;
            col++
          ) {
            box.push(
              board[
                startRow +
                  row
              ][
                startCol +
                  col
              ]
            );
          }
        }

        if (
          !containsAllNumbers(
            box,
            numbers
          )
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

function containsAllNumbers(
  values,
  numbers
) {
  if (
    values.length !==
    numbers.length
  ) {
    return false;
  }

  const unique =
    new Set(values);

  if (
    unique.size !==
    numbers.length
  ) {
    return false;
  }

  return numbers.every(
    (number) =>
      unique.has(number)
  );
}

// =====================================================
// BOX BORDER STYLING
// =====================================================

function getBoxBorderClasses(
  rowIndex,
  colIndex,
  config
) {
  if (!config) {
    return "border";
  }

  const {
    size,
    boxRows,
    boxCols,
  } = config;

  const classes = [
    "border",
  ];

  // Outer edges
  if (
    rowIndex === 0
  ) {
    classes.push(
      "border-t-4"
    );
  }

  if (
    colIndex === 0
  ) {
    classes.push(
      "border-l-4"
    );
  }

  if (
    rowIndex ===
    size - 1
  ) {
    classes.push(
      "border-b-4"
    );
  }

  if (
    colIndex ===
    size - 1
  ) {
    classes.push(
      "border-r-4"
    );
  }

  // Box boundaries
  if (
    (rowIndex + 1) %
      boxRows ===
      0 &&
    rowIndex !==
      size - 1
  ) {
    classes.push(
      "border-b-4"
    );
  }

  if (
    (colIndex + 1) %
      boxCols ===
      0 &&
    colIndex !==
      size - 1
  ) {
    classes.push(
      "border-r-4"
    );
  }

  return classes.join(
    " "
  );
}

// =====================================================
// SCORE
// =====================================================

function calculateScore({
  difficulty,
  mistakes,
  checks,
}) {
  let score = 500;

  if (
    difficulty === "easy"
  ) {
    score = 500;
  }

  if (
    difficulty ===
    "medium"
  ) {
    score = 800;
  }

  if (
    difficulty === "hard"
  ) {
    score = 1200;
  }

  score -=
    mistakes * 75;

  score -=
    Math.max(
      checks - 1,
      0
    ) * 25;

  return Math.max(
    score,
    100
  );
}

// =====================================================
// DIFFICULTY CARD
// =====================================================

function DifficultyCard({
  icon,
  title,
  board,
  numbers,
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

      <p className="text-sm font-bold text-slate-600">
        {numbers}
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

// =====================================================
// COMPACT STAT
// =====================================================

function CompactStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center shadow-[3px_3px_0_#111827]">

      <div className="text-xl sm:text-2xl">
        {icon}
      </div>

      <p className="text-xl sm:text-2xl font-black">
        {value}
      </p>

      <p className="text-[10px] sm:text-xs font-bold">
        {label}
      </p>

    </div>
  );
}

// =====================================================
// RESULT STAT
// =====================================================

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

export default SudokuMini;