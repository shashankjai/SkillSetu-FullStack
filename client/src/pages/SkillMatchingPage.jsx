import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Background from "../components/background/Background";
import "../components/background/Background.css";
import { FaSearch, FaStar, FaClock, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/footer/Footer";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionDetails, setSessionDetails] = useState({});
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({ date: "", time: "" });

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/matches`, {
          headers: { "x-auth-token": token },
        });

        setMatches(response.data);

        const ratingsPromises = response.data.map(async (match) => {
          const userId = match.user._id;
          const ratingResponse = await axios.get(
            `${API_URL}/api/sessions/ratings/${userId}`,
            {
              headers: { "x-auth-token": token },
            },
          );
          return { userId, averageRating: ratingResponse.data.averageRating };
        });

        const ratingsData = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsData.reduce(
          (acc, { userId, averageRating }) => {
            acc[userId] = averageRating;
            return acc;
          },
          {},
        );
        setRatings(ratingsMap);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, [navigate]);

  const handleScheduleSession = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const sendSessionRequest = async (userId) => {
    const token = localStorage.getItem("token");
    const { date, time } = sessionDetails[userId] || {};
    const skill = matches.find(
      (match) => match.user._id === userId,
    )?.teachSkill;
    const newErrorMessages = { ...errorMessages };
    newErrorMessages[userId] = {};

    if (!date) {
      newErrorMessages[userId].date = "Please select a date";
    } else {
      const today = new Date();
      const selectedDate = new Date(date + "T00:00:00");
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrorMessages[userId].date = "Selected date is in the past";
      }
    }

    if (!time) {
      newErrorMessages[userId].time = "Please select a time";
    } else {
      const today = new Date();
      const selectedDate = new Date(date + "T00:00:00");
      if (
        selectedDate.getTime() === today.setHours(0, 0, 0, 0) &&
        time &&
        new Date(`${date}T${time}`).getTime() < Date.now()
      ) {
        newErrorMessages[userId].time = "Selected time is in the past";
      }
    }

    setErrorMessages(newErrorMessages);

    if (newErrorMessages[userId]?.date || newErrorMessages[userId]?.time) {
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/sessions/request`,
        { userId2: userId, sessionDate: date, sessionTime: time, skill },
        { headers: { "x-auth-token": token } },
      );

      await axios.post(
        `${API_URL}/api/notifications/send`,
        {
          userId,
          message: `You have a new session request for ${skill} on ${date} at ${time}`,
          type: "session_request",
        },
        { headers: { "x-auth-token": token } },
      );

      toast.success("Session request sent successfully!", {
        autoClose: 2200,
        style: {
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff",
          borderRadius: "14px",
          fontWeight: 700,
        },
        icon: false,
      });
    } catch (err) {
      console.error("Error sending session request:", err);
      toast.error("Error sending session request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-950">
      <Background />
      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-blue-600/20 via-sky-500/10 to-indigo-600/20 p-6 shadow-[0_22px_50px_rgba(37,99,235,0.15)] backdrop-blur-xl md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Discover people
            </p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
              Skill Matching
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-200 md:text-base">
              Browse your matches and schedule a session to share your skills,
              grow together, and build your network.
            </p>
          </div>

          <div className="relative mx-auto mb-8 max-w-xl">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
            <input
              type="text"
              placeholder="Search by name or skill"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.length > 0 ? (
              matches
                .filter(
                  (match) =>
                    match.user.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    match.teachSkill
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((match) => (
                  <div
                    key={`${match.user._id}-${match.teachSkill}`}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.25)] backdrop-blur-md"
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <img
                        className="h-16 w-16 rounded-full border-2 border-blue-300 object-cover"
                        src={
                          match.user?.profilePicture
                            ? `${API_URL}/uploads/profile-pictures/${match.user.profilePicture}`
                            : "/default-avatar.png"
                        }
                        alt="Avatar"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-xl font-bold text-white">
                            {match.user.name}
                          </h3>
                          <span className="rounded-full bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-100">
                            {match.teachSkill}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                          <FaUser className="text-blue-300" />
                          <span>{match.user.status || "Available"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-300">
                          Match score
                        </span>
                        <span className="rounded-full bg-amber-400/15 px-2 py-1 text-xs font-bold text-amber-300">
                          {match.score || "Top match"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-300">
                          Rating
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-300">
                          <FaStar /> {ratings[match.user._id] || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-300">
                          Availability
                        </span>
                        <span className="flex items-center gap-1 text-emerald-300">
                          <FaClock /> Flexible
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      <input
                        type="date"
                        value={sessionDetails[match.user._id]?.date || ""}
                        onChange={(e) =>
                          setSessionDetails((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...(prev[match.user._id] || {}),
                              date: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                      />
                      {errorMessages[match.user._id]?.date && (
                        <p className="text-xs text-red-300">
                          {errorMessages[match.user._id].date}
                        </p>
                      )}

                      <input
                        type="time"
                        value={sessionDetails[match.user._id]?.time || ""}
                        onChange={(e) =>
                          setSessionDetails((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...(prev[match.user._id] || {}),
                              time: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                      />
                      {errorMessages[match.user._id]?.time && (
                        <p className="text-xs text-red-300">
                          {errorMessages[match.user._id].time}
                        </p>
                      )}

                      <button
                        onClick={() => sendSessionRequest(match.user._id)}
                        className="primary-btn w-full"
                      >
                        Send Session Request
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full rounded-[24px] border border-dashed border-white/15 bg-slate-900/40 p-8 text-center text-slate-300">
                No matches available at the moment.
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default SkillMatchingPage;
