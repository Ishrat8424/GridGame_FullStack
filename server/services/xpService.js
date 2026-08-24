const calculateXP = ({ game, score, result }) => {
  let xp = 0;

  // Base XP by result
  if (result === "won") {
    xp += 20;
  } else if (result === "completed") {
    xp += 10;
  } else if (result === "lost") {
    xp += 5;
  }

  // Math Blast bonus by score
  if (game === "Math Blast") {
    if (score >= 1000) {
      xp += 30;
    } else if (score >= 800) {
      xp += 20;
    } else if (score >= 600) {
      xp += 10;
    } else if (score >= 300) {
      xp += 5;
    }
  }

  return xp;
};

module.exports = {
  calculateXP,
};