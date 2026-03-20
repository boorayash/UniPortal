import { useEffect, useState } from "react";
import ProfessorReuse from "./professorReuse";
import AuthUserBadge from "../components/AuthUserBadge";
import API_URL from '../config/api';

export default function ProfessorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/professor/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (!res.ok) {
        window.location.href = "/";
        return;
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Professor dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats;
  const assignments = data?.assignments || [];
  const totalReviewed = stats
    ? stats.approved + stats.rejected
    : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      {/* Sidebar */}
      <ProfessorReuse />

      {/* Main */}
      <div className="flex-1 p-4 md:p-10 transition-opacity duration-300">

        {loading ? (
          <p className="text-gray-400 animate-fadeIn">
            Loading professor dashboard…
          </p>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-10">
              <h1 className="text-3xl font-bold">
                Professor Dashboard
              </h1>
              <AuthUserBadge />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard title="Pending Reviews" value={stats.pending} color="blue" />
              <StatCard title="Approved" value={stats.approved} color="green" />
              <StatCard title="Rejected" value={stats.rejected} color="red" />
              <StatCard title="Total Reviewed" value={totalReviewed} color="emerald" />
            </div>

            {/* Assignments Awaiting Review */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">
                Assignments Awaiting Review
              </h2>

              {assignments.length === 0 ? (
                <p className="text-gray-400">
                  No pending assignments 🎉
                </p>
              ) : (
                <div className="divide-y divide-white/10">
                  {assignments.map(a => (
                    <div
                      key={a._id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 py-4"
                    >
                      {/* Left */}
                      <div>
                        <p className="font-medium">
                          {a.studentName} – {a.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          Submitted:{" "}
                          {new Date(a.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Right */}
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            window.location.href =
                            `/professor/assignments/${a._id}/review`
                          }
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-bold rounded-lg text-sm shadow-[0_0_15px_rgba(52,211,153,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                        >
                          Review
                        </button>

                        <button
                          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ---------- Helper ---------- */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-500/15 text-blue-300",
    green: "bg-green-500/15 text-green-300",
    red: "bg-red-500/15 text-red-300",
    emerald: "bg-emerald-500/15 text-emerald-300"
  };

  return (
    <div className={`p-6 rounded-2xl ${colors[color]} backdrop-blur-xl`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

