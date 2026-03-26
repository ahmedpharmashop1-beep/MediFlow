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

const createAllPharmacies = async () => {
  try {
    console.log('\n🏪 Création de toutes les pharmacies à partir des pharmaciens...\n');
    
    // Récupérer tous les pharmaciens
    const pharmacists = await Pharmacist.find({});
    console.log(`💊 ${pharmacists.length} pharmaciens trouvés\n`);
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const pharmacist of pharmacists) {
      const pharmacyName = pharmacist.pharmacyName || `Pharmacy ${pharmacist._id}`;
      
      let pharmacy = await Pharmacy.findOne({ name: pharmacyName });
      
      if (!pharmacy) {
        try {
          pharmacy = new Pharmacy({
            name: pharmacyName,
            address: pharmacist.pharmacyAddress || 'Adresse non spécifiée',
            phone: pharmacist.phone || '',
            lat: pharmacist.coordinates?.lat || 36.8065, // Coordonnées par défaut (Tunis)
            lng: pharmacist.coordinates?.lng || 10.1815,
            rating: 4.5,
            reviewCount: 0
          });
          
          await pharmacy.save();
          createdCount++;
          console.log(`  ✅ Pharmacy créée: ${pharmacyName}`);
        } catch (error) {
          if (error.code === 11000) {
            existingCount++;
            console.log(`  ⚠️  Pharmacy existe déjà: ${pharmacyName}`);
          } else {
            console.error(`  ❌ Erreur lors de la création de ${pharmacyName}:`, error.message);
          }
        }
      } else {
        existingCount++;
        console.log(`  ℹ️  Pharmacy existe déjà: ${pharmacyName}`);
      }
    }
    
    console.log(`\n📊 Résumé:`);
    console.log(`🆕 Pharmacies créées: ${createdCount}`);
    console.log(`📍 Pharmacies existantes: ${existingCount}`);
    console.log(`🏪 Total: ${createdCount + existingCount} pharmacies`);
    
    // Vérifier le nombre total de pharmacies
    const totalPharmacies = await Pharmacy.countDocuments();
    console.log(`🔍 Vérification: ${totalPharmacies} pharmacies dans la base de données`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des pharmacies:', error);
  }
};

const main = async () => {
  await connectDB();
  await createAllPharmacies();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

main().catch(console.error);
