import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxUser = useSelector((state) => state.auth.user);

  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(
    localStorage.getItem("token")
  );

  const user = reduxUser;

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition-colors duration-300 font-semibold ${
      isActive
        ? "text-blue-700 border-b-2 border-blue-700"
        : "text-white hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-md text-white font-bold">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">

        {/* SkillSetu Logo */}
        <NavLink
          to={
            isAuthenticated && user
              ? "/already-logged-in"
              : "/"
          }
          onClick={handleNavigation}
          className="text-3xl font-extrabold text-white drop-shadow-md"
        >
          SkillSetu
        </NavLink>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`flex-1 justify-end items-center ${
            menuOpen ? "block" : "hidden"
          } md:flex`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 lg:space-x-8 text-xl">

            {/* Home */}
            <NavLink
              to={
                isAuthenticated && user
                  ? "/already-logged-in"
                  : "/"
              }
              onClick={handleNavigation}
              className={navLinkClass}
            >
              Home
            </NavLink>

            {/* Logged-in User */}
            {isAuthenticated && user ? (
              <>
                {/* Profile */}
                <NavLink
                  to="/profile"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  Profile
                </NavLink>

                {/* Skill Matching */}
                <NavLink
                  to="/skill-matching"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  Skill Matching
                </NavLink>

                {/* Chat */}
                <NavLink
                  to="/chat"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  Chat
                </NavLink>

                {/* About Us */}
                <NavLink
                  to="/about-us"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  About Us
                </NavLink>

                {/* Admin Dashboard */}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={handleNavigation}
                    className={navLinkClass}
                  >
                    Admin Dashboard
                  </NavLink>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-2 md:mt-0 bg-blue-700 px-4 py-2 rounded hover:bg-red-600 font-semibold text-white transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink
                  to="/login"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  Login
                </NavLink>

                {/* Sign Up */}
                <NavLink
                  to="/register"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  Sign Up
                </NavLink>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;