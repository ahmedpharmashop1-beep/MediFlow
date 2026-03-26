const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
const Medicine = require('./Model/Medicine');
const MedicineStock = require('./Model/MedicineStock');
const Pharmacy = require('./Model/Pharmacy');
const Pharmacist = require('./Model/Pharmacist');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Connect to database using same config as server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const addMedicinesToAllPharmacies = async () => {
  try {
    console.log('\n💊 Ajout des médicaments dans toutes les pharmacies...\n');
    
    // 1. Créer les médicaments de base s'ils n'existent pas
    const medicinesData = [
      {
        name: 'Doliprane',
        dosage: '500mg',
        form: 'Comprimé'
      },
      {
        name: 'Aspirine',
        dosage: '325mg',
        form: 'Comprimé effervescent'
      },
      {
        name: 'Vitamine C',
        dosage: '1000mg',
        form: 'Comprimé à croquer'
      }
    ];
    
    console.log('📋 Création des médicaments de base...');
    const medicineIds = {};
    
    for (const medData of medicinesData) {
      let medicine = await Medicine.findOne({ name: medData.name });
      
      if (!medicine) {
        medicine = new Medicine(medData);
        await medicine.save();
        console.log(`  ✅ ${medData.name} créé`);
      } else {
        console.log(`  ℹ️  ${medData.name} existe déjà`);
      }
      
      medicineIds[medData.name] = medicine._id;
    }
    
    // 2. Récupérer toutes les pharmacies
    const pharmacies = await Pharmacy.find({});
    console.log(`\n🏪 ${pharmacies.length} pharmacies trouvées\n`);
    
    if (pharmacies.length === 0) {
      console.log('⚠️ Aucune pharmacy trouvée, création des pharmacies à partir des pharmaciens...');
      
      // Créer les pharmacies à partir des pharmaciens
      const pharmacists = await Pharmacist.find({});
      
      for (const pharmacist of pharmacists) {
        let pharmacy = await Pharmacy.findOne({ name: pharmacist.pharmacyName || 'Pharmacy' + pharmacist._id });
        
        if (!pharmacy) {
          try {
            pharmacy = new Pharmacy({
              name: pharmacist.pharmacyName || 'Pharmacy ' + pharmacist._id,
              address: pharmacist.pharmacyAddress || '',
              phone: pharmacist.phone || '',
              lat: pharmacist.coordinates?.lat || 0,
              lng: pharmacist.coordinates?.lng || 0,
            });
            await pharmacy.save();
            console.log(`  ✅ Pharmacy créée: ${pharmacy.name}`);
          } catch (error) {
            if (error.code === 11000) {
              console.log(`  ⚠️  Pharmacy existe déjà (erreur de duplicate key): ${pharmacist.pharmacyName || 'Pharmacy ' + pharmacist._id}`);
              // Récupérer la pharmacy existante
              pharmacy = await Pharmacy.findOne({ name: pharmacist.pharmacyName || 'Pharmacy' + pharmacist._id });
            } else {
              throw error;
            }
          }
        }
      }
      
      // Récupérer à nouveau les pharmacies
      const updatedPharmacies = await Pharmacy.find({});
      console.log(`🏪 ${updatedPharmacies.length} pharmacies trouvées après création\n`);
      
      // Utiliser les pharmacies mises à jour
      pharmacies.push(...updatedPharmacies);
    }
    
    // 3. Ajouter les stocks de médicaments pour chaque pharmacie
    const stockData = [
      {
        medicineName: 'Doliprane',
        stockCount: 50,
        price: 2.50,
        description: 'Antalgique et antipyrétique pour traiter la douleur et la fièvre',
        category: 'Antalgique'
      },
      {
        medicineName: 'Aspirine',
        stockCount: 45,
        price: 1.80,
        description: 'Anti-inflammatoire, antalgique, antipyrétique et antiagrégant plaquettaire',
        category: 'Anti-inflammatoire'
      },
      {
        medicineName: 'Vitamine C',
        stockCount: 30,
        price: 8.90,
        description: 'Complément alimentaire pour renforcer le système immunitaire',
        category: 'Vitamine'
      }
    ];
    
    let totalAdded = 0;
    
    for (const pharmacy of pharmacies) {
      console.log(`📍 Traitement de la pharmacie: ${pharmacy.name}`);
      
      let addedForPharmacy = 0;
      
      for (const stock of stockData) {
        // Vérifier si le stock existe déjà
        const existingStock = await MedicineStock.findOne({
          medicineId: medicineIds[stock.medicineName],
          pharmacyId: pharmacy._id
        });
        
        if (!existingStock) {
          // Créer le nouveau stock
          const newStock = new MedicineStock({
            medicineId: medicineIds[stock.medicineName],
            pharmacyId: pharmacy._id,
            stockCount: stock.stockCount,
            price: stock.price,
            description: stock.description,
            category: stock.category
          });
          
          await newStock.save();
          addedForPharmacy++;
          totalAdded++;
          
          console.log(`  ✅ ${stock.medicineName} ajouté - ${stock.price}DT - Stock: ${stock.stockCount}`);
        } else {
          console.log(`  ℹ️  ${stock.medicineName} existe déjà`);
        }
      }
      
      if (addedForPharmacy > 0) {
        console.log(`  🎉 ${addedForPharmacy} médicament(s) ajouté(s) à ${pharmacy.name}\n`);
      } else {
        console.log(`  ℹ️  Aucun nouveau médicament à ajouter\n`);
      }
    }
    
    console.log(`🎯 Opération terminée!`);
    console.log(`📊 Total: ${totalAdded} stocks ajoutés dans ${pharmacies.length} pharmacies`);
    console.log(`💊 Médicaments ajoutés: Doliprane, Aspirine, Vitamine C`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des médicaments:', error);
  }
};

const main = async () => {
  await connectDB();
  await addMedicinesToAllPharmacies();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

main().catch(console.error);
