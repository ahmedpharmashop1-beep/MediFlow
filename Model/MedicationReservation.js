const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationReservationSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true, index: true },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true, index: true },

    quantity: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: ['reserved', 'collected', 'expired', 'cancelled'],
      default: 'reserved',
      index: true,
    },

    // Code à encoder en QR côté frontend
    reservationCode: { type: String, required: true, unique: true, index: true },

    expiresAt: { type: Date, required: true },
    collectedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicationReservation', medicationReservationSchema);

