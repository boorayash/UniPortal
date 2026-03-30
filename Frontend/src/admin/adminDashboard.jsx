import { useEffect, useState } from "react";
import Reuse from "./reuse";
import AuthUserBadge from "../components/AuthUserBadge";
import AdminStatCard from "./statsCard";
import AdminActivityPanel from "./activityPanel";
import AdminBackground from "./adminBackground";
import { Folder, Users, Star, AlertCircle } from "lucide-react";
import API_URL from '../config/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    students: 0,
    professors: 0,
    pendingApprovals: 0,
  });

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchActivity();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (res.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/activity`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setActivity(data || []);
    } catch (err) {
      console.log("Activity fetch error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-gray-200">
      
      {/* Sidebar */}
      <Reuse />

      {/* Dashboard Scroll Area */}
      <div className="relative flex-1 overflow-y-auto p-4 md:p-10">

        <AdminBackground />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative flex justify-between items-center mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <AuthUserBadge />
          </div>

          {/* Stats: Hero Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <AdminStatCard 
              title="Total Departments" 
              value={stats.departments} 
              color="indigo" 
              to="/admin/departments" 
              icon={Folder} 
            />
            <AdminStatCard 
              title="Total Students" 
              value={stats.students} 
              color="cyan" 
              to="/admin/users?role=student" 
              icon={Users} 
            />
            <AdminStatCard 
              title="Total Professors" 
              value={stats.professors} 
              color="indigo" 
              to="/admin/users?role=professor" 
              icon={Star} 
            />
            <AdminStatCard 
              title="Pending Approvals" 
              value={stats.pendingApprovals} 
              color="amber" 
              to="/admin/approvals" 
              icon={AlertCircle} 
              isWarning={true}
            />
          </div>

          {/* Activity: Full Width System Console */}
          <div className="w-full">
            <AdminActivityPanel activity={activity} />
          </div>
        </div>

      </div>
    </div>
  );
}

