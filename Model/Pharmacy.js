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
    // Pharmacy type classification
    pharmacyType: { 
      type: String, 
      enum: ['jour', 'nuit', 'garde'], 
      default: 'jour',
      index: true
    },
    // Hospital association for internal hospital pharmacies
    hospitalId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Hospital',
      default: null,
      index: true
    },
    isHospitalPharmacy: { 
      type: Boolean, 
      default: false // true = internal hospital pharmacy, false = independent pharmacy
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);

