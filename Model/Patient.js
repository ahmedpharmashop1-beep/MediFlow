const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const patientSchema = new Schema(
  {
    firstName: { 
      type: String, 
      required: true,
      trim: true 
    },
    lastName: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      default: 'patient',
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
    insuranceType: { 
      type: String, 
      enum: ['CNSS', 'CNRPS'],
      required: true
    },
    insuranceCode: { 
      type: String, 
      trim: true, 
      unique: true, 
      required: true
    },
    isConnected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
patientSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Patient', patientSchema);
