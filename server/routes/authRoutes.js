const express = require("express");

const {
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// AUTH ROUTES
// =====================================================

// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  registerUser
);

// =====================================================
// VERIFY EMAIL
// =====================================================

router.get(
  "/verify-email/:token",
  verifyEmail
);

// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  forgotPassword
);

// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
  "/reset-password/:token",
  resetPassword
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  loginUser
);

// =====================================================
// UPDATE PROFILE
// =====================================================

router.patch(
  "/profile",
  protect,
  updateProfile
);

// =====================================================
// GET LOGGED-IN USER
// =====================================================

router.get(
  "/me",
  protect,
  (req, res) => {
    res.status(200).json({
      success: true,

      user: {
        id:
          req.user._id,

        username:
          req.user.username,

        email:
          req.user.email,

        avatar:
          req.user.avatar,

        xp:
          req.user.xp,

        level:
          req.user.level,

        stats:
          req.user.stats,

        isEmailVerified:
          req.user.isEmailVerified !==
          false,
      },
    });
  }
);

module.exports = router;