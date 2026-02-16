import { NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function AdminReuse() {
  return (
    <aside className="w-64 h-screen bg-white/10 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0">

      {/* Title + Nav */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 text-white">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-2">
          <NavItem to="/admin/dashboard" label="Dashboard" />
          <NavItem to="/admin/departments" label="Departments" />
          <NavItem to="/admin/users" label="Users" />
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="p-6 border-t border-white/10 flex justify-center">
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
          {/* Active indicator */}
          <span
            className={`
              absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r
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


// import { NavLink } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";

// export default function AdminReuse() {
//   return (
//     <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/10 flex flex-col">

//       {/* Title */}
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-8 text-white">
//           Admin Panel
//         </h2>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-2">
//           <NavItem to="/admin/dashboard" label="Dashboard" />
//           <NavItem to="/admin/departments" label="Departments" />
//           <NavItem to="/admin/users" label="Users" />
//         </nav>
//       </div>

//       {/* Logout */}
//       <div className="mt-auto p-6 border-t border-white/10 flex justify-center">
//         <LogoutButton className="w-full" />
//       </div>
//     </aside>
//   );
// }

// /* ---------------- Nav Item ---------------- */

// function NavItem({ to, label }) {
//   return (
//     <NavLink to={to} end>
//       {({ isActive }) => (
//         <div
//           className={`
//             relative overflow-hidden px-4 py-3 rounded-xl
//             transition-all duration-300
//             ${
//               isActive
//                 ? "bg-white/20 text-white scale-[1.02]"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }
//           `}
//         >
//           {/* Left active indicator */}
//           <span
//             className={`
//               absolute left-0 top-0 h-full w-1
//               bg-blue-500 rounded-r
//               transition-transform duration-300
//               ${isActive ? "scale-y-100" : "scale-y-0"}
//             `}
//             style={{ transformOrigin: "top" }}
//           />

//           {/* Glow */}
//           {isActive && (
//             <span className="absolute inset-0 bg-blue-500/10 blur-xl animate-fadeIn" />
//           )}

//           <span className="relative z-10 font-medium">
//             {label}
//           </span>
//         </div>
//       )}
//     </NavLink>
//   );
// }
