import React, { useEffect, useMemo, useState } from "react";
import StudentReuse from "./studentReuse";
import AuthUserBadge from "../components/AuthUserBadge";
import UploadAssignmentPopup from "./uploadAssignmentPopup";
import BulkUploadPopup from "./bulkUploadPopup";
import SubmitForReviewPopup from "./submitPopup";
import EditResubmitPopup from "./editResubmitPopup";
import AssignmentHistory from "./assignmentHistory";
import API_URL from '../config/api';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [submitId, setSubmitId] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${API_URL}/student/assignments`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setAssignments(data || []);
    } catch (err) {
      console.error("Fetch assignments error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Filtering & Sorting ---------------- */
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

  const toggleHistory = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <StudentReuse />

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

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              {/* Filters */}
              <div className="flex items-center gap-2">
                {["all", "draft", "submitted", "resubmitted", "approved", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition
                      ${filterStatus === s
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Upload buttons */}
              <div className="flex items-center gap-3">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/10 text-sm"
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>

                <button
                  onClick={() => setShowUpload(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
                >
                  Upload
                </button>

                <button
                  onClick={() => setShowBulk(true)}
                  className="px-5 py-2.5 bg-purple-600/90 hover:bg-purple-700 rounded-xl font-medium transition"
                >
                  Bulk Upload
                </button>
              </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              {visibleAssignments.length === 0 ? (
                <p className="text-gray-400 text-center py-6">
                  No assignments found
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-gray-300 text-sm">
                      <th className="py-2">Title</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Last Updated</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleAssignments.map(a => (
                      <React.Fragment key={a._id}>
                        <tr
                          className={`border-b border-white/10 transition cursor-pointer
                            ${expandedId === a._id ? "bg-white/10" : "hover:bg-white/5"}
                          `}
                          onClick={() => toggleHistory(a._id)}
                        >
                          <td className="py-3 font-medium">{a.title}</td>
                          <td className="py-3 capitalize">{a.category}</td>
                          <td className="py-3">
                            <StatusBadge status={a.status} />
                          </td>
                          <td className="py-3 text-sm text-gray-400">
                            {new Date(a.updatedAt).toLocaleDateString()}
                          </td>

                          <td className="py-3 text-right">
                            {(a.status === "draft" || a.status === "resubmitted") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubmitId(a._id);
                                }}
                                className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded text-xs hover:bg-emerald-600/30"
                              >
                                Submit for Review
                              </button>
                            )}

                            {a.status === "rejected" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditAssignment(a);
                                }}
                                className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded text-xs hover:bg-orange-500/30"
                              >
                                Edit & Resubmit
                              </button>
                            )}

                            {(a.status === "submitted" || a.status === "approved") && (
                              <span className="text-xs text-gray-500">—</span>
                            )}
                          </td>
                        </tr>

                        {expandedId === a._id && (
                          <tr className="bg-black/30 border-t border-white/20">
                            <td colSpan="5" className="p-0 pl-8">
                              <AssignmentHistory assignment={a} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Popups */}
        {showUpload && (
          <UploadAssignmentPopup
            onClose={() => setShowUpload(false)}
            onSuccess={fetchAssignments}
          />
        )}

        {showBulk && (
          <BulkUploadPopup
            onClose={() => setShowBulk(false)}
            onSuccess={fetchAssignments}
          />
        )}

        {submitId && (
          <SubmitForReviewPopup
            assignmentId={submitId}
            onClose={() => setSubmitId(null)}
            onSuccess={fetchAssignments}
          />
        )}

        {editAssignment && (
          <EditResubmitPopup
            assignment={editAssignment}
            onClose={() => setEditAssignment(null)}
            onSuccess={fetchAssignments}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ status }) {
  const map = {
    draft: "bg-blue-500/20 text-blue-300",
    submitted: "bg-yellow-500/20 text-yellow-300",
    resubmitted: "bg-purple-500/20 text-purple-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

