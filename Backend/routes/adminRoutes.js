const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyAdmin } = require('../middleware/authMiddleware');

const Department = require("../model/schema/department");
const User = require("../model/schema/user");
const Activity = require("../model/schema/activity");

// NOTE: user creation is handled in usersRoute.js (/admin/users/create)

router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalProfessors = await User.countDocuments({ role: "professor" });
    const totalHods = await User.countDocuments({ role: "hod" });
    
    res.json({
      departments: totalDepartments,
      students: totalStudents,
      professors: totalProfessors,
      hods: totalHods,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/activity", verifyAdmin, async (req, res) => {
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
});

module.exports = router;

// function verifyAdmin(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, "This is a secret key.");

//     if (decoded.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     req.admin = decoded; 
//     next();

//   } catch (err) {
//     return res.status(400).json({ message: "Invalid token" });
//   }
// }