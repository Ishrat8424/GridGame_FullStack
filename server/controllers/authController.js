const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/emailTemplates");

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide username, email and password.",
      });
    }

    const cleanUsername =
      username.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (
      cleanUsername.length < 3 ||
      cleanUsername.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be between 3 and 20 characters.",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const existingEmail =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const existingUsername =
      await User.findOne({
        username: cleanUsername,
      });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message:
          "Username is already taken.",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const verificationExpires =
      new Date(
        Date.now() +
          60 * 60 * 1000
      );

    const user =
      await User.create({
        username: cleanUsername,

        email: cleanEmail,

        password: hashedPassword,

        isEmailVerified: false,

        emailVerificationToken:
          hashedVerificationToken,

        emailVerificationExpires:
          verificationExpires,
      });

    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        to: cleanEmail,

        subject:
          "Verify your GameGrid account 🎮",

        html:
          verificationEmailTemplate({
            username:
              cleanUsername,

            verificationUrl,
          }),
      });
    } catch (emailError) {
      console.error(
        "Verification email error:",
        emailError
      );

      await User.findByIdAndDelete(
        user._id
      );

      return res.status(500).json({
        success: false,
        message:
          "We couldn't send the verification email. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,

      message:
        "Account created! Please check your email and verify your account before logging in.",

      requiresEmailVerification:
        true,

      email: cleanEmail,
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating account.",
    });
  }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (
  req,
  res
) => {
  try {
    const { token } =
      req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Verification token is required.",
      });
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user =
      await User.findOne({
        emailVerificationToken:
          hashedToken,

        emailVerificationExpires: {
          $gt: new Date(),
        },
      }).select(
        "+emailVerificationToken +emailVerificationExpires"
      );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Verification link is invalid or has expired.",
      });
    }

    user.isEmailVerified =
      true;

    user.emailVerificationToken =
      null;

    user.emailVerificationExpires =
      null;

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error(
      "Verify email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while verifying email.",
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } =
      req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your email address.",
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select(
        "+resetPasswordToken +resetPasswordExpires"
      );

    /*
      Security:
      We return the same message even if
      the account does not exist.

      This prevents attackers from checking
      which emails are registered.
    */

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const hashedResetToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    /*
      Reset link expires in 15 minutes
    */

    user.resetPasswordToken =
      hashedResetToken;

    user.resetPasswordExpires =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,

        subject:
          "Reset your GameGrid password 🔐",

        html:
          resetPasswordEmailTemplate({
            username:
              user.username,

            resetUrl,
          }),
      });
    } catch (emailError) {
      console.error(
        "Reset password email error:",
        emailError
      );

      /*
        Clear token because email was
        not successfully sent.
      */

      user.resetPasswordToken =
        null;

      user.resetPasswordExpires =
        null;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          "We couldn't send the password reset email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while requesting password reset.",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } =
      req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required.",
      });
    }

    if (
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter and confirm your new password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    if (
      password !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match.",
      });
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: new Date(),
        },
      }).select(
        "+password +resetPasswordToken +resetPasswordExpires"
      );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while resetting password.",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide email and password.",
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (
      user.isEmailVerified ===
      false
    ) {
      return res.status(403).json({
        success: false,

        requiresEmailVerification:
          true,

        message:
          "Please verify your email before logging in.",
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );

    return res.status(200).json({
      success: true,

      message:
        "Login successful!",

      token,

      user: {
        id:
          user._id,

        username:
          user.username,

        email:
          user.email,

        avatar:
          user.avatar,

        xp:
          user.xp,

        level:
          user.level,

        stats:
          user.stats,

        isEmailVerified:
          user.isEmailVerified !==
          false,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while logging in.",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      avatar,
    } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message:
          "Please select an avatar.",
      });
    }

    const allowedAvatars = [
      "🦊",
      "🐼",
      "🐸",
      "🐯",
      "🦁",
      "🐵",
      "🐨",
      "🐰",
    ];

    if (
      !allowedAvatars.includes(
        avatar
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid avatar selected.",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.user._id,

        {
          avatar,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,

      message:
        "Profile updated successfully!",

      user: {
        id:
          user._id,

        username:
          user.username,

        email:
          user.email,

        avatar:
          user.avatar,

        xp:
          user.xp,

        level:
          user.level,

        stats:
          user.stats,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  updateProfile,
};