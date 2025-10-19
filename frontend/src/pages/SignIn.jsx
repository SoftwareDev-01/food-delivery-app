import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation helper
  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      // Redirect based on user role (customize your routes)
      if (result.data.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to sign in. Please check your credentials."
      );
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/googleauth`,
          { email: result.user.email },
          { withCredentials: true }
        );
        dispatch(setUserData(data));
        if (data.role === "owner") {
          navigate("/owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-200 to-pink-100 px-4">
      <div className="w-full max-w-md p-10 rounded-xl shadow-lg bg-white border border-red-400">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-4 tracking-wide">
          EatWithMe
        </h2>
        <p className="text-center text-gray-600 mb-8 font-medium">
          Sign in to continue your gourmet journey.
        </p>

        {error && (
          <div className="mb-6 text-center text-red-700 font-semibold bg-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full px-5 py-3 rounded-lg border transition ${
              !email || isEmailValid(email)
                ? "border-gray-300 focus:border-red-500"
                : "border-red-500 focus:border-red-600"
            }`}
            autoComplete="email"
            disabled={loading}
          />
          {!isEmailValid(email) && email && (
            <p className="mt-1 text-xs text-red-500">Invalid email format</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 transition pr-12"
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-10 text-gray-600 hover:text-red-600 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="mb-6 text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition-transform ${
            loading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 active:scale-95"
          }`}
        >
          {loading ? (
            <svg
              className="mx-auto h-6 w-6 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 110 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-7">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-sm text-gray-500 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 font-semibold transition-colors ${
            loading
              ? "bg-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <FcGoogle size={22} />
          <span className="text-gray-700">Sign in with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
