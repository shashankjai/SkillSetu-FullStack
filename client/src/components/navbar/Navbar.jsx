// client/src/components/navbar/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  MessageCircle,
  Info,
  Shield,
  LogIn,
  UserPlus,
  Search,
  Compass,
  Bot,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const user = reduxUser;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
      isActive
        ? "bg-[#3478F6] text-white shadow-sm font-bold"
        : "text-slate-300 hover:bg-[#172338] hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B1220]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Text Header (NO LOGO IMAGE as per prompt requirement) */}
        <NavLink
          to="/"
          onClick={handleNavigation}
          className="flex shrink-0 items-center text-white transition hover:opacity-90"
        >
          <span className="text-xl font-extrabold tracking-tight text-white">
            SkillSetu
          </span>
        </NavLink>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-700 bg-[#172338] p-2 text-slate-200 hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop & Mobile Navigation Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute left-4 right-4 top-[62px] md:static md:block`}
        >
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-[#111B2B] p-3 shadow-2xl md:flex-row md:items-center md:gap-1.5 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            {isAuthenticated && user ? (
              <>
                <NavLink
                  to="/"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Home size={15} />
                  Home
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <User size={15} />
                  Profile
                </NavLink>

                <NavLink
                  to="/skill-matching"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Search size={15} />
                  Explore
                </NavLink>

                <NavLink
                  to="/learning-roadmap"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Compass size={15} />
                  Roadmap
                </NavLink>

                <NavLink
                  to="/ai-assistant"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Bot size={15} />
                  AI Assistant
                </NavLink>

                <NavLink
                  to="/chat"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <MessageCircle size={15} />
                  Chat
                </NavLink>

                <NavLink
                  to="/about-us"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Info size={15} />
                  About
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={handleNavigation}
                    className={navLinkClass}
                  >
                    <Shield size={15} />
                    Admin
                  </NavLink>
                )}

                {location.pathname !== "/" && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-600/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-600 md:ml-2 md:mt-0 transition"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                )}
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Home size={15} />
                  Home
                </NavLink>

                <NavLink
                  to="/about-us"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Info size={15} />
                  About
                </NavLink>

                <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2 md:flex-row md:border-0 md:pt-0 md:ml-2">
                  <NavLink
                    to="/login"
                    onClick={handleNavigation}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#3478F6] px-4 py-2 text-xs font-bold text-white hover:bg-[#2563EB] transition"
                  >
                    <LogIn size={15} />
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={handleNavigation}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-[#172338] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                  >
                    <UserPlus size={15} />
                    Sign Up
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
