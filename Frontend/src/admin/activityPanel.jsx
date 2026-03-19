import { motion } from "framer-motion";

/* ----------------------------------
   Activity type → color mapping
----------------------------------- */
const typeColor = {
  assignment_uploaded: "bg-blue-400",
  assignment_submitted: "bg-yellow-400",
  assignment_resubmitted: "bg-purple-400",
  assignment_approved: "bg-green-400",
  assignment_rejected: "bg-red-400",

  user_created: "bg-indigo-400",
  user_updated: "bg-indigo-300",
  user_deleted: "bg-red-300",

  department_created: "bg-cyan-400",
  department_updated: "bg-cyan-300",
  department_deleted: "bg-red-300"
};

export default function AdminActivityPanel({ activity }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-5">
        Recent Activity
      </h2>

      {activity.length === 0 ? (
        <p className="text-gray-400">No recent activity</p>
      ) : (
        <div className="relative space-y-5 pl-6">

          {/* Vertical timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-white/20" />

          {activity.map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col md:flex-row gap-4 items-start"
            >
              {/* Timeline dot */}
              <div
                className={`w-2.5 h-2.5 mt-1 rounded-full ${
                  typeColor[a.type] || "bg-gray-400"
                }`}
              />

              {/* Content */}
              <div>
                <p className="text-sm text-white">
                  {a.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {a.actor?.name ?? "Admin"} ({a.actor?.role ?? "admin"}) ·{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
