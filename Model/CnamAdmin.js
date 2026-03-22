const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const cnamAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  officeAddress: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  accessLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced', 'admin'],
    default: 'basic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
cnamAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('CnamAdmin', cnamAdminSchema);
