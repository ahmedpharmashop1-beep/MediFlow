// Script pour créer les stocks en utilisant directement la connexion du serveur
const mongoose = require('mongoose');

// Utiliser exactement la même connexion que le serveur
mongoose.connect('mongodb+srv://fringstech_db_user:12345@cluster0.y91ve9j.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('=== CONNEXION AU SERVEUR ATLAS RÉUSSIE ===');
    
    try {
      // Importer les modèles (comme dans le serveur)
      const Pharmacy = require('./Model/Pharmacy.js');
      const MedicineStock = require('./Model/MedicineStock.js');
      const Medicine = require('./Model/Medicine.js');
      
      console.log('✅ Modèles chargés');
      
      // 1. Vérifier la connexion en testant les pharmacies
      const pharmacies = await Pharmacy.find({});
      console.log(`📊 Pharmacies trouvées: ${pharmacies.length}`);
      
      const privatePharmacies = pharmacies.filter(p => !p.isHospitalPharmacy);
      console.log(`🏪 Pharmacies privées: ${privatePharmacies.length}`);
      
      if (privatePharmacies.length === 0) {
        console.log('❌ Aucune pharmacie privée trouvée');
        process.exit(1);
      }
      
      // 2. Vérifier les stocks actuels
      const currentStocks = await MedicineStock.find({});
      console.log(`📦 Stocks actuels: ${currentStocks.length}`);
      
      // 3. Si pas de stocks, en créer
      if (currentStocks.length === 0) {
        console.log('\n🔧 CRÉATION DES STOCKS...');
        
        // Créer d'abord les médicaments
        const medicinesList = [
          'Doliprane 500mg', 'Doliprane 1000mg', 'Paracétamol 1000mg',
          'Ibuprofène 400mg', 'Amoxicilline 500mg', 'Amoxicilline 1g',
          'Augmentin 1g', 'Ventoline', 'Oméprazole 20mg',
          'Metformine 850mg', 'Lisinopril 10mg', 'Aspirine 100mg',
          'Vitamine C 500mg', 'Ciprofloxacine 500mg', 'Insuline Glargine'
        ];
        
        const medicineMap = {};
        for (const medName of medicinesList) {
          let medicine = await Medicine.findOne({ name: medName });
          if (!medicine) {
            medicine = new Medicine({
              name: medName,
              description: `Médicament: ${medName}`
            });
            await medicine.save();
            console.log(`   💊 Créé: ${medName}`);
          }
          medicineMap[medName] = medicine._id;
        }
        
        // Créer les stocks pour chaque pharmacie
        let totalCreated = 0;
        let totalRuptures = 0;
        
        for (const pharmacy of privatePharmacies) {
          console.log(`\n🏪 ${pharmacy.name} (${pharmacy.pharmacyType})`);
          
          // 3-5 médicaments par pharmacie
          const numMeds = 3 + Math.floor(Math.random() * 3);
          const selectedMeds = Object.keys(medicineMap).sort(() => 0.5 - Math.random()).slice(0, numMeds);
          
          for (let i = 0; i < selectedMeds.length; i++) {
            const medName = selectedMeds[i];
            // 40% de chance de rupture de stock
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
            totalCreated++;
            
            if (stockCount === 0) {
              totalRuptures++;
              console.log(`   ⚠️ RUPTURE: ${medName} - 0 unités`);
            } else {
              console.log(`   ✅ DISPONIBLE: ${medName} - ${stockCount} unités - ${newStock.price}DT`);
            }
          }
        }
        
        console.log(`\n✅ Création terminée !`);
        console.log(`📊 Total stocks créés: ${totalCreated}`);
        console.log(`⚠️ Total ruptures: ${totalRuptures}`);
        
      } else {
        console.log('\n✅ Stocks déjà existants');
        
        // Afficher quelques stocks existants
        const sampleStocks = await MedicineStock.find({})
          .populate('medicineId')
          .populate('pharmacyId')
          .limit(5);
        
        console.log('\n📋 Exemples de stocks:');
        sampleStocks.forEach((stock, index) => {
          const status = stock.stockCount > 0 ? '✅' : '⚠️';
          console.log(`   ${index + 1}. ${status} ${stock.medicineId.name} - ${stock.pharmacyId.name} - Stock: ${stock.stockCount}`);
        });
      }
      
      // 4. Test final de l'API
      console.log('\n🎯 TEST DE L\'API...');
      try {
        const axios = require('axios');
        const response = await axios.get('http://localhost:5000/api/pharmacy/search-medicines?limit=3');
        
        console.log(`📊 API retourne: ${response.data.medicines.length} médicaments`);
        
        if (response.data.medicines.length > 0) {
          console.log('\n🎉 SUCCÈS - L\'API fonctionne !');
          response.data.medicines.forEach((med, index) => {
            const status = med.availableStock > 0 ? '✅' : '⚠️';
            console.log(`   ${index + 1}. ${status} ${med.medicine.name} - ${med.pharmacy.name} - Stock: ${med.availableStock}`);
          });
          
          console.log('\n📱 Vous pouvez maintenant utiliser l\'interface de recherche !');
          console.log('🔍 Les filtres fonctionnent aussi (jour/nuit/garde)');
          console.log('⚠️ Les ruptures de stock afficheront des alertes');
          
        } else {
          console.log('\n❌ L\'API ne retourne toujours rien');
          console.log('🔄 Le serveur peut avoir besoin d\'être redémarré');
          console.log('💡 Essayez: npm stop puis npm start');
        }
        
      } catch (apiError) {
        console.log('\n❌ Erreur API:', apiError.message);
        console.log('💡 Assurez-vous que le serveur est démarré (npm start)');
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error.message);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion Atlas:', err.message);
    console.log('\n🔧 Dépannage:');
    console.log('1. Vérifiez que MongoDB Compass est bien connecté');
    console.log('2. Vérifiez votre connexion internet');
    console.log('3. Essayez de redémarrer le serveur');
    process.exit(1);
  });
