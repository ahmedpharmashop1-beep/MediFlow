const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['patient', 'pharmacist', 'hospital_staff', 'cnam_admin'],
      default: 'patient',
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);

