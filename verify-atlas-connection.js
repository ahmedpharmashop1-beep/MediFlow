const mongoose = require('mongoose');
const Pharmacy = require('./Model/Pharmacy.js');
const MedicineStock = require('./Model/MedicineStock.js');
const Medicine = require('./Model/Medicine.js');

// Connexion à votre base Atlas
mongoose.connect('mongodb+srv://fringstech_db_user:12345@cluster0.y91ve9j.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('=== CONNEXION À VOTRE BASE ATLAS RÉUSSIE ===');
    
    try {
      // 1. Vérifier les pharmacies
      const allPharmacies = await Pharmacy.find({});
      console.log(`\n📊 Pharmacies totales: ${allPharmacies.length}`);
      
      const privatePharmacies = allPharmacies.filter(p => !p.isHospitalPharmacy);
      console.log(`🏪 Pharmacies privées: ${privatePharmacies.length}`);
      
      // 2. Vérifier les médicaments existants
      const medicines = await Medicine.find({});
      console.log(`💊 Médicaments existants: ${medicines.length}`);
      
      // 3. Vérifier les stocks existants
      const stocks = await MedicineStock.find({});
      console.log(`📦 Stocks existants: ${stocks.length}`);
      
      if (stocks.length === 0) {
        console.log('\n❌ AUCUN STOCK TROUVÉ - Création nécessaire...');
        
        // Créer les médicaments de base
        const baseMedicines = [
          'Doliprane 500mg', 'Doliprane 1000mg', 'Paracétamol 1000mg',
          'Ibuprofène 400mg', 'Amoxicilline 500mg', 'Amoxicilline 1g',
          'Augmentin 1g', 'Ventoline', 'Oméprazole 20mg',
          'Metformine 850mg', 'Lisinopril 10mg', 'Aspirine 100mg',
          'Vitamine C 500mg', 'Ciprofloxacine 500mg', 'Insuline Glargine'
        ];
        
        console.log('\n💊 Création des médicaments de base...');
        const medicineMap = {};
        for (const medName of baseMedicines) {
          let medicine = await Medicine.findOne({ name: medName });
          if (!medicine) {
            medicine = new Medicine({
              name: medName,
              description: `Médicament: ${medName}`
            });
            await medicine.save();
            console.log(`   ✅ Créé: ${medName}`);
          }
          medicineMap[medName] = medicine._id;
        }
        
        // Créer les stocks pour chaque pharmacie
        console.log('\n🏪 Création des stocks par pharmacie...');
        let totalStocksCreated = 0;
        let totalRuptures = 0;
        
        for (const pharmacy of privatePharmacies) {
          console.log(`\n🏪 ${pharmacy.name} (${pharmacy.pharmacyType})`);
          
          // 3-5 médicaments par pharmacie
          const numMeds = 3 + Math.floor(Math.random() * 3);
          const selectedMeds = Object.keys(medicineMap).sort(() => 0.5 - Math.random()).slice(0, numMeds);
          
          for (let i = 0; i < selectedMeds.length; i++) {
            const medName = selectedMeds[i];
            const stockCount = i === 0 && Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 25) + 1;
            
            const newStock = new MedicineStock({
              medicineId: medicineMap[medName],
              pharmacyId: pharmacy._id,
              stockCount: stockCount,
              reservedCount: 0,
              price: (Math.random() * 40 + 5).toFixed(2),
              description: `Stock de ${medName} chez ${pharmacy.name}`,
              category: 'Médicament'
            });
            
            await newStock.save();
            totalStocksCreated++;
            
            if (stockCount === 0) {
              totalRuptures++;
              console.log(`   ⚠️ RUPTURE: ${medName} - 0 unités`);
            } else {
              console.log(`   ✅ DISPONIBLE: ${medName} - ${stockCount} unités - ${newStock.price}DT`);
            }
          }
        }
        
        console.log(`\n✅ Création terminée !`);
        console.log(`📊 Total stocks créés: ${totalStocksCreated}`);
        console.log(`⚠️ Total ruptures: ${totalRuptures}`);
        
      } else {
        console.log('\n✅ Stocks existants déjà présents');
        
        // Analyser les stocks existants
        const stocksDetails = await MedicineStock.find({})
          .populate('medicineId')
          .populate('pharmacyId');
        
        const available = stocksDetails.filter(s => s.stockCount > 0);
        const ruptures = stocksDetails.filter(s => s.stockCount === 0);
        
        console.log(`\n📊 Analyse des stocks:`);
        console.log(`   💊 Total: ${stocksDetails.length}`);
        console.log(`   ✅ Disponibles: ${available.length}`);
        console.log(`   ⚠️ Ruptures: ${ruptures.length}`);
        
        if (ruptures.length > 0) {
          console.log('\n🚨 Ruptures de stock actuelles:');
          ruptures.slice(0, 5).forEach(stock => {
            console.log(`   - ${stock.medicineId.name} chez ${stock.pharmacyId.name}`);
          });
        }
      }
      
      console.log('\n🎯 TEST DE L\'API...');
      // Test final avec l'API
      const axios = require('axios');
      const apiResponse = await axios.get('http://localhost:5000/api/pharmacy/search-medicines?limit=5');
      
      console.log(`\n📊 Résultats de l'API: ${apiResponse.data.medicines.length} médicaments`);
      
      if (apiResponse.data.medicines.length > 0) {
        console.log('\n📋 Premiers résultats:');
        apiResponse.data.medicines.forEach((med, index) => {
          const status = med.availableStock > 0 ? '✅' : '⚠️';
          console.log(`   ${index + 1}. ${status} ${med.medicine.name} - ${med.pharmacy.name} - Stock: ${med.availableStock}`);
        });
        console.log('\n🎉 L\'API fonctionne correctement !');
        console.log('📱 Vous pouvez maintenant faire des recherches dans l\'interface.');
      } else {
        console.log('\n❌ L\'API ne retourne toujours rien');
        console.log('🔄 Le serveur a peut-être besoin d\'être redémarré');
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à Atlas:', err.message);
    process.exit(1);
  });
