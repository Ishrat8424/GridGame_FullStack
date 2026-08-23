import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";

function Home() {
  const games = [
  {
    id: "01",
    category: "MEMORY",
    title: "Flip & Match",
    icon: "🃏",
    description: "Turn over the cards and find every matching pair.",
    bg: "bg-cyan-300",
    path: "/games/flip-match",
  },
  {
    id: "02",
    category: "LOGIC",
    title: "Pattern Puzzle",
    icon: "🧠",
    description:
      "Spot the rhythm, solve the sequence, and keep your streak alive.",
    bg: "bg-amber-50",
    path: "/games/pattern-puzzle",
  },
  {
    id: "03",
    category: "STRATEGY",
    title: "Toon Tac Toe",
    icon: "⭕",
    description:
      "Place your mark, block the bot, and get three in a row.",
    bg: "bg-orange-400",
    path: "/games/tic-tac-toe",
  },
  {
    id: "04",
    category: "ADVENTURE",
    title: "Grid Quest",
    icon: "🧭",
    description:
      "Navigate the map, dodge the rocks, and discover the treasure.",
    bg: "bg-emerald-200",
    path: "/games/grid-quest",
  },
  {
    id: "05",
    category: "LOGIC",
    title: "Sudoku Mini",
    icon: "🔢",
    description:
      "Fill the four-by-four grid and sharpen your number sense.",
    bg: "bg-sky-200",
    path: "/games/sudoku",
  },
  {
    id: "06",
    category: "CALCULATION",
    title: "Math Blast",
    icon: "🧮",
    description:
      "Calculate quickly, chase streaks, and win the battle.",
    bg: "bg-violet-200",
    path: "/games/math-blast",
  },
];

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <section className="px-6 md:px-14 lg:px-20 pt-32 md:pt-36 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm md:text-base font-black tracking-[0.25em] mb-4">
              WELCOME TO THE
            </p>

            <h1 className="text-[70px] sm:text-[90px] md:text-[120px] lg:text-[140px] leading-[0.82] font-black tracking-tight">
              TOON
              <br />
              ARCADE
            </h1>

            <p className="mt-7 text-xl md:text-2xl max-w-xl leading-relaxed">
              Pick a challenge, make a move, and play your way to a high score.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#games"
                className="bg-slate-950 text-white px-6 py-3 rounded-xl font-bold border-2 border-slate-950 hover:-translate-y-1 transition"
              >
                Explore Games
              </a>

              <LinkButton />
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-105 h-90">
              <div className="absolute left-10 top-14 text-7xl">🏆</div>
              <div className="absolute right-5 top-0 text-6xl">⚡</div>
              <div className="absolute left-0 bottom-10 text-6xl">⭐</div>

              <div className="absolute right-10 top-14 w-64 h-72 bg-pink-500 border-4 border-slate-950 rounded-3xl shadow-[10px_10px_0_#111827] flex flex-col items-center">
                <div className="w-52 h-32 bg-slate-900 mt-7 border-4 border-slate-950 rounded-xl flex items-center justify-center text-yellow-300 text-4xl font-black text-center leading-tight">
                  GAME
                  <br />
                  ON!
                </div>

                <div className="mt-8 flex gap-5 items-center">
                  <div className="w-5 h-16 bg-slate-900 rounded-full"></div>
                  <div className="w-8 h-8 bg-yellow-300 border-4 border-slate-950 rounded-full"></div>
                  <div className="w-8 h-8 bg-cyan-300 border-4 border-slate-950 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="games" className="px-6 md:px-14 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
  <GameCard
  key={game.id}
  id={game.id}
  category={game.category}
  title={game.title}
  icon={game.icon}
  description={game.description}
  bg={game.bg}
  path={game.path}
/>
))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="px-6 md:px-14 py-20 bg-slate-950 text-white"
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-pink-400 font-black tracking-widest">
            TRAIN. PLAY. LEVEL UP.
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-4">
            More Than Just Mini Games
          </h2>

          <p className="text-slate-300 text-lg mt-5 leading-relaxed">
            GameGrid will track XP, levels, achievements, game history,
            performance analytics and leaderboard rankings as you play.
          </p>
        </div>
      </section>
    </div>
  );
}

function LinkButton() {
  return (
    <a
      href="#about"
      className="bg-white px-6 py-3 rounded-xl font-bold border-2 border-slate-950 hover:-translate-y-1 transition"
    >
      Learn More
    </a>
  );
}

export default Home;