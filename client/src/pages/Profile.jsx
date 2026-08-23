import { useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const avatars = ["🦊", "🐼", "🐸", "🐯", "🦁", "🐵", "🐨", "🐰"];

  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  const player = {
    username: "PlayerOne",
    email: "player@example.com",
    level: 4,
    xp: 340,
    nextLevelXP: 500,
    gamesPlayed: 28,
    wins: 19,
    losses: 9,
    bestStreak: 7,
  };

  const achievements = [
    {
      icon: "🏆",
      title: "First Win",
    },
    {
      icon: "🔥",
      title: "Hot Streak",
    },
    {
      icon: "🧠",
      title: "Brain Trainer",
    },
    {
      icon: "🧮",
      title: "Math Rookie",
    },
  ];

  const xpPercentage = Math.min(
    (player.xp / player.nextLevelXP) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* HEADER */}
        <section>
          <p className="font-mono font-black tracking-[0.2em]">
            PLAYER PROFILE
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-2">
            Your Arcade Identity 🎮
          </h1>
        </section>

        {/* MAIN PROFILE CARD */}
        <section className="mt-10 grid lg:grid-cols-[340px_1fr] border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[8px_8px_0_#111827]">

          {/* LEFT */}
          <div className="bg-pink-500 p-8 flex flex-col items-center text-center">

            <div className="w-36 h-36 bg-white border-4 border-slate-950 rounded-full flex items-center justify-center text-7xl">
              {selectedAvatar}
            </div>

            <h2 className="text-3xl font-black mt-5">
              {player.username}
            </h2>

            <p className="font-bold mt-1">
              Level {player.level}
            </p>

            <div className="w-full mt-7">
              <div className="flex justify-between font-black mb-2">
                <span>XP</span>
                <span>
                  {player.xp} / {player.nextLevelXP}
                </span>
              </div>

              <div className="h-5 bg-white border-2 border-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-300"
                  style={{
                    width: `${xpPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-8 md:p-10">

            <p className="font-black tracking-widest text-sm">
              PLAYER DETAILS
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div className="border-2 border-slate-950 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-500">
                  Username
                </p>

                <p className="font-black text-lg mt-1">
                  {player.username}
                </p>
              </div>

              <div className="border-2 border-slate-950 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-500">
                  Email
                </p>

                <p className="font-black text-lg mt-1">
                  {player.email}
                </p>
              </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <MiniStat
                value={player.gamesPlayed}
                label="Games"
              />

              <MiniStat
                value={player.wins}
                label="Wins"
              />

              <MiniStat
                value={player.losses}
                label="Losses"
              />

              <MiniStat
                value={player.bestStreak}
                label="Best Streak"
              />
            </div>
          </div>
        </section>

        {/* AVATAR SELECTOR */}
        <section className="mt-12">

          <p className="font-mono font-bold tracking-widest">
            CUSTOMIZE
          </p>

          <h2 className="text-3xl font-black mt-1">
            Choose Your Avatar
          </h2>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mt-6">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`aspect-square rounded-2xl border-2 border-slate-950 text-4xl flex items-center justify-center transition
                ${
                  selectedAvatar === avatar
                    ? "bg-pink-500 -translate-y-1 shadow-[4px_4px_0_#111827]"
                    : "bg-white hover:bg-cyan-200"
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>

          <p className="mt-4 font-semibold text-slate-700">
            Avatar saving will be connected to your account later.
          </p>
        </section>

        {/* ACHIEVEMENTS */}
        <section className="mt-12">

          <p className="font-mono font-bold tracking-widest">
            COLLECTION
          </p>

          <h2 className="text-3xl font-black mt-1">
            Achievements
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-5 text-center shadow-[4px_4px_0_#111827]"
              >
                <div className="text-5xl">
                  {achievement.icon}
                </div>

                <h3 className="font-black text-lg mt-3">
                  {achievement.title}
                </h3>
              </div>
            ))}
          </div>

        </section>

      </main>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="bg-cyan-200 border-2 border-slate-950 rounded-xl p-4 text-center">
      <p className="text-3xl font-black">
        {value}
      </p>

      <p className="font-bold text-sm mt-1">
        {label}
      </p>
    </div>
  );
}

export default Profile;