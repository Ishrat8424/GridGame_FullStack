const Achievement = require("../models/Achievement");

const achievementRules = [
  {
    achievementId: "first_win",
    title: "First Win",
    description: "Win your first GameGrid game.",
    icon: "🏆",
    check: (user) => user.stats.wins >= 1,
  },
  {
    achievementId: "getting_started",
    title: "Getting Started",
    description: "Play 5 GameGrid games.",
    icon: "🎮",
    check: (user) => user.stats.gamesPlayed >= 5,
  },
  {
    achievementId: "hot_streak",
    title: "Hot Streak",
    description: "Win 5 games in a row.",
    icon: "🔥",
    check: (user) => user.stats.bestStreak >= 5,
  },
  {
    achievementId: "brain_trainer",
    title: "Brain Trainer",
    description: "Play 25 GameGrid games.",
    icon: "🧠",
    check: (user) => user.stats.gamesPlayed >= 25,
  },
  {
    achievementId: "arcade_master",
    title: "Arcade Master",
    description: "Win 50 GameGrid games.",
    icon: "👑",
    check: (user) => user.stats.wins >= 50,
  },
  {
    achievementId: "xp_hunter",
    title: "XP Hunter",
    description: "Earn 1000 XP.",
    icon: "⭐",
    check: (user) => user.xp >= 1000,
  },
];

const checkAndUnlockAchievements = async (user) => {
  const unlockedAchievements = [];

  for (const rule of achievementRules) {
    if (!rule.check(user)) {
      continue;
    }

    const existingAchievement = await Achievement.findOne({
      user: user._id,
      achievementId: rule.achievementId,
    });

    if (existingAchievement) {
      continue;
    }

    const achievement = await Achievement.create({
      user: user._id,
      achievementId: rule.achievementId,
      title: rule.title,
      description: rule.description,
      icon: rule.icon,
    });

    unlockedAchievements.push(achievement);
  }

  return unlockedAchievements;
};

module.exports = {
  checkAndUnlockAchievements,
};