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

const checkPharmacyData = async () => {
  try {
    console.log('🔍 Vérification des données des pharmacies...\n');
    
    // Vérifier les pharmacies
    const pharmacies = await Pharmacy.find({});
    console.log(`🏪 Pharmacies dans la base de données: ${pharmacies.length}`);
    
    pharmacies.forEach((pharmacy, index) => {
      console.log(`  ${index + 1}. ${pharmacy.name} - ${pharmacy.address}`);
    });
    
    // Vérifier les pharmaciens
    const pharmacists = await Pharmacist.find({});
    console.log(`\n💊 Pharmaciens dans la base de données: ${pharmacists.length}`);
    
    pharmacists.forEach((pharmacist, index) => {
      console.log(`  ${index + 1}. ${pharmacist.pharmacyName || 'No name'} - ${pharmacist.email}`);
    });
    
    // Créer les pharmacies manquantes si nécessaire
    console.log('\n🔧 Création des pharmacies manquantes...');
    
    for (const pharmacist of pharmacists) {
      const pharmacyName = pharmacist.pharmacyName || `Pharmacy ${pharmacist._id}`;
      
      let pharmacy = await Pharmacy.findOne({ name: pharmacyName });
      
      if (!pharmacy) {
        console.log(`  ➕ Création de: ${pharmacyName}`);
        
        try {
          pharmacy = new Pharmacy({
            name: pharmacyName,
            address: pharmacist.pharmacyAddress || 'Adresse non spécifiée',
            phone: pharmacist.phone || '',
            lat: pharmacist.coordinates?.lat || 36.8065 + (Math.random() - 0.5) * 0.1, // Variation autour de Tunis
            lng: pharmacist.coordinates?.lng || 10.1815 + (Math.random() - 0.5) * 0.1,
            rating: 4.5,
            reviewCount: 0
          });
          
          await pharmacy.save();
          console.log(`    ✅ Créée avec succès`);
        } catch (error) {
          console.error(`    ❌ Erreur:`, error.message);
        }
      } else {
        console.log(`  ℹ️  Existe déjà: ${pharmacyName}`);
      }
    }
    
    // Vérification finale
    const finalPharmacies = await Pharmacy.find({});
    console.log(`\n🎯 Total final de pharmacies: ${finalPharmacies.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
};

const main = async () => {
  await connectDB();
  await checkPharmacyData();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

main().catch(console.error);
