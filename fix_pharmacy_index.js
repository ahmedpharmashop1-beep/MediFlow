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

const fixPharmacyIndexAndCreate = async () => {
  try {
    console.log('🔧 Correction de l\'index et création des pharmacies...\n');
    
    // 1. Supprimer l'index problématique s'il existe
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('pharmacies');
      
      // Lister les indexes
      const indexes = await collection.indexes();
      console.log('📋 Indexes actuels:');
      indexes.forEach(index => {
        console.log(`   ${index.name}: ${JSON.stringify(index.key)}`);
      });
      
      // Supprimer l'index licenseNumber s'il existe
      const licenseIndex = indexes.find(idx => idx.key && idx.key.licenseNumber);
      if (licenseIndex) {
        await collection.dropIndex('licenseNumber_1');
        console.log('✅ Index licenseNumber supprimé');
      }
      
    } catch (error) {
      console.log('ℹ️  Erreur lors de la suppression de l\'index (normal si inexistant):', error.message);
    }
    
    // 2. Créer les pharmacies manquantes
    const pharmacists = await Pharmacist.find({});
    console.log(`\n💊 ${pharmacists.length} pharmaciens trouvés`);
    
    const pharmaciesData = [
      { name: 'Pharmacie du Centre', address: '123 Avenue Habib Bourguiba, Tunis', phone: '+216 71 111 111', lat: 36.8065, lng: 10.1815 },
      { name: 'Pharmacie El Menzah', address: '45 Rue El Menzah, Tunis', phone: '+216 71 222 222', lat: 36.8425, lng: 10.2007 },
      { name: 'Pharmacie La Marsa', address: '78 Rue de la Marsa, Tunis', phone: '+216 71 333 333', lat: 36.8969, lng: 10.3096 },
      { name: 'Pharmacie Sousse', address: '25 Rue Farhat Hached, Sousse', phone: '+216 73 111 111', lat: 35.8256, lng: 10.6369 },
      { name: 'Pharmacie Sfax', address: '156 Rue Hedi Chaker, Sfax', phone: '+216 74 111 111', lat: 34.7406, lng: 10.7603 },
      { name: 'Pharmacie Bizerte', address: '89 Rue Mongi Slim, Bizerte', phone: '+216 72 111 111', lat: 37.2745, lng: 9.8739 },
      { name: 'Pharmacie Gabès', address: '237 Avenue Habib Bourguiba, Gabès', phone: '+216 75 111 111', lat: 33.8815, lng: 10.0982 },
      { name: 'Pharmacie Nabeul', address: '67 Rue de la République, Nabeul', phone: '+216 72 222 222', lat: 36.4561, lng: 10.7362 }
    ];
    
    let createdCount = 0;
    
    for (const pharmacyData of pharmaciesData) {
      try {
        const existing = await Pharmacy.findOne({ name: pharmacyData.name });
        if (!existing) {
          const pharmacy = new Pharmacy({
            ...pharmacyData,
            rating: 4.5,
            reviewCount: Math.floor(Math.random() * 200) + 50
          });
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
    
    // 3. Vérification finale
    const finalPharmacies = await Pharmacy.find({});
    console.log(`\n🎯 Total final de pharmacies: ${finalPharmacies.length}`);
    
    console.log('\n📋 Liste des pharmacies:');
    finalPharmacies.forEach((pharmacy, index) => {
      console.log(`  ${index + 1}. ${pharmacy.name} - ${pharmacy.address}`);
    });
    
    // 4. Ajouter les stocks manquants pour les nouvelles pharmacies
    if (createdCount > 0) {
      console.log('\n📦 Ajout des stocks pour les nouvelles pharmacies...');
      const Medicine = require('./Model/Medicine');
      const MedicineStock = require('./Model/MedicineStock');
      
      const medicines = await Medicine.find({});
      const stockData = [
        { medicineName: 'Doliprane', stockCount: 50, price: 2.50, description: 'Antalgique', category: 'Antalgique' },
        { medicineName: 'Aspirine', stockCount: 45, price: 1.80, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
        { medicineName: 'Vitamine C', stockCount: 30, price: 8.90, description: 'Vitamine', category: 'Vitamine' },
        { medicineName: 'Ibuprofène', stockCount: 40, price: 3.20, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
        { medicineName: 'Paracétamol', stockCount: 60, price: 2.10, description: 'Antalgique', category: 'Antalgique' }
      ];
      
      let stocksAdded = 0;
      
      for (const pharmacy of finalPharmacies) {
        for (const stock of stockData) {
          const medicine = medicines.find(m => m.name === stock.medicineName);
          if (medicine) {
            const existing = await MedicineStock.findOne({
              medicineId: medicine._id,
              pharmacyId: pharmacy._id
            });
            
            if (!existing) {
              const medicineStock = new MedicineStock({
                medicineId: medicine._id,
                pharmacyId: pharmacy._id,
                stockCount: stock.stockCount,
                price: stock.price,
                description: stock.description,
                category: stock.category
              });
              
              await medicineStock.save();
              stocksAdded++;
            }
          }
        }
      }
      
      console.log(`  ✅ ${stocksAdded} stocks ajoutés`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixPharmacyIndexAndCreate();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Opération terminée avec succès!');
};

main().catch(console.error);
