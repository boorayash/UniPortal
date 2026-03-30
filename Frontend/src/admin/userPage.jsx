import { useEffect, useState } from "react";
import Reuse from "./reuse";
import AdminBackground from "./adminBackground";
import AuthUserBadge from "../components/AuthUserBadge";
import AddUserPopup from "./addUserPopup";
import EditUserPopup from "./editUserPopup";
import API_URL from '../config/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState({ show: false, userId: null });

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, [search, filterRole, filterDept, currentPage]);

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
      console.log("Error loading departments:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API_URL}/admin/users?page=${currentPage}&search=${search}&role=${filterRole}&department=${filterDept}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setUsers(data?.users || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.log("Error loading users:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

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
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Users</h1>
              <p className="text-gray-400 mt-1 text-sm">Manage student and professor accounts</p>
            </div>
            <AuthUserBadge />
          </div>

          {/* Action Bar (Search, Filter & Add) */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl mb-8 border border-white/10 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center shadow-xl">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors w-full lg:max-w-xs"
              />

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-auto"
              >
                <option value="all" className="bg-[#0b1324] text-gray-200">All Roles</option>
                <option value="student" className="bg-[#0b1324] text-gray-200">Student</option>
                <option value="professor" className="bg-[#0b1324] text-gray-200">Professor</option>
              </select>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-auto"
              >
                <option value="all" className="bg-[#0b1324] text-gray-200">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id} className="bg-[#0b1324] text-gray-200">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddPopup(true)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] whitespace-nowrap w-full lg:w-auto"
            >
              + Add User
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">#</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest">Department</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u._id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {(currentPage - 1) * 20 + i + 1}
                      </td>

                      <td className="py-4 px-6 font-medium text-white group-hover:text-indigo-200 transition-colors">{u.name}</td>

                      <td className="py-4 px-6 font-mono text-sm text-gray-400">
                        {u.email}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize
                          ${u.role === 'student' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                            u.role === 'professor' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-400">
                        {u.departmentName}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              setEditPopup({ show: true, userId: u._id })
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteUser(u._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No users found
                      </td>
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

          {/* Popups */}
          {showAddPopup && (
            <AddUserPopup
              close={() => {
                setShowAddPopup(false);
                fetchUsers();
              }}
            />
          )}

          {editPopup.show && (
            <EditUserPopup
              userId={editPopup.userId}
              close={() =>
                setEditPopup({ show: false, userId: null })
              }
              onUpdated={() => {
                setSearch("");
                setFilterDept("all");
                setFilterRole("all");
                setCurrentPage(1);
                fetchUsers();
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
}
