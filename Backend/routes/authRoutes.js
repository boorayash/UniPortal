const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const Department = require("../model/schema/department.js");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.get("/verify", authController.verifyToken);

// Public endpoint for signup department dropdown
router.get("/departments", async (req, res) => {
    try {
        const departments = await Department.find().select("name _id");
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
