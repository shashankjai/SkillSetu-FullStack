import React from "react";
import { FiCalendar, FiClock, FiUser, FiMail, FiTag } from "react-icons/fi";

const MatchList = ({
  matches,
  handleScheduleSession,
  sendSessionRequest,
  setSessionDate,
  setSessionTime,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {matches.length > 0 ? (
        matches.map((match) => (
          <div
            key={match.user._id}
            className="rounded-xl border border-white/10 bg-slate-900 p-6 text-white transition hover:border-white/20"
          >
            {/* User Info */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                <span className="text-lg font-bold">
                  {match.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {match.user.name}
                </h3>
                <p className="flex items-center gap-1 text-sm text-slate-400 truncate">
                  <FiMail size={14} />
                  {match.user.email}
                </p>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="mb-2 text-sm font-medium text-blue-400 flex items-center gap-1.5">
                <FiTag size={14} />
                Matched Skills
              </h4>
              {match.matchedSkills.length > 0 ? (
                <div className="space-y-2">
                  {match.matchedSkills.map((matchSkill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="text-blue-300 font-medium">
                        {matchSkill.teachSkill}
                      </span>
                      <span className="text-slate-500">→</span>
                      <span className="text-green-400">
                        {matchSkill.learnSkill}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No matched skills</p>
              )}
            </div>

            {/* Date & Time Inputs */}
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <FiCalendar size={14} />
                  Select Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <FiClock size={14} />
                  Select Time
                </label>
                <input
                  type="time"
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => sendSessionRequest(match.user._id)}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Send Request
              </button>
              <button
                onClick={() => handleScheduleSession(match.user._id)}
                className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Schedule
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-800 p-4 mb-3">
            <FiUser size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-400">No matches available at the moment.</p>
          <p className="text-sm text-slate-500">Try updating your skills to find better matches.</p>
        </div>
      )}
    </div>
  );
};

export default MatchList;