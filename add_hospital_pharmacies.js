const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Import models
const Hospital = require('./Model/Hospital');
const Pharmacy = require('./Model/Pharmacy');

async function addHospitalPharmacies() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

    // Get all hospitals
    const hospitals = await Hospital.find();
    console.log(`📋 Found ${hospitals.length} hospitals\n`);

    // Add internal pharmacies for each hospital
    for (const hospital of hospitals) {
      // Check if pharmacy already exists
      const existingPharmacy = await Pharmacy.findOne({ 
        hospitalId: hospital._id,
        isHospitalPharmacy: true
      });

      if (!existingPharmacy) {
        const pharmacy = new Pharmacy({
          name: `Pharmacie Interne - ${hospital.name}`,
          address: hospital.address,
          phone: hospital.phone,
          lat: hospital.lat,
          lng: hospital.lng,
          hospitalId: hospital._id,
          isHospitalPharmacy: true,
          rating: 4.5,
          reviewCount: 45,
          description: `Pharmacie interne de ${hospital.name} - Service de vérification et distribution des traitements chroniques APCI (mensuel/trimestriel/semestriel). Ouverture 24h/24.`,
          operatingHours: {
            monday: { open: '24h', close: '24h' },
            tuesday: { open: '24h', close: '24h' },
            wednesday: { open: '24h', close: '24h' },
            thursday: { open: '24h', close: '24h' },
            friday: { open: '24h', close: '24h' },
            saturday: { open: '24h', close: '24h' },
            sunday: { open: '24h', close: '24h' }
          }
        });

        await pharmacy.save();
        console.log(`✅ Added pharmacy for: ${hospital.name}`);
        console.log(`   📋 Pharmacy: ${pharmacy.name}`);
        console.log(`   📍 Address: ${pharmacy.address}\n`);
      } else {
        console.log(`⏭️  Pharmacy already exists for: ${hospital.name}\n`);
      }
    }

    console.log('✅ All hospital pharmacies have been processed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
addHospitalPharmacies();
