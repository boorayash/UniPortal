import {jwtDecode} from "jwt-decode";

export default function AuthUserBadge() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  let user;
  try {
    user = jwtDecode(token);
  } catch {
    return null;
  }

  const displayName =
    user.name ||
    (user.role === "admin" ? "Admin" : null) ||
    user.email ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
      <div className="flex flex-col text-right">
        <span className="text-sm font-medium text-white">
          {displayName}
        </span>
        <span className="text-xs text-gray-400 capitalize">
          {user.role}
        </span>
      </div>

      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
        {initial}
      </div>
    </div>
  );
}

