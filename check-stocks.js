const mongoose = require('mongoose');
const MedicineStock = require('./Model/MedicineStock.js');
const Medicine = require('./Model/Medicine.js');

mongoose.connect('mongodb://localhost:27017/mediflow')
  .then(async () => {
    const count = await MedicineStock.countDocuments();
    console.log(`Nombre de stocks de médicaments: ${count}`);
    
    if (count > 0) {
      const stocks = await MedicineStock.find().limit(3).populate('medicineId pharmacyId');
      stocks.forEach(s => {
        console.log(`Médicament: ${s.medicineId?.name} - Pharmacie: ${s.pharmacyId?.name} - Stock: ${s.stockCount}`);
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
