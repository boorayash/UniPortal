import { NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import logo from "../assets/logo/logo.png";

export default function AdminReuse() {
  return (
    <aside className="w-full md:w-64 h-auto md:h-screen z-50 relative bg-white/10 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">

      {/* Brand & Title */}
      <div className="p-4 md:p-6 flex flex-col items-center md:items-start tracking-tight">
        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="UniPortal Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] shrink-0" />
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            UniPortal
          </h2>
        </div>

        <nav className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar snap-x">
          <NavItem to="/admin/dashboard" label="Dashboard" />
          <NavItem to="/admin/departments" label="Departments" />
          <NavItem to="/admin/users" label="Users" />
          <NavItem to="/admin/approvals" label="Approvals" />
        </nav>
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />

      {/* Logout */}
      <div className="p-4 md:p-6 border-t border-white/10 flex justify-center">
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
            relative overflow-hidden px-4 py-3 rounded-xl border
            transition-all duration-300 ease-out
            ${isActive
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 scale-[1.02] shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]"
              : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
            }
          `}
        >
          {/* Active left border indicator */}
          <span
            className={`
              absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-r
              transition-transform duration-300 ease-out
              ${isActive ? "scale-y-100" : "scale-y-0"}
            `}
            style={{ transformOrigin: "top" }}
          />

          {/* Stronger Glow underlay */}
          {isActive && (
            <span className="absolute inset-0 bg-indigo-500/10 blur-xl pointer-events-none" />
          )}

          <span className="relative z-10 font-medium tracking-wide">
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
