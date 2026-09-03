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
    `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          onClick={handleNavigation}
          className="text-2xl font-bold text-white"
        >
          SkillSetu
        </NavLink>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`${menuOpen ? "block" : "hidden"} absolute left-4 right-4 top-[68px] md:static md:block`}
        >
          <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            {isAuthenticated && user ? (
              <>
                <NavLink
                  to="/"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Home size={16} className="inline mr-1.5" />
                  Home
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <User size={16} className="inline mr-1.5" />
                  Profile
                </NavLink>

                <NavLink
                  to="/skill-matching"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Search size={16} className="inline mr-1.5" />
                  Explore
                </NavLink>

                <NavLink
                  to="/chat"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <MessageCircle size={16} className="inline mr-1.5" />
                  Chat
                </NavLink>

                <NavLink
                  to="/about-us"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Info size={16} className="inline mr-1.5" />
                  About
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={handleNavigation}
                    className={navLinkClass}
                  >
                    <Shield size={16} className="inline mr-1.5" />
                    Admin
                  </NavLink>
                )}

                {location.pathname !== "/" && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 md:mt-0"
                  >
                    <LogOut size={16} className="inline mr-1.5" />
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
                  <Home size={16} className="inline mr-1.5" />
                  Home
                </NavLink>

                <NavLink
                  to="/about-us"
                  onClick={handleNavigation}
                  className={navLinkClass}
                >
                  <Info size={16} className="inline mr-1.5" />
                  About
                </NavLink>

                <div className="flex flex-col gap-1 border-t border-white/10 pt-2 md:flex-row md:border-0 md:pt-0">
                  <NavLink
                    to="/login"
                    onClick={handleNavigation}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <LogIn size={16} className="inline mr-1.5" />
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={handleNavigation}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    <UserPlus size={16} className="inline mr-1.5" />
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
