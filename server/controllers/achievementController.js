const Achievement = require("../models/Achievement");

const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      user: req.user._id,
    }).sort({
      unlockedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching achievements.",
    });
  }
};

module.exports = {
  getAchievements,
};