const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const pharmacistSchema = new mongoose.Schema({
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
    default: 'pharmacist'
  },
  phone: {
    type: String
  },
  pharmacyName: {
    type: String
  },
  pharmacyAddress: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  rating: {
    type: Number,
    default: 4.5
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
pharmacistSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
