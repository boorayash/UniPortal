const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyToken } = require("../middleware/authMiddleware");

const Assignment = require("../model/schema/assignment");
const User = require("../model/schema/user");
const Activity = require("../model/schema/activity");

/* ==============================
   PROFESSOR DASHBOARD
================================ */
router.get("/dashboard", verifyToken, async (req, res) => {
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
      studentName: a.assignedTo.name,
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
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   PROFESSOR ASSIGNMENTS LIST
================================ */
router.get("/assignments", verifyToken, async (req, res) => {
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
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   REVIEW ASSIGNMENT
================================ */
router.get("/assignments/:id/review", verifyToken, async (req, res) => {
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
      studentName: assignment.assignedTo.name,
      status: assignment.status,
      submittedAt: assignment.submittedAt,
      // filePath: assignment.filePath,
      filename: path.basename(assignment.filePath),
      course: assignment.department.name,
      dueDate: assignment.deadline
    });

  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   APPROVE ASSIGNMENT (NO OTP)
================================ */
router.post("/assignments/:id/approve", verifyToken, async (req, res) => {
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
      signature // 🔐 kept (raw for now, will hash later)
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
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   REJECT ASSIGNMENT
================================ */
router.post("/assignments/:id/reject", verifyToken, async (req, res) => {
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
    assignment.reviewer = null; // allow reselection
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
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const { verifyToken } = require("../middleware/authMiddleware");

// const Assignment = require("../model/schema/assignment");
// const User = require("../model/schema/user");
// const Activity = require("../model/schema/activity");

// router.get("/dashboard", verifyToken, async (req, res) => {
//   try {
//     if (req.user.role !== "professor") {
//       return res.status(403).json({ message: "Access Denied" });
//     }

//     const professorId = new mongoose.Types.ObjectId(req.user.id);

//     /* ---------------- Pending ---------------- */
//     const pendingAssignments = await Assignment.find({
//       reviewer: professorId,
//       status: { $in: ["submitted", "resubmitted"] }
//     })
//       .populate("assignedTo", "name email")
//       .sort({ submittedAt: 1 });

//     const pendingCount = pendingAssignments.length;

//     const formatted = pendingAssignments.map(a => ({
//       _id: a._id,
//       title: a.title,
//       studentName: a.assignedTo.name,
//       submittedAt: a.submittedAt,
//       daysPending: Math.floor(
//         (Date.now() - new Date(a.submittedAt)) / (1000 * 60 * 60 * 24)
//       )
//     }));

//     /* ---------------- Approved (FIX) ---------------- */
//     const approvedCount = await Assignment.countDocuments({
//       reviewHistory: {
//         $elemMatch: {
//           by: professorId,
//           action: "approved"
//         }
//       }
//     });

//     /* ---------------- Rejected (FIX) ---------------- */
//     const rejectedCount = await Assignment.countDocuments({
//       reviewHistory: {
//         $elemMatch: {
//           by: professorId,
//           action: "rejected"
//         }
//       }
//     });

//     res.json({
//       stats: {
//         pending: pendingCount,
//         approved: approvedCount,
//         rejected: rejectedCount
//       },
//       assignments: formatted
//     });

//   } catch (err) {
//     console.error("GET /professor/dashboard error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // router.get("/dashboard",verifyToken,async(req,res)=>{
// //     try{
// //         if(req.user.role !== "professor"){
// //             return res.status(403).json({message: "Access Denied"});
// //         }

// //         const professorId = req.user.id;

// //         const assignments = await Assignment.find({
// //             reviewer: professorId,
// //             status: { $in: ["submitted", "resubmitted"] }
// //         })
// //         .populate("assignedTo", "name email")
// //         .sort({submittedAt: 1});

// //         const pendingCount = assignments.length;

// //         const formatted = assignments.map(a => {
// //             const daysPending = Math.floor(
// //                 (Date.now() - new Date(a.submittedAt)) / (1000 * 60 * 60 * 24)
// //             );

// //             return{
// //                 _id: a._id,
// //                 title: a.title,
// //                 studentName: a.assignedTo.name,
// //                 submittedAt: a.submittedAt,
// //                 daysPending
// //             };
// //         });

// //         res.json({
// //             stats: {
// //                 pending: pendingCount,
// //                 approved: await Assignment.countDocuments({
// //                 reviewer: professorId,
// //                 status: "approved"
// //                 }),
// //                 rejected: await Assignment.countDocuments({
// //                 reviewer: professorId,
// //                 status: "rejected"
// //                 })
// //             },
// //             assignments: formatted
// //         });

// //     } catch(err){
// //         console.error("GET /professor/dashboard error:", err);
// //         res.status(500).json({message: "Server error"});
// //     }
// // });

// // GET /professor/assignments
// router.get("/assignments", verifyToken, async (req, res) => {
//   try {
//     if (req.user.role !== "professor") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const assignments = await Assignment.find({
//       reviewer: req.user.id
//     })
//       .populate("assignedTo", "name email")
//       .sort({ updatedAt: -1 });

//     res.json(assignments);

//   } catch (err) {
//     console.error("GET /professor/assignments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // GET /professor/assignments/:id/review
// router.get("/assignments/:id/review", verifyToken, async (req, res) => {
//   try {
//     if (req.user.role !== "professor") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const assignment = await Assignment.findOne({
//       _id: req.params.id,
//       reviewer: req.user.id,
//       status: { $in: ["submitted", "resubmitted"] }
//     })
//       .populate("assignedTo", "name email")
//       .populate("department", "name");

//     if (!assignment) {
//       return res.status(404).json({ message: "Assignment not found" });
//     }

//     res.json({
//       id: assignment._id,
//       title: assignment.title,
//       description: assignment.description,
//       studentName: assignment.assignedTo.name,
//       status: assignment.status,
//       submittedAt: assignment.submittedAt,
//       filePath: assignment.filePath,
//       course: assignment.department.name,
//       dueDate: assignment.deadline
//     });

//   } catch (err) {
//     console.error("Review fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // POST /professor/assignments/:id/request-otp
// router.post("/assignments/:id/request-otp", verifyToken, async (req, res) => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   req.app.locals.otpStore = req.app.locals.otpStore || {};
//   req.app.locals.otpStore[req.user.id] = {
//     otp,
//     expires: Date.now() + 5 * 60 * 1000
//   };

//   // TODO: nodemailer send (later)
//   console.log("OTP for professor:", otp);

//   res.json({ message: "OTP sent to registered email" });
// });

// // POST /professor/assignments/:id/approve
// router.post("/assignments/:id/approve", verifyToken, async (req, res) => {
//   const { remarks, otp, signature } = req.body;

//   const store = req.app.locals.otpStore?.[req.user.id];

//   if (!store || store.otp !== otp || store.expires < Date.now()) {
//     return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   const assignment = await Assignment.findOne({
//     _id: req.params.id,
//     reviewer: req.user.id,
//     status: { $in: ["submitted", "resubmitted"] }
//   });

//   if (!assignment) {
//     return res.status(404).json({ message: "Assignment not found" });
//   }

//   assignment.status = "approved";
//   assignment.reviewHistory.push({
//     action: "approved",
//     by: req.user.id,
//     remarks,
//     signatureHash: crypto.createHash("sha256").update(signature).digest("hex")
//   });

//   await assignment.save();
//   await Activity.create({
//     type: "assignment_approved",
//     message: `Assignment "${assignment.title}" approved`,
//     actor: req.user.id,
//     meta: {
//       assignmentId: assignment._id,
//       studentId: assignment.assignedTo
//     }
//   });

//   delete req.app.locals.otpStore[req.user.id];

//   res.json({ message: "Assignment approved successfully" });
// });

// // POST /professor/assignments/:id/reject
// router.post(
//   "/assignments/:id/reject",
//   verifyToken,
//   async (req, res) => {
//     try {
//       if (req.user.role !== "professor") {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const { remarks } = req.body;

//       if (!remarks || remarks.trim().length < 10) {
//         return res.status(400).json({
//           message: "Rejection feedback must be at least 10 characters"
//         });
//       }

//       const assignment = await Assignment.findOne({
//         _id: req.params.id,
//         reviewer: req.user.id,
//         status: { $in: ["submitted", "resubmitted"] }
//       });

//       if (!assignment) {
//         return res.status(404).json({
//           message: "Assignment not found or not eligible for rejection"
//         });
//       }

//       assignment.status = "rejected";
//       assignment.reviewer = null; // allow reselection
//       assignment.remarks = remarks;

//       assignment.reviewHistory.push({
//         action: "rejected",
//         by: req.user.id,
//         remarks,
//         actedAt: new Date()
//       });

//       await assignment.save();
//       await Activity.create({
//         type: "assignment_rejected",
//         message: `Assignment "${assignment.title}" rejected`,
//         actor: req.user.id,
//         meta: {
//           assignmentId: assignment._id,
//           studentId: assignment.assignedTo
//         }
//       });

//       // 🔔 Notification stub (email / in-app later)
//       console.log(
//         `Assignment ${assignment._id} rejected. Feedback sent to student.`
//       );

//       res.json({
//         message: "Assignment rejected successfully"
//       });

//     } catch (err) {
//       console.error("Reject assignment error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );



// module.exports = router;