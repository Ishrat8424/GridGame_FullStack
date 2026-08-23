import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <section className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[10px_10px_0_#111827]">

          {/* LEFT SIDE */}
          <div className="bg-pink-500 p-10 md:p-14 flex flex-col justify-center">
            <p className="font-mono font-bold tracking-[0.25em] text-sm">
              PLAYER ACCESS
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-4 leading-tight">
              WELCOME
              <br />
              BACK!
            </h1>

            <p className="mt-6 text-lg max-w-md leading-relaxed">
              Log in to continue your arcade journey, earn XP, unlock
              achievements and climb the leaderboard.
            </p>

            <div className="mt-10 text-7xl">
              🎮 ⭐ 🏆
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-10 md:p-14">
            <p className="font-black tracking-widest text-sm">
              GAMEGRID LOGIN
            </p>

            <h2 className="text-4xl font-black mt-3">
              Ready Player?
            </h2>

            <form className="mt-8 space-y-6">

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

              <div>
                <label className="block font-bold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 text-white py-3 rounded-xl font-black border-2 border-slate-950 hover:-translate-y-1 transition"
              >
                LOGIN TO GAMEGRID
              </button>
            </form>

            <p className="mt-6 text-center">
              New player?{" "}
              <Link
                to="/register"
                className="font-black text-pink-500 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Login;