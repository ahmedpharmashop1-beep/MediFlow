const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    // GPS coordinates
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    // Hospital details
    type: {
      type: String,
      enum: ['general', 'specialized', 'clinic', 'emergency'],
      default: 'general'
    },
    specialties: [{
      type: String,
      enum: [
        'Médecine générale',
        'Cardiologie',
        'Dermatologie',
        'Ophtalmologie',
        'Pédiatrie',
        'Gynécologie',
        'Neurologie',
        'Orthopédie',
        'Psychiatrie',
        'Radiologie',
        'Chirurgie',
        'Urgence'
      ]
    }],
    capacity: {
      totalBeds: {
        type: Number,
        default: 0
      },
      occupiedBeds: {
        type: Number,
        default: 0
      },
      emergencyCapacity: {
        type: Number,
        default: 0
      }
    },
    // Queue management
    queueStatus: {
      estimatedWaitMin: {
        type: Number,
        default: 0
      },
      patientsAhead: {
        type: Number,
        default: 0
      },
      isSaturated: {
        type: Boolean,
        default: false
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    // Operating hours
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    // Contact persons
    administrators: [{
      name: String,
      role: String,
      phone: String,
      email: String
    }],
    // Integration status
    isIntegrated: {
      type: Boolean,
      default: true // For MediFlow integration
    }
  },
  { timestamps: true }
);

// Indexes
hospitalSchema.index({ lat: 1, lng: 1 });
hospitalSchema.index({ specialties: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);