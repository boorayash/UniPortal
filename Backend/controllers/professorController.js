
const mongoose = require("mongoose");
const Assignment = require("../model/schema/assignment");
const Activity = require("../model/schema/activity");

exports.getProfessorDashboard = async (req, res, next) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access Denied" });
        }

        const professorId = new mongoose.Types.ObjectId(req.user.id);

        /* ---------- Pending ---------- */
        const pendingAssignments = await Assignment.find({
            reviewer: professorId,
            status: { $in: ["submitted", "resubmitted"] }
        })
            .populate("assignedTo", "name email")
            .sort({ submittedAt: 1 });

        const pendingCount = pendingAssignments.length;

        const formatted = pendingAssignments.map(a => ({
            _id: a._id,
            title: a.title,
            studentName: a.assignedTo?.name || "Deleted User",
            submittedAt: a.submittedAt,
            daysPending: Math.floor(
                (Date.now() - new Date(a.submittedAt)) / (1000 * 60 * 60 * 24)
            )
        }));

        /* ---------- Approved ---------- */
        const approvedCount = await Assignment.countDocuments({
            reviewHistory: {
                $elemMatch: {
                    by: professorId,
                    action: "approved"
                }
            }
        });

        /* ---------- Rejected ---------- */
        const rejectedCount = await Assignment.countDocuments({
            reviewHistory: {
                $elemMatch: {
                    by: professorId,
                    action: "rejected"
                }
            }
        });

        res.json({
            stats: {
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            },
            assignments: formatted
        });

    } catch (err) {
        console.error("GET /professor/dashboard error:", err);
        next(err);
    }
};

exports.getProfessorAssignments = async (req, res, next) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const assignments = await Assignment.find({
            reviewer: req.user.id
        })
            .populate("assignedTo", "name email")
            .sort({ updatedAt: -1 });

        res.json(assignments);

    } catch (err) {
        console.error("GET /professor/assignments error:", err);
        next(err);
    }
};

exports.getAssignmentForReview = async (req, res, next) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            reviewer: req.user.id,
            status: { $in: ["submitted", "resubmitted"] }
        })
            .populate("assignedTo", "name email")
            .populate("department", "name");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json({
            id: assignment._id,
            title: assignment.title,
            description: assignment.description,
            studentName: assignment.assignedTo?.name || "Deleted User",
            status: assignment.status,
            submittedAt: assignment.submittedAt,
            fileUrl: assignment.filePath,
            filename: assignment.filePath?.split('/').pop() || "file.pdf",
            course: assignment.department?.name || "Unknown",
            dueDate: assignment.deadline
        });

    } catch (err) {
        console.error("Review fetch error:", err);
        next(err);
    }
};

exports.approveAssignment = async (req, res, next) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { remarks, signature } = req.body;

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            reviewer: req.user.id,
            status: { $in: ["submitted", "resubmitted"] }
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        assignment.status = "approved";

        assignment.reviewHistory.push({
            action: "approved",
            by: req.user.id,
            remarks,
            signature
        });

        await assignment.save();

        await Activity.create({
            type: "assignment_approved",
            message: `Assignment "${assignment.title}" approved`,
            actor: req.user.id,
            meta: {
                assignmentId: assignment._id,
                studentId: assignment.assignedTo
            }
        });

        res.json({ message: "Assignment approved successfully" });

    } catch (err) {
        console.error("Approve assignment error:", err);
        next(err);
    }
};

exports.rejectAssignment = async (req, res, next) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { remarks } = req.body;

        if (!remarks || remarks.trim().length < 10) {
            return res.status(400).json({
                message: "Rejection feedback must be at least 10 characters"
            });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            reviewer: req.user.id,
            status: { $in: ["submitted", "resubmitted"] }
        });

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found or not eligible for rejection"
            });
        }

        assignment.status = "rejected";
        assignment.reviewer = null;
        assignment.remarks = remarks;

        assignment.reviewHistory.push({
            action: "rejected",
            by: req.user.id,
            remarks,
            actedAt: new Date()
        });

        await assignment.save();

        await Activity.create({
            type: "assignment_rejected",
            message: `Assignment "${assignment.title}" rejected`,
            actor: req.user.id,
            meta: {
                assignmentId: assignment._id,
                studentId: assignment.assignedTo
            }
        });

        res.json({ message: "Assignment rejected successfully" });

    } catch (err) {
        console.error("Reject assignment error:", err);
        next(err);
    }
};
