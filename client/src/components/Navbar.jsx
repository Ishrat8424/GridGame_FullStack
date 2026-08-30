import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) =>
    location.pathname === path;

  const navLinkClass = (path) =>
    `transition ${
      isActive(path)
        ? "text-pink-500 font-black"
        : "hover:text-pink-500"
    }`;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-2 border-slate-950/10 bg-yellow-300">

      <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 md:px-10 lg:px-12">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 text-2xl md:text-3xl font-black tracking-tight text-slate-950 hover:-translate-y-0.5 transition"
        >
          🎮 Game
          <span className="text-pink-500">
            Grid
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden lg:flex items-center gap-7 font-semibold text-slate-950">

          <Link
            to="/"
            className={navLinkClass("/")}
          >
            Home
          </Link>

          <a
            href="/#games"
            className="hover:text-pink-500 transition"
          >
            Games
          </a>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={navLinkClass(
                  "/dashboard"
                )}
              >
                Dashboard
              </Link>

              <Link
                to="/activity"
                className={navLinkClass(
                  "/activity"
                )}
              >
                Activity
              </Link>
            </>
          )}

          <Link
            to="/leaderboard"
            className={`inline-flex items-center gap-1.5 ${
              isActive("/leaderboard")
                ? "text-pink-500 font-black"
                : "hover:text-pink-500"
            } transition`}
          >
            Leaderboard
          </Link>

          {isAuthenticated && (
            <Link
              to="/profile"
              className={navLinkClass(
                "/profile"
              )}
            >
              Profile
            </Link>
          )}

          <Link
            to="/about"
            className={navLinkClass(
              "/about"
            )}
          >
            About
          </Link>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="hidden sm:flex items-center gap-3">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border-2 border-slate-950 font-black hover:bg-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-4 py-2 font-black shadow-[3px_3px_0_#111827] hover:-translate-y-1 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* PLAYER */}

              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 font-black hover:bg-white/60 transition"
              >
                <span className="text-2xl">
                  {user?.avatar ||
                    "🦊"}
                </span>

                <span className="max-w-[120px] truncate">
                  {user?.username ||
                    "Player"}
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

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(
              (isOpen) =>
                !isOpen
            )
          }
          className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-2xl font-black shadow-[3px_3px_0_#111827]"
          aria-expanded={
            isMenuOpen
          }
          aria-controls="mobile-navigation"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
        >
          {isMenuOpen
            ? "×"
            : "☰"}
        </button>

      </div>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-t-2 border-slate-950 bg-yellow-300 px-5 pb-5 pt-4 sm:px-6"
        >

          <div className="mx-auto max-w-7xl">

            <div className="flex flex-col gap-1 font-black text-slate-950">

              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/")
                    ? "bg-slate-950 text-white"
                    : "hover:bg-white"
                }`}
              >
                🏠 Home
              </Link>

              <a
                href="/#games"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 hover:bg-white transition"
              >
                🎮 Games
              </a>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={
                      closeMenu
                    }
                    className={`rounded-xl px-4 py-3 transition ${
                      isActive(
                        "/dashboard"
                      )
                        ? "bg-slate-950 text-white"
                        : "hover:bg-white"
                    }`}
                  >
                    📊 Dashboard
                  </Link>

                  <Link
                    to="/activity"
                    onClick={
                      closeMenu
                    }
                    className={`rounded-xl px-4 py-3 transition ${
                      isActive(
                        "/activity"
                      )
                        ? "bg-slate-950 text-white"
                        : "hover:bg-white"
                    }`}
                  >
                    🕹️ Activity
                  </Link>
                </>
              )}

              <Link
                to="/leaderboard"
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 transition ${
                  isActive(
                    "/leaderboard"
                  )
                    ? "bg-slate-950 text-white"
                    : "hover:bg-white"
                }`}
              >
                🏆 Leaderboard
              </Link>

              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={
                    closeMenu
                  }
                  className={`rounded-xl px-4 py-3 transition ${
                    isActive(
                      "/profile"
                    )
                      ? "bg-slate-950 text-white"
                      : "hover:bg-white"
                  }`}
                >
                  👤 Profile
                </Link>
              )}

              <Link
                to="/about"
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/about")
                    ? "bg-slate-950 text-white"
                    : "hover:bg-white"
                }`}
              >
                ℹ️ About
              </Link>

            </div>

            {/* ===============================================
                MOBILE AUTH SECTION
            =============================================== */}

            {!isAuthenticated ? (
              <div className="flex gap-3 border-t-2 border-slate-950/15 pt-4 mt-4">

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-xl border-2 border-slate-950 bg-white px-4 py-3 text-center font-black"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex-1 rounded-xl border-2 border-slate-950 bg-pink-500 px-4 py-3 text-center font-black text-white shadow-[3px_3px_0_#111827]"
                >
                  Register
                </Link>

              </div>
            ) : (
              <div className="border-t-2 border-slate-950/15 mt-4 pt-4">

                {/* MOBILE PLAYER */}

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 bg-white border-2 border-slate-950 rounded-xl p-3 mb-3"
                >

                  <div className="w-11 h-11 bg-yellow-200 border-2 border-slate-950 rounded-full flex items-center justify-center text-2xl">
                    {user?.avatar ||
                      "🦊"}
                  </div>

                  <div className="min-w-0">

                    <p className="font-black truncate">
                      {user?.username ||
                        "Player"}
                    </p>

                    <p className="text-xs text-slate-600 font-bold">
                      View Profile
                    </p>

                  </div>

                </Link>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="w-full rounded-xl border-2 border-slate-950 bg-slate-950 px-4 py-3 text-left font-black text-white hover:bg-pink-500 transition"
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;