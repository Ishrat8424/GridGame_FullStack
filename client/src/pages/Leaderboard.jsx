import Navbar from "../components/Navbar";

function Leaderboard() {
  const players = [
    {
      rank: 1,
      username: "PixelMaster",
      avatar: "🦊",
      level: 12,
      xp: 4850,
      wins: 82,
    },
    {
      rank: 2,
      username: "BrainBolt",
      avatar: "🐼",
      level: 11,
      xp: 4320,
      wins: 75,
    },
    {
      rank: 3,
      username: "PuzzlePro",
      avatar: "🐸",
      level: 10,
      xp: 3980,
      wins: 69,
    },
    {
      rank: 4,
      username: "MathWizard",
      avatar: "🦁",
      level: 9,
      xp: 3450,
      wins: 61,
    },
    {
      rank: 5,
      username: "GridHero",
      avatar: "🐯",
      level: 8,
      xp: 3100,
      wins: 54,
    },
    {
      rank: 6,
      username: "MemoryKing",
      avatar: "🐵",
      level: 8,
      xp: 2870,
      wins: 48,
    },
  ];

  const topThree = players.slice(0, 3);

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* HEADER */}
        <section className="text-center">
          <p className="font-mono font-black tracking-[0.25em]">
            GAMEGRID RANKINGS
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-3">
            LEADERBOARD 🏆
          </h1>

          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Play games, earn XP and climb your way to the top of the arcade.
          </p>
        </section>

        {/* FILTER BUTTONS */}
        <section className="flex flex-wrap justify-center gap-3 mt-9">
          <button className="bg-slate-950 text-white border-2 border-slate-950 px-5 py-2 rounded-xl font-black">
            Global XP
          </button>

          <button className="bg-white border-2 border-slate-950 px-5 py-2 rounded-xl font-black hover:bg-cyan-200 transition">
            Weekly
          </button>

          <button className="bg-white border-2 border-slate-950 px-5 py-2 rounded-xl font-black hover:bg-pink-200 transition">
            Most Wins
          </button>
        </section>

        {/* TOP 3 */}
        <section className="grid md:grid-cols-3 gap-6 mt-14 items-end">

          {topThree.map((player) => {
            const styles = {
              1: {
                bg: "bg-yellow-200",
                medal: "🥇",
                height: "md:min-h-[330px]",
              },
              2: {
                bg: "bg-cyan-300",
                medal: "🥈",
                height: "md:min-h-[290px]",
              },
              3: {
                bg: "bg-orange-300",
                medal: "🥉",
                height: "md:min-h-[270px]",
              },
            };

            const style = styles[player.rank];

            return (
              <div
                key={player.rank}
                className={`${style.bg} ${style.height}
                  border-2 border-slate-950 rounded-3xl p-7
                  text-center shadow-[7px_7px_0_#111827]
                  ${player.rank === 1 ? "md:order-2" : ""}
                  ${player.rank === 2 ? "md:order-1" : ""}
                  ${player.rank === 3 ? "md:order-3" : ""}
                `}
              >
                <div className="text-5xl">
                  {style.medal}
                </div>

                <div className="w-24 h-24 mx-auto mt-5 bg-white border-2 border-slate-950 rounded-full flex items-center justify-center text-5xl">
                  {player.avatar}
                </div>

                <h2 className="text-2xl font-black mt-5">
                  {player.username}
                </h2>

                <p className="font-bold mt-1">
                  Level {player.level}
                </p>

                <p className="text-3xl font-black mt-5">
                  {player.xp.toLocaleString()} XP
                </p>

                <p className="font-semibold">
                  {player.wins} Wins
                </p>
              </div>
            );
          })}

        </section>

        {/* FULL RANKING */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="font-mono font-bold tracking-widest">
              TOP PLAYERS
            </p>

            <h2 className="text-4xl font-black">
              Arcade Rankings
            </h2>
          </div>

          <div className="space-y-4">
            {players.map((player) => (
              <div
                key={player.rank}
                className="bg-white border-2 border-slate-950 rounded-2xl p-4 md:p-6 shadow-[4px_4px_0_#111827] flex items-center gap-4"
              >
                {/* RANK */}
                <div className="w-12 text-center text-2xl font-black">
                  #{player.rank}
                </div>

                {/* AVATAR */}
                <div className="w-14 h-14 shrink-0 bg-cyan-200 border-2 border-slate-950 rounded-full flex items-center justify-center text-3xl">
                  {player.avatar}
                </div>

                {/* PLAYER */}
                <div className="flex-1">
                  <h3 className="font-black text-lg md:text-xl">
                    {player.username}
                  </h3>

                  <p className="text-sm font-semibold text-slate-600">
                    Level {player.level} • {player.wins} Wins
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="font-black text-lg md:text-xl">
                    {player.xp.toLocaleString()}
                  </p>

                  <p className="font-bold text-sm">
                    XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CURRENT PLAYER */}
        <section className="mt-12 bg-pink-500 border-2 border-slate-950 rounded-2xl p-6 shadow-[6px_6px_0_#111827]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <p className="font-mono font-black tracking-widest text-sm">
                YOUR RANK
              </p>

              <h2 className="text-3xl font-black mt-1">
                Keep Playing! 🎮
              </h2>

              <p className="font-semibold mt-2">
                Earn more XP to climb the GameGrid leaderboard.
              </p>
            </div>

            <a
              href="/#games"
              className="bg-slate-950 text-white px-6 py-3 rounded-xl font-black text-center hover:-translate-y-1 transition"
            >
              PLAY GAMES →
            </a>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Leaderboard;