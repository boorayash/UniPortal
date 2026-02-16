import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminStatCard({ title, value, color, to }) {
  const navigate = useNavigate();

  const colors = {
    indigo: "from-indigo-500/20 to-indigo-600/20 text-indigo-300",
    green: "from-green-500/20 to-green-600/20 text-green-300",
    orange: "from-orange-500/20 to-orange-600/20 text-orange-300",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-300"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`
        cursor-pointer select-none
        bg-gradient-to-br ${colors[color]}
        backdrop-blur-xl border border-white/10
        p-6 rounded-2xl shadow-lg
        transition
      `}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-4xl font-bold mt-3">{value}</h2>

      <p className="mt-4 text-xs opacity-60">
        Click to view →
      </p>
    </motion.div>
  );
}
