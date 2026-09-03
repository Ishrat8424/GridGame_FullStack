import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import { playSound } from "../utils/sound";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.email ||
      !formData.password
    ) {
      playSound("error");

      setError(
        "Please enter email and password."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          {
            email:
              formData.email,

            password:
              formData.password,
          }
        );

      const {
        token,
        user,
      } = response.data;

      // SUCCESS SOUND
      playSound(
        "success",
        0.6
      );

      login(
        user,
        token
      );

      navigate(
        "/dashboard"
      );
    } catch (err) {
      // ERROR SOUND
      playSound(
        "error",
        0.6
      );

      setError(
        err.response?.data
          ?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
              Log in to continue your
              arcade journey, earn XP,
              unlock achievements and
              climb the leaderboard.
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

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label className="block font-bold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="player@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-cyan-200"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <div className="flex items-center justify-between gap-4 mb-2">

                  <label className="font-bold">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    onClick={() =>
                      playSound(
                        "click",
                        0.35
                      )
                    }
                    className="text-sm font-black text-pink-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <input
                  type="password"
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                  ❌ {error}
                </div>
              )}

              {/* LOGIN */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 text-white py-3 rounded-xl font-black border-2 border-slate-950 hover:-translate-y-1 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "LOGGING IN..."
                  : "LOGIN TO GAMEGRID"}
              </button>

            </form>

            <p className="mt-6 text-center">

              New player?{" "}

              <Link
                to="/register"
                onClick={() =>
                  playSound(
                    "click",
                    0.35
                  )
                }
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