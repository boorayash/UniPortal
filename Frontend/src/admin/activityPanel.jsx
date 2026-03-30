import { motion } from "framer-motion";
import { Activity } from "lucide-react";

/* ----------------------------------
   Date Helper Functions
----------------------------------- */
const isToday = (d) => {
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

const isYesterday = (d) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
};

const formatTime = (d) => {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/* ----------------------------------
   Activity type → color mapping
----------------------------------- */
const typeColor = {
  assignment_uploaded: "bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)]",
  assignment_submitted: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
  assignment_resubmitted: "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.6)]",
  assignment_approved: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]",
  assignment_rejected: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.6)]",

  user_created: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.6)]",
  user_updated: "bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,0.6)]",
  user_deleted: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]",

  department_created: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
  department_updated: "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.6)]",
  department_deleted: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
};

export default function AdminActivityPanel({ activity }) {
  // Group activities
  const groupedActivity = activity.reduce(
    (acc, a) => {
      const date = new Date(a.createdAt);
      if (isToday(date)) acc.today.push(a);
      else if (isYesterday(date)) acc.yesterday.push(a);
      else acc.earlier.push(a);
      return acc;
    },
    { today: [], yesterday: [], earlier: [] }
  );

  return (
    <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col h-full shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-gray-400 w-5 h-5" />
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Live System Console
        </h2>
      </div>

      {activity.length === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-50">
          <p className="text-gray-400">No system activities recorded</p>
        </div>
      ) : (
        <div className="relative flex-1 overflow-y-auto pr-2 pb-4 no-scrollbar">
          
          {/* Static thin timeline reference line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-px bg-white/10" />

          <div className="space-y-8 relative">
            <ActivityGroup title="Today" items={groupedActivity.today} />
            <ActivityGroup title="Yesterday" items={groupedActivity.yesterday} />
            <ActivityGroup title="Earlier" items={groupedActivity.earlier} />
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityGroup({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-[#070b14] inline-block px-2 relative z-10 mb-4 ml-[7px]">
        {title}
      </h3>

      <div className="space-y-2">
        {items.map((a, i) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="flex items-start gap-5 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-default"
          >
            {/* Timeline Dot (Bright & larger) */}
            <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-[2px] border-[#0c1222] shrink-0 z-10 ${typeColor[a.type] || "bg-gray-400 shadow-[0_0_12px_rgba(156,163,175,0.6)]"}`} />

            {/* Content Hierarchy */}
            <div className="flex-1 pt-0.5">
              <p className="text-white font-medium text-[15px] leading-snug group-hover:text-cyan-100 transition-colors">
                {a.message}
              </p>
              
              <div className="flex items-center gap-2 mt-1.5">
                {/* Actor */}
                <span className="text-gray-400 text-sm font-medium">
                  {a.actor?.name ?? "System"} 
                  <span className="opacity-60 ml-1">({a.actor?.role ?? "automated"})</span>
                </span>
                <span className="text-white/10 px-1">•</span>
                {/* Time */}
                <span className="text-gray-500 text-xs font-mono tracking-tighter">
                  {formatTime(new Date(a.createdAt))}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

