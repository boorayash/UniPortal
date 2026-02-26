const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController.js");
const { verifyToken } = require("../middleware/authMiddleware");

/* ==============================
   PROFESSOR DASHBOARD
================================ */
router.get("/dashboard", verifyToken, professorController.getProfessorDashboard);

/* ==============================
   PROFESSOR ASSIGNMENTS LIST
================================ */
router.get("/assignments", verifyToken, professorController.getProfessorAssignments);

/* ==============================
   REVIEW ASSIGNMENT
================================ */
router.get("/assignments/:id/review", verifyToken, professorController.getAssignmentForReview);

/* ==============================
   APPROVE ASSIGNMENT (NO OTP)
================================ */
router.post("/assignments/:id/approve", verifyToken, professorController.approveAssignment);

/* ==============================
   REJECT ASSIGNMENT
================================ */
router.post("/assignments/:id/reject", verifyToken, professorController.rejectAssignment);


module.exports = router;
