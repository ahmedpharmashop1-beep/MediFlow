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
  role: {
    type: String,
    default: 'cnam_admin'
  },
  phone: {
    type: String
  },
  officeAddress: {
    type: String
  },
  employeeId: {
    type: String,
    unique: true
  },
  department: {
    type: String
  },
  position: {
    type: String
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

// Indexes pour optimiser les performances
cnamAdminSchema.index({ role: 1 });
cnamAdminSchema.index({ accessLevel: 1 });
cnamAdminSchema.index({ department: 1 });

// Hash password before saving
cnamAdminSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('CnamAdmin', cnamAdminSchema);
