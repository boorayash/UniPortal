export default function AuthUserBadge() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  if (!role) return null;

  const displayName = name || (role === "admin" ? "Admin" : "User");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
      <div className="flex flex-col text-right">
        <span className="text-sm font-medium text-white">
          {displayName}
        </span>
        <span className="text-xs text-gray-400 capitalize">
          {role}
        </span>
      </div>

      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
        {initial}
      </div>
    </div>
  );
}
 