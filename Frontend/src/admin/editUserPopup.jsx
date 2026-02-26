import { useEffect, useState } from "react";
import API_URL from '../config/api';

export default function EditUserPopup({ userId, close, onUpdated }) {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
    role: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDepartments();
    fetchUser();
  }, []);

  const loadDepartments = async () => {
    const res = await fetch(`${API_URL}/admin/departments`, { credentials: 'include' });
    if (res.status === 401) { window.location.href = '/'; return; }
    const data = await res.json();
    setDepartments(data || []);
  };

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, { credentials: 'include' });
    if (res.status === 401) { window.location.href = '/'; return; }
    const data = await res.json();

    setForm({
      name: data.name,
      email: data.email,
      password: "",
      departmentId: data.departmentId,
      role: data.role
    });
  };

  const updateUser = async () => {
    // The instruction provided a malformed snippet.
    // Interpreting the intent to change method to PATCH and remove Authorization header.
    // Also, assuming 'form' should be used for the body, not 'formData' as it's not defined.
    // The 'try' block was also incomplete in the instruction, so keeping the original structure.
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PATCH", // Changed from PUT to PATCH
      credentials: "include",
      headers: { "Content-Type": "application/json" }, // Removed Authorization header logic
      body: JSON.stringify(form),
    });

    if (res.status === 401) { window.location.href = '/'; return; }
    const data = await res.json();

    if (res.ok) {
      setMessage("User updated successfully!");
      onUpdated();
      setTimeout(() => close(), 1500);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/20 p-7 rounded-2xl w-full max-w-lg relative">

        <button className="absolute top-3 right-4 text-white text-xl" onClick={close}>×</button>

        <h2 className="text-3xl font-bold mb-6">Edit User</h2>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            value={form.name}
            className="bg-white/10 p-3 rounded-xl"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            value={form.email}
            className="bg-white/10 p-3 rounded-xl"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Leave empty to keep same password"
            className="bg-white/10 p-3 rounded-xl"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            value={form.departmentId}
            className="bg-white/10 p-3 rounded-xl"
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
          >
            <option value="">Select Department</option>
            {Array.isArray(departments) && departments.map((d) => (
              <option key={d._id} value={d._id} className="text-black">
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={form.role}
            disabled
            className="bg-gray-700 cursor-not-allowed p-3 rounded-xl text-white"
          />

        </div>

        <button
          onClick={updateUser}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
        >
          Update User
        </button>

        {message && <p className="mt-3 text-green-400">{message}</p>}
      </div>
    </div>
  );
}
