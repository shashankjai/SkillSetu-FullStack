import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const pageSize = 6;

  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { "x-auth-token": token },
        params: {
          search: query,
          status: statusFilter,
          sort: sortMode,
        },
      });
      setUsers(data);
      setError("");
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [query, statusFilter, sortMode]);

  const filteredUsers = useMemo(() => users, [users]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleAddUser = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_URL}/api/admin/users`, formData, {
        headers: { "x-auth-token": token },
      });
      setFormData({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { "x-auth-token": token },
      });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    }
  };

  const handleStatusChange = async (userId, nextStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}`,
        { status: nextStatus },
        { headers: { "x-auth-token": token } },
      );
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user status.");
    }
  };

  const handleRoleChange = async (userId, role) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}`,
        { role },
        { headers: { "x-auth-token": token } },
      );
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role.");
    }
  };

  const handleViewUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users/${userId}`, {
        headers: { "x-auth-token": token },
      });
      setSelectedUser(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to view user details.");
    }
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
            Members
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            User Management
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <h3 className="mb-4 text-xl font-bold text-white">Add new user</h3>
        <form
          onSubmit={handleAddUser}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            placeholder="Name"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400"
            required
          />
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({ ...formData, password: event.target.value })
            }
            placeholder="Password"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400"
            required
          />
          <select
            value={formData.role}
            onChange={(event) =>
              setFormData({ ...formData, role: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 md:col-span-2 xl:col-span-4"
          >
            Create account
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400 md:max-w-sm"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-300">
          Loading users...
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-slate-950/40 p-8 text-center text-slate-300">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-950 text-sm uppercase tracking-[0.2em] text-slate-300">
              <tr>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => {
                const isBlocked = user.status === "blocked";
                return (
                  <tr
                    key={user._id}
                    className="border-t border-white/10 text-slate-100"
                  >
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewUser(user._id)}
                        className="flex items-center gap-3 text-left"
                      >
                        <img
                          src={
                            user.profilePicture
                              ? `${API_URL}/uploads/${user.profilePicture}`
                              : "https://placehold.co/80x80?text=User"
                          }
                          alt={user.name}
                          className="h-11 w-11 rounded-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/80x80?text=User";
                          }}
                        />
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{user.email}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(user._id, event.target.value)
                        }
                        className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      <div>
                        {(user.skillsToTeach || []).slice(0, 2).join(", ") ||
                          "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isBlocked ? "bg-red-500/20 text-red-200" : "bg-emerald-500/20 text-emerald-200"}`}
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              user._id,
                              isBlocked ? "active" : "blocked",
                            )
                          }
                          className={`rounded-lg px-2 py-1 text-xs font-semibold ${isBlocked ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
                        >
                          {isBlocked ? "Activate" : "Suspend"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user._id)}
                          className="rounded-lg bg-slate-700 px-2 py-1 text-xs font-semibold text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <div className="rounded-2xl border border-blue-500/20 bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">User details</h3>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="text-sm text-slate-300"
            >
              Close
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Profile
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {selectedUser.user.name}
              </p>
              <p className="text-slate-300">{selectedUser.user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Account status
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {selectedUser.user.status === "blocked" ? "Blocked" : "Active"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Skills offered
              </p>
              <p className="mt-2 text-slate-200">
                {selectedUser.user.skillsToTeach?.join(", ") || "No skills yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Skills wanted
              </p>
              <p className="mt-2 text-slate-200">
                {selectedUser.user.skillsToLearn?.join(", ") || "No skills yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Sessions
              </p>
              <p className="mt-2 text-slate-200">
                {selectedUser.sessions?.length || 0} linked sessions
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Reports
              </p>
              <p className="mt-2 text-slate-200">
                {selectedUser.reports?.length || 0} records
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
