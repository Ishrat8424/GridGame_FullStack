import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

// =====================================================
// QUESTION BANK
// =====================================================

const questionBank = {
  easy: [
    {
      pattern: ["⭐", "🌙", "⭐", "🌙", "⭐", "?"],
      options: ["🌙", "⭐", "☀️", "🌈"],
      answer: "🌙",
      explanation: "The pattern alternates ⭐ and 🌙.",
    },
    {
      pattern: ["🍎", "🍌", "🍎", "🍌", "?", "🍌"],
      options: ["🍎", "🍌", "🍇", "🍊"],
      answer: "🍎",
      explanation: "The pattern alternates 🍎 and 🍌.",
    },
    {
      pattern: ["🔵", "🔴", "🔵", "🔴", "?"],
      options: ["🔵", "🔴", "🟢", "🟡"],
      answer: "🔵",
      explanation: "Blue and red repeat alternately.",
    },
    {
      pattern: ["🐱", "🐶", "🐱", "🐶", "🐱", "?"],
      options: ["🐶", "🐱", "🐼", "🦊"],
      answer: "🐶",
      explanation: "Cat and dog repeat alternately.",
    },
    {
      pattern: ["1", "2", "1", "2", "1", "?"],
      options: ["1", "2", "3", "4"],
      answer: "2",
      explanation: "The sequence repeats 1, 2.",
    },
    {
      pattern: ["🍕", "🍔", "🍕", "🍔", "?"],
      options: ["🍕", "🍔", "🌭", "🍟"],
      answer: "🍕",
      explanation: "The sequence alternates 🍕 and 🍔.",
    },
  ],

  medium: [
    {
      pattern: ["🔵", "🔵", "🔴", "🔵", "🔵", "🔴", "?"],
      options: ["🔵", "🔴", "🟢", "🟡"],
      answer: "🔵",
      explanation: "The repeating block is 🔵 🔵 🔴.",
    },
    {
      pattern: ["1", "3", "5", "7", "?"],
      options: ["8", "9", "10", "11"],
      answer: "9",
      explanation: "Each number increases by 2.",
    },
    {
      pattern: ["2", "4", "6", "8", "?"],
      options: ["9", "10", "12", "14"],
      answer: "10",
      explanation: "These are consecutive even numbers.",
    },
    {
      pattern: ["A", "B", "B", "A", "B", "B", "?"],
      options: ["A", "B", "C", "D"],
      answer: "A",
      explanation: "The repeating block is A B B.",
    },
    {
      pattern: ["🌞", "🌞", "🌧️", "🌞", "🌞", "🌧️", "?"],
      options: ["🌞", "🌧️", "❄️", "🌈"],
      answer: "🌞",
      explanation: "The repeating group is 🌞 🌞 🌧️.",
    },
    {
      pattern: ["3", "6", "9", "12", "?"],
      options: ["13", "14", "15", "18"],
      answer: "15",
      explanation: "Each number increases by 3.",
    },
  ],

  hard: [
    {
      pattern: ["1", "2", "4", "7", "11", "?"],
      options: ["14", "15", "16", "17"],
      answer: "16",
      explanation:
        "The increases are +1, +2, +3, +4, so next is +5.",
    },
    {
      pattern: ["2", "4", "8", "16", "?"],
      options: ["20", "24", "30", "32"],
      answer: "32",
      explanation: "Each number doubles.",
    },
    {
      pattern: ["1", "4", "9", "16", "?"],
      options: ["20", "24", "25", "36"],
      answer: "25",
      explanation: "These are square numbers: 1², 2², 3², 4², 5².",
    },
    {
      pattern: ["2", "3", "5", "8", "13", "?"],
      options: ["18", "20", "21", "22"],
      answer: "21",
      explanation:
        "Each term is the sum of the previous two.",
    },
    {
      pattern: ["30", "25", "20", "15", "?"],
      options: ["5", "10", "12", "14"],
      answer: "10",
      explanation: "Each number decreases by 5.",
    },
    {
      pattern: ["1", "2", "6", "24", "?"],
      options: ["48", "72", "100", "120"],
      answer: "120",
      explanation:
        "Multiply successively by 2, 3, 4, then 5.",
    },
  ],
};

// =====================================================
// COMPONENT
// =====================================================

