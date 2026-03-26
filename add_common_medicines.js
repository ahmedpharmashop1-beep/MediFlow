const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
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

// Médicaments à ajouter dans toutes les pharmacies
const medicinesToAdd = [
  {
    name: 'Doliprane',
    commercialName: 'Doliprane 500mg',
    description: 'Antalgique et antipyrétique pour traiter la douleur et la fièvre',
    price: 2.50,
    stock: 50,
    status: 'disponible',
    category: 'Antalgique',
    manufacturer: 'Sanofi',
    dosage: '500mg',
    form: 'Comprimé'
  },
  {
    name: 'Aspirine',
    commercialName: 'Aspirine 325mg',
    description: 'Anti-inflammatoire, antalgique, antipyrétique et antiagrégant plaquettaire',
    price: 1.80,
    stock: 45,
    status: 'disponible',
    category: 'Anti-inflammatoire',
    manufacturer: 'Bayer',
    dosage: '325mg',
    form: 'Comprimé effervescent'
  },
  {
    name: 'Vitamine C',
    commercialName: 'Vitamine C 1000mg',
    description: 'Complément alimentaire pour renforcer le système immunitaire',
    price: 8.90,
    stock: 30,
    status: 'disponible',
    category: 'Vitamine',
    manufacturer: 'UPS',
    dosage: '1000mg',
    form: 'Comprimé à croquer'
  }
];

const addMedicinesToAllPharmacies = async () => {
  try {
    console.log('\n💊 Ajout des médicaments dans toutes les pharmacies...\n');
    
    // Récupérer toutes les pharmacies
    const pharmacies = await Pharmacist.find({});
    console.log(`🏪 ${pharmacies.length} pharmacies trouvées\n`);
    
    let totalAdded = 0;
    
    for (const pharmacy of pharmacies) {
      console.log(`📍 Traitement de la pharmacie: ${pharmacy.pharmacyName || pharmacy.name}`);
      
      // Initialiser le tableau medicines s'il n'existe pas
      if (!pharmacy.medicines) {
        pharmacy.medicines = [];
      }
      
      let addedForPharmacy = 0;
      
      // Ajouter chaque médicament s'il n'existe pas déjà
      for (const medicine of medicinesToAdd) {
        // Vérifier si le médicament existe déjà dans cette pharmacie
        const existingMedicine = pharmacy.medicines.find(
          med => med.name.toLowerCase() === medicine.name.toLowerCase()
        );
        
        if (!existingMedicine) {
          // Ajouter le médicament avec un ID unique
          const newMedicine = {
            _id: new mongoose.Types.ObjectId(),
            ...medicine,
            addedAt: new Date()
          };
          
          pharmacy.medicines.push(newMedicine);
          addedForPharmacy++;
          totalAdded++;
          
          console.log(`  ✅ ${medicine.name} ajouté - ${medicine.price}DT - Stock: ${medicine.stock}`);
        } else {
          console.log(`  ℹ️  ${medicine.name} existe déjà`);
        }
      }
      
      // Sauvegarder la pharmacie mise à jour
      if (addedForPharmacy > 0) {
        await pharmacy.save();
        console.log(`  🎉 ${addedForPharmacy} médicament(s) ajouté(s) à ${pharmacy.pharmacyName || pharmacy.name}\n`);
      } else {
        console.log(`  ℹ️  Aucun nouveau médicament à ajouter\n`);
      }
    }
    
    console.log(`🎯 Opération terminée!`);
    console.log(`📊 Total: ${totalAdded} médicaments ajoutés dans ${pharmacies.length} pharmacies`);
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
