// Script de diagnostic complet
const mongoose = require('mongoose');
const Pharmacy = require('./Model/Pharmacy');

async function diagnose() {
  try {
    await mongoose.connect('mongodb+srv://mediflow:mediflow1234@cluster0.r0g5bgu.mongodb.net/mediflow?retryWrites=true&w=majority', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connecté à MongoDB\n');

    // 1. Compter toutes les pharmacies
    const allPharmacies = await Pharmacy.find({});
    console.log(`📊 Total pharmacies en base: ${allPharmacies.length}`);
    
    // 2. Compter les pharmacies privées (isHospitalPharmacy: false)
    const privatePharmacies = await Pharmacy.find({ isHospitalPharmacy: false });
    console.log(`🏪 Pharmacies privées (isHospitalPharmacy: false): ${privatePharmacies.length}`);
    
    // 3. Compter les pharmacies hospitalières (isHospitalPharmacy: true)
    const hospitalPharmacies = await Pharmacy.find({ isHospitalPharmacy: true });
    console.log(`🏥 Pharmacies hospitalières (isHospitalPharmacy: true): ${hospitalPharmacies.length}`);
    
    // 4. Compter les pharmacies avec isHospitalPharmacy undefined
    const undefinedPharmacies = await Pharmacy.find({ isHospitalPharmacy: { $exists: false } });
    console.log(`❓ Pharmacies san isHospitalPharmacy: ${undefinedPharmacies.length}`);
    
    // 5. Afficher les premières pharmacies de chaque type
    console.log('\n=== EXEMPLES PHARMACIES PRIVÉES ===');
    privatePharmacies.slice(0, 5).forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - isHospitalPharmacy: ${p.isHospitalPharmacy}`);
    });
    
    console.log('\n=== EXEMPLES PHARMACIES HOSPITALIÈRES ===');
    hospitalPharmacies.slice(0, 5).forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - isHospitalPharmacy: ${p.isHospitalPharmacy}`);
    });
    
    console.log('\n✅ Diagnostic terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

diagnose();
