import { useEffect, useState } from "react";
import AdminReuse from "./reuse";
import { Check, X, Clock, UserCheck } from "lucide-react";
import API_URL from '../config/api';

export default function ApprovalPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPending = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/pending-users`, {
                credentials: 'include'
            });
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
                credentials: 'include'
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
        <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#1c0033] text-white">
            <AdminReuse />

            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl">
                        <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Approval Requests</h1>
                        <p className="text-white/60 text-sm">Review and manage new account requests</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-white/50">
                        <Clock className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-xl font-medium">No pending requests</p>
                        <p className="text-sm mt-1">All account requests have been handled</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingUsers.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                    <p className="text-white/60 text-sm">{user.email}</p>
                                    <div className="flex gap-3 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                                            {user.role}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            {user.department?.name || "No Department"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 ml-4">
                                    <button
                                        onClick={() => handleAction(user._id, "approve")}
                                        disabled={actionLoading === user._id}
                                        className="px-5 py-2.5 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded-xl text-green-300 font-medium flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(user._id, "reject")}
                                        disabled={actionLoading === user._id}
                                        className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl text-red-300 font-medium flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
