import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/forgot-password",
          {
            email: cleanEmail,
          }
        );

      setMessage(
        response.data.message ||
          "If an account exists with that email, a reset link has been sent."
      );
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

      <section className="min-h-[calc(100vh-88px)] flex items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl grid lg:grid-cols-2 border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[10px_10px_0_#111827]">

          {/* LEFT SIDE */}

          <div className="bg-cyan-300 p-10 md:p-14 flex flex-col justify-center">

            <p className="font-mono font-bold tracking-[0.25em] text-sm">
              ACCOUNT RECOVERY
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-4 leading-tight">
              FORGOT
              <br />
              PASSWORD?
            </h1>

            <p className="mt-6 text-lg max-w-md leading-relaxed font-semibold">
              No worries! Enter the email
              connected to your GameGrid
              account and we'll send you a
              secure password reset link.
            </p>

            <div className="mt-10 text-7xl">
              🔐 📧 🎮
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white p-10 md:p-14 flex flex-col justify-center">

            <p className="font-black tracking-widest text-sm">
              GAMEGRID RECOVERY
            </p>

            <h2 className="text-4xl font-black mt-3">
              Reset Password
            </h2>

            <p className="mt-3 text-slate-600 font-semibold">
              We'll email you a secure
              reset link.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8 space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label className="block font-bold mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(
                      e.target.value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="player@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-cyan-200"
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                  ❌ {error}
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div className="bg-green-100 border-2 border-green-600 rounded-xl p-4 font-bold text-green-800">
                  <p>
                    📧 {message}
                  </p>

                  <p className="text-sm mt-2 font-semibold">
                    Check your inbox and
                    spam folder.
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-black border-2 border-slate-950 shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "SENDING..."
                  : "📧 SEND RESET LINK"}
              </button>

            </form>

            <div className="mt-7 text-center">

              <Link
                to="/login"
                className="font-black text-pink-500 hover:underline"
              >
                ← Back to Login
              </Link>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}

export default ForgotPassword;