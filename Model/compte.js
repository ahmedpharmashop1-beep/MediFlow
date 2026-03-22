const mongoose = require('mongoose');
const { Schema } = mongoose;

const compteSchema = new Schema(
  {
    firstName: { 
      type: String, 
      trim: true 
    },
    lastName: { 
      type: String, 
      trim: true 
    },
    name: { 
      type: String, 
      trim: true 
    }, // Pour les hôpitaux et CNAM
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['patient', 'pharmacist', 'doctor', 'hospital', 'cnam_admin'],
      default: 'patient',
    },
    isAdmin: { type: Boolean, default: false },
    // Champs supplémentaires pour différents types
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
    insuranceNumber: { type: String, trim: true }, // Pour patients
    speciality: { type: String, trim: true }, // Pour médecins
    hospital: { type: String, trim: true }, // Pour médecins
    pharmacyName: { type: String, trim: true }, // Pour pharmaciens
    bedCount: { type: Number }, // Pour hôpitaux
    departments: [{ type: String }], // Pour hôpitaux
    averageProcessingTime: { type: String }, // Pour CNAM
    services: [{ type: String }] // Pour CNAM
  },
  { timestamps: true }
);

module.exports = mongoose.model('Compte', compteSchema);

