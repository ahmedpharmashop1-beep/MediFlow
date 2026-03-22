const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: '',
      maxlength: 500
    },
    isVerified: {
      type: Boolean,
      default: false // True if patient actually visited/purchased from pharmacy
    }
  },
  { timestamps: true }
);

// Compound index to prevent multiple reviews from same patient for same pharmacy
reviewSchema.index({ patientId: 1, pharmacyId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);