import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const primaryColor = "text-red-600";
  const primaryBg = "bg-red-600";
  const primaryHoverBg = "hover:bg-red-700";

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSendOtp = async () => {
    resetMessages();
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true });
      setSuccess("OTP sent! Please check your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    resetMessages();
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true });
      setSuccess("OTP verified! You can now reset your password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    resetMessages();
    if (!newPassword || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      setSuccess("Password reset successful! Redirecting to sign in...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try again.");
    }
    setLoading(false);
  };

  // Step indicator UI
  const steps = [
    { id: 1, label: "Enter Email" },
    { id: 2, label: "Verify OTP" },
    { id: 3, label: "Reset Password" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-red-200">
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-2 text-center text-red-600 tracking-wide">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6 font-medium">
          Follow the steps to reset your password
        </p>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {steps.map(({ id, label }) => (
            <div key={id} className="flex-1 text-center relative">
              <div
                className={`mx-auto w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold 
                ${step === id ? "bg-red-600 shadow-lg" : id < step ? "bg-red-400" : "bg-red-200 text-red-400"}`}
              >
                {id}
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  step === id
                    ? "text-red-600"
                    : id < step
                    ? "text-red-400"
                    : "text-red-300"
                }`}
              >
                {label}
              </p>
              {id < steps.length && (
                <div
                  className={`absolute top-4 right-0 w-full h-0.5 ${
                    id < step ? "bg-red-600" : "bg-red-200"
                  }`}
                  style={{ right: "-50%", left: "50%" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-100 rounded-md font-semibold text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 text-sm text-green-700 bg-green-100 rounded-md font-semibold text-center">
            {success}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-transform ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : `${primaryBg} ${primaryHoverBg} active:scale-95`
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
                "Send OTP"
              )}
            </button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-transform ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : `${primaryBg} ${primaryHoverBg} active:scale-95`
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
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <div className="relative mb-4">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative mb-6">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-transform ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : `${primaryBg} ${primaryHoverBg} active:scale-95`
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
                "Reset Password"
              )}
            </button>
          </>
        )}

        {/* Back to Login */}
        <p className="mt-8 text-center text-gray-600 font-medium">
          Remember your password?{" "}
          <Link to="/signin" className="text-red-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
