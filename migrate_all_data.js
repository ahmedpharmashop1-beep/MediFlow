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

const migrateAllData = async () => {
  try {
    console.log('🚀 DÉBUT DE LA MIGRATION COMPLÈTE DES DONNÉES...\n');
    
    let migrationStats = {
      patients: { existing: 0, created: 0 },
      doctors: { existing: 0, created: 0 },
      pharmacists: { existing: 0, created: 0 },
      admins: { existing: 0, created: 0 },
      pharmacies: { existing: 0, created: 0 },
      medicines: { existing: 0, created: 0 },
      medicineStocks: { existing: 0, created: 0 },
      reservations: { existing: 0, created: 0 }
    };

    // 1. MIGRATION DES PATIENTS
    console.log('🏥 Migration des patients...');
    const patientsData = [
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
      },
      {
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@test.com',
        password: 'password123',
        role: 'patient',
        phone: '+216 71 345 678',
        address: '78 Rue de la Marsa, Tunis',
        status: 'active',
        insuranceType: 'CNSS',
        insuranceCode: 'CNSS002'
      },
      {
        firstName: 'Fatma',
        lastName: 'Trabelsi',
        email: 'fatma.trabelsi@test.com',
        password: 'password123',
        role: 'patient',
        phone: '+216 71 567 890',
        address: '156 Rue du 18 Janvier, Sfax',
        status: 'active',
        insuranceType: 'CNRPS',
        insuranceCode: 'CNRPS002'
      }
    ];

    for (const patientData of patientsData) {
      const existing = await Patient.findOne({ email: patientData.email });
      if (!existing) {
        const patient = new Patient(patientData);
        await patient.save();
        migrationStats.patients.created++;
        console.log(`  ✅ Patient créé: ${patientData.firstName} ${patientData.lastName}`);
      } else {
        migrationStats.patients.existing++;
        console.log(`  ℹ️  Patient existe déjà: ${patientData.firstName} ${patientData.lastName}`);
      }
    }

    // 2. MIGRATION DES MÉDECINS
    console.log('\n👨‍⚕️ Migration des médecins...');
    const doctorsData = [
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
        consultationFee: 80,
        availableDays: ['monday', 'wednesday', 'friday'],
        availableTimeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ]
      },
      {
        firstName: 'Sophie',
        lastName: 'Lefebvre',
        email: 'sophie.lefebvre@test.com',
        password: 'password123',
        role: 'doctor',
        phone: '+216 71 890 123',
        specialization: 'Pédiatre',
        hospitalName: 'Hôpital d\'Enfants Béchir Hamza',
        hospitalAddress: 'Rue Djebel Lakhdar, Tunis',
        licenseNumber: 'DOC002',
        experience: 8,
        consultationFee: 60,
        availableDays: ['tuesday', 'thursday'],
        availableTimeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '15:00', end: '18:00' }
        ]
      }
    ];

    for (const doctorData of doctorsData) {
      const existing = await Doctor.findOne({ email: doctorData.email });
      if (!existing) {
        const doctor = new Doctor(doctorData);
        await doctor.save();
        migrationStats.doctors.created++;
        console.log(`  ✅ Médecin créé: Dr ${doctorData.firstName} ${doctorData.lastName}`);
      } else {
        migrationStats.doctors.existing++;
        console.log(`  ℹ️  Médecin existe déjà: Dr ${doctorData.firstName} ${doctorData.lastName}`);
      }
    }

    // 3. MIGRATION DES PHARMACIENS
    console.log('\n💊 Migration des pharmaciens...');
    const pharmacistsData = [
      {
        name: 'Mohamed Ben Ali',
        email: 'mohamed.benali@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 111 111',
        pharmacyName: 'Pharmacie du Centre',
        pharmacyAddress: '123 Avenue Habib Bourguiba, Tunis',
        licenseNumber: 'PHARM001',
        coordinates: { lat: 36.8065, lng: 10.1815 },
        rating: 4.5,
        openingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '09:00', close: '13:00' }
        }
      },
      {
        name: 'Fatma Mansouri',
        email: 'fatma.mansouri@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 222 222',
        pharmacyName: 'Pharmacie El Menzah',
        pharmacyAddress: '45 Rue El Menzah, Tunis',
        licenseNumber: 'PHARM002',
        coordinates: { lat: 36.8425, lng: 10.2007 },
        rating: 4.7,
        openingHours: {
          monday: { open: '08:30', close: '20:30' },
          tuesday: { open: '08:30', close: '20:30' },
          wednesday: { open: '08:30', close: '20:30' },
          thursday: { open: '08:30', close: '20:30' },
          friday: { open: '08:30', close: '20:30' },
          saturday: { open: '09:00', close: '19:30' },
          sunday: { open: '09:00', close: '13:30' }
        }
      }
    ];

    for (const pharmacistData of pharmacistsData) {
      const existing = await Pharmacist.findOne({ email: pharmacistData.email });
      if (!existing) {
        const pharmacist = new Pharmacist(pharmacistData);
        await pharmacist.save();
        migrationStats.pharmacists.created++;
        console.log(`  ✅ Pharmacien créé: ${pharmacistData.name}`);
      } else {
        migrationStats.pharmacists.existing++;
        console.log(`  ℹ️  Pharmacien existe déjà: ${pharmacistData.name}`);
      }
    }

    // 4. MIGRATION DES ADMINISTRATEURS
    console.log('\n👨‍💼 Migration des administrateurs...');
    const adminsData = [
      {
        name: 'Super Administrateur MediFlow',
        email: 'admin@mediflow.com',
        password: 'Admin2024!',
        role: 'cnam_admin',
        phone: '+33 1 23 45 67 89',
        officeAddress: '123 Rue de la Santé, 75001 Paris',
        employeeId: 'ADMIN-001',
        department: 'Direction Générale',
        position: 'Super Administrateur',
        accessLevel: 'admin'
      },
      {
        name: 'Administrateur CNAM',
        email: 'cnam@test.com',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 000 000',
        officeAddress: 'Avenue Habib Bourguiba, Tunis',
        employeeId: 'CNAM-001',
        department: 'Gestion des Comptes',
        position: 'Administrateur CNAM',
        accessLevel: 'admin'
      }
    ];

    for (const adminData of adminsData) {
      const existing = await CnamAdmin.findOne({ email: adminData.email });
      if (!existing) {
        const admin = new CnamAdmin(adminData);
        await admin.save();
        migrationStats.admins.created++;
        console.log(`  ✅ Admin créé: ${adminData.name}`);
      } else {
        migrationStats.admins.existing++;
        console.log(`  ℹ️  Admin existe déjà: ${adminData.name}`);
      }
    }

    // 5. MIGRATION DES PHARMACIES
    console.log('\n🏪 Migration des pharmacies...');
    const pharmaciesData = [
      {
        name: 'Pharmacie du Centre',
        address: '123 Avenue Habib Bourguiba, Tunis',
        phone: '+216 71 111 111',
        lat: 36.8065,
        lng: 10.1815,
        rating: 4.5,
        reviewCount: 127
      },
      {
        name: 'Pharmacie El Menzah',
        address: '45 Rue El Menzah, Tunis',
        phone: '+216 71 222 222',
        lat: 36.8425,
        lng: 10.2007,
        rating: 4.7,
        reviewCount: 89
      },
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

    for (const pharmacyData of pharmaciesData) {
      const existing = await Pharmacy.findOne({ name: pharmacyData.name });
      if (!existing) {
        try {
          const pharmacy = new Pharmacy(pharmacyData);
          await pharmacy.save();
          migrationStats.pharmacies.created++;
          console.log(`  ✅ Pharmacie créée: ${pharmacyData.name}`);
        } catch (error) {
          if (error.code === 11000) {
            migrationStats.pharmacies.existing++;
            console.log(`  ℹ️  Pharmacie existe déjà: ${pharmacyData.name}`);
          } else {
            console.error(`  ❌ Erreur lors de la création de ${pharmacyData.name}:`, error.message);
          }
        }
      } else {
        migrationStats.pharmacies.existing++;
        console.log(`  ℹ️  Pharmacie existe déjà: ${pharmacyData.name}`);
      }
    }

    // 6. MIGRATION DES MÉDICAMENTS
    console.log('\n💊 Migration des médicaments...');
    const medicinesData = [
      { name: 'Doliprane', dosage: '500mg', form: 'Comprimé' },
      { name: 'Aspirine', dosage: '325mg', form: 'Comprimé effervescent' },
      { name: 'Vitamine C', dosage: '1000mg', form: 'Comprimé à croquer' },
      { name: 'Ibuprofène', dosage: '400mg', form: 'Comprimé' },
      { name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé' },
      { name: 'Amoxicilline', dosage: '1g', form: 'Gélule' },
      { name: 'Oméprazole', dosage: '20mg', form: 'Gélule' },
      { name: 'Spironolactone', dosage: '25mg', form: 'Comprimé' },
      { name: 'Metformine', dosage: '850mg', form: 'Comprimé' },
      { name: 'Lisinopril', dosage: '10mg', form: 'Comprimé' },
      { name: 'Ventoline', dosage: '100µg', form: 'Aérosol' },
      { name: 'Augmentin', dosage: '1g', form: 'Comprimé' },
      { name: 'Arthotec', dosage: '50mg', form: 'Comprimé' },
      { name: 'Atarax', dosage: '25mg', form: 'Comprimé' },
      { name: 'Bactrim', dosage: '400mg', form: 'Comprimé' }
    ];

    const medicineIds = {};
    for (const medicineData of medicinesData) {
      const existing = await Medicine.findOne({ name: medicineData.name });
      if (!existing) {
        const medicine = new Medicine(medicineData);
        await medicine.save();
        medicineIds[medicineData.name] = medicine._id;
        migrationStats.medicines.created++;
        console.log(`  ✅ Médicament créé: ${medicineData.name}`);
      } else {
        medicineIds[medicineData.name] = existing._id;
        migrationStats.medicines.existing++;
        console.log(`  ℹ️  Médicament existe déjà: ${medicineData.name}`);
      }
    }

    // 7. MIGRATION DES STOCKS DE MÉDICAMENTS
    console.log('\n📦 Migration des stocks de médicaments...');
    const pharmacies = await Pharmacy.find({});
    
    const stockData = [
      { medicineName: 'Doliprane', stockCount: 50, price: 2.50, description: 'Antalgique et antipyrétique', category: 'Antalgique' },
      { medicineName: 'Aspirine', stockCount: 45, price: 1.80, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
      { medicineName: 'Vitamine C', stockCount: 30, price: 8.90, description: 'Complément alimentaire', category: 'Vitamine' },
      { medicineName: 'Ibuprofène', stockCount: 40, price: 3.20, description: 'Anti-inflammatoire', category: 'Anti-inflammatoire' },
      { medicineName: 'Paracétamol', stockCount: 60, price: 2.10, description: 'Antalgique', category: 'Antalgique' },
      { medicineName: 'Amoxicilline', stockCount: 25, price: 12.50, description: 'Antibiotique', category: 'Antibiotique' },
      { medicineName: 'Oméprazole', stockCount: 35, price: 15.80, description: 'Antiulcéreux', category: 'Antiulcéreux' },
      { medicineName: 'Ventoline', stockCount: 20, price: 22.00, description: 'Bronchodilatateur', category: 'Asthme' }
    ];

    for (const pharmacy of pharmacies) {
      console.log(`  📍 Stocks pour: ${pharmacy.name}`);
      
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
            migrationStats.medicineStocks.created++;
            console.log(`    ✅ ${stock.medicineName} - ${stock.price}DT - Stock: ${stock.stockCount}`);
          } else {
            migrationStats.medicineStocks.existing++;
            console.log(`    ℹ️  ${stock.medicineName} existe déjà`);
          }
        }
      }
    }

    // 8. MIGRATION DES RÉSERVATIONS
    console.log('\n📋 Migration des réservations...');
    const patients = await Patient.find({});
    const medicineStocks = await MedicineStock.find({});
    
    if (medicineStocks.length > 0 && patients.length > 0) {
      const reservationsData = [
        {
          patientId: patients[0]?._id,
          medicineId: medicineStocks[0]?.medicineId,
          pharmacyId: medicineStocks[0]?.pharmacyId,
          quantity: 2,
          status: 'pending',
          reservationDate: new Date(),
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
        },
        {
          patientId: patients[1]?._id,
          medicineId: medicineStocks[1]?.medicineId,
          pharmacyId: medicineStocks[1]?.pharmacyId,
          quantity: 1,
          status: 'confirmed',
          reservationDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
          expiryDate: new Date(Date.now() + 22 * 60 * 60 * 1000),
          confirmedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ];

      for (const reservationData of reservationsData) {
        if (reservationData.patientId && reservationData.medicineId && reservationData.pharmacyId) {
          const existing = await MedicationReservation.findOne({
            patientId: reservationData.patientId,
            medicineId: reservationData.medicineId,
            pharmacyId: reservationData.pharmacyId
          });
          
          if (!existing) {
            const reservation = new MedicationReservation(reservationData);
            await reservation.save();
            migrationStats.reservations.created++;
            console.log(`  ✅ Réservation créée pour patient: ${reservationData.patientId}`);
          } else {
            migrationStats.reservations.existing++;
            console.log(`  ℹ️  Réservation existe déjà`);
          }
        }
      }
    }

    // 9. AFFICHAGE DU RAPPORT DE MIGRATION
    console.log('\n🎉 RAPPORT DE MIGRATION TERMINÉE');
    console.log('=' .repeat(60));
    
    console.log('\n👥 UTILISATEURS:');
    console.log(`   Patients: ${migrationStats.patients.created} créés, ${migrationStats.patients.existing} existants`);
    console.log(`   Médecins: ${migrationStats.doctors.created} créés, ${migrationStats.doctors.existing} existants`);
    console.log(`   Pharmaciens: ${migrationStats.pharmacists.created} créés, ${migrationStats.pharmacists.existing} existants`);
    console.log(`   Admins: ${migrationStats.admins.created} créés, ${migrationStats.admins.existing} existants`);
    
    console.log('\n🏪 INFRASTRUCTURE:');
    console.log(`   Pharmacies: ${migrationStats.pharmacies.created} créées, ${migrationStats.pharmacies.existing} existantes`);
    console.log(`   Médicaments: ${migrationStats.medicines.created} créés, ${migrationStats.medicines.existing} existants`);
    console.log(`   Stocks: ${migrationStats.medicineStocks.created} créés, ${migrationStats.medicineStocks.existing} existants`);
    console.log(`   Réservations: ${migrationStats.reservations.created} créées, ${migrationStats.reservations.existing} existantes`);
    
    const totalCreated = Object.values(migrationStats).reduce((sum, stat) => sum + stat.created, 0);
    const totalExisting = Object.values(migrationStats).reduce((sum, stat) => sum + stat.existing, 0);
    
    console.log(`\n📊 TOTAL: ${totalCreated} éléments créés, ${totalExisting} éléments existants`);
    console.log(`🎯 Migration réussie avec ${totalCreated} nouvelles données ajoutées!`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
};

const main = async () => {
  await connectDB();
  await migrateAllData();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🚀 Migration terminée!');
};

main().catch(console.error);
