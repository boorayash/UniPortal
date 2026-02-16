import { useEffect, useState } from "react";
import Reuse from "./reuse";

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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/admin/departments", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
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
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/departments/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      {/* Sidebar */}
      <Reuse />

      {/* Content */}
      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-10">Departments</h1>

        {/* Add Department */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl mb-8 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Add Department</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20"
            />

            <input
              placeholder="Code (CSE)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20"
            >
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Research">Research</option>
            </select>

            <button
              onClick={addDepartment}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {message && <p className="text-green-400 mt-3">{message}</p>}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10"
          >
            <option value="All">All</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Research">Research</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300">
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Users</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDepartments.map((d, i) => (
                <tr
                  key={d._id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-2">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="py-2 font-medium">{d.name}</td>
                  <td className="py-2 text-gray-300">{d.code}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300">
                      {d.type}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{d.userCount || 0}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(d._id);
                          setEditName(d.name);
                          setEditCode(d.code);
                          setEditType(d.type);
                          setShowEditModal(true);
                        }}
                        className="px-3 py-1 rounded-md text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(d._id)}
                        className="px-3 py-1 rounded-md text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-600" : "bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-4">Edit Department</h2>

              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10"
              />

              <input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10"
              />

              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10"
              >
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Research">Research</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={updateDepartment}
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
