import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChartBar,
  FaFlag,
  FaUserShield,
  FaBolt,
  FaSignOutAlt,
  FaTools,
  FaCalendarAlt,
  FaBell,
  FaHome,
} from "react-icons/fa";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FaHome /> },
  { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  { to: "/admin/reports", label: "Reports", icon: <FaFlag /> },
  { to: "/admin/skills", label: "Skills", icon: <FaTools /> },
  { to: "/admin/sessions", label: "Sessions", icon: <FaCalendarAlt /> },
  { to: "/admin/analytics", label: "Analytics", icon: <FaChartBar /> },
  { to: "/admin/notifications", label: "Notifications", icon: <FaBell /> },
  { to: "/admin/profile", label: "Settings", icon: <FaUserShield /> },
  { to: "/admin/engagement-analytics", label: "Engagement", icon: <FaBolt /> },
];

const AdminSidebar = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const parsedUser = token
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;
  const isAdmin = parsedUser?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onClose) onClose();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/70 md:hidden"
        />
      )}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-white/10 bg-slate-950/95 text-white shadow-[0_30px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div>
          <div className="border-b border-blue-500/30 p-6">
            <div className="brand-gradient-text text-2xl font-black tracking-wide">
              SkillSetu
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-300">
              Admin Console
            </p>
          </div>
          <nav className="space-y-2 p-4">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : "text-slate-200 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {isAdmin && (
          <button
            onClick={handleLogout}
            className="m-4 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
