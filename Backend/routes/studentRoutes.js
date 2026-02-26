const express = require("express");
const studentController = require("../controllers/studentController.js");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();


/* =========================================================
   GET /student/dashboard
   ========================================================= */
router.get("/dashboard", verifyToken, studentController.getStudentDashboard);

/* =========================================================
   GET /student/assignments
   ========================================================= */
router.get("/assignments", verifyToken, studentController.getStudentAssignments);

/* =========================================================
   POST /student/assignments/upload
   ========================================================= */
router.post(
  "/assignments/upload",
  verifyToken,
  upload.single("file"),
  studentController.uploadAssignment
);

/* =========================================================
   POST /student/assignments/bulk-upload
   ========================================================= */
router.post(
  "/assignments/bulk-upload",
  verifyToken,
  upload.array("files", 5),
  studentController.bulkUploadAssignments
);

/* =========================================================
   POST /student/assignments/:id/submit
   ========================================================= */
router.post(
  "/assignments/:id/submit",
  verifyToken,
  studentController.submitAssignment
);

/* =========================================================
   GET /student/professors
   ========================================================= */
router.get("/professors", verifyToken, studentController.getProfessorsForStudent);

/* =========================================================
   PUT /student/assignments/:id/resubmit
   ========================================================= */
router.put(
  "/assignments/:id/resubmit",
  verifyToken,
  studentController.resubmitAssignment
);


module.exports = router;
