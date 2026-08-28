const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const dailyChallengeRoutes = require("./routes/dailyChallengeRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/games", gameRoutes);

app.use(
  "/api/achievements",
  achievementRoutes
);

app.use(
  "/api/leaderboard",
  leaderboardRoutes
);

app.use(
  "/api/daily-challenge",
  dailyChallengeRoutes
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "GameGrid backend is connected!",
  });
});

// =====================================================
// 404 API ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `🎮 GameGrid server running on port ${PORT}`
  );
});