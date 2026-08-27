const calculateXP = ({
  game,
  score,
  result,
  difficulty = "normal",
  mode = "normal",
}) => {
  let xp = 0;

  // =====================================================
  // MATH BLAST
  // =====================================================

  if (game === "Math Blast") {
    // Base XP
    if (result === "won") {
      xp += 20;
    } else if (result === "completed") {
      xp += 10;
    } else if (result === "lost") {
      xp += 5;
    }

    // Score bonus
    if (score >= 1000) {
      xp += 30;
    } else if (score >= 800) {
      xp += 20;
    } else if (score >= 600) {
      xp += 10;
    } else if (score >= 300) {
      xp += 5;
    }

    return xp;
  }

  // =====================================================
  // TOON TAC TOE
  // =====================================================

  if (game === "Toon Tac Toe") {
    // WIN
    if (result === "won") {
      if (difficulty === "easy") {
        return 20;
      }

      if (difficulty === "medium") {
        return 35;
      }

      if (difficulty === "hard") {
        return 60;
      }

      return 20;
    }

    // DRAW
    if (result === "completed") {
      if (difficulty === "easy") {
        return 5;
      }

      if (difficulty === "medium") {
        return 10;
      }

      if (difficulty === "hard") {
        return 25;
      }

      return 10;
    }

    // LOSS
    if (result === "lost") {
      if (difficulty === "easy") {
        return 2;
      }

      if (difficulty === "medium") {
        return 3;
      }

      if (difficulty === "hard") {
        return 5;
      }

      return 5;
    }
  }

  // =====================================================
  // FLIP & MATCH
  // =====================================================

  if (game === "Flip & Match") {
    // =================================================
    // SOLO MODE
    // =================================================

    if (mode === "solo") {
      let soloXP = 10;

      if (score >= 1000) {
        soloXP = 50;
      } else if (score >= 850) {
        soloXP = 40;
      } else if (score >= 700) {
        soloXP = 30;
      } else if (score >= 500) {
        soloXP = 25;
      } else if (score >= 350) {
        soloXP = 20;
      } else if (score >= 200) {
        soloXP = 15;
      }

      return soloXP;
    }

    // =================================================
    // VS COMPUTER MODE
    // =================================================

    if (mode === "computer") {
      // WIN
      if (result === "won") {
        if (difficulty === "easy") {
          return 30;
        }

        if (difficulty === "medium") {
          return 50;
        }

        if (difficulty === "hard") {
          return 80;
        }

        return 30;
      }

      // DRAW
      if (result === "completed") {
        if (difficulty === "easy") {
          return 10;
        }

        if (difficulty === "medium") {
          return 20;
        }

        if (difficulty === "hard") {
          return 35;
        }

        return 10;
      }

      // LOSS
      if (result === "lost") {
        if (difficulty === "easy") {
          return 5;
        }

        if (difficulty === "medium") {
          return 8;
        }

        if (difficulty === "hard") {
          return 12;
        }

        return 5;
      }
    }

    return 10;
  }

  // =====================================================
  // SUDOKU MINI
  // =====================================================

  if (game === "Sudoku Mini") {
    let sudokuXP = 0;

    // Base XP
    if (difficulty === "easy") {
      sudokuXP = 20;
    } else if (difficulty === "medium") {
      sudokuXP = 40;
    } else if (difficulty === "hard") {
      sudokuXP = 70;
    } else {
      sudokuXP = 15;
    }

    // =================================================
    // EASY SCORE BONUS
    // =================================================

    if (difficulty === "easy") {
      if (score >= 500) {
        sudokuXP += 10;
      } else if (score >= 400) {
        sudokuXP += 5;
      }
    }

    // =================================================
    // MEDIUM SCORE BONUS
    // =================================================

    if (difficulty === "medium") {
      if (score >= 800) {
        sudokuXP += 20;
      } else if (score >= 650) {
        sudokuXP += 10;
      }
    }

    // =================================================
    // HARD SCORE BONUS
    // =================================================

    if (difficulty === "hard") {
      if (score >= 1200) {
        sudokuXP += 30;
      } else if (score >= 1000) {
        sudokuXP += 20;
      } else if (score >= 800) {
        sudokuXP += 10;
      }
    }

    return sudokuXP;
  }

  // =====================================================
  // PATTERN PUZZLE
  // =====================================================

  if (game === "Pattern Puzzle") {
    let patternXP = 0;

    // Base XP
    if (difficulty === "easy") {
      patternXP = 15;
    } else if (difficulty === "medium") {
      patternXP = 30;
    } else if (difficulty === "hard") {
      patternXP = 50;
    } else {
      patternXP = 10;
    }

    // =================================================
    // EASY SCORE BONUS
    // =================================================

    if (difficulty === "easy") {
      if (score >= 600) {
        patternXP += 15;
      } else if (score >= 500) {
        patternXP += 10;
      } else if (score >= 300) {
        patternXP += 5;
      }
    }

    // =================================================
    // MEDIUM SCORE BONUS
    // =================================================

    if (difficulty === "medium") {
      if (score >= 950) {
        patternXP += 25;
      } else if (score >= 750) {
        patternXP += 15;
      } else if (score >= 500) {
        patternXP += 10;
      }
    }

    // =================================================
    // HARD SCORE BONUS
    // =================================================

    if (difficulty === "hard") {
      if (score >= 1300) {
        patternXP += 40;
      } else if (score >= 1000) {
        patternXP += 25;
      } else if (score >= 700) {
        patternXP += 15;
      }
    }

    return patternXP;
  }

  // =====================================================
  // GRID QUEST
  // =====================================================

  if (game === "Grid Quest") {
    let gridXP = 0;

    // =================================================
    // BASE XP BY DIFFICULTY
    // =================================================

    if (difficulty === "easy") {
      gridXP = 20;
    } else if (difficulty === "medium") {
      gridXP = 40;
    } else if (difficulty === "hard") {
      gridXP = 70;
    } else {
      gridXP = 15;
    }

    // =================================================
    // EASY SCORE BONUS
    // =================================================

    if (difficulty === "easy") {
      if (score >= 1000) {
        gridXP += 20;
      } else if (score >= 800) {
        gridXP += 15;
      } else if (score >= 600) {
        gridXP += 10;
      } else if (score >= 500) {
        gridXP += 5;
      }
    }

    // =================================================
    // MEDIUM SCORE BONUS
    // =================================================

    if (difficulty === "medium") {
      if (score >= 1500) {
        gridXP += 30;
      } else if (score >= 1200) {
        gridXP += 20;
      } else if (score >= 1000) {
        gridXP += 10;
      }
    }

    // =================================================
    // HARD SCORE BONUS
    // =================================================

    if (difficulty === "hard") {
      if (score >= 2000) {
        gridXP += 50;
      } else if (score >= 1700) {
        gridXP += 35;
      } else if (score >= 1500) {
        gridXP += 20;
      } else if (score >= 1200) {
        gridXP += 10;
      }
    }

    return gridXP;
  }

  // =====================================================
  // DEFAULT XP
  // FOR FUTURE GAMEGRID GAMES
  // =====================================================

  if (result === "won") {
    xp = 20;
  } else if (result === "completed") {
    xp = 10;
  } else if (result === "lost") {
    xp = 5;
  }

  return xp;
};

module.exports = {
  calculateXP,
};