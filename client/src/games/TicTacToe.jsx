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
  const [saving, setSaving] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] =
    useState([]);
  const [error, setError] = useState("");

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
      finishGame(result, newBoard);
      return;
    }

    if (newBoard.every(Boolean)) {
      finishGame("draw", newBoard);
      return;
    }

    setIsPlayerTurn(false);

    setTimeout(() => {
      makeComputerMove(newBoard);
    }, 500);
  };

  const makeComputerMove = (currentBoard) => {
    const emptyCells = currentBoard
      .map((cell, index) =>
        cell === null ? index : null
      )
      .filter((index) => index !== null);

    if (emptyCells.length === 0) {
      finishGame("draw", currentBoard);
      return;
    }

    const randomIndex =
      emptyCells[
        Math.floor(
          Math.random() * emptyCells.length
        )
      ];

    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O";

    setBoard(newBoard);

    const result = checkWinner(newBoard);

    if (result) {
      finishGame(result, newBoard);
      return;
    }

    if (newBoard.every(Boolean)) {
      finishGame("draw", newBoard);
      return;
    }

    setIsPlayerTurn(true);
  };

  const finishGame = async (result, finalBoard) => {
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

      const score =
        result === "X"
          ? 300
          : result === "draw"
          ? 150
          : 50;

      const response = await api.post(
        "/games/result",
        {
          game: "Toon Tac Toe",
          score,
          result: backendResult,
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

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-12 pt-28">

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

        <section className="mt-10 max-w-xl mx-auto bg-orange-300 border-2 border-slate-950 rounded-3xl p-8 shadow-[8px_8px_0_#111827]">

          <div className="flex items-center justify-between font-black mb-6">
            <span>You: X</span>
            <span>Computer: O</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  handlePlayerMove(index)
                }
                disabled={gameOver || !isPlayerTurn}
                className="aspect-square bg-white border-2 border-slate-950 rounded-2xl text-5xl md:text-6xl font-black flex items-center justify-center hover:bg-cyan-200 transition disabled:cursor-not-allowed"
              >
                {cell}
              </button>
            ))}
          </div>

          <div className="mt-7 text-center">

            {!gameOver && (
              <p className="font-black text-xl">
                {isPlayerTurn
                  ? "Your turn 🎯"
                  : "Computer is thinking... 🤖"}
              </p>
            )}

            {gameOver && (
              <div>

                <p className="font-black text-2xl">
                  {winner === "X" &&
                    "🎉 You Win!"}

                  {winner === "O" &&
                    "🤖 Computer Wins!"}

                  {winner === "draw" &&
                    "🤝 It's a Draw!"}
                </p>

                {saving ? (
                  <p className="font-bold mt-3">
                    Saving result...
                  </p>
                ) : (
                  <p className="font-black mt-3">
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