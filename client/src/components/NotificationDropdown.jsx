// src/components/NotificationDropdown.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAllAsRead, markAsRead } from "../redux/slices/notificationSlice";
import axios from "axios"; // Import axios here

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const NotificationDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [filter, setFilter] = useState("all"); // Default filter is 'all'

  const handleMarkAsRead = async (id) => {
    if (!id) return;

    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${API_URL}/api/notifications/${id}/read`,
        {},
        { headers: { "x-auth-token": token } },
      );
      dispatch(markAsRead(id));
    } catch (err) {
      console.error("Error updating read status in backend:", err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?._id || !token) return;

    try {
      await axios.patch(
        `${API_URL}/api/notifications/${user._id}/read-all`,
        {},
        { headers: { "x-auth-token": token } },
      );
      dispatch(markAllAsRead());
    } catch (err) {
      console.error("Error marking all notifications as read:", err.message);
    }
  };

  const toggleFilter = (filterType) => {
    if (filter === filterType) {
      setFilter("all");
    } else {
      setFilter(filterType);
    }
  };

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true; // Show all notifications when filter is 'all'
  });

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".notification-dropdown") === null &&
        event.target.closest(".notification-bell-container") === null
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <div className="notification-dropdown absolute right-0 top-full z-[110] mt-3 max-h-64 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      {/* Filter Buttons */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 p-2.5">
        <button
          onClick={() => toggleFilter("unread")}
          className={`!w-auto !p-0 text-xs transition ${filter === "unread" ? "font-bold text-blue-300" : "text-slate-400"} hover:text-blue-200`}
        >
          Unread
        </button>
        <button
          onClick={() => toggleFilter("read")}
          className={`!w-auto !p-0 text-xs transition ${filter === "read" ? "font-bold text-blue-300" : "text-slate-400"} hover:text-blue-200`}
        >
          Read
        </button>
        <button
          onClick={handleMarkAllAsRead}
          className="!w-auto !p-0 text-xs text-blue-300 transition hover:text-blue-200"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <ul className="max-h-44 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <li
              key={notification._id}
              className={`cursor-pointer border-b border-white/5 p-3 text-sm transition hover:bg-white/10 ${!notification.isRead ? "bg-blue-600/20 text-white" : "text-slate-300"}`}
              onClick={() => handleMarkAsRead(notification._id)} // Mark as read on click
            >
              {notification.message}
            </li>
          ))
        ) : (
          <li className="p-4 text-sm text-slate-400">No notifications</li>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
