import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

function Profile() {
  const { user, loading, updateUser } = useAuth();

  const avatars = [
    "🦊",
    "🐼",
    "🐸",
    "🐯",
    "🦁",
    "🐵",
    "🐨",
    "🐰",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || "🦊"
  );

  const [savingAvatar, setSavingAvatar] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Real achievements from MongoDB
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] =
    useState(true);

  // Fetch real achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get("/achievements");

        setAchievements(
          response.data.achievements || []
        );
      } catch (err) {
        console.error(
          "Failed to fetch achievements:",
          err
        );
      } finally {
        setAchievementsLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Loading profile
  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
        <p className="text-2xl font-black">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Real user data from MongoDB
  const player = {
    username: user.username,
    email: user.email,

    level: user.level || 1,
    xp: user.xp || 0,

    nextLevelXP:
      (user.level || 1) * 500,

    gamesPlayed:
      user.stats?.gamesPlayed || 0,

    wins:
      user.stats?.wins || 0,

    losses:
      user.stats?.losses || 0,

    bestStreak:
      user.stats?.bestStreak || 0,
  };

  const xpPercentage = Math.min(
    (player.xp / player.nextLevelXP) * 100,
    100
  );

  // Save avatar
  const handleAvatarChange = async (avatar) => {
    try {
      setSavingAvatar(true);
      setMessage("");
      setError("");

      const response = await api.patch(
        "/auth/profile",
        {
          avatar,
        }
      );

      setSelectedAvatar(
        response.data.user.avatar
      );

      updateUser(response.data.user);

      setMessage(
        "Avatar saved successfully!"
      );
    } catch (err) {
      console.error(
        "Avatar update failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save avatar."
      );
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-12 pt-28 md:px-12">

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

            {/* XP */}
            <div className="w-full mt-7">

              <div className="flex justify-between font-black mb-2">

                <span>XP</span>

                <span>
                  {player.xp} /{" "}
                  {player.nextLevelXP}
                </span>

              </div>

              <div className="h-5 bg-white border-2 border-slate-950 rounded-full overflow-hidden">

                <div
                  className="h-full bg-cyan-300 transition-all duration-500"
                  style={{
                    width: `${xpPercentage}%`,
                  }}
                />

              </div>

              <p className="font-semibold text-sm mt-2">
                {Math.max(
                  player.nextLevelXP -
                    player.xp,
                  0
                )}{" "}
                XP until next level
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white p-8 md:p-10">

            <p className="font-black tracking-widest text-sm">
              PLAYER DETAILS
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-5">

              {/* USERNAME */}
              <div className="border-2 border-slate-950 rounded-xl p-4">

                <p className="text-sm font-bold text-slate-500">
                  Username
                </p>

                <p className="font-black text-lg mt-1">
                  {player.username}
                </p>

              </div>

              {/* EMAIL */}
              <div className="border-2 border-slate-950 rounded-xl p-4">

                <p className="text-sm font-bold text-slate-500">
                  Email
                </p>

                <p className="font-black text-lg mt-1 break-all">
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
                type="button"
                onClick={() =>
                  handleAvatarChange(avatar)
                }
                disabled={savingAvatar}
                className={`aspect-square rounded-2xl border-2 border-slate-950 text-4xl flex items-center justify-center transition
                ${
                  selectedAvatar === avatar
                    ? "bg-pink-500 -translate-y-1 shadow-[4px_4px_0_#111827]"
                    : "bg-white hover:bg-cyan-200"
                }
                disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {avatar}
              </button>

            ))}

          </div>

          {/* SAVING */}
          {savingAvatar && (
            <p className="mt-4 font-bold text-slate-700">
              Saving avatar...
            </p>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mt-4 bg-green-100 border-2 border-green-600 rounded-xl p-3 font-bold text-green-700">
              ✅ {message}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-4 bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
              ❌ {error}
            </div>
          )}

        </section>

        {/* ACHIEVEMENTS */}
        <section className="mt-12">

          <p className="font-mono font-bold tracking-widest">
            COLLECTION
          </p>

          <div className="flex items-center justify-between mt-1">

            <h2 className="text-3xl font-black">
              Achievements
            </h2>

            {!achievementsLoading && (
              <p className="font-black">
                🏆 {achievements.length} Unlocked
              </p>
            )}

          </div>

          {/* LOADING ACHIEVEMENTS */}
          {achievementsLoading ? (

            <div className="mt-6 bg-white border-2 border-slate-950 rounded-2xl p-6">

              <p className="font-black">
                Loading achievements...
              </p>

            </div>

          ) : achievements.length === 0 ? (

            /* NO ACHIEVEMENTS */
            <div className="mt-6 bg-amber-50 border-2 border-slate-950 rounded-2xl p-8 text-center shadow-[4px_4px_0_#111827]">

              <div className="text-6xl">
                🔒
              </div>

              <h3 className="font-black text-2xl mt-4">
                No Achievements Yet
              </h3>

              <p className="text-slate-600 mt-2">
                Play GameGrid challenges to
                unlock your first trophy.
              </p>

            </div>

          ) : (

            /* REAL ACHIEVEMENTS */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

              {achievements.map(
                (achievement) => (

                  <div
                    key={achievement._id}
                    className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-6 text-center shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
                  >

                    <div className="w-20 h-20 mx-auto bg-yellow-300 border-2 border-slate-950 rounded-full flex items-center justify-center text-4xl">

                      {achievement.icon}

                    </div>

                    <h3 className="font-black text-xl mt-4">
                      {achievement.title}
                    </h3>

                    <p className="text-slate-600 mt-2 text-sm">
                      {achievement.description}
                    </p>

                    {achievement.unlockedAt && (

                      <p className="font-bold text-xs text-slate-500 mt-4">
                        Unlocked{" "}
                        {formatDate(
                          achievement.unlockedAt
                        )}
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

// MINI STAT CARD
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

// FORMAT ACHIEVEMENT DATE
function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleDateString();
}

export default Profile;