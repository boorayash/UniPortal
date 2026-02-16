const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // -------- BASIC INFO --------
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["assignment", "thesis", "report"],
      required: true
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // professor
    },

    resubmittedAt: {
      type: Date
    },

    // -------- FILE --------
    filePath: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number // bytes
    },

    // -------- RELATIONS --------
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },


    // -------- STATUS FLOW --------
    status: {
      type: String,
      enum: ["draft", "submitted","resubmitted", "approved", "rejected"],
      default: "draft",
      index: true
    },

    reviewHistory: [{
      action: { type: String, enum: ["approved", "rejected"] },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      remarks: String,
      signatureHash: String,
      actedAt: { type: Date, default: Date.now }
    }],


    // -------- AUDIT --------
    submittedAt: Date,
    remarks: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
