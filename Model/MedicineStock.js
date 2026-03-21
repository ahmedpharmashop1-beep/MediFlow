const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicineStockSchema = new Schema(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    // Qty totale disponible (hors réservations)
    stockCount: { type: Number, required: true, min: 0 },
    // Qty déjà réservées (Bloquées pour des patients en attente de collecte)
    reservedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

medicineStockSchema.index({ medicineId: 1, pharmacyId: 1 }, { unique: true });

module.exports = mongoose.model('MedicineStock', medicineStockSchema);

