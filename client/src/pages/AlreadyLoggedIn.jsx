import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

const AlreadyLoggedIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4"
        >
          SkillSetu
        </motion.h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          You are already logged in!
        </h2>

        {user?.name && (
          <p className="text-white text-lg mb-2">
            Welcome back,{" "}
            <span className="font-bold">
              {user.name}
            </span>
          </p>
        )}

        <p className="text-blue-100 text-base sm:text-lg mb-8">
          You are currently signed in to your SkillSetu account.
          Please logout first if you want to login with another
          account.
        </p>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mx-auto bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-red-500 hover:text-white transition duration-300 shadow-lg"
        >
          <FiLogOut />
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default AlreadyLoggedIn;