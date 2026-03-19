import API_URL from '../config/api';
export default function LogoutButton({ className = "" }) {

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Always clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Redirect to login
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={logout}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition ${className}`}
    >
      Logout
    </button>
  );
}
