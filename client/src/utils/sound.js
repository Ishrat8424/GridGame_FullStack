const sounds = {
  click: "/sounds/click.wav",
  success: "/sounds/success.wav",
  error: "/sounds/error.wav",
  win: "/sounds/win.wav",
  lose: "/sounds/lose.mp3",
  achievement: "/sounds/achievement.wav",
  xp: "/sounds/xp.wav",
};

export const playSound = (
  soundName,
  volume = 0.5
) => {
  const soundPath =
    sounds[soundName];

  if (!soundPath) {
    console.warn(
      `Sound "${soundName}" not found.`
    );

    return;
  }

  try {
    const audio =
      new Audio(soundPath);

    audio.volume = Math.min(
      Math.max(volume, 0),
      1
    );

    audio.play().catch(() => {
      // Browser may block audio
      // before first user interaction.
    });
  } catch (error) {
    console.error(
      "Sound error:",
      error
    );
  }
};