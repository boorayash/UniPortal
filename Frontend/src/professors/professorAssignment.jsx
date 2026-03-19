import { useEffect, useMemo, useState } from "react";
import ProfessorReuse from "./professorReuse";
import AuthUserBadge from "../components/AuthUserBadge";
import API_URL from '../config/api';

export default function ProfessorAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI-only
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        `${API_URL}/professor/assignments`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setAssignments(data || []);
    } catch (err) {
      console.error("Fetch professor assignments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const visibleAssignments = useMemo(() => {
    let list = [...assignments];

    if (filterStatus !== "all") {
      list = list.filter(a => a.status === filterStatus);
    }

    list.sort((a, b) => {
      const da = new Date(a.updatedAt).getTime();
      const db = new Date(b.updatedAt).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });

    return list;
  }, [assignments, filterStatus, sortOrder]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      {/* Sidebar */}
      <ProfessorReuse />

      {/* Content */}
      <div className="flex-1 p-10 transition-opacity duration-300">

        {loading ? (
          <p className="text-gray-400 animate-fadeIn">
            Loading assignments…
          </p>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Assignments</h1>
              <AuthUserBadge />
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">

              <div className="flex gap-2">
                {["all", "submitted", "approved", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition
                      ${filterStatus === s
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 hover:bg-white/20"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/10 text-sm"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              {visibleAssignments.length === 0 ? (
                <p className="text-gray-400 text-center py-6">
                  No assignments found
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-gray-300 text-sm">
                      <th className="py-2">Student</th>
                      <th className="py-2">Title</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Updated</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleAssignments.map(a => (
                      <tr
                        key={a._id}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="py-3">{a.assignedTo?.name}</td>
                        <td className="py-3 font-medium">{a.title}</td>
                        <td className="py-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="py-3 text-sm text-gray-400">
                          {new Date(a.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          {a.status === "submitted" ? (
                            <button
                              onClick={() =>
                                window.location.href =
                                `/professor/assignments/${a._id}/review`
                              }
                              className="px-4 py-1.5 bg-emerald-600/20 text-emerald-300 rounded-lg text-xs hover:bg-emerald-600/30"
                            >
                              Review
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ status }) {
  const map = {
    submitted: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

