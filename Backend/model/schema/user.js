const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  role: { type: String, enum:['student', 'professor', 'hod'], required: true } 
});

module.exports = mongoose.model('User', userSchema);
