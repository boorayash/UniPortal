const Department = require("../model/schema/department");
const User = require("../model/schema/user");
const Activity = require("../model/schema/activity");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalDepartments = await Department.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student", approved: { $ne: false } });
        const totalProfessors = await User.countDocuments({ role: "professor", approved: { $ne: false } });
        const pendingApprovals = await User.countDocuments({ approved: false });

        res.json({
            departments: totalDepartments,
            students: totalStudents,
            professors: totalProfessors,
            pendingApprovals,
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const activity = await Activity.find()
            .populate("actor", "name role")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(activity);
    } catch (err) {
        console.error("Fetch activity error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ approved: false })
            .populate("department", "name")
            .sort({ _id: -1 });

        res.json(pendingUsers);
    } catch (err) {
        console.error("Fetch pending users error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.approved) return res.status(400).json({ message: "User already approved" });

        user.approved = true;
        await user.save();

        await Activity.create({
            type: "user_approved",
            message: `User "${user.name}" approved (${user.role})`,
            actor: req.user.id,
            meta: { userId: user._id }
        });

        res.json({ success: true, message: "User approved successfully" });
    } catch (err) {
        console.error("Approve user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userName = user.name;
        const userRole = user.role;
        await User.findByIdAndDelete(req.params.id);

        await Activity.create({
            type: "user_rejected",
            message: `User "${userName}" rejected (${userRole})`,
            actor: req.user.id,
            meta: { userId: req.params.id }
        });

        res.json({ success: true, message: "User rejected and removed" });
    } catch (err) {
        console.error("Reject user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
