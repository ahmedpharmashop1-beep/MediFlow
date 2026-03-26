// Script pour supprimer une pharmacie en double
const Pharmacist = require('./Model/Pharmacist');
const mongoose = require('mongoose');

// Connexion à la base de données
require('dotenv').config();
const connectDB = require('./config/connectDB');

const deleteDuplicatePharmacy = async () => {
  try {
    console.log('🔍 Recherche des pharmacies "Pharmacie du Centre"...\n');
    
    // Trouver toutes les pharmacies avec ce nom
    const pharmacies = await Pharmacist.find({ pharmacyName: 'Pharmacie du Centre' });
    
    if (pharmacies.length === 0) {
      console.log('❌ Aucune pharmacie "Pharmacie du Centre" trouvée');
      return;
    }
    
    if (pharmacies.length === 1) {
      console.log('✅ Une seule "Pharmacie du Centre" trouvée - aucune action nécessaire');
      return;
    }
    
    console.log(`⚠️  ${pharmacies.length} pharmacies "Pharmacie du Centre" trouvées:\n`);
    
    // Afficher les détails de chaque pharmacie
    pharmacies.forEach((pharmacy, index) => {
      console.log(`${index + 1}. 🏥 ${pharmacy.pharmacyName}`);
      console.log(`   👤 Nom: ${pharmacy.name}`);
      console.log(`   📧 Email: ${pharmacy.email}`);
      console.log(`   📱 Téléphone: ${pharmacy.phone}`);
      console.log(`   📍 Adresse: ${pharmacy.pharmacyAddress}`);
      console.log(`   🆔 ID: ${pharmacy._id}`);
      console.log(`   📅 Créée le: ${pharmacy.createdAt}`);
      console.log('');
    });
    
    // Supprimer la première (la plus ancienne)
    const oldestPharmacy = pharmacies[0];
    const newestPharmacy = pharmacies[pharmacies.length - 1];
    
    console.log(`🗑️  Suppression de la plus ancienne "Pharmacie du Centre"...`);
    console.log(`   📧 Email à supprimer: ${oldestPharmacy.email}`);
    console.log(`   🆔 ID à supprimer: ${oldestPharmacy._id}`);
    
    await Pharmacist.findByIdAndDelete(oldestPharmacy._id);
    
    console.log(`✅ Pharmacie supprimée avec succès!`);
    console.log(`🏥 Pharmacie conservée: ${newestPharmacy.email} (${newestPharmacy.name})`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Exécuter la suppression
deleteDuplicatePharmacy();
