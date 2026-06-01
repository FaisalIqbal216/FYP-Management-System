const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'supervisor', 'student'], default: 'student' },
  isActive: { type: Boolean, default: true },
  rollNo: { type: String, default: '' },
  department: { type: String, default: '' },
  batch: { type: String, default: '' },
  semester: { type: String, default: '' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  designation: { type: String, default: '' },
  field: { type: String, default: '' },
  phone: { type: String, default: '' },
  maxStudents: { type: Number, default: 5 },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);