const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    // Get data sent from frontend
    const { username, email, password } = req.body;

    // 1. Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email and password.",
      });
    }

    // 2. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // 3. Check whether email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 4. Check whether username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken.",
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 7. Send safe response
    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
      },
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      }),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating account.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // 2. Find user and explicitly include password
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Please select an avatar.",
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

    if (!allowedAvatars.includes(avatar)) {
      return res.status(400).json({
        success: false,
        message: "Invalid avatar selected.",
      });
    }

    const user = await User.findByIdAndUpdate(
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
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};