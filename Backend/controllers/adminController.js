const Department = require("../model/schema/department");
const User = require("../model/schema/user");
const Activity = require("../model/schema/activity");
const sendEmail = require("../utils/email");

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalDepartments = await Department.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student", approved: { $ne: false } });
        const totalProfessors = await User.countDocuments({ role: "professor", approved: { $ne: false } });
        const pendingApprovals = await User.countDocuments({ approved: false, isEmailVerified: true });

        res.json({
            departments: totalDepartments,
            students: totalStudents,
            professors: totalProfessors,
            pendingApprovals,
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        next(err);
    }
};

exports.getActivityLog = async (req, res, next) => {
    try {
        const activity = await Activity.find()
            .populate("actor", "name role")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(activity);
    } catch (err) {
        console.error("Fetch activity error:", err);
        next(err);
    }
};

exports.getPendingUsers = async (req, res, next) => {
    try {
        const pendingUsers = await User.find({ approved: false, isEmailVerified: true })
            .populate("department", "name")
            .sort({ _id: -1 });

        res.json(pendingUsers);
    } catch (err) {
        console.error("Fetch pending users error:", err);
        next(err);
    }
};

exports.approveUser = async (req, res, next) => {
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

        // Send Approval Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your UniPortal Account is Approved!',
                message: `Hello ${user.name},\n\nGreat news! An admin has just approved your UniPortal account.\n\nYou can now log in using the credentials you created during signup.\n\nWelcome aboard!`
            });
        } catch (emailErr) {
            console.error("Failed to send approval email:", emailErr);
            // Non-fatal, admin approval still succeeded
        }

        res.json({ success: true, message: "User approved successfully" });
    } catch (err) {
        console.error("Approve user error:", err);
        next(err);
    }
};

exports.rejectUser = async (req, res, next) => {
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
        next(err);
    }
};
