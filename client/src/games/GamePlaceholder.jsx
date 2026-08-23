import { Link } from "react-router-dom";

function GamePlaceholder({ title, icon }) {
  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center px-6">
      <div className="bg-white border-2 border-slate-950 rounded-3xl p-10 md:p-16 text-center shadow-[8px_8px_0_#111827] max-w-xl w-full">

        <div className="text-7xl mb-6">
          {icon}
        </div>

        <p className="font-mono font-bold tracking-widest">
          GAMEGRID ARCADE
        </p>

        <h1 className="text-4xl md:text-5xl font-black mt-3">
          {title}
        </h1>

        <p className="mt-5 text-lg">
          This game will be migrated into the new GameGrid platform soon.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold hover:-translate-y-1 transition"
        >
          ← Back to Arcade
        </Link>

      </div>
    </div>
  );
}

export default GamePlaceholder;