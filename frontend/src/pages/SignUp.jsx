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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation helpers
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isMobileValid = (mobile) =>
    /^\+?\d{7,15}$/.test(mobile); // basic international phone validation

  const handleSignUp = async () => {
    setError("");

    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isMobileValid(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, mobile, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      // Redirect based on role
      if (result.data.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to sign up. Please try again."
      );
    }

    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      let mobileNumber = mobile;
      if (!mobileNumber) {
        mobileNumber = prompt("Please enter your mobile number:");
        if (!mobileNumber || !isMobileValid(mobileNumber)) {
          setError("Invalid mobile number provided.");
          setLoading(false);
          return;
        }
        setMobile(mobileNumber);
      }

      const result = await signInWithPopup(auth, provider);
      if (result) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/googleauth`,
          {
            fullName: result.user.displayName,
            email: result.user.email,
            mobile: mobileNumber,
            role,
          },
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
      setError("Google sign-up failed. Please try again.");
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
          Create your account to get started with delicious food deliveries.
        </p>

        {error && (
          <div className="mb-6 text-center text-red-700 font-semibold bg-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="mb-5">
          <label
            htmlFor="fullName"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 transition"
            disabled={loading}
          />
        </div>

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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-5 py-3 rounded-lg border transition focus:outline-none ${
              !email || isEmailValid(email)
                ? "border-gray-300 focus:border-red-500"
                : "border-red-500 focus:border-red-600"
            }`}
            disabled={loading}
          />
          {!isEmailValid(email) && email && (
            <p className="mt-1 text-xs text-red-500">Invalid email format</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="mb-5">
          <label
            htmlFor="mobile"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`w-full px-5 py-3 rounded-lg border transition focus:outline-none ${
              !mobile || isMobileValid(mobile)
                ? "border-gray-300 focus:border-red-500"
                : "border-red-500 focus:border-red-600"
            }`}
            disabled={loading}
          />
          {!isMobileValid(mobile) && mobile && (
            <p className="mt-1 text-xs text-red-500">Invalid mobile number</p>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 transition pr-12"
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
          {password && password.length < 6 && (
            <p className="mt-1 text-xs text-red-500">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Role
          </label>
          <div className="flex gap-4">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors border shadow-sm ${
                  role === r
                    ? "bg-red-600 text-white border-red-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-red-600 hover:text-white"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
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
            "Sign Up"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-7">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-sm text-gray-500 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 font-semibold transition-colors ${
            loading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <FcGoogle size={22} />
          <span className="text-gray-700">Sign up with Google</span>
        </button>

        {/* Already have account */}
        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-red-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
