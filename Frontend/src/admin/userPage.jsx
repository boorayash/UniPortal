import { useEffect, useState } from "react";
import Reuse from "./reuse";
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      {/* Sidebar */}
      <Reuse />

      {/* Content */}
      <div className="flex-1 p-4 md:p-10">

        {/* Header + Add */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Users</h1>

          <button
            onClick={() => setShowAddPopup(true)}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            + Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white md:w-1/3"
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white md:w-1/4"
          >
            <option value="all" className="text-black">All Roles</option>
            <option value="student" className="text-black">Student</option>
            <option value="professor" className="text-black">Professor</option>
          </select>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white md:w-1/4"
          >
            <option value="all" className="text-black">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id} className="text-black">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="overflow-x-auto w-full">
<table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300">
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-2">
                    {(currentPage - 1) * 20 + i + 1}
                  </td>

                  <td className="py-2 font-medium">{u.name}</td>

                  <td className="py-2 text-gray-400 text-sm">
                    {u.email}
                  </td>

                  <td className="py-2">
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300 capitalize">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-2 text-gray-300">
                    {u.departmentName}
                  </td>

                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditPopup({ show: true, userId: u._id })
                        }
                        className="px-3 py-1 rounded-md text-sm 
                                   bg-yellow-500/20 text-yellow-400 
                                   hover:bg-yellow-500/30"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-3 py-1 rounded-md text-sm 
                                   bg-red-500/20 text-red-400 
                                   hover:bg-red-500/30"
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

          {users.length === 0 && (
            <p className="text-gray-400 text-center mt-4">
              No users found
            </p>
          )}
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
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-white/10"
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
  );
}
