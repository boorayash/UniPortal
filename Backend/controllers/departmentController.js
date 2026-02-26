const Department = require('../model/schema/department');
const Activity = require("../model/schema/activity");

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'department',
                    as: 'users'
                }
            },
            {
                $addFields: {
                    userCount: { $size: '$users' }
                }
            },
            {
                $project: {
                    users: 0
                }
            }
        ]);

        res.status(200).json(departments);
    } catch (err) {
        console.error("Fetch departments error:", err);
        res.status(500).json({ message: 'Error fetching departments' });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const { name, code, type } = req.body;

        const newDept = new Department({ name, code, type });
        await newDept.save();

        // ✅ Activity: department created
        await Activity.create({
            type: "department_created",
            message: `Department "${newDept.name}" created`,
            actor: req.user.id,
            meta: {
                departmentId: newDept._id
            }
        });

        res.status(201).json({
            message: 'Department created successfully',
            department: newDept
        });

    } catch (err) {
        console.error("Create department error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { name, code, type } = req.body;

        const updated = await Department.findByIdAndUpdate(
            req.params.id,
            { name, code, type },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Department not found" });
        }

        // ✅ Activity: department updated
        await Activity.create({
            type: "department_updated",
            message: `Department "${updated.name}" updated`,
            actor: req.user.id,
            meta: {
                departmentId: updated._id
            }
        });

        res.json({ success: true, updated });

    } catch (err) {
        console.error("Update department error:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const dept = await Department.findByIdAndDelete(req.params.id);

        if (!dept) {
            return res.status(404).json({ message: "Department not found" });
        }

        // ✅ Activity: department deleted
        await Activity.create({
            type: "department_deleted",
            message: `Department "${dept.name}" deleted`,
            actor: req.user.id,
            meta: {
                departmentId: dept._id
            }
        });

        res.json({ message: 'Department deleted successfully' });

    } catch (err) {
        console.error("Delete department error:", err);
        res.status(500).json({ message: 'Error deleting department' });
    }
};
