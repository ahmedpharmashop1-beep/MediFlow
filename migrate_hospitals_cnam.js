const mongoose = require('mongoose');
const dns = require('dns');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Hospital = require('./Model/Hospital');
const Doctor = require('./Model/Doctor');
const CnamAdmin = require('./Model/CnamAdmin');
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

const migrateHospitalsAndCnamData = async () => {
  try {
    console.log('🏥 MIGRATION DES DONNÉES HÔPITAUX ET CNAM...\n');
    
    let addedStats = {
      hospitals: 0,
      doctors: 0,
      cnamAdmins: 0,
      reservations: 0
    };

    // 1. MIGRATION DES HÔPITAUX
    console.log('🏥 Migration des hôpitaux...');
    const existingHospitals = await Hospital.find({});
    console.log(`   Hôpitaux existants: ${existingHospitals.length}`);
    
    const hospitalsData = [
      {
        name: 'Hôpital Charles Nicolle',
        address: 'Boulevard 9 Avril 1938, Tunis 1006',
        phone: '+216 71 570 100',
        email: 'hcn.tn@hospital.tn',
        password: 'password123',
        role: 'hospital',
        lat: 36.8065,
        lng: 10.1815,
        type: 'general',
        specialties: ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie', 'Gynécologie'],
        capacity: {
          totalBeds: 650,
          occupiedBeds: 420,
          emergencyCapacity: 50
        },
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        administrators: [{
          name: 'Directeur Général',
          role: 'Directeur',
          phone: '+216 71 570 101',
          email: 'directeur@hcn.tn'
        }]
      },
      {
        name: 'Hôpital d\'Enfants Béchir Hamza',
        address: 'Rue Djebel Lakhdar, Tunis 1007',
        phone: '+216 71 571 300',
        email: 'heb.tn@hospital.tn',
        password: 'password123',
        role: 'hospital',
        lat: 36.8425,
        lng: 10.2007,
        type: 'specialized',
        specialties: ['Pédiatrie', 'Chirurgie', 'Urgence'],
        capacity: {
          totalBeds: 280,
          occupiedBeds: 180,
          emergencyCapacity: 30
        },
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        administrators: [{
          name: 'Directeur Pédiatrie',
          role: 'Directeur',
          phone: '+216 71 571 301',
          email: 'directeur@heb.tn'
        }]
      },
      {
        name: 'Hôpital La Rabta',
        address: 'Boulevard du 9 Avril, Tunis 1007',
        phone: '+216 71 561 100',
        email: 'larabta.tn@hospital.tn',
        password: 'password123',
        role: 'hospital',
        lat: 36.8969,
        lng: 10.3096,
        type: 'general',
        specialties: ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie', 'Urgence'],
        capacity: {
          totalBeds: 720,
          occupiedBeds: 480,
          emergencyCapacity: 60
        },
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        administrators: [{
          name: 'Directeur Général',
          role: 'Directeur',
          phone: '+216 71 561 101',
          email: 'directeur@larabta.tn'
        }]
      },
      {
        name: 'Hôpital Sahloul',
        address: 'Route de Ceinture, Sahloul, Sousse 4054',
        phone: '+216 73 226 000',
        email: 'hsahloul.tn@hospital.tn',
        password: 'password123',
        role: 'hospital',
        lat: 35.8256,
        lng: 10.6369,
        type: 'general',
        specialties: ['Cardiologie', 'Chirurgie', 'Orthopédie', 'Urgence'],
        capacity: {
          totalBeds: 580,
          occupiedBeds: 380,
          emergencyCapacity: 45
        },
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        administrators: [{
          name: 'Directeur Régional',
          role: 'Directeur',
          phone: '+216 73 226 001',
          email: 'directeur@hsahloul.tn'
        }]
      },
      {
        name: 'Hôpital Habib Thameur',
        address: 'Avenue Habib Thameur, Tunis 1008',
        phone: '+216 71 842 000',
        email: 'hthameur.tn@hospital.tn',
        password: 'password123',
        role: 'hospital',
        lat: 36.7406,
        lng: 10.7603,
        type: 'general',
        specialties: ['Cardiologie', 'Chirurgie', 'Pédiatrie', 'Urgence'],
        capacity: {
          totalBeds: 420,
          occupiedBeds: 280,
          emergencyCapacity: 35
        },
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        administrators: [{
          name: 'Directeur Général',
          role: 'Directeur',
          phone: '+216 71 842 001',
          email: 'directeur@hthameur.tn'
        }]
      }
    ];

    for (const hospitalData of hospitalsData) {
      const existing = await Hospital.findOne({ name: hospitalData.name });
      if (!existing) {
        try {
          const hospital = new Hospital(hospitalData);
          await hospital.save();
          addedStats.hospitals++;
          console.log(`   ✅ Hôpital ajouté: ${hospitalData.name}`);
        } catch (error) {
          console.log(`   ⚠️  Erreur lors de l'ajout de ${hospitalData.name}: ${error.message}`);
        }
      } else {
        console.log(`   ℹ️  Hôpital existe déjà: ${hospitalData.name}`);
      }
    }

    // 2. MISE À JOUR DES MÉDECINS AVEC HÔPITAUX
    console.log('\n👨‍⚕️ Mise à jour des médecins avec hôpitaux...');
    const existingDoctors = await Doctor.find({});
    console.log(`   Médecins existants: ${existingDoctors.length}`);
    
    const hospitals = await Hospital.find({});
    const hospitalMap = {};
    hospitals.forEach(hospital => {
      hospitalMap[hospital.name] = hospital._id;
    });

    for (const doctor of existingDoctors) {
      let updated = false;
      
      // Associer les médecins aux hôpitaux correspondants
      if (doctor.hospitalName && hospitalMap[doctor.hospitalName]) {
        doctor.hospitalId = hospitalMap[doctor.hospitalName];
        updated = true;
      } else {
        // Assigner un hôpital par défaut si non spécifié
        if (doctor.specialization === 'Cardiologue' && hospitalMap['Hôpital Charles Nicolle']) {
          doctor.hospitalId = hospitalMap['Hôpital Charles Nicolle'];
          doctor.hospitalName = 'Hôpital Charles Nicolle';
          updated = true;
        } else if (doctor.specialization === 'Pédiatre' && hospitalMap['Hôpital d\'Enfants Béchir Hamza']) {
          doctor.hospitalId = hospitalMap['Hôpital d\'Enfants Béchir Hamza'];
          doctor.hospitalName = 'Hôpital d\'Enfants Béchir Hamza';
          updated = true;
        } else if (hospitalMap['Hôpital La Rabta']) {
          doctor.hospitalId = hospitalMap['Hôpital La Rabta'];
          doctor.hospitalName = 'Hôpital La Rabta';
          updated = true;
        }
      }
      
      if (updated) {
        await doctor.save();
        addedStats.doctors++;
        console.log(`   ✅ Médecin mis à jour: Dr ${doctor.firstName} ${doctor.lastName} - ${doctor.hospitalName}`);
      }
    }

    // 3. AJOUT DE MÉDECINS MANQUANTS
    console.log('\n👨‍⚕️ Ajout des médecins manquants...');
    const doctorsToAdd = [
      {
        firstName: 'Mohamed',
        lastName: 'Ben Salah',
        email: 'mohamed.bensalah@test.com',
        password: 'password123',
        role: 'doctor',
        phone: '+216 71 345 678',
        specialization: 'Chirurgien',
        hospitalName: 'Hôpital La Rabta',
        hospitalAddress: 'Boulevard du 9 Avril, Tunis 1007',
        licenseNumber: 'DOC003',
        experience: 15,
        consultationFee: 100,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
        availableTimeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '18:00' }
        ]
      },
      {
        firstName: 'Leila',
        lastName: 'Khemiri',
        email: 'leila.khemiri@test.com',
        password: 'password123',
        role: 'doctor',
        phone: '+216 71 678 901',
        specialization: 'Gynécologue',
        hospitalName: 'Hôpital Charles Nicolle',
        hospitalAddress: 'Boulevard 9 Avril 1938, Tunis 1006',
        licenseNumber: 'DOC004',
        experience: 12,
        consultationFee: 90,
        availableDays: ['monday', 'wednesday', 'friday'],
        availableTimeSlots: [
          { start: '09:00', end: '13:00' },
          { start: '15:00', end: '19:00' }
        ]
      },
      {
        firstName: 'Rached',
        lastName: 'Jebali',
        email: 'rached.jebali@test.com',
        password: 'password123',
        role: 'doctor',
        phone: '+216 71 234 567',
        specialization: 'Orthopédiste',
        hospitalName: 'Hôpital Sahloul',
        hospitalAddress: 'Route de Ceinture, Sahloul, Sousse 4054',
        licenseNumber: 'DOC005',
        experience: 8,
        consultationFee: 85,
        availableDays: ['tuesday', 'thursday', 'saturday'],
        availableTimeSlots: [
          { start: '08:30', end: '12:30' },
          { start: '14:30', end: '17:30' }
        ]
      }
    ];

    for (const doctorData of doctorsToAdd) {
      const existing = await Doctor.findOne({ email: doctorData.email });
      if (!existing) {
        // Ajouter l'ID de l'hôpital si disponible
        if (doctorData.hospitalName && hospitalMap[doctorData.hospitalName]) {
          doctorData.hospitalId = hospitalMap[doctorData.hospitalName];
        }
        
        const doctor = new Doctor(doctorData);
        await doctor.save();
        addedStats.doctors++;
        console.log(`   ✅ Médecin ajouté: Dr ${doctorData.firstName} ${doctorData.lastName}`);
      } else {
        console.log(`   ℹ️  Médecin existe déjà: Dr ${doctorData.firstName} ${doctorData.lastName}`);
      }
    }

    // 4. MIGRATION DES ADMINISTRATEURS CNAM
    console.log('\n👨‍💼 Migration des administrateurs CNAM...');
    const existingAdmins = await CnamAdmin.find({});
    console.log(`   Admins CNAM existants: ${existingAdmins.length}`);
    
    const cnamAdminsToAdd = [
      {
        name: 'Directeur CNAM Tunis',
        email: 'directeur.tn@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 800 000',
        officeAddress: 'Avenue Habib Bourguiba, Tunis',
        employeeId: 'CNAM-TN-001',
        department: 'Direction Régionale Tunis',
        position: 'Directeur Régional',
        accessLevel: 'admin'
      },
      {
        name: 'Responsable Affiliation CNAM',
        email: 'affiliation@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 801 000',
        officeAddress: 'Avenue Habib Bourguiba, Tunis',
        employeeId: 'CNAM-AFF-001',
        department: 'Service Affiliation',
        position: 'Responsable Affiliation',
        accessLevel: 'advanced'
      },
      {
        name: 'Administrateur CNAM Sousse',
        email: 'admin.sousse@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 73 800 000',
        officeAddress: 'Rue Farhat Hached, Sousse',
        employeeId: 'CNAM-SO-001',
        department: 'Direction Régionale Sousse',
        position: 'Administrateur Régional',
        accessLevel: 'intermediate'
      }
    ];

    for (const adminData of cnamAdminsToAdd) {
      const existing = await CnamAdmin.findOne({ email: adminData.email });
      if (!existing) {
        const admin = new CnamAdmin(adminData);
        await admin.save();
        addedStats.cnamAdmins++;
        console.log(`   ✅ Admin CNAM ajouté: ${adminData.name}`);
      } else {
        console.log(`   ℹ️  Admin CNAM existe déjà: ${adminData.name}`);
      }
    }

    // 5. AJOUT DE RÉSERVATIONS D'EXEMPLE
    console.log('\n📋 Ajout de réservations d\'exemple...');
    const Patient = require('./Model/Patient');
    const MedicineStock = require('./Model/MedicineStock');
    
    const patients = await Patient.find({});
    const medicineStocks = await MedicineStock.find({});
    
    if (medicineStocks.length > 0 && patients.length > 0) {
      const reservationsToAdd = [
        {
          patientId: patients[0]?._id,
          medicineId: medicineStocks[0]?.medicineId,
          pharmacyId: medicineStocks[0]?.pharmacyId,
          quantity: 2,
          status: 'reserved',
          reservationCode: 'RES-' + Date.now() + '-001',
          expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
          reservationDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          patientId: patients[1]?._id,
          medicineId: medicineStocks[1]?.medicineId,
          pharmacyId: medicineStocks[1]?.pharmacyId,
          quantity: 1,
          status: 'reserved',
          reservationCode: 'RES-' + Date.now() + '-002',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          reservationDate: new Date()
        },
        {
          patientId: patients[2]?._id,
          medicineId: medicineStocks[2]?.medicineId,
          pharmacyId: medicineStocks[2]?.pharmacyId,
          quantity: 3,
          status: 'collected',
          reservationCode: 'RES-' + Date.now() + '-003',
          expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000),
          reservationDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
          collectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ];

      for (const reservationData of reservationsToAdd) {
        if (reservationData.patientId && reservationData.medicineId && reservationData.pharmacyId) {
          const existing = await MedicationReservation.findOne({
            reservationCode: reservationData.reservationCode
          });
          
          if (!existing) {
            const reservation = new MedicationReservation(reservationData);
            await reservation.save();
            addedStats.reservations++;
            console.log(`   ✅ Réservation ajoutée: statut ${reservationData.status}`);
          }
        }
      }
    }

    // 6. RAPPORT FINAL
    console.log('\n🎉 RAPPORT DE MIGRATION HÔPITAUX ET CNAM');
    console.log('=' .repeat(60));
    console.log(`🏥 Hôpitaux ajoutés: ${addedStats.hospitals}`);
    console.log(`👨‍⚕️ Médecins ajoutés/mis à jour: ${addedStats.doctors}`);
    console.log(`👨‍💼 Admins CNAM ajoutés: ${addedStats.cnamAdmins}`);
    console.log(`📋 Réservations ajoutées: ${addedStats.reservations}`);
    
    const totalAdded = Object.values(addedStats).reduce((sum, count) => sum + count, 0);
    console.log(`\n📊 Total des nouvelles données ajoutées: ${totalAdded}`);
    
    if (totalAdded > 0) {
      console.log('✅ Migration hôpitaux et CNAM terminée avec succès!');
    } else {
      console.log('ℹ️  Toutes les données hôpitaux et CNAM sont déjà présentes.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration hôpitaux et CNAM:', error);
  }
};

const main = async () => {
  await connectDB();
  await migrateHospitalsAndCnamData();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Migration hôpitaux et CNAM terminée!');
};

main().catch(console.error);
