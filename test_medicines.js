// Script de test pour vérifier les bases de données de médicaments
const { generateUniqueMedicineDatabase } = require('./client/src/services/pharmacyService.js');

console.log('🧪 Test des bases de données de médicaments...\n');

const pharmacies = [
  { _id: 'pharm1', pharmacyName: 'Pharmacie du Centre' },
  { _id: 'pharm2', pharmacyName: 'Pharmacie El Menzah' },
  { _id: 'pharm3', pharmacyName: 'Pharmacie La Marsa' },
  { _id: 'pharm4', pharmacyName: 'Pharmacie Sousse' },
  { _id: 'pharm5', pharmacyName: 'Pharmacie Sfax' },
  { _id: 'pharm6', pharmacyName: 'Pharmacie Bizerte' },
  { _id: 'pharm7', pharmacyName: 'Pharmacie Gabès' },
  { _id: 'pharm8', pharmacyName: 'Pharmacie Nabeul' }
];

pharmacies.forEach(pharmacy => {
  console.log(`🏥 ${pharmacy.pharmacyName}:`);
  const medicines = generateUniqueMedicineDatabase(pharmacy._id, pharmacy.pharmacyName);
  
  medicines.forEach((medicine, index) => {
    const status = medicine.stock === 0 ? '⚠️ RUPTURE' : medicine.stock < 10 ? '🟡 STOCK FAIBLE' : '✅ DISPONIBLE';
    console.log(`  ${index + 1}. ${medicine.name} - ${medicine.price}DT - ${medicine.stock} unités ${status}`);
  });
  
  console.log(`  📊 Total: ${medicines.length} médicaments\n`);
});

console.log('✅ Test terminé !');
