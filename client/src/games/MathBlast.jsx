import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

function MathBlast() {
  const { updateUser } = useAuth();

  const totalQuestions = 10;

  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  const [question, setQuestion] = useState(() => generateQuestion());

  const progress = useMemo(() => {
    return Math.min(
      ((questionNumber - 1) / totalQuestions) * 100,
      100
    );
  }, [questionNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answer === "") {
      setMessage("Enter an answer first.");
      return;
    }

    const numericAnswer = Number(answer);

    const isCorrect =
      numericAnswer === question.correctAnswer;

    const newScore = isCorrect
      ? score + 100
      : score;

    if (isCorrect) {
      setScore(newScore);
      setMessage("✅ Correct! +100 points");
    } else {
      setMessage(
        `❌ Wrong! Correct answer: ${question.correctAnswer}`
      );
    }

    if (questionNumber >= totalQuestions) {
      await finishGame(newScore);
      return;
    }

    setTimeout(() => {
      setQuestion(generateQuestion());
      setQuestionNumber((prev) => prev + 1);
      setAnswer("");
      setMessage("");
    }, 700);
  };

  const finishGame = async (finalScore) => {
    try {
      setSaving(true);

      const correctAnswers = Math.floor(finalScore / 100);

      const earnedXP = calculateXP(correctAnswers);

      const result =
        correctAnswers >= 6
          ? "won"
          : "completed";

      const response = await api.post("/games/result", {
        game: "Math Blast",
        score: finalScore,
        result,
        xpEarned: earnedXP,
      });

      updateUser(response.data.user);

      setXpEarned(earnedXP);

      setUnlockedAchievements(
        response.data.unlockedAchievements || []
      );

      setGameFinished(true);
    } catch (error) {
      console.error(
        "Failed to save Math Blast result:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Game finished, but the result could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  const restartGame = () => {
    setQuestionNumber(1);
    setScore(0);
    setAnswer("");
    setMessage("");
    setGameFinished(false);
    setSaving(false);
    setXpEarned(0);
    setUnlockedAchievements([]);
    setQuestion(generateQuestion());
  };

  if (gameFinished) {
    const correctAnswers = Math.floor(score / 100);

    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 pb-12 pt-28">

          <div className="bg-white border-2 border-slate-950 rounded-3xl p-8 md:p-12 text-center shadow-[8px_8px_0_#111827]">

            <p className="font-mono font-black tracking-[0.2em]">
              ROUND COMPLETE
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-3">
              Math Blast Finished! 🧮
            </h1>

            <div className="grid sm:grid-cols-3 gap-5 mt-10">

              <ResultCard
                icon="🎯"
                value={`${correctAnswers}/${totalQuestions}`}
                label="Correct"
                color="bg-cyan-300"
              />

              <ResultCard
                icon="⭐"
                value={score}
                label="Score"
                color="bg-pink-300"
              />

              <ResultCard
                icon="⚡"
                value={`+${xpEarned}`}
                label="XP Earned"
                color="bg-yellow-200"
              />

            </div>

            {unlockedAchievements.length > 0 && (
              <div className="mt-10">

                <p className="font-mono font-black tracking-widest">
                  NEW ACHIEVEMENTS
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">

                  {unlockedAchievements.map(
                    (achievement) => (
                      <div
                        key={achievement._id}
                        className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-5 shadow-[4px_4px_0_#111827]"
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

              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

              <button
                type="button"
                onClick={restartGame}
                className="bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-7 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
              >
                🔁 PLAY AGAIN
              </button>

              <Link
                to="/dashboard"
                className="bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-7 py-3 font-black hover:-translate-y-1 transition"
              >
                📊 DASHBOARD
              </Link>

              <Link
                to="/"
                className="bg-cyan-300 border-2 border-slate-950 rounded-xl px-7 py-3 font-black hover:-translate-y-1 transition"
              >
                🎮 ARCADE
              </Link>

            </div>

          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-12 pt-28">

        {/* HEADER */}
        <section className="text-center">

          <p className="font-mono font-black tracking-[0.2em]">
            GAME 06 / CALCULATION
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-3">
            MATH BLAST 🧮
          </h1>

          <p className="text-lg mt-4">
            Solve quickly, build your score and earn XP.
          </p>

        </section>

        {/* PROGRESS */}
        <section className="mt-10">

          <div className="flex justify-between font-black mb-2">

            <span>
              Question {questionNumber} / {totalQuestions}
            </span>

            <span>
              Score: {score}
            </span>

          </div>

          <div className="h-5 bg-white border-2 border-slate-950 rounded-full overflow-hidden">

            <div
              className="h-full bg-pink-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* GAME CARD */}
        <section className="mt-8 bg-cyan-300 border-2 border-slate-950 rounded-3xl p-8 md:p-12 shadow-[8px_8px_0_#111827]">

          <p className="font-mono font-black tracking-widest text-center">
            SOLVE THIS
          </p>

          <div className="mt-8 flex items-center justify-center gap-5 text-5xl md:text-7xl font-black">

            <span>{question.firstNumber}</span>

            <span>{question.symbol}</span>

            <span>{question.secondNumber}</span>

            <span>=</span>

            <span>?</span>

          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10"
          >

            <label className="block font-black mb-2">
              Your Answer
            </label>

            <input
              type="number"
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              autoFocus
              placeholder="Type your answer"
              className="w-full bg-white border-2 border-slate-950 rounded-xl px-5 py-4 text-2xl font-black text-center outline-none focus:ring-4 focus:ring-pink-200"
            />

            {message && (
              <div className="mt-4 bg-white border-2 border-slate-950 rounded-xl p-3 text-center font-black">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-slate-950 text-white border-2 border-slate-950 rounded-xl py-4 font-black text-lg hover:bg-pink-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "SAVING RESULT..."
                : questionNumber === totalQuestions
                ? "FINISH ROUND 🚀"
                : "SUBMIT ANSWER →"}
            </button>

          </form>

        </section>

        {/* RULES */}
        <section className="mt-10 grid md:grid-cols-3 gap-5">

          <InfoCard
            icon="✅"
            title="+100 Points"
            description="Every correct answer adds 100 points."
          />

          <InfoCard
            icon="🏆"
            title="6+ Correct"
            description="Score at least 6 correct answers to count the round as a win."
          />

          <InfoCard
            icon="⚡"
            title="Earn XP"
            description="Your XP reward increases with your performance."
          />

        </section>

      </main>
    </div>
  );
}

function generateQuestion() {
  const operations = [
    "+",
    "-",
    "×",
    "÷",
  ];

  const operation =
    operations[
      Math.floor(
        Math.random() * operations.length
      )
    ];

  let firstNumber;
  let secondNumber;
  let correctAnswer;

  if (operation === "+") {
    firstNumber = randomNumber(1, 50);
    secondNumber = randomNumber(1, 50);

    correctAnswer =
      firstNumber + secondNumber;
  }

  if (operation === "-") {
    firstNumber = randomNumber(10, 60);
    secondNumber = randomNumber(
      1,
      firstNumber
    );

    correctAnswer =
      firstNumber - secondNumber;
  }

  if (operation === "×") {
    firstNumber = randomNumber(2, 12);
    secondNumber = randomNumber(2, 12);

    correctAnswer =
      firstNumber * secondNumber;
  }

  if (operation === "÷") {
    secondNumber = randomNumber(2, 12);
    correctAnswer = randomNumber(2, 12);

    firstNumber =
      secondNumber * correctAnswer;
  }

  return {
    firstNumber,
    secondNumber,
    symbol: operation,
    correctAnswer,
  };
}

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function calculateXP(correctAnswers) {
  if (correctAnswers === 10) {
    return 50;
  }

  if (correctAnswers >= 8) {
    return 40;
  }

  if (correctAnswers >= 6) {
    return 30;
  }

  if (correctAnswers >= 3) {
    return 15;
  }

  return 5;
}

function ResultCard({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div
      className={`${color} border-2 border-slate-950 rounded-2xl p-6 shadow-[4px_4px_0_#111827]`}
    >
      <div className="text-4xl">
        {icon}
      </div>

      <p className="text-4xl font-black mt-3">
        {value}
      </p>

      <p className="font-bold mt-1">
        {label}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-2xl p-5 shadow-[4px_4px_0_#111827]">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="font-black text-xl mt-3">
        {title}
      </h3>

      <p className="text-slate-600 mt-2">
        {description}
      </p>

    </div>
  );
}

export default MathBlast;