import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function VerifyEmail() {
  const { token } = useParams();

  const hasVerified = useRef(false);

  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState(
      "Verifying your email..."
    );

  useEffect(() => {
    // Prevent React StrictMode
    // from calling verification twice
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");

        setMessage(
          "Verification token is missing."
        );

        return;
      }

      try {
        const response =
          await api.get(
            `/auth/verify-email/${token}`
          );

        setStatus("success");

        setMessage(
          response.data.message ||
            "Email verified successfully!"
        );
      } catch (error) {
        console.error(
          "Email verification error:",
          error
        );

        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg bg-white border-2 border-slate-950 rounded-3xl p-8 text-center shadow-[8px_8px_0_#111827]">

        <div className="text-7xl mb-5">
          {status === "loading" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>

        <p className="font-mono font-black tracking-widest text-sm">
          GAMEGRID ACCOUNT
        </p>

        <h1 className="text-3xl md:text-4xl font-black mt-3">
          {status === "loading" &&
            "Verifying Email"}

          {status === "success" &&
            "Email Verified!"}

          {status === "error" &&
            "Verification Failed"}
        </h1>

        <p className="mt-4 text-slate-600 font-semibold leading-relaxed">
          {message}
        </p>

        {status === "loading" && (
          <div className="mt-8">
            <div className="w-12 h-12 mx-auto border-4 border-slate-950 border-t-pink-500 rounded-full animate-spin" />
          </div>
        )}

        {status === "success" && (
          <Link
            to="/login"
            className="inline-block mt-8 bg-pink-500 text-white border-2 border-slate-950 rounded-xl px-7 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
          >
            🔐 LOGIN TO GAMEGRID
          </Link>
        )}

        {status === "error" && (
          <div className="mt-8 space-y-4">
            <Link
              to="/register"
              className="block bg-cyan-300 text-slate-950 border-2 border-slate-950 rounded-xl px-7 py-3 font-black shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition"
            >
              CREATE ACCOUNT
            </Link>

            <Link
              to="/login"
              className="block font-black underline"
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;