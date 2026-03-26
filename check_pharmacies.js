// Script pour vérifier les pharmacies existantes dans la base de données
const Pharmacist = require('./Model/Pharmacist');
const mongoose = require('mongoose');

// Connexion à la base de données
require('dotenv').config();
const connectDB = require('./config/connectDB');

const checkPharmacies = async () => {
  try {
    console.log('🔍 Vérification des pharmacies existantes...\n');
    
    const pharmacies = await Pharmacist.find({});
    
    if (pharmacies.length === 0) {
      console.log('❌ Aucune pharmacie trouvée dans la base de données');
      return;
    }
    
    console.log(`📊 ${pharmacies.length} pharmacie(s) trouvée(s):\n`);
    
    pharmacies.forEach((pharmacy, index) => {
      console.log(`${index + 1}. 🏥 ${pharmacy.pharmacyName || 'Non spécifié'}`);
      console.log(`   👤 Nom: ${pharmacy.name}`);
      console.log(`   📧 Email: ${pharmacy.email}`);
      console.log(`   📱 Téléphone: ${pharmacy.phone}`);
      console.log(`   📍 Adresse: ${pharmacy.pharmacyAddress || 'Non spécifiée'}`);
      console.log(`   ⭐ Rating: ${pharmacy.rating || 'Non spécifié'}`);
      console.log(`   🆔 ID: ${pharmacy._id}`);
      console.log('');
    });
    
    // Vérifier les doublons par nom de pharmacie
    const pharmacyNames = {};
    pharmacies.forEach(pharmacy => {
      const name = pharmacy.pharmacyName || 'Non spécifié';
      if (pharmacyNames[name]) {
        pharmacyNames[name].push(pharmacy);
      } else {
        pharmacyNames[name] = [pharmacy];
      }
    });
    
    console.log('🔍 Vérification des doublons par nom de pharmacie:\n');
    let hasDuplicates = false;
    
    Object.keys(pharmacyNames).forEach(name => {
      if (pharmacyNames[name].length > 1) {
        hasDuplicates = true;
        console.log(`⚠️  Doublon trouvé pour: ${name}`);
        pharmacyNames[name].forEach((pharmacy, index) => {
          console.log(`   ${index + 1}. Email: ${pharmacy.email} (ID: ${pharmacy._id})`);
        });
        console.log('');
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ Aucun doublon trouvé par nom de pharmacie');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Exécuter la vérification
checkPharmacies();
