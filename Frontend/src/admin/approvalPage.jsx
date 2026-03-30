import { useEffect, useState } from "react";
import AdminReuse from "./reuse";
import AdminBackground from "./adminBackground";
import AuthUserBadge from "../components/AuthUserBadge";
import { Check, X, Clock, UserCheck } from "lucide-react";
import API_URL from '../config/api';

export default function ApprovalPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPending = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/pending-users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            if (response.status === 401) { window.location.href = "/"; return; }
            const data = await response.json();
            setPendingUsers(data || []);
        } catch (err) {
            console.error("Failed to fetch pending users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleAction = async (userId, action) => {
        setActionLoading(userId);
        try {
            const response = await fetch(`${API_URL}/admin/${action === 'approve' ? 'approve' : 'reject'}-user/${userId}`, {
                method: action === 'approve' ? 'POST' : 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.status === 401) { window.location.href = "/"; return; }
            if (response.ok) {
                setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
            }
        } catch (err) {
            console.error(`Failed to ${action} user:`, err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-gray-200">
            {/* Sidebar */}
            <AdminReuse />

            {/* Content Area */}
            <div className="relative flex-1 overflow-y-auto p-4 md:p-10">

                <AdminBackground />

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <UserCheck className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Pending Approvals</h1>
                                <p className="text-gray-400 mt-1 text-sm">Review and manage new account requests</p>
                            </div>
                        </div>
                        <AuthUserBadge />
                    </div>

                    {/* Pending Requests Content */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                            <Clock className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-xl font-medium text-gray-300">No pending requests</p>
                            <p className="text-sm mt-1">All account requests have been handled.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-white/[0.08] transition-all duration-300 shadow-xl group"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors">{user.name}</h3>
                                        <p className="text-gray-400 text-sm font-mono mt-0.5">{user.email}</p>
                                        
                                        <div className="flex gap-3 mt-3">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize
                                                ${user.role === 'student' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                                user.role === 'professor' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                                            >
                                                {user.role}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                {user.department?.name || "No Department"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => handleAction(user._id, "approve")}
                                            disabled={actionLoading === user._id}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium flex justify-center items-center gap-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(user._id, "reject")}
                                            disabled={actionLoading === user._id}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-rose-400 font-medium flex justify-center items-center gap-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] disabled:opacity-50"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
