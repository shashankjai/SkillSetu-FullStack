import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerImage from "../assets/auth-bg.jpg";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setSuccessMessage("Registration successful! Please log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-950">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex w-full flex-col items-center justify-center bg-slate-950/90 px-4 py-10 sm:px-6 lg:w-1/2"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.18),transparent_35%)]" />

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            Join SkillSetu
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
            SkillSetu
          </h1>
          <p className="mt-3 text-base text-slate-300">
            Create your profile and start learning together.
          </p>
        </motion.div>

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Start today
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Create account
            </h2>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-5"
          >
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error === "Please enter your full name.") setError("");
                }}
                autoComplete="off"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === "Please enter a valid email address.")
                    setError("");
                }}
                autoComplete="off"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error === "Password must be at least 6 characters long.")
                    setError("");
                }}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-12 text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 transition hover:text-white"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error === "Passwords do not match!") setError("");
                }}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-12 text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 transition hover:text-white"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            </div>

            <button type="submit" className="primary-btn w-full text-base">
              Create account <FiArrowRight />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-300 transition hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden h-screen w-1/2 overflow-hidden bg-slate-900 lg:block"
      >
        <div className="relative h-full w-full">
          <img
            src={registerImage}
            alt="SkillSetu register"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-blue-900/40" />
          <div className="absolute inset-0 flex items-end p-10">
            <div className="max-w-md rounded-[26px] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                Your network
              </p>
              <h3 className="mt-3 text-3xl font-bold text-white">
                Exchange knowledge, not just messages.
              </h3>
              <p className="mt-3 text-sm text-slate-200">
                Meet peers, teach what you know, and learn in a friendly
                skill-sharing community.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
