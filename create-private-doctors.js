const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Doctor = require('./Model/Doctor');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediflow');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const createPrivateDoctors = async () => {
  try {
    await connectDB();

    // Delete existing private doctors
    const deleted = await Doctor.deleteMany({ hospitalId: null });
    console.log(`🗑️ Supprimé ${deleted.deletedCount} médecins privés existants`);

    const privateDoctors = [
      {
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@private.tn',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '92 123 45 67',
        specialization: 'Cardiologie',
        hospitalId: null,
        hospitalName: 'Cabinet privé',
        licenseNumber: 'LN001',
        experience: 8,
        consultationFee: 100,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' }
        ],
        rating: 4.7
      },
      {
        firstName: 'Fatima',
        lastName: 'Khedher',
        email: 'fatima.khedher@private.tn',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '92 234 56 78',
        specialization: 'Gynécologie',
        hospitalId: null,
        hospitalName: 'Cabinet privé',
        licenseNumber: 'LN002',
        experience: 12,
        consultationFee: 120,
        availableDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        availableTimeSlots: [
          { start: '10:00', end: '13:00' },
          { start: '15:00', end: '19:00' }
        ],
        rating: 4.8
      },
      {
        firstName: 'Mohamed',
        lastName: 'Saidi',
        email: 'mohamed.saidi@private.tn',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '92 345 67 89',
        specialization: 'Pédiatrie',
        hospitalId: null,
        hospitalName: 'Cabinet privé',
        licenseNumber: 'LN003',
        experience: 5,
        consultationFee: 80,
        availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
        availableTimeSlots: [
          { start: '08:30', end: '12:30' },
          { start: '16:00', end: '19:00' }
        ],
        rating: 4.6
      },
      {
        firstName: 'Leila',
        lastName: 'Mani',
        email: 'leila.mani@private.tn',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '92 456 78 90',
        specialization: 'Dermatologie',
        hospitalId: null,
        hospitalName: 'Cabinet privé',
        licenseNumber: 'LN004',
        experience: 10,
        consultationFee: 110,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ],
        rating: 4.9
      },
      {
        firstName: 'Samir',
        lastName: 'Garbouj',
        email: 'samir.garbouj@private.tn',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '92 567 89 01',
        specialization: 'Ophtalmologie',
        hospitalId: null,
        hospitalName: 'Cabinet privé',
        licenseNumber: 'LN005',
        experience: 7,
        consultationFee: 95,
        availableDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        availableTimeSlots: [
          { start: '10:00', end: '13:00' },
          { start: '16:00', end: '18:30' }
        ],
        rating: 4.5
      }
    ];

    const result = await Doctor.insertMany(privateDoctors);
    console.log(`✅ ${result.length} médecins privés créés avec succès`);
    
    result.forEach((doc, idx) => {
      console.log(`  📌 Dr. ${doc.firstName} ${doc.lastName} (${doc.specialization}) - ID: ${doc._id}`);
    });

  } catch (error) {
    console.error('❌ Error creating doctors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

createPrivateDoctors();
