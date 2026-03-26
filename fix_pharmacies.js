const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
const Pharmacy = require('./Model/Pharmacy');
const Pharmacist = require('./Model/Pharmacist');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Connect to database using same config as server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const fixPharmacies = async () => {
  try {
    console.log('🔧 Correction des pharmacies manquantes...\n');
    
    // Récupérer tous les pharmaciens
    const pharmacists = await Pharmacist.find({});
    console.log(`💊 ${pharmacists.length} pharmaciens trouvés`);
    
    // Récupérer les pharmacies existantes
    const existingPharmacies = await Pharmacy.find({});
    console.log(`🏪 ${existingPharmacies.length} pharmacies existantes`);
    
    const pharmaciesToCreate = [];
    
    for (const pharmacist of pharmacists) {
      const pharmacyName = pharmacist.pharmacyName || `Pharmacy ${pharmacist._id}`;
      
      const existing = await Pharmacy.findOne({ name: pharmacyName });
      if (!existing) {
        pharmaciesToCreate.push({
          name: pharmacyName,
          address: pharmacist.pharmacyAddress || 'Adresse non spécifiée',
          phone: pharmacist.phone || '',
          lat: pharmacist.coordinates?.lat || 36.8065 + (Math.random() - 0.5) * 0.1,
          lng: pharmacist.coordinates?.lng || 10.1815 + (Math.random() - 0.5) * 0.1,
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 200) + 50
        });
      }
    }
    
    console.log(`📍 ${pharmaciesToCreate.length} pharmacies à créer\n`);
    
    // Créer les pharmacies une par une pour éviter les erreurs
    let createdCount = 0;
    for (const pharmacyData of pharmaciesToCreate) {
      try {
        // Vérifier si elle n'existe pas déjà (double vérification)
        const existing = await Pharmacy.findOne({ name: pharmacyData.name });
        if (!existing) {
          const pharmacy = new Pharmacy(pharmacyData);
          await pharmacy.save();
          createdCount++;
          console.log(`  ✅ Pharmacie créée: ${pharmacyData.name}`);
        } else {
          console.log(`  ℹ️  Existe déjà: ${pharmacyData.name}`);
        }
      } catch (error) {
        console.error(`  ❌ Erreur pour ${pharmacyData.name}:`, error.message);
      }
    }
    
    // Vérification finale
    const finalPharmacies = await Pharmacy.find({});
    console.log(`\n🎯 Total final de pharmacies: ${finalPharmacies.length}`);
    
    finalPharmacies.forEach((pharmacy, index) => {
      console.log(`  ${index + 1}. ${pharmacy.name} - ${pharmacy.address}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction des pharmacies:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixPharmacies();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Correction terminée!');
};

main().catch(console.error);
