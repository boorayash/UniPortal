import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminStatCard({ title, value, color, to, icon: Icon, isWarning = false }) {
  const navigate = useNavigate();

  // Color mappings including specific RGB values for accurate color-matched glows
  const styles = {
    indigo: {
      bg: "bg-indigo-950/40",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    },
    cyan: {
      bg: "bg-cyan-950/40",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    },
    amber: {
      bg: "bg-amber-950/40",
      border: isWarning ? "border-amber-500/50" : "border-amber-500/20", // Stronger border if priority
      text: "text-amber-400",
      glow: isWarning ? "shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "shadow-[0_0_20px_rgba(245,158,11,0.15)]", // Intense static glow
    }
  };

  const currentStyle = styles[color] || styles.indigo;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`
        relative overflow-hidden cursor-pointer select-none group
        ${currentStyle.bg} backdrop-blur-md border ${currentStyle.border}
        p-6 rounded-2xl ${currentStyle.glow}
        transition-all duration-300 ease-out
      `}
    >
      {/* Top Row: Title & Icon */}
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-300 tracking-wide">
          {title}
        </p>
        {Icon && (
          <div className={`p-2 rounded-lg bg-black/20 border border-white/5`}>
            <Icon className={`w-5 h-5 ${currentStyle.text}`} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Value */}
      <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
        {value}
      </h2>

      {/* Footer / CTA */}
      <p className="mt-5 text-xs text-gray-500 font-medium group-hover:text-white transition-colors duration-300 flex items-center gap-1">
        Click to view details 
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
      </p>

      {/* Subtle top glare effect for layered glass feeling */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
    </motion.div>
  );
}
