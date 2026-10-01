import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/admin/sessions`, {
        headers: { "x-auth-token": token },
        params: { status: statusFilter },
      });
      setSessions(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [statusFilter]);

  return (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
            Platform
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Session Management
          </h2>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-300">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-slate-950/40 p-8 text-center text-slate-300">
          No sessions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-950 text-sm uppercase tracking-[0.2em] text-slate-300">
              <tr>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session._id}
                  className="border-t border-white/10 text-slate-100"
                >
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {session._id.slice(-8)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-200">
                    {session.userId1?.name || "Unknown"} /{" "}
                    {session.userId2?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-200">
                    {session.skill || "General session"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {session.sessionDate
                      ? new Date(session.sessionDate).toLocaleString()
                      : "Not scheduled"}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-100">
                      {session.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
