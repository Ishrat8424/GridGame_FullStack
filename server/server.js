const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GameGrid backend is connected!",
  });
});

app.listen(PORT, () => {
  console.log(`GameGrid server running on port ${PORT}`);
});