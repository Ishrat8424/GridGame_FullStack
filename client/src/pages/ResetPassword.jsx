import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
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

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        "Please enter and confirm your new password."
      );

      return;
    }

    if (
      formData.password.length <
      6
    ) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (!token) {
      setError(
        "Password reset token is missing."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          `/auth/reset-password/${token}`,
          {
            password:
              formData.password,

            confirmPassword:
              formData.confirmPassword,
          }
        );

      setMessage(
        response.data.message ||
          "Password reset successfully!"
      );

      setSuccess(true);

      setFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Password reset failed. Please try again."
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

          <div className="bg-pink-500 p-10 md:p-14 flex flex-col justify-center">

            <p className="font-mono font-bold tracking-[0.25em] text-sm">
              PASSWORD RECOVERY
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-4 leading-tight">
              NEW
              <br />
              PASSWORD
            </h1>

            <p className="mt-6 text-lg max-w-md leading-relaxed font-semibold">
              Choose a new password for your
              GameGrid account and jump back
              into the arcade.
            </p>

            <div className="mt-10 text-7xl">
              🔐 🎮 ⚡
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white p-10 md:p-14 flex flex-col justify-center">

            <p className="font-black tracking-widest text-sm">
              GAMEGRID SECURITY
            </p>

            <h2 className="text-4xl font-black mt-3">
              Reset Password
            </h2>

            {!success && (
              <p className="mt-3 text-slate-600 font-semibold">
                Enter your new password below.
              </p>
            )}

            {/* SUCCESS STATE */}

            {success ? (
              <div className="mt-8">

                <div className="bg-green-100 border-2 border-green-600 rounded-2xl p-6 text-center">

                  <div className="text-6xl">
                    ✅
                  </div>

                  <h3 className="text-2xl font-black mt-4">
                    Password Changed!
                  </h3>

                  <p className="mt-3 font-semibold text-green-800">
                    {message}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="w-full mt-6 bg-slate-950 text-white py-3 rounded-xl font-black border-2 border-slate-950 shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
                >
                  🔐 LOGIN WITH NEW PASSWORD
                </button>

              </div>
            ) : (

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8 space-y-6"
              >

                {/* NEW PASSWORD */}

                <div>

                  <label className="block font-bold mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-pink-200"
                  />

                  <p className="text-sm mt-2 text-slate-500 font-semibold">
                    Minimum 6 characters.
                  </p>

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label className="block font-bold mb-2">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter password again"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border-2 border-slate-950 rounded-xl outline-none focus:ring-4 focus:ring-cyan-200"
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 font-bold text-red-700">
                    ❌ {error}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="w-full bg-pink-500 text-white py-3 rounded-xl font-black border-2 border-slate-950 shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "RESETTING..."
                    : "🔐 RESET PASSWORD"}
                </button>

              </form>
            )}

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

export default ResetPassword;