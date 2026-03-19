const mongoose = require("mongoose");
const Assignment = require("../model/schema/assignment");
const User = require("../model/schema/user");
const Activity = require("../model/schema/activity");

exports.getStudentDashboard = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        const aggregation = await Assignment.aggregate([
            {
                $match: {
                    assignedTo: new mongoose.Types.ObjectId(studentId)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            draft: 0,
            submitted: 0,
            resubmitted: 0,
            approved: 0,
            rejected: 0
        };

        aggregation.forEach(item => {
            stats[item._id] = item.count;
        });

        const recent = await Assignment.find({ assignedTo: studentId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select("title status");

        res.json({ stats, recent });

    } catch (err) {
        console.error("GET /student/dashboard error:", err);
        next(err);
    }
};

exports.getStudentAssignments = async (req, res, next) => {
    try {
        const { status, sort } = req.query;

        const query = { assignedTo: req.user.id };
        if (status && status !== "all") {
            query.status = status;
        }

        const assignments = await Assignment.find(query)
            .populate("approvedBy", "name email")
            .populate("reviewHistory.by", "name role")
            .sort({ updatedAt: sort === "asc" ? 1 : -1 })
            .select(
                "title category status updatedAt submittedAt resubmittedAt reviewHistory"
            );

        res.json(assignments);
    } catch (err) {
        console.error("GET /student/assignments error:", err);
        next(err);
    }
};

exports.uploadAssignment = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "PDF file is required" });
        }

        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const assignment = await Assignment.create({
            title,
            description,
            category,
            filePath: req.file.path,
            fileSize: req.file.size,
            assignedTo: student._id,
            department: student.department,
            status: "draft"
        });

        await Activity.create({
            type: "assignment_uploaded",
            message: `Assignment "${assignment.title}" uploaded`,
            actor: req.user.id,
            meta: {
                assignmentId: assignment._id
            }
        });

        res.status(201).json({
            message: "Assignment uploaded successfully",
            assignmentId: assignment._id
        });

    } catch (err) {
        console.error("Upload assignment error:", err);
        next(err);
    }
};

exports.bulkUploadAssignments = async (req, res, next) => {
    try {
        const { description, category } = req.body;

        if (!description || !category) {
            return res.status(400).json({
                message: "Description and category are required"
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one PDF file is required"
            });
        }

        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const createdAssignments = [];

        for (const file of req.files) {
            const assignment = await Assignment.create({
                title: file.originalname.replace(".pdf", ""),
                description,
                category,
                filePath: file.path,
                fileSize: file.size,
                assignedTo: student._id,
                department: student.department,
                status: "draft"
            });

            createdAssignments.push({
                id: assignment._id,
                title: assignment.title
            });
        }

        res.status(201).json({
            message: "Bulk upload successful",
            count: createdAssignments.length,
            assignments: createdAssignments
        });

    } catch (err) {
        console.error("Bulk upload error:", err);
        next(err);
    }
};

exports.submitAssignment = async (req, res, next) => {
    try {
        const { reviewerId } = req.body;

        if (!reviewerId) {
            return res.status(400).json({ message: "Reviewer is required" });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            assignedTo: req.user.id,
            status: { $in: ["draft", "resubmitted"] }
        });

        if (!assignment) {
            return res.status(404).json({
                message: "Draft or resubmitted assignment not found"
            });
        }

        assignment.status = "submitted";
        assignment.reviewer = reviewerId;

        // Only set on first submission
        if (!assignment.submittedAt) {
            assignment.submittedAt = new Date();
        }

        await assignment.save();
        await Activity.create({
            type: "assignment_submitted",
            message: `Assignment "${assignment.title}" submitted for review`,
            actor: req.user.id,
            meta: {
                assignmentId: assignment._id,
                reviewerId
            }
        });

        res.json({
            message: "Assignment submitted for review successfully"
        });

    } catch (err) {
        console.error("Submit assignment error:", err);
        next(err);
    }
};

exports.getProfessorsForStudent = async (req, res, next) => {
    try {
        const student = await User.findById(req.user.id);

        const professors = await User.find({
            role: "professor",
            department: student.department
        }).select("name email");

        res.json(professors);
    } catch (err) {
        console.error("Fetch professors error:", err);
        next(err);
    }
};

exports.resubmitAssignment = async (req, res, next) => {
    try {
        const { description } = req.body;

        if (!description || description.trim().length < 5) {
            return res.status(400).json({
                message: "Description is required"
            });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            assignedTo: req.user.id,
            status: "rejected"
        });

        if (!assignment) {
            return res.status(404).json({
                message: "Rejected assignment not found"
            });
        }

        assignment.description = description;
        assignment.status = "resubmitted";
        assignment.reviewer = null;

        // 🔥 Explicit resubmission marker (OPTION A)
        assignment.resubmittedAt = new Date();

        await assignment.save();
        await Activity.create({
            type: "assignment_resubmitted",
            message: `Assignment "${assignment.title}" resubmitted`,
            actor: req.user.id,
            meta: {
                assignmentId: assignment._id
            }
        });

        res.json({
            message: "Assignment updated. You can submit it for review now."
        });

    } catch (err) {
        console.error("Resubmit error:", err);
        next(err);
    }
};
