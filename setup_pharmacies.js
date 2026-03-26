// Script à exécuter après le démarrage du serveur
const Pharmacist = require('./Model/Pharmacist');

const setupPharmacies = async () => {
  try {
    console.log('🚀 Configuration des pharmacies...');
    
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

    let createdCount = 0;
    let skippedCount = 0;
    
    for (const pharmacyData of pharmacies) {
      try {
        // Vérifier si la pharmacie existe déjà
        const existingPharmacy = await Pharmacist.findOne({ email: pharmacyData.email });
        
        if (existingPharmacy) {
          console.log(`ℹ️  ${pharmacyData.pharmacyName} existe déjà`);
          skippedCount++;
          continue;
        }

        // Créer le compte pharmacien (exactement comme create_admin.js)
        const pharmacyAccount = new Pharmacist(pharmacyData);
        await pharmacyAccount.save();
        
        createdCount++;
        console.log(`✅ ${pharmacyData.pharmacyName} créée avec succès!`);
        console.log(`   📧 Email: ${pharmacyData.email}`);
        console.log(`   👤 Nom: ${pharmacyData.name}`);
        console.log(`   🏥 Nom de pharmacie: ${pharmacyData.pharmacyName}`);
        console.log(`   📍 Adresse: ${pharmacyData.pharmacyAddress}`);
        console.log('');
        
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  ${pharmacyData.pharmacyName} existe déjà (email dupliqué)`);
          skippedCount++;
        } else {
          console.error(`❌ Erreur pour ${pharmacyData.pharmacyName}:`, error.message);
        }
      }
    }
    
    console.log(`🎉 Configuration terminée! Créées: ${createdCount}, Existantes: ${skippedCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration des pharmacies:', error);
  }
};

module.exports = setupPharmacies;
