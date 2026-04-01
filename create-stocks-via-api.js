// Script pour créer les stocks via l'API REST du serveur
const axios = require('axios');

async function createStocksViaAPI() {
  try {
    console.log('=== CRÉATION DES STOCKS VIA API SERVEUR ===');
    
    // 1. Vérifier que le serveur répond
    console.log('\n1️⃣ Test de connexion au serveur...');
    const testResponse = await axios.get('http://localhost:5000/api/pharmacy/search-medicines?limit=1');
    console.log('✅ Serveur accessible');
    
    // 2. Créer un endpoint temporaire dans le serveur pour initialiser les stocks
    console.log('\n2️⃣ Création de l\'endpoint d\'initialisation...');
    
    // Créer le contenu du fichier temporaire pour l'endpoint
    const endpointCode = `
// Endpoint temporaire pour créer les stocks
router.post('/init-stocks', async (req, res) => {
  try {
    console.log('=== INITIALISATION DES STOCKS ===');
    
    const Pharmacy = require('../Model/Pharmacy.js');
    const MedicineStock = require('../Model/MedicineStock.js');
    const Medicine = require('../Model/Medicine.js');
    
    // 1. Récupérer les pharmacies privées
    const privatePharmacies = await Pharmacy.find({ isHospitalPharmacy: false });
    console.log(\`📊 Pharmacies privées: \${privatePharmacies.length}\`);
    
    // 2. Supprimer les anciens stocks
    await MedicineStock.deleteMany({});
    console.log('🗑️ Anciens stocks supprimés');
    
    // 3. Créer les médicaments de base
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
          description: \`Médicament: \${medName}\`
        });
        await medicine.save();
        console.log(\`   💊 Créé: \${medName}\`);
      }
      medicineMap[medName] = medicine._id;
    }
    
    // 4. Créer les stocks
    let totalCreated = 0;
    let totalRuptures = 0;
    
    for (const pharmacy of privatePharmacies) {
      console.log(\`\\n🏪 \${pharmacy.name} (\${pharmacy.pharmacyType})\`);
      
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
          description: \`Stock de \${medName} chez \${pharmacy.name}\`,
          category: 'Médicament'
        });
        
        await newStock.save();
        totalCreated++;
        
        if (stockCount === 0) {
          totalRuptures++;
          console.log(\`   ⚠️ RUPTURE: \${medName} - 0 unités\`);
        } else {
          console.log(\`   ✅ DISPONIBLE: \${medName} - \${stockCount} unités - \${newStock.price}DT\`);
        }
      }
    }
    
    console.log(\`\\n✅ Terminé ! Total stocks: \${totalCreated}, Ruptures: \${totalRuptures}\`);
    
    res.status(200).json({
      success: true,
      message: \`Stocks créés: \${totalCreated} dont \${totalRuptures} ruptures\`,
      totalCreated,
      totalRuptures
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});
`;
    
    console.log('\n📝 Code d\'endpoint généré');
    console.log('💡 Instructions manuelles:');
    console.log('\n🔧 ÉTAPE 1: Ajoutez ce code à la fin du fichier routes/pharmacy.js');
    console.log('   (juste avant module.exports = router;');
    console.log('\n🔧 ÉTAPE 2: Redémarrez le serveur (npm stop puis npm start)');
    console.log('\n🔧 ÉTAPE 3: Exécutez cette commande:');
    console.log('   curl -X POST http://localhost:5000/api/pharmacy/init-stocks');
    console.log('\n🔧 ÉTAPE 4: Testez la recherche:');
    console.log('   curl http://localhost:5000/api/pharmacy/search-medicines?limit=3');
    console.log('\n🔧 ÉTAPE 5: Supprimez l\'endpoint temporaire après utilisation');
    
    // Sauvegarder le code dans un fichier pour référence
    const fs = require('fs');
    fs.writeFileSync('./temp-endpoint.js', endpointCode);
    console.log('\n💾 Code sauvegardé dans: temp-endpoint.js');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createStocksViaAPI();
