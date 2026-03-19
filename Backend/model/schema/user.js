const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  role: { type: String, enum: ['student', 'professor'], required: true },
  approved: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false }
});

module.exports = mongoose.model('User', userSchema);
