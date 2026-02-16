import { useEffect, useState } from "react";
import Reuse from "./reuse";
import AuthUserBadge from "../components/AuthUserBadge";
import AdminStatCard from "./statsCard";
import AdminActivityPanel from "./activityPanel";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    students: 0,
    professors: 0,
    hods: 0,
  });

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchActivity();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/admin/dashboard", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

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
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/admin/activity", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setActivity(data || []);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      {/* Sidebar (FIXED) */}
      <Reuse />

      {/* Dashboard Scroll Area */}
      <div className="relative flex-1 overflow-y-auto p-10">

        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[130px] animate-pulse delay-200" />
          <div className="absolute top-40 right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[130px] animate-pulse delay-500" />
        </div>

        {/* Header */}
        <div className="relative flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            Admin Dashboard
          </h1>
          <AuthUserBadge />
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          <AdminStatCard title="Total Departments" value={stats.departments} color="indigo" to="/admin/departments" />
          <AdminStatCard title="Total Students" value={stats.students} color="green" to="/admin/users?role=student" />
          <AdminStatCard title="Total Professors" value={stats.professors} color="orange" to="/admin/users?role=professor" />
          <AdminStatCard title="Total HODs" value={stats.hods} color="purple" to="/admin/users?role=hod" />
        </div>

        {/* Activity */}
        <div className="relative mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AdminActivityPanel activity={activity} />
          </div>

          <div className="bg-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Coming soon…
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import Reuse from "./reuse";
// import AuthUserBadge from "../components/AuthUserBadge";
// import AdminStatCard from "./statsCard";
// import AdminActivityPanel from "./activityPanel";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     departments: 0,
//     students: 0,
//     professors: 0,
//     hods: 0,
//   });

//   const [activity, setActivity] = useState([]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch("http://localhost:5000/admin/dashboard", { credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       if (res.status === 401) { window.location.href = '/'; return; }
//       const data = await res.json();
//       setStats(data || {
//         departments: 0,
//         students: 0,
//         professors: 0,
//         hods: 0,
//       });
//     } catch (err) {
//       console.log("Dashboard fetch error:", err);
//     }
//   };

//   const fetchActivity = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:5000/admin/activity", {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       const data = await res.json();
//       setActivity(data || []);
//     };

//     useEffect(() => {
//       fetchDashboardData();
//       fetchActivity();
//     }, []);

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">

//       {/* Background Blobs */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[130px] animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[130px] animate-pulse delay-200"></div>
//         <div className="absolute top-40 right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[130px] animate-pulse delay-500"></div>
//       </div>

//       {/* Sidebar */}
//         <Reuse />
//       {/* Dashboard Content */}
//       <div className="relative flex-1 p-10">
//         <div className="flex justify-between items-center mb-10">
//           <h1 className="text-4xl font-bold drop-shadow-lg">
//             Admin Dashboard
//           </h1>

//           <AuthUserBadge />
//         </div>

        

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//           <AdminStatCard
//             title="Total Departments"
//             value={stats.departments}
//             color="indigo"
//             to="/admin/departments"
//           />

//           <AdminStatCard
//             title="Total Students"
//             value={stats.students}
//             color="green"
//             to="/admin/users?role=student"
//           />

//           <AdminStatCard
//             title="Total Professors"
//             value={stats.professors}
//             color="orange"
//             to="/admin/users?role=professor"
//           />

//           <AdminStatCard
//             title="Total HODs"
//             value={stats.hods}
//             color="purple"
//             to="/admin/users?role=hod"
//           />

//         </div>
//         <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Activity takes more space */}
//           <div className="lg:col-span-2">
//             <AdminActivityPanel activity={activity} />
//           </div>

//           {/* Future: Quick actions / system info */}
//           <div className="bg-white/10 rounded-2xl p-6">
//             <p className="text-gray-400 text-sm">
//               System insights coming soon…
//             </p>
//           </div>

//         </div>


//       </div>
//     </div>
//   );
// }

