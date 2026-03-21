const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    dosage: { type: String, default: '' },
    form: { type: String, default: '' }, // comprimé, sirop, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);

