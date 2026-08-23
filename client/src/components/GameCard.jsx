import { Link } from "react-router-dom";
function GameCard({
  id,
  category,
  title,
  icon,
  description,
  bg,
  path,
}) {
  return (
    <div
      className={`${bg} group border-2 border-slate-950 rounded-2xl p-6 md:p-7 min-h-[420px] flex flex-col shadow-[7px_7px_0_#111827] transition duration-200 hover:-translate-y-2 hover:shadow-[11px_11px_0_#111827]`}
    >
      <div className="flex items-start justify-between gap-4 mb-10">
        <div className="flex w-20 h-20 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 border-2 border-slate-950 text-4xl shadow-[3px_3px_0_#111827] transition duration-200 group-hover:rotate-6">
          {icon}
        </div>
        <span className="rounded-full border-2 border-slate-950 bg-white/70 px-3 py-1 font-mono text-xs font-bold tracking-widest">
          {id}
        </span>
      </div>

      <p className="font-mono text-xs font-bold tracking-[0.2em] text-slate-800">
        {category}
      </p>

      <h2 className="mt-3 text-3xl md:text-4xl font-black leading-none">
        {title}
      </h2>

      <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-800 md:text-lg">
        {description}
      </p>

      <div className="mt-auto pt-8">
        <Link
          to={path}
          className="flex items-center justify-between border-t-2 border-slate-950/20 pt-5 font-black transition hover:text-pink-600"
        >
          <span>PLAY NOW</span>
          <span className="text-3xl leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </Link>
      </div>
    </div>
  );
}

export default GameCard;