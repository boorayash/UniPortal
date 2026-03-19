import { NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function ProfessorReuse() {
  return (
    <aside className="w-full md:w-64 h-auto md:min-h-screen bg-white/10 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 flex flex-col">

      {/* Title */}
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-white shrink-0">
          Professor Panel
        </h2>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar snap-x">
          <NavItem to="/professor/dashboard" label="Dashboard" />
          <NavItem to="/professor/assignments" label="Assignments" />
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto p-6 border-t border-white/10 flex justify-center">
        <LogoutButton className="w-full" />
      </div>
    </aside>
  );
}

/* ---------------- Nav Item ---------------- */

function NavItem({ to, label }) {
  return (
    <NavLink to={to} end>
      {({ isActive }) => (
        <div
          className={`
            relative overflow-hidden px-4 py-3 rounded-xl
            transition-all duration-300
            ${
              isActive
                ? "bg-white/20 text-white scale-[1.02]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          {/* Left active indicator */}
          <span
            className={`
              absolute left-0 top-0 h-full w-1
              bg-blue-500 rounded-r
              transition-transform duration-300
              ${isActive ? "scale-y-100" : "scale-y-0"}
            `}
            style={{ transformOrigin: "top" }}
          />

          {/* Glow */}
          {isActive && (
            <span className="absolute inset-0 bg-blue-500/10 blur-xl animate-fadeIn" />
          )}

          <span className="relative z-10 font-medium">
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
