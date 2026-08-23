import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-14 py-5 border-b border-black/10 bg-yellow-300">
      <Link
        to="/"
        className="text-2xl md:text-3xl font-black tracking-tight text-slate-950"
      >
        🎮 Game<span className="text-pink-500">Grid</span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-950">
        <Link to="/" className="hover:text-pink-500 transition">
          Home
        </Link>

        <a href="#games" className="hover:text-pink-500 transition">
          Games
        </a>

        <Link to="/dashboard" className="hover:text-pink-500 transition">
          Dashboard
        </Link>
<Link
  to="/leaderboard"
  className="hover:text-pink-500 transition"
>
  Leaderboard
</Link>
<Link
  to="/profile"
  className="hover:text-pink-500 transition"
>
  Profile
</Link>

        <a href="#about" className="hover:text-pink-500 transition">
          About
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="border-2 border-slate-950 rounded-xl px-4 py-2 font-bold hover:bg-white transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-pink-500 text-white border-2 border-pink-500 rounded-xl px-4 py-2 font-bold hover:bg-pink-600 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;