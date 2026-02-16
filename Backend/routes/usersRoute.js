const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../model/schema/user');
const Department = require('../model/schema/department');
const Assignment = require('../model/schema/assignment');
const Activity = require("../model/schema/activity");
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.get("/departments-list", async (req,res)=>{
    try{
        const departments = await Department.find().select("name code");
        res.json(departments);
    } catch(err){
        res.status(500).json({message : "Server error"});
    }
});

// GET USERS WITH PAGINATION, SEARCH, FILTERS
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    let { page = 1, limit = 20, search = "", role = "all", department = "all" } = req.query;
    page = Number(page);
    limit = Number(limit);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role !== "all") filter.role = role;
    if (department !== "all") {
      filter.department = new mongoose.Types.ObjectId(department);
    }

    const users = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "departmentData"
        }
      },
      { $unwind: "$departmentData" },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          status: 1,
          departmentName: "$departmentData.name"
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/users/create", verifyAdmin, async(req,res)=>{
    try{
        const{name,email,password,departmentId,role} = req.body;
        if(!name || !email || !password || !departmentId || !role){
            return res.status(400).json({message: "All fields are required"});
        }

        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            department: departmentId,
            role
        });

        await user.save();
        await Activity.create({
          type: "user_created",
          message: `User "${user.name}" created (${user.role})`,
          actor: req.user.id,
          meta: {
            userId: user._id
          }
        });

        res.json({success:true, message: "User created successfully", user});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/users/:id", verifyToken, async(req,res)=>{
  try{
    const user = await User.findById(req.params.id).populate('department','name');

    // If requester isn't admin or requesting their own profile, deny
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if(!user)
      return res.status(404).json({message:"User not found"});

    res.json({
      name: user.name,
      email: user.email,
      departmentId: user.department._id,
      role: user.role
    });
  } catch(err){
    res.status(500).json({message: "Server error"});
  }
});

router.put("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, departmentId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Check if email already used by another user
    const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existing)
      return res.status(400).json({ message: "Email already in use by another user" });

    user.name = name;
    user.email = email;
    user.department = new mongoose.Types.ObjectId(departmentId);

    // Update password only if entered
    if (password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    await Activity.create({
      type: "user_updated",
      message: `User "${user.name}" updated`,
      actor: req.user.id,
      meta: { userId: user._id }
    });


    res.json({ success: true, message: "User updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE USER
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. If student → check pending assignments
    if (user.role === "student") {
      const pendingAssignments = await Assignment.find({
        student: userId,
        status: "pending",
      });

      if (pendingAssignments.length > 0) {
        return res.status(400).json({
          message: "Student has pending assignments. Cannot delete.",
        });
      }
    }

    // 3. Delete user
    await User.findByIdAndDelete(userId);
    await Activity.create({
      type: "user_deleted",
      message: `User "${user.name}" deleted`,
      actor: req.user.id,
      meta: { userId: user._id }
    });


    return res.json({ success: true, message: "User deleted successfully" });

  } catch (err) {
    console.log("Delete Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;