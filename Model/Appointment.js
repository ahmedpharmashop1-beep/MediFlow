const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    specialty: {
      type: String,
      required: true,
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
        'Radiologie'
      ]
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    appointmentTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 30
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled'
    },
    reason: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    // Communication and follow-up
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: {
      type: Date
    },
    prescriptions: [{
      medicineId: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      dosage: String,
      duration: String,
      instructions: String
    }],
    // Communication log
    communications: [{
      type: {
        type: String,
        enum: ['email', 'sms', 'call', 'in_person']
      },
      message: String,
      sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
      },
      sentAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Indexes for efficient queries
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
appointmentSchema.index({ hospitalId: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);