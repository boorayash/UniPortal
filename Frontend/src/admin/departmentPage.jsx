import { useEffect, useState } from "react";
import Reuse from "./reuse";
import AdminBackground from "./adminBackground";
import AuthUserBadge from "../components/AuthUserBadge";
import { X } from "lucide-react";
import API_URL from '../config/api';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("UG");
  const [message, setMessage] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editType, setEditType] = useState("UG");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/departments`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setDepartments(data || []);
    } catch (err) {
      console.log("Error fetching departments:", err);
    }
  };

  const addDepartment = async () => {
    if (!name.trim() || !code.trim()) return;

    try {
      const res = await fetch(`${API_URL}/admin/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, code, type }),
      });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMessage("Department added successfully!");
        setName("");
        setCode("");
        setType("UG");
        fetchDepartments();
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMessage("Department deleted successfully!");
        fetchDepartments();
      } else {
        setMessage(data.message || "Failed to delete department.");
      }
    } catch (err) {
      console.log("Error deleting department:", err);
    }
  };

  const updateDepartment = async () => {
    if (!editName.trim() || !editCode.trim()) return;

    try {
      const res = await fetch(`${API_URL}/admin/departments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          name: editName,
          code: editCode,
          type: editType,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMessage("Department updated successfully!");
        setShowEditModal(false);
        fetchDepartments();
      } else {
        setMessage(data.message || "Failed to update department.");
      }
    } catch (err) {
      console.log("Error updating department:", err);
    }
  };

  // Filter + pagination
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || d.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-gray-200">

      {/* Sidebar */}
      <Reuse />

      {/* Content Area */}
      <div className="relative flex-1 overflow-y-auto p-4 md:p-10">

        <AdminBackground />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Departments</h1>
              <p className="text-gray-400 mt-1 text-sm">Manage university departments and academic branches</p>
            </div>
            <AuthUserBadge />
          </div>

          {/* Action Bar (Add & Filter) */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl mb-8 border border-white/10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end shadow-xl">
            
            {/* Add Department */}
            <div className="w-full lg:w-auto">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Add New Department</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  placeholder="Department Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <input
                  placeholder="Code (e.g. CSE)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-32"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="UG" className="bg-[#0b1324]">UG</option>
                  <option value="PG" className="bg-[#0b1324]">PG</option>
                  <option value="Research" className="bg-[#0b1324]">Research</option>
                </select>
                <button
                  onClick={addDepartment}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02]"
                >
                  Create
                </button>
              </div>
              {message && <p className="text-emerald-400 text-sm mt-3">{message}</p>}
            </div>

            {/* Search & Filter */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="All" className="bg-[#0b1324]">All Types</option>
                <option value="UG" className="bg-[#0b1324]">UG</option>
                <option value="PG" className="bg-[#0b1324]">PG</option>
                <option value="Research" className="bg-[#0b1324]">Research</option>
              </select>
            </div>

          </div>

          {/* Table Container */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">#</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Code</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Users</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedDepartments.map((d, i) => (
                    <tr
                      key={d._id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td className="py-4 px-6 font-medium text-white group-hover:text-indigo-200 transition-colors">{d.name}</td>
                      <td className="py-4 px-6 font-mono text-sm text-gray-400">{d.code}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border
                          ${d.type === 'UG' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            d.type === 'PG' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                        >
                          {d.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400">{d.userCount || 0}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditId(d._id);
                              setEditName(d.name);
                              setEditCode(d.code);
                              setEditType(d.type);
                              setShowEditModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(d._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedDepartments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">No departments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 transition-colors text-sm"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-xl text-sm border transition-colors ${currentPage === i + 1 
                    ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 transition-colors text-sm"
              >
                Next
              </button>
            </div>
          )}

          {/* Edit Modal (Final Glass System) */}
          {showEditModal && (
            <div className="fixed inset-0 bg-[#070b14]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-b from-[#1a2235]/95 to-[#0c1222]/95 backdrop-blur-2xl border border-white/10 border-t-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8 rounded-2xl w-full max-w-lg relative">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Edit Department</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] p-2 rounded-lg transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Code</label>
                    <input
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/5 focus:shadow-[inset_0_0_10px_rgba(79,70,229,0.1),_0_0_15px_rgba(79,70,229,0.2)] transition-all"
                    >
                      <option value="UG" className="bg-[#0b1324]">UG</option>
                      <option value="PG" className="bg-[#0b1324]">PG</option>
                      <option value="Research" className="bg-[#0b1324]">Research</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateDepartment}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-0.5"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
