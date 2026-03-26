const mongoose = require('mongoose');
const Pharmacist = require('./Model/Pharmacist');
require('dotenv').config();

// Connexion à la base de données
mongoose.connect(process.env.DB_URI)
.then(() => {
  console.log('✅ Connecté à MongoDB');
  createPharmacyAccounts();
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  process.exit(1);
});

// Création des comptes pharmaciens
async function createPharmacyAccounts() {
  try {
    const pharmacies = [
      {
        name: 'Ahmed Ben Ali',
        email: 'ahmed.benali@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 123 456',
        pharmacyName: 'Pharmacie du Centre',
        pharmacyAddress: '123 Rue de la Paix, Tunis',
        licenseNumber: 'PH001',
        rating: 4.5
      },
      {
        name: 'Fatma Mansouri',
        email: 'fatma.mansouri@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 789 012',
        pharmacyName: 'Pharmacie El Menzah',
        pharmacyAddress: '45 Avenue Habib Bourguiba, El Menzah, Tunis',
        licenseNumber: 'PH002',
        rating: 4.2
      },
      {
        name: 'Mohamed Trabelsi',
        email: 'mohamed.trabelsi@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 345 678',
        pharmacyName: 'Pharmacie La Marsa',
        pharmacyAddress: '78 Rue Gamal Abdel Nasser, La Marsa, Tunis',
        licenseNumber: 'PH003',
        rating: 4.8
      },
      {
        name: 'Sonia Khemiri',
        email: 'sonia.khemiri@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 73 234 567',
        pharmacyName: 'Pharmacie Sousse',
        pharmacyAddress: '15 Avenue Farhat Hached, Sousse',
        licenseNumber: 'PH004',
        rating: 4.3
      },
      {
        name: 'Karim Brahmi',
        email: 'karim.brahmi@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 74 567 890',
        pharmacyName: 'Pharmacie Sfax',
        pharmacyAddress: '200 Avenue Hedi Chaker, Sfax',
        licenseNumber: 'PH005',
        rating: 4.6
      },
      {
        name: 'Leila Hachani',
        email: 'leila.hachani@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 72 678 901',
        pharmacyName: 'Pharmacie Bizerte',
        pharmacyAddress: '33 Rue Mongi Slim, Bizerte',
        licenseNumber: 'PH006',
        rating: 4.4
      },
      {
        name: 'Rached Jebali',
        email: 'rached.jebali@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 75 789 012',
        pharmacyName: 'Pharmacie Gabès',
        pharmacyAddress: '88 Avenue Abdelkader El Ghazzi, Gabès',
        licenseNumber: 'PH007',
        rating: 4.1
      },
      {
        name: 'Mariem Saidani',
        email: 'mariem.saidani@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 72 123 456',
        pharmacyName: 'Pharmacie Nabeul',
        pharmacyAddress: '12 Rue Habib Thameur, Nabeul',
        licenseNumber: 'PH008',
        rating: 4.7
      }
    ];

    for (const pharmacyData of pharmacies) {
      try {
        // Vérifier si la pharmacie existe déjà
        const existingPharmacy = await Pharmacist.findOne({ email: pharmacyData.email });
        
        if (existingPharmacy) {
          console.log(`ℹ️  La pharmacie ${pharmacyData.pharmacyName} existe déjà`);
          console.log(`   📧 Email: ${existingPharmacy.email}`);
          console.log(`   👤 Nom: ${existingPharmacy.name}`);
          continue;
        }

        // Créer le compte pharmacien (exactement comme create_admin.js)
        const pharmacyAccount = new Pharmacist(pharmacyData);
        await pharmacyAccount.save();
        
        console.log(`✅ Compte pharmacie créé avec succès!`);
        console.log(`   📧 Email: ${pharmacyData.email}`);
        console.log(`   🔑 Mot de passe: ${pharmacyData.password}`);
        console.log(`   👤 Nom: ${pharmacyData.name}`);
        console.log(`   🏢 Rôle: ${pharmacyData.role}`);
        console.log(`   🏥 Nom de pharmacie: ${pharmacyData.pharmacyName}`);
        console.log(`   📍 Adresse: ${pharmacyData.pharmacyAddress}`);
        console.log(`   📞 Téléphone: ${pharmacyData.phone}`);
        console.log(`   ⭐ Rating: ${pharmacyData.rating}`);
        console.log('');
        
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  ${pharmacyData.pharmacyName} existe déjà (email dupliqué)`);
        } else {
          console.error(`❌ Erreur lors de la création de ${pharmacyData.pharmacyName}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Création des comptes pharmaciens terminée!');
    
  } catch (error) {
    console.error('❌ Erreur générale lors de la création des pharmaciens:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Déconnecté de MongoDB');
  }
}
