const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
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

const checkMedicinesInPharmacies = async () => {
  try {
    console.log('🔍 Vérification des médicaments ajoutés dans les pharmacies...\n');
    
    const medicinesToCheck = ['Doliprane', 'Aspirine', 'Vitamine C'];
    
    // Récupérer toutes les pharmacies
    const pharmacies = await Pharmacist.find({});
    console.log(`🏪 ${pharmacies.length} pharmacies trouvées\n`);
    
    for (const medicineName of medicinesToCheck) {
      console.log(`💊 Vérification de: ${medicineName}`);
      let foundInPharmacies = 0;
      
      for (const pharmacy of pharmacies) {
        if (pharmacy.medicines && pharmacy.medicines.length > 0) {
          const medicine = pharmacy.medicines.find(
            med => med.name.toLowerCase() === medicineName.toLowerCase()
          );
          
          if (medicine) {
            foundInPharmacies++;
            console.log(`  ✅ ${pharmacy.pharmacyName || pharmacy.name} - ${medicine.price}DT - Stock: ${medicine.stock}`);
          }
        }
      }
      
      console.log(`📊 ${medicineName} trouvé dans ${foundInPharmacies}/${pharmacies.length} pharmacies\n`);
    }
    
    // Afficher un résumé global
    console.log('📋 Résumé global:');
    let totalMedicines = 0;
    
    for (const pharmacy of pharmacies) {
      if (pharmacy.medicines) {
        totalMedicines += pharmacy.medicines.length;
      }
    }
    
    console.log(`🏪 Nombre total de pharmacies: ${pharmacies.length}`);
    console.log(`💊 Nombre total de médicaments dans toutes les pharmacies: ${totalMedicines}`);
    console.log(`📊 Moyenne de médicaments par pharmacie: ${(totalMedicines / pharmacies.length).toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
};

const main = async () => {
  await connectDB();
  await checkMedicinesInPharmacies();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

main().catch(console.error);
