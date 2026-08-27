import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const cardIcons = [
  "🍎",
  "🚀",
  "🐼",
  "⭐",
  "🎮",
  "🍕",
  "⚽",
  "🌈",
];

function FlipMatch() {
  const { updateUser } = useAuth();

  // =====================================================
  // SCREEN
  // mode → difficulty → game → result
  // =====================================================

  const [screen, setScreen] =
    useState("mode");

  // =====================================================
  // GAME SETTINGS
  // =====================================================

  const [mode, setMode] =
    useState(null);

  const [difficulty, setDifficulty] =
    useState("easy");

  // =====================================================
  // BOARD
  // =====================================================

  const [cards, setCards] =
    useState([]);

  const [
    flippedCards,
    setFlippedCards,
  ] = useState([]);

  const [
    matchedCards,
    setMatchedCards,
  ] = useState([]);

  // =====================================================
  // GAME STATS
  // =====================================================

  const [moves, setMoves] =
    useState(0);

  const [
    playerPairs,
    setPlayerPairs,
  ] = useState(0);

  const [
    computerPairs,
    setComputerPairs,
  ] = useState(0);

  const [
    currentTurn,
    setCurrentTurn,
  ] = useState("player");

  // =====================================================
  // RESULT
  // =====================================================

  const [winner, setWinner] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [
    xpEarned,
    setXpEarned,
  ] = useState(0);

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
  // COMPUTER MEMORY
  // =====================================================

  const computerMemory =
    useRef({});

  const gameFinishedRef =
    useRef(false);

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress = useMemo(() => {
    if (cards.length === 0) {
      return 0;
    }

    return Math.round(
      (matchedCards.length /
        cards.length) *
        100
    );
  }, [matchedCards, cards]);

  // =====================================================
  // CREATE BOARD
  // =====================================================

  const createBoard = () => {
    return [
      ...cardIcons,
      ...cardIcons,
    ]
      .map((icon, index) => ({
        id: `${icon}-${index}`,
        icon,
      }))
      .sort(
        () =>
          Math.random() - 0.5
      );
  };

  // =====================================================
  // RESET GAME
  // =====================================================

  const resetGameState = () => {
    setCards(createBoard());

    setFlippedCards([]);

    setMatchedCards([]);

    setMoves(0);

    setPlayerPairs(0);

    setComputerPairs(0);

    setCurrentTurn("player");

    setWinner(null);

    setSaving(false);

    setXpEarned(0);

    setFinalScore(0);

    setError("");

    setUnlockedAchievements([]);

    computerMemory.current = {};

    gameFinishedRef.current =
      false;
  };

  // =====================================================
  // START SOLO
  // =====================================================

  const startSoloGame = () => {
    setMode("solo");

    resetGameState();

    setScreen("game");
  };

  // =====================================================
  // OPEN COMPUTER DIFFICULTY
  // =====================================================

  const chooseComputerMode = () => {
    setMode("computer");

    setScreen("difficulty");
  };

  // =====================================================
  // START COMPUTER GAME
  // =====================================================

  const startComputerGame = (
    selectedDifficulty
  ) => {
    setMode("computer");

    setDifficulty(
      selectedDifficulty
    );

    resetGameState();

    setScreen("game");
  };

  // =====================================================
  // CHANGE MODE
  // =====================================================

  const goToModeSelection = () => {
    resetGameState();

    setMode(null);

    setScreen("mode");
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = () => {
    resetGameState();

    setScreen("game");
  };

  // =====================================================
  // COMPUTER MEMORY
  // =====================================================

  const rememberCard = (card) => {
    computerMemory.current[
      card.id
    ] = card.icon;
  };

  // =====================================================
  // PLAYER CLICK
  // =====================================================

  const handleCardClick = (card) => {
    if (
      screen !== "game" ||
      saving ||
      flippedCards.length === 2 ||
      matchedCards.includes(
        card.id
      ) ||
      flippedCards.some(
        (item) =>
          item.id === card.id
      )
    ) {
      return;
    }

    if (
      mode === "computer" &&
      currentTurn !== "player"
    ) {
      return;
    }

    const newFlipped = [
      ...flippedCards,
      card,
    ];

    rememberCard(card);

    setFlippedCards(
      newFlipped
    );

    if (
      newFlipped.length === 2
    ) {
      const nextMoves =
        moves + 1;

      setMoves(nextMoves);

      resolvePair(
        newFlipped,
        "player",
        nextMoves
      );
    }
  };

  // =====================================================
  // RESOLVE PAIR
  // =====================================================

  const resolvePair = (
    selectedCards,
    owner,
    currentMoveCount
  ) => {
    const [first, second] =
      selectedCards;

    const isMatch =
      first.icon === second.icon;

    // ===================================================
    // MATCH
    // ===================================================

    if (isMatch) {
      const newMatched = [
        ...matchedCards,
        first.id,
        second.id,
      ];

      let nextPlayerPairs =
        playerPairs;

      let nextComputerPairs =
        computerPairs;

      if (owner === "player") {
        nextPlayerPairs += 1;

        setPlayerPairs(
          nextPlayerPairs
        );
      }

      if (
        owner === "computer"
      ) {
        nextComputerPairs += 1;

        setComputerPairs(
          nextComputerPairs
        );
      }

      setMatchedCards(
        newMatched
      );

      setTimeout(() => {
        setFlippedCards([]);
      }, 450);

      // All cards matched
      if (
        newMatched.length ===
        cards.length
      ) {
        setTimeout(() => {
          finishGame({
            finalMoves:
              currentMoveCount,

            finalPlayerPairs:
              nextPlayerPairs,

            finalComputerPairs:
              nextComputerPairs,
          });
        }, 500);

        return;
      }

      // Matching player keeps turn
      if (
        mode === "computer" &&
        owner === "computer"
      ) {
        setTimeout(() => {
          setCurrentTurn(
            "computer"
          );
        }, 650);
      }

      return;
    }

    // ===================================================
    // NO MATCH
    // ===================================================

    setTimeout(() => {
      setFlippedCards([]);

      if (
        mode === "computer"
      ) {
        if (
          owner === "player"
        ) {
          setCurrentTurn(
            "computer"
          );
        } else {
          setCurrentTurn(
            "player"
          );
        }
      }
    }, 850);
  };

  // =====================================================
  // COMPUTER TURN
  // =====================================================

  const computerMove = () => {
    const availableCards =
      cards.filter(
        (card) =>
          !matchedCards.includes(
            card.id
          )
      );

    if (
      availableCards.length <
      2
    ) {
      return;
    }

    const chosenCards =
      chooseComputerCards(
        availableCards,
        difficulty,
        computerMemory.current
      );

    if (
      !chosenCards ||
      chosenCards.length < 2
    ) {
      return;
    }

    const [first, second] =
      chosenCards;

    setFlippedCards([
      first,
    ]);

    rememberCard(first);

    setTimeout(() => {
      setFlippedCards([
        first,
        second,
      ]);

      rememberCard(second);

      const nextMoves =
        moves + 1;

      setMoves(nextMoves);

      setTimeout(() => {
        resolvePair(
          [
            first,
            second,
          ],
          "computer",
          nextMoves
        );
      }, 500);
    }, 500);
  };

  const runComputerMove = useEffectEvent(() => {
    computerMove();
  });

  useEffect(() => {
    if (
      screen !== "game" ||
      mode !== "computer" ||
      currentTurn !==
        "computer" ||
      saving ||
      cards.length === 0 ||
      flippedCards.length > 0 ||
      gameFinishedRef.current
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
        runComputerMove();
      }, 700);

    return () =>
      clearTimeout(timer);
  }, [
    screen,
    currentTurn,
    mode,
    saving,
    cards,
    matchedCards,
    flippedCards,
    difficulty,
  ]);

  // =====================================================
  // FINISH GAME
  // =====================================================

  const finishGame = async ({
    finalMoves,
    finalPlayerPairs,
    finalComputerPairs,
  }) => {
    if (
      gameFinishedRef.current
    ) {
      return;
    }

    gameFinishedRef.current =
      true;

    try {
      setSaving(true);

      setError("");

      let backendResult =
        "completed";

      let calculatedScore = 0;

      let gameWinner =
        "completed";

      // =================================================
      // SOLO
      // =================================================

      if (mode === "solo") {
        calculatedScore =
          calculateSoloScore(
            finalMoves
          );

        backendResult =
          "completed";

        gameWinner =
          "completed";
      }

      // =================================================
      // COMPUTER
      // =================================================

      if (
        mode === "computer"
      ) {
        if (
          finalPlayerPairs >
          finalComputerPairs
        ) {
          backendResult =
            "won";

          gameWinner =
            "player";
        } else if (
          finalComputerPairs >
          finalPlayerPairs
        ) {
          backendResult =
            "lost";

          gameWinner =
            "computer";
        } else {
          backendResult =
            "completed";

          gameWinner =
            "draw";
        }

        calculatedScore =
          calculateComputerScore({
            playerPairs:
              finalPlayerPairs,

            computerPairs:
              finalComputerPairs,

            result:
              backendResult,

            difficulty,
          });
      }

      setWinner(gameWinner);

      setFinalScore(
        calculatedScore
      );

      const response =
        await api.post(
          "/games/result",
          {
            game:
              "Flip & Match",

            score:
              calculatedScore,

            result:
              backendResult,

            difficulty:
              mode ===
              "computer"
                ? difficulty
                : "normal",

            mode,
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

      setScreen("result");
    } catch (err) {
      console.error(
        "Failed to save Flip & Match:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          "Game finished, but the result could not be saved."
      );

      // Still show result
      setScreen("result");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // MODE SCREEN
  // =====================================================

  if (screen === "mode") {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-5xl px-5 pb-10 pt-24 md:px-10">

          <section className="text-center">

            <p className="font-mono font-black tracking-[0.2em] text-sm">
              GAME 01 / MEMORY
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3">
              FLIP & MATCH 🃏
            </h1>

            <p className="mt-4 text-base md:text-lg">
              Choose how you want
              to play.
            </p>

          </section>

          <section className="grid md:grid-cols-2 gap-5 md:gap-7 mt-10 max-w-4xl mx-auto">

            {/* SOLO */}

            <button
              type="button"
              onClick={
                startSoloGame
              }
              className="bg-cyan-300 border-2 border-slate-950 rounded-3xl p-7 md:p-9 text-left shadow-[7px_7px_0_#111827] hover:-translate-y-1 transition"
            >

              <div className="text-6xl">
                🧠
              </div>

              <p className="font-mono font-black tracking-widest mt-6 text-sm">
                MODE 01
              </p>

              <h2 className="text-3xl font-black mt-2">
                Solo Mode
              </h2>

              <p className="mt-3 text-slate-700 font-semibold">
                Match every pair
                using as few moves
                as possible.
              </p>

              <div className="mt-8 font-black text-lg">
                PLAY SOLO →
              </div>

            </button>

            {/* COMPUTER */}

            <button
              type="button"
              onClick={
                chooseComputerMode
              }
              className="bg-pink-400 border-2 border-slate-950 rounded-3xl p-7 md:p-9 text-left shadow-[7px_7px_0_#111827] hover:-translate-y-1 transition"
            >

              <div className="text-6xl">
                🤖
              </div>

              <p className="font-mono font-black tracking-widest mt-6 text-sm">
                MODE 02
              </p>

              <h2 className="text-3xl font-black mt-2">
                Vs Computer
              </h2>

              <p className="mt-3 text-slate-700 font-semibold">
                Take turns with AI
                and collect more
                matching pairs.
              </p>

              <div className="mt-8 font-black text-lg">
                CHOOSE AI →
              </div>

            </button>

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
  // DIFFICULTY SCREEN
  // =====================================================

  if (
    screen === "difficulty"
  ) {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-5xl px-5 pb-10 pt-24 md:px-10">

          <section className="text-center">

            <p className="font-mono font-black tracking-[0.2em] text-sm">
              VS COMPUTER
            </p>

            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Choose Difficulty 🤖
            </h1>

            <p className="mt-4">
              How strong should
              your opponent be?
            </p>

          </section>

          <section className="grid sm:grid-cols-3 gap-5 mt-10 max-w-5xl mx-auto">

            <DifficultyCard
              icon="🙂"
              title="Easy"
              description="Computer mostly chooses random cards."
              color="bg-green-200"
              onClick={() =>
                startComputerGame(
                  "easy"
                )
              }
            />

            <DifficultyCard
              icon="😎"
              title="Medium"
              description="Computer remembers some revealed pairs."
              color="bg-orange-200"
              onClick={() =>
                startComputerGame(
                  "medium"
                )
              }
            />

            <DifficultyCard
              icon="🤖"
              title="Hard"
              description="Computer uses strong memory whenever possible."
              color="bg-red-200"
              onClick={() =>
                startComputerGame(
                  "hard"
                )
              }
            />

          </section>

          <div className="mt-10 text-center">

            <button
              type="button"
              onClick={() =>
                setScreen("mode")
              }
              className="font-black hover:text-pink-600"
            >
              ← Back to Modes
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (screen === "result") {
    return (
      <div className="min-h-screen bg-yellow-300 text-slate-950">

        <Navbar />

        <main className="mx-auto max-w-3xl px-5 pb-10 pt-24">

          <section className="bg-white border-2 border-slate-950 rounded-3xl p-7 md:p-10 text-center shadow-[8px_8px_0_#111827]">

            <p className="font-mono font-black tracking-widest">
              GAME COMPLETE
            </p>

            {mode === "solo" ? (
              <>
                <div className="text-7xl mt-5">
                  🎉
                </div>

                <h1 className="text-4xl md:text-5xl font-black mt-4">
                  Memory Master!
                </h1>

                <p className="font-bold mt-3 text-lg">
                  You cleared the
                  board in{" "}
                  {moves} moves.
                </p>
              </>
            ) : (
              <>
                <div className="text-7xl mt-5">
                  {winner ===
                  "player"
                    ? "🏆"
                    : winner ===
                      "computer"
                    ? "🤖"
                    : "🤝"}
                </div>

                <h1 className="text-4xl md:text-5xl font-black mt-4">

                  {winner ===
                    "player" &&
                    "You Win!"}

                  {winner ===
                    "computer" &&
                    "Computer Wins!"}

                  {winner ===
                    "draw" &&
                    "It's a Draw!"}

                </h1>

                <div className="mt-6 bg-cyan-100 border-2 border-slate-950 rounded-2xl p-5">

                  <p className="font-black text-3xl">

                    👤 {playerPairs}
                    {" : "}
                    {computerPairs} 🤖

                  </p>

                  <p className="font-bold capitalize mt-2">
                    {difficulty} Mode
                  </p>

                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-7">

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
                  playAgain
                }
                className="bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[3px_3px_0_#111827]"
              >
                🔁 Play Again
              </button>

              <button
                type="button"
                onClick={
                  goToModeSelection
                }
                className="bg-cyan-300 border-2 border-slate-950 rounded-xl px-5 py-3 font-black shadow-[3px_3px_0_#111827]"
              >
                🎮 Change Mode
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

      <main className="mx-auto max-w-4xl px-3 sm:px-5 pb-8 pt-20 md:pt-24">

        {/* GAME TOP BAR */}

        <div className="flex items-center justify-between gap-3 mb-5">

          <button
            type="button"
            onClick={
              goToModeSelection
            }
            className="font-black text-sm sm:text-base"
          >
            ← Modes
          </button>

          <div className="text-center">

            <h1 className="font-black text-xl sm:text-2xl">
              Flip & Match 🃏
            </h1>

            <p className="text-xs font-bold capitalize">
              {mode === "solo"
                ? "Solo Mode"
                : `${difficulty} • Vs Computer`}
            </p>

          </div>

          <button
            type="button"
            onClick={
              playAgain
            }
            className="font-black text-sm sm:text-base"
          >
            Restart ↻
          </button>

        </div>

        {/* COMPACT STATS */}

        {mode === "solo" ? (

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5">

            <CompactStat
              icon="🎯"
              value={moves}
              label="Moves"
            />

            <CompactStat
              icon="🃏"
              value={`${matchedCards.length / 2}/8`}
              label="Pairs"
            />

            <CompactStat
              icon="📈"
              value={`${progress}%`}
              label="Done"
            />

          </div>

        ) : (

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5">

            <CompactStat
              icon="👤"
              value={playerPairs}
              label="You"
            />

            <CompactStat
              icon="🤖"
              value={computerPairs}
              label="CPU"
            />

            <CompactStat
              icon={
                currentTurn ===
                "player"
                  ? "👤"
                  : "🤖"
              }
              value={
                currentTurn ===
                "player"
                  ? "YOU"
                  : "CPU"
              }
              label="Turn"
            />

          </div>

        )}

        {/* TURN MESSAGE */}

        {mode === "computer" && (

          <div className="text-center mb-4">

            <p className="font-black">

              {currentTurn ===
              "player"
                ? "🎯 Your Turn"
                : "🤖 Computer is thinking..."}

            </p>

          </div>

        )}

        {/* BOARD */}

        <section className="bg-cyan-300 border-2 border-slate-950 rounded-3xl p-3 sm:p-5 md:p-7 shadow-[6px_6px_0_#111827]">

          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">

            {cards.map(
              (card) => {
                const isFlipped =
                  flippedCards.some(
                    (item) =>
                      item.id ===
                      card.id
                  );

                const isMatched =
                  matchedCards.includes(
                    card.id
                  );

                const showCard =
                  isFlipped ||
                  isMatched;

                return (
                  <button
                    key={
                      card.id
                    }
                    type="button"
                    onClick={() =>
                      handleCardClick(
                        card
                      )
                    }
                    disabled={
                      isMatched ||
                      saving ||
                      flippedCards.length ===
                        2 ||
                      (mode ===
                        "computer" &&
                        currentTurn !==
                          "player")
                    }
                    className={`aspect-square border-2 border-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl md:text-5xl font-black transition-all duration-300
                    ${
                      showCard
                        ? "bg-white"
                        : "bg-pink-500"
                    }
                    ${
                      isMatched
                        ? "bg-green-200"
                        : ""
                    }`}
                  >
                    {showCard
                      ? card.icon
                      : "?"}
                  </button>
                );
              }
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

// =====================================================
// COMPUTER AI
// =====================================================

function chooseComputerCards(
  availableCards,
  difficulty,
  memory
) {
  const rememberedPair =
    findRememberedPair(
      availableCards,
      memory
    );

  if (
    difficulty === "hard" &&
    rememberedPair
  ) {
    return rememberedPair;
  }

  if (
    difficulty ===
      "medium" &&
    rememberedPair &&
    Math.random() < 0.7
  ) {
    return rememberedPair;
  }

  return getTwoRandomCards(
    availableCards
  );
}

function findRememberedPair(
  availableCards,
  memory
) {
  const groups = {};

  for (
    const card of
      availableCards
  ) {
    const rememberedIcon =
      memory[card.id];

    if (!rememberedIcon) {
      continue;
    }

    if (
      !groups[
        rememberedIcon
      ]
    ) {
      groups[
        rememberedIcon
      ] = [];
    }

    groups[
      rememberedIcon
    ].push(card);
  }

  for (
    const icon of
      Object.keys(groups)
  ) {
    if (
      groups[icon].length >=
      2
    ) {
      return groups[
        icon
      ].slice(0, 2);
    }
  }

  return null;
}

function getTwoRandomCards(
  cards
) {
  const shuffled = [
    ...cards,
  ].sort(
    () =>
      Math.random() - 0.5
  );

  return shuffled.slice(
    0,
    2
  );
}

// =====================================================
// SCORE
// =====================================================

function calculateSoloScore(
  moves
) {
  if (moves <= 8) {
    return 1000;
  }

  if (moves <= 10) {
    return 850;
  }

  if (moves <= 12) {
    return 700;
  }

  if (moves <= 16) {
    return 500;
  }

  if (moves <= 20) {
    return 350;
  }

  return 200;
}

function calculateComputerScore({
  playerPairs,
  computerPairs,
  result,
  difficulty,
}) {
  let score =
    playerPairs * 100;

  if (result === "won") {
    if (
      difficulty ===
      "easy"
    ) {
      score += 300;
    }

    if (
      difficulty ===
      "medium"
    ) {
      score += 500;
    }

    if (
      difficulty ===
      "hard"
    ) {
      score += 800;
    }
  }

  if (
    result ===
    "completed"
  ) {
    score += 150;
  }

  if (
    result === "lost"
  ) {
    score += 50;
  }

  score +=
    Math.max(
      0,
      8 - computerPairs
    ) * 20;

  return score;
}

// =====================================================
// MODE / DIFFICULTY CARD
// =====================================================

function DifficultyCard({
  icon,
  title,
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

      <p className="mt-2 text-sm font-semibold text-slate-700">
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

export default FlipMatch;