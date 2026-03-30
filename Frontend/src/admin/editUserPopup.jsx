import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
    const res = await fetch(`${API_URL}/admin/departments`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    if (res.status === 401) { window.location.href = '/'; return; }
    const data = await res.json();
    setDepartments(data || []);
  };

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    <div className="fixed inset-0 bg-[#070b14]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a2235]/95 to-[#0c1222]/95 backdrop-blur-2xl border border-white/10 border-t-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8 rounded-2xl w-full max-w-lg relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Edit User</h2>
            <button onClick={close} className="text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] p-2 rounded-lg transition-all">
                <X className="w-5 h-5"/>
            </button>
        </div>

        <div className="space-y-5">

            <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                />
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                />
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Password</label>
                <input
                    type="password"
                    placeholder="Leave empty to keep current password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                />
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Department</label>
                <select
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                >
                    <option value="" className="bg-[#0b1324] text-gray-400">Select Department</option>
                    {Array.isArray(departments) && departments.map((d) => (
                    <option key={d._id} value={d._id} className="bg-[#0b1324] text-gray-200">
                        {d.name}
                    </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Role</label>
                <input
                    type="text"
                    value={form.role}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-gray-500 cursor-not-allowed capitalize focus:outline-none"
                />
            </div>

        </div>

        {message && <p className="text-emerald-400 text-sm mt-4">{message}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
            <button 
                onClick={close} 
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl border border-white/10 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={updateUser} 
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-0.5"
            >
                Update User
            </button>
        </div>

      </div>
    </div>
  );
}
