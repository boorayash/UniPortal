import { useEffect, useState } from "react";


export default function AddUserPopup({ close }) {
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/admin/departments", { credentials: 'include' })
      .then(res => { if (res.status === 401) { window.location.href = '/'; return null; } return res.json(); })
      .then(data => setDepartments(data || []));
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !password || !role || !departmentId) {
      setMessage("All fields required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          departmentId,
          role,
        }),
      });

      if (res.status === 401) { window.location.href = '/'; return; }
      const data = await res.json();

      if (res.ok) {
        setMessage("User created successfully!");

        // Clear all fields
        setName("");
        setEmail("");
        setPassword("");
        setDepartmentId("");
        setRole("");

        // Keep popup open & show message
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error creating user:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">

        <h2 className="text-3xl font-bold text-white mb-6">Add User</h2>

        <div className="grid grid-cols-1 gap-4">

          <input className="p-3 rounded-xl bg-white/10 text-white"
            placeholder="Full Name"
            value={name} onChange={(e) => setName(e.target.value)}
          />

          <input className="p-3 rounded-xl bg-white/10 text-white"
            placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />

          <input className="p-3 rounded-xl bg-white/10 text-white"
            placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />

          <select className="p-3 rounded-xl bg-white/10 text-white"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Select Department</option>
            {Array.isArray(departments) && departments.map((d) => (
              <option key={d._id} value={d._id} className="text-black">
                {d.name}
              </option>
            ))}
          </select>

          <select className="p-3 rounded-xl bg-white/10 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="student" className="text-black">Student</option>
            <option value="professor" className="text-black">Professor</option>
          </select>

        </div>

        <p className="text-red-400 mt-3">{message}</p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={close} className="px-4 py-2 bg-gray-600 rounded-xl">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 rounded-xl">Create</button>
        </div>
      </div>
    </div>
  );
}