function PatternPuzzle() {
  const { updateUser } = useAuth();

  const [screen, setScreen] =
    useState("difficulty");

  const [difficulty, setDifficulty] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const [message, setMessage] =
    useState("");

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
  // CURRENT QUESTION
  // =====================================================

  const question =
    questions[currentQuestion];

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    return Math.round(
      ((currentQuestion + (answered ? 1 : 0)) /
        questions.length) *
        100
    );
  }, [
    currentQuestion,
    questions,
    answered,
  ]);

  // =====================================================
  // START GAME
  // =====================================================

  const startGame = (
    selectedDifficulty
  ) => {
    const shuffled = [
      ...questionBank[
        selectedDifficulty
      ],
    ].sort(
      () =>
        Math.random() - 0.5
    );

    const selectedQuestions =
      shuffled.slice(0, 5);

    setDifficulty(
      selectedDifficulty
    );

    setQuestions(
      selectedQuestions
    );

    setCurrentQuestion(0);

    setScore(0);

    setCorrectAnswers(0);

    setSelectedAnswer(null);

    setAnswered(false);

    setMessage("");

    setSaving(false);

    setXpEarned(0);

    setFinalScore(0);

    setError("");

    setUnlockedAchievements([]);

    setScreen("game");
  };

  // =====================================================
  // ANSWER
  // =====================================================

  const handleAnswer = (
    option
  ) => {
    if (
      answered ||
      !question
    ) {
      return;
    }

    setSelectedAnswer(
      option
    );

    setAnswered(true);

    if (
      option ===
      question.answer
    ) {
      const points =
        getQuestionPoints(
          difficulty
        );

      setScore(
        (previous) =>
          previous + points
      );

      setCorrectAnswers(
        (previous) =>
          previous + 1
      );

      setMessage(
        "✅ Correct!"
      );
    } else {
      setMessage(
        `❌ Wrong! Correct answer: ${question.answer}`
      );
    }
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion = async () => {
    if (!answered) {
      return;
    }

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      await finishGame();

      return;
    }

    setCurrentQuestion(
      (previous) =>
        previous + 1
    );

    setSelectedAnswer(
      null
    );

    setAnswered(false);

    setMessage("");
  };

  // =====================================================
  // FINISH GAME
  // =====================================================

  const finishGame = async () => {
    try {
      setSaving(true);

      setError("");

      const accuracy =
        Math.round(
          (correctAnswers /
            questions.length) *
            100
        );

      const calculatedScore =
        calculateFinalScore({
          difficulty,
          score,
          accuracy,
        });

      setFinalScore(
        calculatedScore
      );

      const response =
        await api.post(
          "/games/result",
          {
            game:
              "Pattern Puzzle",

            score:
              calculatedScore,

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
        "Failed to save Pattern Puzzle:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Game completed, but the result could not be saved."
      );

      setScreen(
        "result"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = () => {
    startGame(
      difficulty
    );
  };

  // =====================================================
  // CHANGE DIFFICULTY
  // =====================================================

  const changeDifficulty = () => {
    setDifficulty(null);

    setQuestions([]);

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
              GAME 04 / PATTERNS
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3">
              PATTERN PUZZLE 🧩
            </h1>

            <p className="mt-4 text-base md:text-lg">
              Spot the rule,
              predict what comes
              next, and train your
              logical thinking.
            </p>

          </section>

          <section className="grid sm:grid-cols-3 gap-5 mt-10">

            <DifficultyCard
              icon="🙂"
              title="Easy"
              subtitle="Simple Patterns"
              description="Alternating emojis and easy repeating sequences."
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
              subtitle="Sequence Logic"
              description="Repeating groups and number progressions."
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
              subtitle="Advanced Logic"
              description="Multi-step numerical patterns and tougher sequences."
              color="bg-red-200"
              onClick={() =>
                startGame(
                  "hard"
                )
              }
            />

          </section>

          <section className="mt-10 bg-white border-2 border-slate-950 rounded-2xl p-6 max-w-2xl mx-auto shadow-[4px_4px_0_#111827]">

            <h2 className="font-black text-xl">
              How it works
            </h2>

            <p className="text-slate-600 mt-3">
              You'll get 5 random
              questions. Choose the
              item that correctly
              completes each
              pattern.
            </p>

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
    const accuracy =
      questions.length > 0
        ? Math.round(
            (correctAnswers /
              questions.length) *
              100
          )
        : 0;

    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-3xl px-5 pb-10 pt-24">

          <section className="bg-white border-2 border-slate-950 rounded-3xl p-7 md:p-10 text-center shadow-[8px_8px_0_#111827]">

            <div className="text-7xl">
              {accuracy === 100
                ? "🏆"
                : accuracy >= 60
                ? "🎉"
                : "🧠"}
            </div>

            <p className="font-mono font-black tracking-widest mt-5">
              CHALLENGE COMPLETE
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-3">
              Pattern Complete!
            </h1>

            <p className="capitalize font-bold mt-3">
              {difficulty} Mode
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
                icon="✅"
                value={`${correctAnswers}/${questions.length}`}
                label="Correct"
                color="bg-green-200"
              />

              <ResultStat
                icon="📈"
                value={`${accuracy}%`}
                label="Accuracy"
                color="bg-cyan-200"
              />

            </div>

            <p className="text-2xl font-black mt-6">
              ⚡ +{xpEarned} XP
            </p>

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
                  playAgain
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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-10 pt-20 md:pt-24">

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
              Pattern Puzzle 🧩
            </h1>

            <p className="capitalize text-xs font-bold">
              {difficulty} Mode
            </p>

          </div>

          <p className="font-black text-sm">
            {currentQuestion + 1}/
            {questions.length}
          </p>

        </div>

        {/* PROGRESS */}

        <div className="h-4 bg-white border-2 border-slate-950 rounded-full overflow-hidden">

          <div
            className="h-full bg-pink-500 transition-all duration-300"
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-3 mt-5">

          <CompactStat
            icon="✅"
            value={
              correctAnswers
            }
            label="Correct"
          />

          <CompactStat
            icon="🎯"
            value={score}
            label="Points"
          />

        </div>

        {/* QUESTION */}

        {question && (

          <section className="mt-7 bg-cyan-300 border-2 border-slate-950 rounded-3xl p-5 sm:p-8 shadow-[7px_7px_0_#111827]">

            <p className="font-mono font-black tracking-widest text-center text-sm">
              WHAT COMES NEXT?
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 mt-7">

              {question.pattern.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={`${item}-${index}`}
                    className={`min-w-12 h-14 sm:min-w-16 sm:h-16 px-3 bg-white border-2 border-slate-950 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black ${
                      item === "?"
                        ? "bg-pink-200"
                        : ""
                    }`}
                  >
                    {item}
                  </div>

                )
              )}

            </div>

            {/* OPTIONS */}

            <div className="grid grid-cols-2 gap-3 mt-8">

              {question.options.map(
                (option) => {

                  const isCorrect =
                    answered &&
                    option ===
                      question.answer;

                  const isWrong =
                    answered &&
                    selectedAnswer ===
                      option &&
                    option !==
                      question.answer;

                  return (
                    <button
                      key={
                        option
                      }
                      type="button"
                      onClick={() =>
                        handleAnswer(
                          option
                        )
                      }
                      disabled={
                        answered
                      }
                      className={`border-2 border-slate-950 rounded-2xl py-5 text-2xl sm:text-3xl font-black transition shadow-[3px_3px_0_#111827]
                      ${
                        isCorrect
                          ? "bg-green-300"
                          : isWrong
                          ? "bg-red-300"
                          : selectedAnswer ===
                            option
                          ? "bg-pink-300"
                          : "bg-white hover:bg-yellow-100"
                      }
                      disabled:cursor-not-allowed`}
                    >
                      {option}
                    </button>
                  );
                }
              )}

            </div>

          </section>

        )}

        {/* FEEDBACK */}

        {answered && (

          <section className="mt-5 bg-white border-2 border-slate-950 rounded-2xl p-5">

            <p className="font-black text-lg">
              {message}
            </p>

            <p className="text-slate-600 mt-2">
              {question.explanation}
            </p>

          </section>

        )}

        {/* NEXT */}

        {answered && (

          <button
            type="button"
            onClick={
              nextQuestion
            }
            disabled={
              saving
            }
            className="w-full mt-6 bg-pink-500 text-white border-2 border-slate-950 rounded-xl py-4 font-black text-lg shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition disabled:opacity-60"
          >

            {saving
              ? "SAVING..."
              : currentQuestion ===
                questions.length -
                  1
              ? "FINISH GAME 🏁"
              : "NEXT QUESTION →"}

          </button>

        )}

      </main>

    </div>
  );
}

// =====================================================
// QUESTION POINTS
// =====================================================

function getQuestionPoints(
  difficulty
) {
  if (
    difficulty === "easy"
  ) {
    return 100;
  }

  if (
    difficulty ===
    "medium"
  ) {
    return 150;
  }

  if (
    difficulty === "hard"
  ) {
    return 200;
  }

  return 100;
}

// =====================================================
// FINAL SCORE
// =====================================================

function calculateFinalScore({
  difficulty,
  score,
  accuracy,
}) {
  let finalScore =
    score;

  // Perfect accuracy bonus
  if (accuracy === 100) {
    if (
      difficulty === "easy"
    ) {
      finalScore += 100;
    }

    if (
      difficulty ===
      "medium"
    ) {
      finalScore += 200;
    }

    if (
      difficulty === "hard"
    ) {
      finalScore += 300;
    }
  }

  return finalScore;
}

// =====================================================
// DIFFICULTY CARD
// =====================================================

function DifficultyCard({
  icon,
  title,
  subtitle,
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

      <p className="font-black text-sm mt-1">
        {subtitle}
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

export default PatternPuzzle;