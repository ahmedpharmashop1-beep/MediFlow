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
  phone: {
    type: String,
    required: true
  },
  pharmacyName: {
    type: String,
    required: true
  },
  pharmacyAddress: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
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
pharmacistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
