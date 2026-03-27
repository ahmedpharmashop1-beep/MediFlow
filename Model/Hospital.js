const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'hospital'
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
        'Médecine Interne',
        'Cardiologie adulte',
        'Cardiologie pédiatrique (seul service de cardio-pédiatrie du pays, accueillant 7000 enfants par an)',
        'Dermatologie',
        'Endocrinologie',
        'Exploration fonctionnelle et réanimation cardiaque',
        'Gastroentérologie (services A et B)',
        'Maladies infectieuses',
        'Gynécologie',
        'Neurologie',
        'Orthopédie',
        'Psychiatrie',
        'Radiologie',
        'Chirurgie',
        'Urgence',
        'Ophtalmologie',
        'Pédiatrie'
      ]
    }],
    surgicalSpecialties: [{
      type: String,
      enum: [
        'Anesthésie-Réanimation',
        'Chirurgie Générale (Services A et B)',
        'Chirurgie Cardio-vasculaire',
        'Chirurgie Orthopédique et Traumatologique',
        'ORL / Oto-rhino-laryngologie et Maxillo-faciale',
        'Urologie',
        'Chirurgie Thoracique',
        'Spécialités Chirurgicales',
        'Chirurgie A et B (Générale et digestive)'
      ]
    }],
    emergencyServices: [{
      type: String,
      enum: [
        'Service des Urgences (Disponible 24/7)',
        'Services de consultations externes',
        'Services d\'Urgence et Medico-techniques',
        'Service des Urgences (accueil 24/7)',
        'Laboratoires d\'analyses et imagerie médicale',
        'Consultations externes (sans hospitalisation)'
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

// Hash password before saving
hospitalSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Indexes
hospitalSchema.index({ lat: 1, lng: 1 });
hospitalSchema.index({ specialties: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
