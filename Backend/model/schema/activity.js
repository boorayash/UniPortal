const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String, // assignment_submitted, user_created, etc.
      required: true
    },

    message: {
      type: String,
      required: true
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    meta: {
      type: Object // flexible extra info
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
