const mongoose = require('mongoose');
const { Schema } = mongoose;

const pharmacySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    address: { type: String, default: '' },
    // GPS, used for "closest pharmacy" ranking
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);

