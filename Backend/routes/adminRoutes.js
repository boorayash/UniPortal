const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyAdmin } = require('../middleware/authMiddleware');
const adminController = require("../controllers/adminController.js");


// NOTE: user creation is handled in usersRoute.js (/admin/users/create)


router.get("/dashboard", verifyAdmin, adminController.getDashboardStats);
router.get("/activity", verifyAdmin, adminController.getActivityLog);
router.get("/pending-users", verifyAdmin, adminController.getPendingUsers);
router.post("/approve-user/:id", verifyAdmin, adminController.approveUser);
router.post("/reject-user/:id", verifyAdmin, adminController.rejectUser);


module.exports = router;

