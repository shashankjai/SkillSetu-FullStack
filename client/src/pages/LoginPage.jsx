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

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

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

    // Field validation
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

    // API call
    dispatch(loginStart());
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      
      // Safely decode token
      let decoded;
      try {
        // Dynamically import jwt-decode if needed, or use a safer approach
        const { jwtDecode } = await import('jwt-decode');
        decoded = jwtDecode(token);
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
        // Fallback: try to parse manually if possible
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          decoded = JSON.parse(jsonPayload);
        } catch (manualError) {
          throw new Error("Invalid token format");
        }
      }

      const role = decoded?.user?.role || "user";

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.data.name || decoded?.user?.name || "",
          email: response.data.email || decoded?.user?.email || email,
          _id: response.data.id || decoded?.user?.id || "",
          role: role,
        })
      );

      dispatch(loginSuccess(token));

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.msg || err.message || "Something went wrong!";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    }
  };

  return (
    <div className="flex fixed inset-0 overflow-hidden">
      {/* Left: Login Form */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200 relative z-10"
      >
        {/* Animated Website Title */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-6 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            SkillSetu
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 italic mt-1">
            Empower your skills. Connect. Grow.
          </p>
        </motion.div>

        {/* Login Box */}
        <div className="mt-12 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-[90%] max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
            Welcome Back
          </h2>
          {/* Error Message */}
          {error && (
            <p className="text-red-500 font-semibold text-center mb-3 bg-white/90 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-500" />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (
                    error === "Please enter your email address." ||
                    error === "Please enter a valid email address."
                  ) {
                    setError("");
                  }
                }}
                className="pl-10 pr-4 py-2 sm:py-3 w-full rounded-full border border-gray-300 outline-none text-sm sm:text-base md:text-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error === "Password is required.") {
                    setError("");
                  }
                }}
                className="pl-10 pr-10 py-2 sm:py-3 w-full rounded-full border border-gray-300 outline-none text-sm sm:text-base md:text-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-2/3 mx-auto block bg-blue-500 text-white font-semibold py-2 sm:py-3 rounded-full border border-blue-700 hover:bg-blue-600 hover:text-gray-100 transition duration-300 text-sm sm:text-base md:text-lg"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm sm:text-base md:text-lg text-white">
              Don't have an account?{" "}
              <Link to="/register" className="underline hover:text-gray-200">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: Background Image Animation */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
        }}
      ></motion.div>
    </div>
  );
};

export default LoginPage;