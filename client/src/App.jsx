import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import GamePlaceholder from "./games/GamePlaceholder";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import MathBlast from "./games/MathBlast";
import TicTacToe from "./games/TicTacToe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/games/math-blast"
  element={
    <ProtectedRoute>
      <MathBlast />
    </ProtectedRoute>
  }
/>
        <Route
          path="/games/flip-match"
          element={<GamePlaceholder title="Flip & Match" icon="🃏" />}
        />

        <Route
          path="/games/pattern-puzzle"
          element={<GamePlaceholder title="Pattern Puzzle" icon="🧠" />}
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
          path="/games/grid-quest"
          element={<GamePlaceholder title="Grid Quest" icon="🧭" />}
        />

        <Route
          path="/games/sudoku"
          element={<GamePlaceholder title="Sudoku Mini" icon="🔢" />}
        />

        <Route
          path="/games/math-blast"
          element={<GamePlaceholder title="Math Blast" icon="🧮" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
