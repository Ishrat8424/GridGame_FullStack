import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navItems = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Profile", to: "/profile" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-2 border-slate-950/10 bg-yellow-300/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-10">
      <Link
        to="/"
        onClick={closeMenu}
        className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl"
      >
        🎮 Game<span className="text-pink-500">Grid</span>
      </Link>

      <div className="hidden items-center gap-7 font-bold text-slate-950 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`transition hover:text-pink-600 ${location.pathname === item.to ? "text-pink-600 underline decoration-2 underline-offset-8" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        {location.pathname === "/" && <a href="#about" className="transition hover:text-pink-600">About</a>}
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <Link
          to="/login"
          className="rounded-xl border-2 border-slate-950 px-4 py-2 font-bold transition hover:bg-white"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-xl border-2 border-pink-500 bg-pink-500 px-4 py-2 font-bold text-white transition hover:bg-pink-600"
        >
          Register
        </Link>
      </div>

      <button
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-xl font-black lg:hidden"
      >
        {menuOpen ? "×" : "☰"}
      </button>
      </div>

      {menuOpen && (
        <div className="border-t-2 border-slate-950/10 px-5 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-2 font-bold">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white/70">
                {item.label}
              </Link>
            ))}
            <a href="/#games" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white/70">Games</a>
            <div className="mt-2 flex gap-2 border-t border-slate-950/15 pt-3">
              <Link to="/login" onClick={closeMenu} className="flex-1 rounded-xl border-2 border-slate-950 px-4 py-2 text-center">Login</Link>
              <Link to="/register" onClick={closeMenu} className="flex-1 rounded-xl border-2 border-pink-500 bg-pink-500 px-4 py-2 text-center text-white">Register</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;