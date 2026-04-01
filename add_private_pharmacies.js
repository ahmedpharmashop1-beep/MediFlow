const mongoose = require('mongoose');
require('dotenv').config();
const Pharmacy = require('./Model/Pharmacy');

const MONGODB_URI = process.env.DB_URI || 'mongodb://localhost:27017/mediflow';

async function addPrivatePharmacies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const pharmacies = [
      // Pharmacies de jour (7h - 20h)
      {
        name: 'Pharmacie du Centre - Jour',
        address: '123 Rue de la Paix, Tunis',
        phone: '+216 71 123 456',
        lat: 36.8065,
        lng: 10.1957,
        rating: 4.8,
        reviewCount: 42,
        pharmacyType: 'jour',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '07:00', close: '20:00' },
          tuesday: { open: '07:00', close: '20:00' },
          wednesday: { open: '07:00', close: '20:00' },
          thursday: { open: '07:00', close: '20:00' },
          friday: { open: '07:00', close: '20:00' },
          saturday: { open: '08:00', close: '19:00' },
          sunday: { open: '09:00', close: '13:00' }
        },
        description: 'Pharmacie privée ouverte en journée avec large choix de médicaments'
      },
      {
        name: 'Pharmacie El Menzah - Jour',
        address: '45 Avenue Habib Bourguiba, Tunis',
        phone: '+216 71 789 012',
        lat: 36.8000,
        lng: 10.1800,
        rating: 4.6,
        reviewCount: 38,
        pharmacyType: 'jour',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '07:30', close: '20:30' },
          tuesday: { open: '07:30', close: '20:30' },
          wednesday: { open: '07:30', close: '20:30' },
          thursday: { open: '07:30', close: '20:30' },
          friday: { open: '07:30', close: '20:30' },
          saturday: { open: '08:30', close: '19:30' },
          sunday: { open: '10:00', close: '14:00' }
        },
        description: 'Pharmacie spécialisée en produits naturels et bio'
      },
      // Pharmacies de nuit (20h - 8h)
      {
        name: 'Pharmacie de Nuit - La Marsa',
        address: '78 Rue de la Marsa, Tunis',
        phone: '+216 71 345 678',
        lat: 36.8200,
        lng: 10.3200,
        rating: 4.7,
        reviewCount: 55,
        pharmacyType: 'nuit',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '20:00', close: '08:00' },
          tuesday: { open: '20:00', close: '08:00' },
          wednesday: { open: '20:00', close: '08:00' },
          thursday: { open: '20:00', close: '08:00' },
          friday: { open: '20:00', close: '08:00' },
          saturday: { open: '20:00', close: '08:00' },
          sunday: { open: '20:00', close: '08:00' }
        },
        description: 'Pharmacie de nuit disponible 24/7 pour urgences'
      },
      {
        name: 'Pharmacie 24h Urgence',
        address: '12 Rue République, Ariana',
        phone: '+216 71 567 890',
        lat: 36.8600,
        lng: 10.1500,
        rating: 4.5,
        reviewCount: 72,
        pharmacyType: 'nuit',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        description: 'Pharmacie de garde 24h/24 toute l\'année'
      },
      // Pharmacies de garde (service de garde)
      {
        name: 'Pharmacie de Garde - Ben Arous',
        address: '56 Rue Médecins, Ben Arous',
        phone: '+216 71 234 567',
        lat: 36.7400,
        lng: 10.2300,
        rating: 4.4,
        reviewCount: 31,
        pharmacyType: 'garde',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '20:00', close: '08:00' },
          tuesday: { open: '20:00', close: '08:00' },
          wednesday: { open: '20:00', close: '08:00' },
          thursday: { open: '20:00', close: '08:00' },
          friday: { open: '20:00', close: '08:00' },
          saturday: { open: '20:00', close: '08:00' },
          sunday: { open: '20:00', close: '08:00' }
        },
        description: 'Pharmacie de garde avec service sur rendez-vous'
      },
      {
        name: 'Pharmacie Garde - Sfax',
        address: '89 Avenue Paris, Sfax',
        phone: '+216 74 456 789',
        lat: 34.7400,
        lng: 10.7600,
        rating: 4.3,
        reviewCount: 28,
        pharmacyType: 'garde',
        isHospitalPharmacy: false,
        operatingHours: {
          monday: { open: '20:00', close: '08:00' },
          tuesday: { open: '20:00', close: '08:00' },
          wednesday: { open: '20:00', close: '08:00' },
          thursday: { open: '20:00', close: '08:00' },
          friday: { open: '20:00', close: '08:00' },
          saturday: { open: '20:00', close: '08:00' },
          sunday: { open: '20:00', close: '08:00' }
        },
        description: 'Service de garde pharmaceutique avec urgences'
      }
    ];

    // Delete existing private pharmacies first
    await Pharmacy.deleteMany({ isHospitalPharmacy: false, pharmacyType: { $in: ['jour', 'nuit', 'garde'] } });
    console.log('🗑️ Existing private pharmacies deleted');

    // Add new pharmacies
    const result = await Pharmacy.insertMany(pharmacies);
    console.log(`✅ Added ${result.length} pharmacies successfully`);

    // Show summary
    console.log('\n📊 Pharmacies Added Summary:');
    console.log('===================================');
    const joursCount = result.filter(p => p.pharmacyType === 'jour').length;
    const nuitsCount = result.filter(p => p.pharmacyType === 'nuit').length;
    const gardesCount = result.filter(p => p.pharmacyType === 'garde').length;
    
    console.log(`🌞 Pharmacies de jour: ${joursCount}`);
    console.log(`🌙 Pharmacies de nuit: ${nuitsCount}`);
    console.log(`🚨 Pharmacies de garde: ${gardesCount}`);
    console.log('===================================\n');

    result.forEach(pharmacy => {
      console.log(`✓ ${pharmacy.name} (${pharmacy.pharmacyType})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

addPrivatePharmacies();
