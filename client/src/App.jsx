import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import MathBlast from "./games/MathBlast";
import TicTacToe from "./games/TicTacToe";
import FlipMatch from "./games/FlipMatch";
import Activity from "./pages/Activity";
import SudokuMini from "./games/SudokuMini";
import PatternPuzzle from "./games/PatternPuzzle";
import GridQuest from "./games/GridQuest";

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
        <Route
  path="/activity"
  element={
    <ProtectedRoute>
      <Activity />
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
  element={
    <ProtectedRoute>
      <FlipMatch />
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
  path="/games/tic-tac-toe"
  element={
    <ProtectedRoute>
      <TicTacToe />
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
          path="/games/sudoku"
          element={
            <ProtectedRoute>
              <SudokuMini />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
