const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/profile", protect, updateProfile);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      xp: req.user.xp,
      level: req.user.level,
      stats: req.user.stats,
    },
  });
});
module.exports = router;