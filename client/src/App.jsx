import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

// =====================================================
// PAGES
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import About from "./pages/About";
import DailyChallenge from "./pages/DailyChallenge";

// =====================================================
// COMPONENTS
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";

// =====================================================
// GAMES
// =====================================================

import MathBlast from "./games/MathBlast";
import TicTacToe from "./games/TicTacToe";
import FlipMatch from "./games/FlipMatch";
import SudokuMini from "./games/SudokuMini";
import PatternPuzzle from "./games/PatternPuzzle";
import GridQuest from "./games/GridQuest";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================================
            PUBLIC ROUTES
        ================================================ */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        {/* ================================================
            PLAYER ROUTES
        ================================================ */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-challenge"
          element={
            <ProtectedRoute>
              <DailyChallenge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================================================
            GAME ROUTES
        ================================================ */}

        <Route
          path="/games/math-blast"
          element={
            <ProtectedRoute>
              <MathBlast />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/tic-tac-toe"
          element={
            <ProtectedRoute>
              <TicTacToe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/flip-match"
          element={
            <ProtectedRoute>
              <FlipMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/sudoku-mini"
          element={
            <ProtectedRoute>
              <SudokuMini />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/pattern-puzzle"
          element={
            <ProtectedRoute>
              <PatternPuzzle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/grid-quest"
          element={
            <ProtectedRoute>
              <GridQuest />
            </ProtectedRoute>
          }
        />

        {/* ================================================
            OLD SUDOKU URL
            Kept for backwards compatibility
        ================================================ */}

        <Route
          path="/games/sudoku"
          element={
            <ProtectedRoute>
              <SudokuMini />
            </ProtectedRoute>
          }
        />

        {/* ================================================
            404 ROUTE
        ================================================ */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

// =====================================================
// 404 PAGE
// =====================================================

function NotFound() {
  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center px-5">

      <div className="max-w-lg w-full bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[7px_7px_0_#111827]">

        <div className="text-7xl">
          🕹️
        </div>

        <p className="font-mono font-black tracking-widest mt-5">
          ERROR 404
        </p>

        <h1 className="text-4xl font-black mt-2">
          Game Over!
        </h1>

        <p className="text-slate-600 font-semibold mt-3">
          This GameGrid page doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
        >
          🎮 BACK HOME
        </Link>

      </div>

    </div>
  );
}

export default App;