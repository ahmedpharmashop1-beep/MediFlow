const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import all models
const Patient = require('./Model/Patient');
const Doctor = require('./Model/Doctor');
const Pharmacist = require('./Model/Pharmacist');
const CnamAdmin = require('./Model/CnamAdmin');
const Pharmacy = require('./Model/Pharmacy');
const Medicine = require('./Model/Medicine');
const MedicineStock = require('./Model/MedicineStock');
const MedicationReservation = require('./Model/MedicationReservation');

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

const addMissingDataOnly = async () => {
  try {
    console.log('🔍 VÉRIFICATION DES DONNÉES MANQUANTES...\n');
    
    let addedStats = {
      patients: 0,
      doctors: 0,
      pharmacists: 0,
      pharmacies: 0,
      medicines: 0,
      medicineStocks: 0
    };

    // 1. VÉRIFIER ET AJOUTER LES PATIENTS MANQUANTS
    console.log('🏥 Vérification des patients...');
    const existingPatients = await Patient.find({});
    console.log(`   Patients existants: ${existingPatients.length}`);
    
    const patientsToAdd = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com',
        password: 'password123',
        role: 'patient',
        phone: '+216 71 123 456',
        address: '123 Rue de la Paix, Tunis',
        status: 'active',
        insuranceType: 'CNSS',
        insuranceCode: 'CNSS001'
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@test.com',
        password: 'password123',
        role: 'patient',
        phone: '+216 71 789 012',
        address: '45 Avenue Habib Bourguiba, Tunis',
        status: 'active',
        insuranceType: 'CNRPS',
        insuranceCode: 'CNRPS001'
      }
    ];

    for (const patientData of patientsToAdd) {
      const existing = await Patient.findOne({ email: patientData.email });
      if (!existing) {
        const patient = new Patient(patientData);
        await patient.save();
        addedStats.patients++;
        console.log(`   ✅ Patient ajouté: ${patientData.firstName} ${patientData.lastName}`);
      }
    }

    // 2. VÉRIFIER ET AJOUTER LES MÉDECINS MANQUANTS
    console.log('\n👨‍⚕️ Vérification des médecins...');
    const existingDoctors = await Doctor.find({});
    console.log(`   Médecins existants: ${existingDoctors.length}`);
    
    const doctorsToAdd = [
      {
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@test.com',
        password: 'password123',
        role: 'doctor',
        phone: '+216 71 234 567',
        specialization: 'Cardiologue',
        hospitalName: 'Hôpital Charles Nicolle',
        hospitalAddress: 'Boulevard 9 Avril, Tunis',
        licenseNumber: 'DOC001',
        experience: 10,
        consultationFee: 80
      }
    ];

    for (const doctorData of doctorsToAdd) {
      const existing = await Doctor.findOne({ email: doctorData.email });
      if (!existing) {
        const doctor = new Doctor(doctorData);
        await doctor.save();
        addedStats.doctors++;
        console.log(`   ✅ Médecin ajouté: Dr ${doctorData.firstName} ${doctorData.lastName}`);
      }
    }

    // 3. VÉRIFIER ET AJOUTER LES PHARMACIENS MANQUANTS
    console.log('\n💊 Vérification des pharmaciens...');
    const existingPharmacists = await Pharmacist.find({});
    console.log(`   Pharmaciens existants: ${existingPharmacists.length}`);
    
    // Les pharmaciens existent déjà, pas besoin d'en ajouter

    // 4. VÉRIFIER ET AJOUTER LES PHARMACIES MANQUANTES
    console.log('\n🏪 Vérification des pharmacies...');
    const existingPharmacies = await Pharmacy.find({});
    console.log(`   Pharmacies existantes: ${existingPharmacies.length}`);
    
    if (existingPharmacies.length < 8) {
      const pharmaciesToAdd = [
        {
          name: 'Pharmacie La Marsa',
          address: '78 Rue de la Marsa, Tunis',
          phone: '+216 71 333 333',
          lat: 36.8969,
          lng: 10.3096,
          rating: 4.3,
          reviewCount: 156
        },
        {
          name: 'Pharmacie Sousse',
          address: '25 Rue Farhat Hached, Sousse',
          phone: '+216 73 111 111',
          lat: 35.8256,
          lng: 10.6369,
          rating: 4.6,
          reviewCount: 203
        },
        {
          name: 'Pharmacie Sfax',
          address: '156 Rue Hedi Chaker, Sfax',
          phone: '+216 74 111 111',
          lat: 34.7406,
          lng: 10.7603,
          rating: 4.4,
          reviewCount: 178
        },
        {
          name: 'Pharmacie Bizerte',
          address: '89 Rue Mongi Slim, Bizerte',
          phone: '+216 72 111 111',
          lat: 37.2745,
          lng: 9.8739,
          rating: 4.5,
          reviewCount: 145
        },
        {
          name: 'Pharmacie Gabès',
          address: '237 Avenue Habib Bourguiba, Gabès',
          phone: '+216 75 111 111',
          lat: 33.8815,
          lng: 10.0982,
          rating: 4.2,
          reviewCount: 98
        },
        {
          name: 'Pharmacie Nabeul',
          address: '67 Rue de la République, Nabeul',
          phone: '+216 72 222 222',
          lat: 36.4561,
          lng: 10.7362,
          rating: 4.6,
          reviewCount: 167
        }
      ];

      for (const pharmacyData of pharmaciesToAdd) {
        const existing = await Pharmacy.findOne({ name: pharmacyData.name });
        if (!existing) {
          try {
            const pharmacy = new Pharmacy(pharmacyData);
            await pharmacy.save();
            addedStats.pharmacies++;
            console.log(`   ✅ Pharmacie ajoutée: ${pharmacyData.name}`);
          } catch (error) {
            console.log(`   ⚠️  Erreur lors de l'ajout de ${pharmacyData.name}: ${error.message}`);
          }
        }
      }
    }

    // 5. VÉRIFIER ET AJOUTER LES MÉDICAMENTS MANQUANTS
    console.log('\n💊 Vérification des médicaments...');
    const existingMedicines = await Medicine.find({});
    console.log(`   Médicaments existants: ${existingMedicines.length}`);
    
    const medicinesToAdd = [
      { name: 'Doliprane', dosage: '500mg', form: 'Comprimé' },
      { name: 'Aspirine', dosage: '325mg', form: 'Comprimé effervescent' },
      { name: 'Vitamine C', dosage: '1000mg', form: 'Comprimé à croquer' },
      { name: 'Ibuprofène', dosage: '400mg', form: 'Comprimé' },
      { name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé' },
      { name: 'Amoxicilline', dosage: '1g', form: 'Gélule' },
      { name: 'Oméprazole', dosage: '20mg', form: 'Gélule' },
      { name: 'Spironolactone', dosage: '25mg', form: 'Comprimé' },
      { name: 'Metformine', dosage: '850mg', form: 'Comprimé' },
      { name: 'Lisinopril', dosage: '10mg', form: 'Comprimé' }
    ];

    const medicineIds = {};
    for (const medicineData of medicinesToAdd) {
      const existing = await Medicine.findOne({ name: medicineData.name });
      if (!existing) {
        const medicine = new Medicine(medicineData);
        await medicine.save();
        medicineIds[medicineData.name] = medicine._id;
        addedStats.medicines++;
        console.log(`   ✅ Médicament ajouté: ${medicineData.name}`);
      } else {
        medicineIds[medicineData.name] = existing._id;
      }
    }

    // 6. VÉRIFIER ET AJOUTER LES STOCKS MANQUANTS
    console.log('\n📦 Vérification des stocks de médicaments...');
    const allPharmacies = await Pharmacy.find({});
    console.log(`   Pharmacies pour les stocks: ${allPharmacies.length}`);
    
    const stockData = [
      { medicineName: 'Doliprane', stockCount: 50, price: 2.50, description: 'Antalgique et antipyrétique', category: 'Antalgique' },
      { medicineName: 'Aspirine', stockCount: 45, price: 1.80, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
      { medicineName: 'Vitamine C', stockCount: 30, price: 8.90, description: 'Complément alimentaire', category: 'Vitamine' },
      { medicineName: 'Ibuprofène', stockCount: 40, price: 3.20, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
      { medicineName: 'Paracétamol', stockCount: 60, price: 2.10, description: 'Antalgique', category: 'Antalgique' },
      { medicineName: 'Amoxicilline', stockCount: 25, price: 12.50, description: 'Antibiotique', category: 'Antibiotique' },
      { medicineName: 'Oméprazole', stockCount: 35, price: 15.80, description: 'Antiulcéreux', category: 'Antiulcéreux' }
    ];

    for (const pharmacy of allPharmacies) {
      console.log(`   📍 Stocks pour: ${pharmacy.name}`);
      
      for (const stock of stockData) {
        if (medicineIds[stock.medicineName]) {
          const existing = await MedicineStock.findOne({
            medicineId: medicineIds[stock.medicineName],
            pharmacyId: pharmacy._id
          });
          
          if (!existing) {
            const medicineStock = new MedicineStock({
              medicineId: medicineIds[stock.medicineName],
              pharmacyId: pharmacy._id,
              stockCount: stock.stockCount,
              price: stock.price,
              description: stock.description,
              category: stock.category
            });
            
            await medicineStock.save();
            addedStats.medicineStocks++;
            console.log(`     ✅ ${stock.medicineName} - ${stock.price}DT - Stock: ${stock.stockCount}`);
          }
        }
      }
    }

    // 7. RAPPORT FINAL
    console.log('\n🎉 RAPPORT DES AJOUTS');
    console.log('=' .repeat(50));
    console.log(`👥 Patients ajoutés: ${addedStats.patients}`);
    console.log(`👨‍⚕️ Médecins ajoutés: ${addedStats.doctors}`);
    console.log(`💊 Pharmaciens ajoutés: ${addedStats.pharmacists}`);
    console.log(`🏪 Pharmacies ajoutées: ${addedStats.pharmacies}`);
    console.log(`💊 Médicaments ajoutés: ${addedStats.medicines}`);
    console.log(`📦 Stocks ajoutés: ${addedStats.medicineStocks}`);
    
    const totalAdded = Object.values(addedStats).reduce((sum, count) => sum + count, 0);
    console.log(`\n📊 Total des nouvelles données ajoutées: ${totalAdded}`);
    
    if (totalAdded > 0) {
      console.log('✅ Migration des données manquantes terminée avec succès!');
    } else {
      console.log('ℹ️  Toutes les données sont déjà présentes, aucun ajout nécessaire.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données manquantes:', error);
  }
};

const main = async () => {
  await connectDB();
  await addMissingDataOnly();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Opération terminée!');
};

main().catch(console.error);
