import { useEffect, useState } from "react";
import StudentReuse from "./studentReuse";
import AuthUserBadge from "../components/AuthUserBadge";
import UploadAssignmentPopup from "./uploadAssignmentPopup";
import API_URL from '../config/api';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/student/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setStats(data.stats);
      setRecent(data.recent);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Sidebar */}
      <StudentReuse />

      {/* Content */}
      <div className="flex-1 p-4 md:p-10 transition-opacity duration-300">

        {loading ? (
          <div className="text-gray-400 animate-fadeIn">
            Loading dashboard…
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
              <h1 className="text-3xl font-bold">
                Assignment Dashboard
              </h1>
              <AuthUserBadge />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard title="Draft" count={stats.draft} color="blue" />
              <StatCard title="Submitted" count={stats.submitted} color="yellow" />
              <StatCard title="Approved" count={stats.approved} color="green" />
              <StatCard title="Rejected" count={stats.rejected} color="red" />
            </div>

            {/* Recent Submissions */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">

              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
                <h2 className="text-xl font-semibold tracking-wide">
                  Recent Submissions
                </h2>

                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-medium"
                >
                  Upload New Assignment
                </button>
              </div>

              {/* List */}
              <div className="space-y-3">
                {recent.length === 0 ? (
                  <div className="text-gray-400 text-center py-6">
                    No recent submissions
                  </div>
                ) : (
                  recent.map((a) => (
                    <div
                      key={a._id}
                      className="
                        flex justify-between items-center p-4 rounded-xl
                        bg-black/30 hover:bg-black/40 transition
                        border border-white/5
                      "
                    >
                      {/* Left */}
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {a.title}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Last updated recently
                        </span>
                      </div>

                      {/* Right */}
                      <StatusBadge status={a.status} />
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 text-right">
                <a
                  href="/student/assignments"
                  className="text-blue-400 hover:underline text-sm font-medium"
                >
                  View All Assignments →
                </a>
              </div>
            </div>
          </>
        )}

        {/* Upload Popup */}
        {showUpload && (
          <UploadAssignmentPopup
            onClose={() => setShowUpload(false)}
            onSuccess={fetchDashboard}
          />
        )}
      </div>
    </div>
  );
}

/* ----------------- Helper Components ----------------- */

function StatCard({ title, count, color }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-300",
    yellow: "bg-yellow-500/20 text-yellow-300",
    green: "bg-green-500/20 text-green-300",
    red: "bg-red-500/20 text-red-300",
  };

  return (
    <div className={`p-6 rounded-2xl ${colors[color]} backdrop-blur-xl`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{count}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    draft: "bg-blue-500/20 text-blue-300",
    submitted: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
