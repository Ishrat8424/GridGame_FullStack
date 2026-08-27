import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

function TicTacToe() {
  const { updateUser } = useAuth();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [difficulty, setDifficulty] = useState("easy");

  const [saving, setSaving] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const [unlockedAchievements, setUnlockedAchievements] =
    useState([]);

  const [error, setError] = useState("");

  // =========================================
  // PLAYER MOVE
  // =========================================

  const handlePlayerMove = (index) => {
    if (
      board[index] ||
      !isPlayerTurn ||
      gameOver
    ) {
      return;
    }

    const newBoard = [...board];

    newBoard[index] = "X";

    setBoard(newBoard);

    const result = checkWinner(newBoard);

    if (result) {
      finishGame(result);
      return;
    }

    if (newBoard.every(Boolean)) {
      finishGame("draw");
      return;
    }

    setIsPlayerTurn(false);

    setTimeout(() => {
      makeComputerMove(newBoard);
    }, 500);
  };

  // =========================================
  // COMPUTER MOVE
  // =========================================

  const makeComputerMove = (currentBoard) => {
    let move = null;

    if (difficulty === "easy") {
      move = getRandomMove(currentBoard);
    }

    if (difficulty === "medium") {
      move = getMediumMove(currentBoard);
    }

    if (difficulty === "hard") {
      move = getBestMove(currentBoard);
    }

    if (move === null || move === undefined) {
      finishGame("draw");
      return;
    }

    const newBoard = [...currentBoard];

    newBoard[move] = "O";

    setBoard(newBoard);

    const result = checkWinner(newBoard);

    if (result) {
      finishGame(result);
      return;
    }

    if (newBoard.every(Boolean)) {
      finishGame("draw");
      return;
    }

    setIsPlayerTurn(true);
  };

  // =========================================
  // FINISH GAME
  // =========================================

  const finishGame = async (result) => {
    setWinner(result);
    setGameOver(true);
    setIsPlayerTurn(false);

    try {
      setSaving(true);
      setError("");

      let backendResult = "completed";

      if (result === "X") {
        backendResult = "won";
      } else if (result === "O") {
        backendResult = "lost";
      }

      // Score differs slightly by difficulty
      let score = 0;

      if (result === "X") {
        if (difficulty === "easy") {
          score = 300;
        }

        if (difficulty === "medium") {
          score = 500;
        }

        if (difficulty === "hard") {
          score = 800;
        }
      }

      if (result === "draw") {
        if (difficulty === "easy") {
          score = 100;
        }

        if (difficulty === "medium") {
          score = 200;
        }

        if (difficulty === "hard") {
          score = 300;
        }
      }

      if (result === "O") {
        score = 50;
      }

      const response = await api.post(
        "/games/result",
        {
          game: "Toon Tac Toe",
          score,
          result: backendResult,

          // We will store this later in GameResult model
          difficulty,
        }
      );

      updateUser(response.data.user);

      setXpEarned(
        response.data.gameResult.xpEarned
      );

      setUnlockedAchievements(
        response.data.unlockedAchievements || []
      );
    } catch (err) {
      console.error(
        "Failed to save Tic Tac Toe result:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Game finished, but the result could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // RESTART
  // =========================================

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
    setSaving(false);
    setXpEarned(0);
    setUnlockedAchievements([]);
    setError("");
  };

  // =========================================
  // CHANGE DIFFICULTY
  // =========================================

  const changeDifficulty = (level) => {
    setDifficulty(level);

    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
    setSaving(false);
    setXpEarned(0);
    setUnlockedAchievements([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-12 pt-28">

        {/* HEADER */}
        <section className="text-center">

          <p className="font-mono font-black tracking-[0.2em]">
            GAME 03 / STRATEGY
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-3">
            TOON TAC TOE ⭕
          </h1>

          <p className="text-lg mt-4">
            Beat the computer and get three in a row.
          </p>

        </section>

        {/* DIFFICULTY */}
        <section className="mt-8">

          <p className="font-black text-center mb-3">
            CHOOSE DIFFICULTY
          </p>

          <div className="flex flex-wrap justify-center gap-3">

            {[
              {
                id: "easy",
                label: "Easy",
                icon: "🙂",
                color: "bg-green-300",
              },
              {
                id: "medium",
                label: "Medium",
                icon: "😎",
                color: "bg-orange-300",
              },
              {
                id: "hard",
                label: "Hard",
                icon: "🤖",
                color: "bg-red-300",
              },
            ].map((level) => (

              <button
                key={level.id}
                type="button"
                onClick={() =>
                  changeDifficulty(level.id)
                }
                className={`px-6 py-3 rounded-xl border-2 border-slate-950 font-black transition shadow-[3px_3px_0_#111827]
                ${
                  difficulty === level.id
                    ? `${level.color} -translate-y-1`
                    : "bg-white hover:bg-cyan-200"
                }`}
              >
                {level.icon} {level.label}
              </button>

            ))}

          </div>

        </section>

        {/* GAME CARD */}
        <section className="mt-8 max-w-xl mx-auto bg-orange-300 border-2 border-slate-950 rounded-3xl p-8 shadow-[8px_8px_0_#111827]">

          <div className="flex items-center justify-between font-black mb-3">

            <span>
              You: X
            </span>

            <span>
              Computer: O
            </span>

          </div>

          <div className="text-center mb-6">

            <span className="inline-block bg-white border-2 border-slate-950 rounded-xl px-4 py-2 font-black capitalize">
              Difficulty: {difficulty}
            </span>

          </div>

          {/* BOARD */}
          <div className="grid grid-cols-3 gap-3">

            {board.map((cell, index) => (

              <button
                key={index}
                type="button"
                onClick={() =>
                  handlePlayerMove(index)
                }
                disabled={
                  gameOver ||
                  !isPlayerTurn ||
                  Boolean(cell)
                }
                className={`aspect-square border-2 border-slate-950 rounded-2xl text-5xl md:text-6xl font-black flex items-center justify-center transition
                ${
                  cell === "X"
                    ? "bg-cyan-200"
                    : cell === "O"
                    ? "bg-pink-200"
                    : "bg-white hover:bg-yellow-100"
                }
                disabled:cursor-not-allowed`}
              >
                {cell}

              </button>

            ))}

          </div>

          {/* GAME STATUS */}
          <div className="mt-7 text-center">

            {!gameOver && (

              <p className="font-black text-xl">

                {isPlayerTurn
                  ? "Your turn 🎯"
                  : difficulty === "hard"
                  ? "Hard AI is calculating... 🤖"
                  : "Computer is thinking... 🤖"}

              </p>

            )}

            {gameOver && (

              <div>

                <p className="font-black text-3xl">

                  {winner === "X" &&
                    "🎉 You Win!"}

                  {winner === "O" &&
                    "🤖 Computer Wins!"}

                  {winner === "draw" &&
                    "🤝 It's a Draw!"}

                </p>

                <p className="font-bold mt-2 capitalize">
                  {difficulty} Mode
                </p>

                {saving ? (

                  <p className="font-bold mt-3">
                    Saving result...
                  </p>

                ) : (

                  <p className="font-black text-xl mt-3">
                    ⚡ +{xpEarned} XP
                  </p>

                )}

                {error && (

                  <div className="mt-4 bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                    ❌ {error}
                  </div>

                )}

                <button
                  type="button"
                  onClick={restartGame}
                  className="mt-5 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
                >
                  🔁 PLAY AGAIN
                </button>

              </div>

            )}

          </div>

        </section>

        {/* ACHIEVEMENTS */}
        {unlockedAchievements.length > 0 && (

          <section className="mt-10 max-w-xl mx-auto">

            <p className="font-mono font-black tracking-widest text-center">
              NEW ACHIEVEMENTS
            </p>

            <div className="space-y-4 mt-5">

              {unlockedAchievements.map(
                (achievement) => (

                  <div
                    key={achievement._id}
                    className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-5 text-center shadow-[4px_4px_0_#111827]"
                  >

                    <div className="text-5xl">
                      {achievement.icon}
                    </div>

                    <h3 className="font-black text-xl mt-3">
                      {achievement.title}
                    </h3>

                    <p className="text-slate-600 mt-1">
                      {achievement.description}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* NAVIGATION */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          <Link
            to="/dashboard"
            className="bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black text-center hover:-translate-y-1 transition"
          >
            📊 DASHBOARD
          </Link>

          <Link
            to="/"
            className="bg-cyan-300 border-2 border-slate-950 rounded-xl px-6 py-3 font-black text-center hover:-translate-y-1 transition"
          >
            ← BACK TO ARCADE
          </Link>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// EASY AI
// =====================================================

function getRandomMove(board) {
  const emptyCells = board
    .map((cell, index) =>
      cell === null ? index : null
    )
    .filter(
      (index) => index !== null
    );

  if (emptyCells.length === 0) {
    return null;
  }

  return emptyCells[
    Math.floor(
      Math.random() *
        emptyCells.length
    )
  ];
}

// =====================================================
// MEDIUM AI
// =====================================================

function getMediumMove(board) {
  // Try to win
  for (let i = 0; i < board.length; i++) {

    if (board[i] === null) {

      const copy = [...board];

      copy[i] = "O";

      if (
        checkWinner(copy) === "O"
      ) {
        return i;
      }

    }

  }

  // Block player
  for (let i = 0; i < board.length; i++) {

    if (board[i] === null) {

      const copy = [...board];

      copy[i] = "X";

      if (
        checkWinner(copy) === "X"
      ) {
        return i;
      }

    }

  }

  // Take center if available
  if (board[4] === null) {
    return 4;
  }

  return getRandomMove(board);
}

// =====================================================
// HARD AI
// =====================================================

function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {

    if (board[i] === null) {

      board[i] = "O";

      const score = minimax(
        board,
        0,
        false
      );

      board[i] = null;

      if (score > bestScore) {

        bestScore = score;
        bestMove = i;

      }

    }

  }

  return bestMove;
}

// =====================================================
// MINIMAX
// =====================================================

function minimax(
  board,
  depth,
  isMaximizing
) {
  const winner = checkWinner(board);

  if (winner === "O") {
    return 10 - depth;
  }

  if (winner === "X") {
    return depth - 10;
  }

  if (board.every(Boolean)) {
    return 0;
  }

  if (isMaximizing) {

    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {

      if (board[i] === null) {

        board[i] = "O";

        const score = minimax(
          board,
          depth + 1,
          false
        );

        board[i] = null;

        bestScore = Math.max(
          bestScore,
          score
        );

      }

    }

    return bestScore;

  }

  let bestScore = Infinity;

  for (let i = 0; i < board.length; i++) {

    if (board[i] === null) {

      board[i] = "X";

      const score = minimax(
        board,
        depth + 1,
        true
      );

      board[i] = null;

      bestScore = Math.min(
        bestScore,
        score
      );

    }

  }

  return bestScore;
}

// =====================================================
// CHECK WINNER
// =====================================================

function checkWinner(board) {
  for (const pattern of winningPatterns) {

    const [a, b, c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }

  }

  return null;
}

export default TicTacToe;