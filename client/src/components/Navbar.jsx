import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get authentication information from AuthContext
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // Logout
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative flex flex-wrap items-center justify-between gap-y-4 px-6 md:px-14 py-5 border-b border-black/10 bg-yellow-300">

      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-black tracking-tight text-slate-950"
      >
        🎮 Game<span className="text-pink-500">Grid</span>
      </Link>

      {/* MAIN NAVIGATION */}
      <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-950">

        <Link
          to="/"
          className="hover:text-pink-500 transition"
        >
          Home
        </Link>

        <a
          href="/#games"
          className="hover:text-pink-500 transition"
        >
          Games
        </a>

        {/* Show only when logged in */}
        {isAuthenticated && (
          <>
            <Link
              to="/dashboard"
              className="hover:text-pink-500 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="hover:text-pink-500 transition"
            >
              Profile
            </Link>
          </>
        )}

        <Link
          to="/leaderboard"
          className="hover:text-pink-500 transition"
        >
          Leaderboard
        </Link>

        <a
          href="/#about"
          className="hover:text-pink-500 transition"
        >
          About
        </a>

      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-2xl font-black shadow-[3px_3px_0_#111827]"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isMenuOpen ? "×" : "☰"}
      </button>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="order-3 basis-full lg:hidden border-t-2 border-slate-950 pt-4"
        >
          <div className="flex flex-col gap-1 font-bold text-slate-950">
            <Link to="/" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
              Home
            </Link>

            <a href="/#games" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
              Games
            </a>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
                  Dashboard
                </Link>

                <Link to="/profile" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
                  Profile
                </Link>
              </>
            )}

            <Link to="/leaderboard" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
              Leaderboard
            </Link>

            <a href="/#about" onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-white transition">
              About
            </a>

            {!isAuthenticated ? (
              <div className="flex gap-2 border-t-2 border-slate-950/15 pt-3 mt-2">
                <Link to="/login" onClick={closeMenu} className="flex-1 rounded-xl border-2 border-slate-950 px-4 py-3 text-center font-bold hover:bg-white transition">
                  Login
                </Link>

                <Link to="/register" onClick={closeMenu} className="flex-1 rounded-xl border-2 border-slate-950 bg-pink-500 px-4 py-3 text-center font-bold text-white shadow-[3px_3px_0_#111827] hover:-translate-y-1 transition">
                  Register
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-xl border-2 border-slate-950 bg-slate-950 px-4 py-3 text-left font-black text-white hover:bg-pink-500 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="hidden sm:flex items-center gap-3">

        {/* NOT LOGGED IN */}
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border-2 border-slate-950 font-bold hover:bg-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-4 py-2 font-bold shadow-[3px_3px_0_#111827] hover:-translate-y-1 transition"
            >
              Register
            </Link>
          </>
        ) : (
          /* LOGGED IN */
          <>
            {/* PLAYER */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 font-black hover:text-pink-500 transition"
            >
              <span className="text-2xl">
                {user?.avatar || "🦊"}
              </span>

              <span>
                {user?.username || "Player"}
              </span>
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="bg-slate-950 text-white px-4 py-2 rounded-xl border-2 border-slate-950 font-black hover:bg-pink-500 transition"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;