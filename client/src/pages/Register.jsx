import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <section className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[10px_10px_0_#111827]">

          {/* LEFT SIDE */}
          <div className="bg-cyan-300 p-10 md:p-14 flex flex-col justify-center">
            <p className="font-mono font-bold tracking-[0.25em] text-sm">
              NEW PLAYER
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-4 leading-tight">
              JOIN THE
              <br />
              ARCADE!
            </h1>

            <p className="mt-6 text-lg max-w-md leading-relaxed">
              Create your GameGrid account, play brain-training games,
              earn XP, unlock achievements and compete on the leaderboard.
            </p>

            <div className="mt-10 flex gap-5 text-6xl">
              <span>🎮</span>
              <span>🚀</span>
              <span>🏆</span>
            </div>

            <div className="mt-10 bg-yellow-300 border-2 border-slate-950 rounded-2xl p-5 shadow-[5px_5px_0_#111827]">
              <p className="font-black">
                PLAYER PERKS
              </p>

              <div className="mt-3 space-y-2 font-semibold">
                <p>⭐ Earn XP & level up</p>
                <p>🏆 Unlock achievements</p>
                <p>📊 Track your performance</p>
                <p>🔥 Build winning streaks</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-10 md:p-14">
            <p className="font-black tracking-widest text-sm">
              CREATE PLAYER
            </p>

            <h2 className="text-4xl font-black mt-3">
              Start Playing!
            </h2>

            <p className="text-slate-600 mt-2">
              Create your GameGrid player profile.
            </p>

            <form className="mt-8 space-y-5">

              {/* USERNAME */}
              <div>
                <label className="block font-bold mb-2">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Choose a player name"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-yellow-200"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block font-bold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="player@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-cyan-200"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block font-bold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block font-bold mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password again"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-black border-2 border-slate-950 shadow-[4px_4px_0_#111827] hover:-translate-y-1 hover:shadow-[6px_6px_0_#111827] transition"
              >
                CREATE ACCOUNT 🚀
              </button>
            </form>

            <p className="mt-7 text-center">
              Already a player?{" "}
              <Link
                to="/login"
                className="font-black text-pink-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Register;