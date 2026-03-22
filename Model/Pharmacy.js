const mongoose = require('mongoose');
const { Schema } = mongoose;

const pharmacySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    // GPS, used for "closest pharmacy" ranking
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    // Reviews and ratings
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);

