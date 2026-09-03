import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/Navbar";
import AdminSideBar from "../components/admin/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/slices/adminProfileSlice";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const _toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  const profileImage = user?.profilePicture
    ? user.profilePicture.startsWith("http")
      ? user.profilePicture
      : `${API_URL}/uploads/${user.profilePicture}`
    : "https://placehold.co/150x150?text=Admin";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar
        adminName={user?.name || "Admin"}
        profileImage={profileImage}
        onToggleSidebar={_toggleSidebar}
      />

      <div className="flex pt-16 transition-all duration-300">
        {sidebarOpen && <AdminSideBar />}

        <main className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-4rem)] transition-all duration-300">
          <div className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-blue-700/30 via-sky-600/20 to-indigo-700/30 p-6 shadow-[0_22px_50px_rgba(37,99,235,0.2)] backdrop-blur-xl">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="relative group flex-shrink-0">
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/150x150?text=Admin";
                  }}
                  className="h-24 w-24 rounded-full border-4 border-white/60 object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Admin panel
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  {user?.name || "Admin User"}
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-slate-200 md:text-base">
                  Responsible for overseeing platform operations, handling
                  reports, maintaining integrity, and guiding the growth of the
                  SkillSetu community.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Users",
                text: "View and manage all registered users, monitor access, and keep account controls in check.",
              },
              {
                title: "Reports",
                text: "Review reported issues, assess patterns, and resolve platform concerns quickly.",
              },
              {
                title: "Analytics",
                text: "Track engagement, adoption, and performance metrics to guide product decisions.",
              },
              {
                title: "Profile",
                text: "Update your admin visibility, account details, and platform-level controls.",
              },
            ].map(({ title, text }) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
