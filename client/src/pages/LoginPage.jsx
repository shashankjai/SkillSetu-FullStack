import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import axios from "axios";
import loginImage from "../assets/auth-bg.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    dispatch(loginStart());

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      let decoded;

      try {
        const { jwtDecode } = await import("jwt-decode");
        decoded = jwtDecode(token);
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);

        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join(""),
          );
          decoded = JSON.parse(jsonPayload);
        } catch (manualError) {
          throw new Error("Invalid token format");
        }
      }

      const role = decoded?.user?.role || "user";
      const user = {
        name: response.data.name || decoded?.user?.name || "",
        email: response.data.email || decoded?.user?.email || email,
        _id: response.data.id || decoded?.user?.id || "",
        role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginSuccess(user));

      navigate(role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.msg || err.message || "Something went wrong!";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
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
            Skill exchange platform
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
            SkillSetu
          </h1>
          <p className="mt-3 text-base text-slate-300">
            Empower your skills. Connect. Grow.
          </p>
        </motion.div>

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Sign in</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (
                    error === "Please enter your email address." ||
                    error === "Please enter a valid email address."
                  )
                    setError("");
                }}
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
                  if (error === "Password is required.") setError("");
                }}
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

            <button type="submit" className="primary-btn w-full text-base">
              Sign in <FiArrowRight />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            New to SkillSetu?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-300 transition hover:text-white"
            >
              Create account
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
            src={loginImage}
            alt="SkillSetu team"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-blue-900/40" />
          <div className="absolute inset-0 flex items-end p-10">
            <div className="max-w-md rounded-[26px] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                Why SkillSetu
              </p>
              <h3 className="mt-3 text-3xl font-bold text-white">
                Learn with people, not just courses.
              </h3>
              <p className="mt-3 text-sm text-slate-200">
                Book sessions, swap skills, and build a stronger learning
                network with trusted peers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
