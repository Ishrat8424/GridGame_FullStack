import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(response.data.message);

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-6 pb-12 pt-28">
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

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* USERNAME */}
              <div>
                <label className="block font-bold mb-2">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password again"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                  ❌ {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="bg-green-100 border-2 border-green-600 rounded-xl p-3 font-bold text-green-700">
                  ✅ {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-black border-2 border-slate-950 shadow-[4px_4px_0_#111827] hover:-translate-y-1 hover:shadow-[6px_6px_0_#111827] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "CREATING PLAYER..."
                  : "CREATE ACCOUNT 🚀"}
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