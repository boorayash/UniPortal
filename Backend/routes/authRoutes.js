const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Admin = require("../model/schema/admin.js");
const User = require("../model/schema/user.js");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  // 1) Check admin table
  let user = await Admin.findOne({ email });
  let role = "admin";

  // 2) If not admin, check User table
  if (!user) {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    role = user.role;  // student / professor / hod
  }

  // Password validation
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  // JWT
  const token = jwt.sign(
    { id: user._id,
      name: user.name || "Admin",
      role: user.role || "admin",
      email: user.email
     },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.json({ message: "Login successful", role, token });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.json({ message: "Logout successful" });
});


module.exports = router;
