const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
const Hospital = require('./Model/Hospital');

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

const addHospitalsOnly = async () => {
  try {
    console.log('🏥 Ajout des hôpitaux manquants...\n');
    
    const existingHospitals = await Hospital.find({});
    console.log(`🏪 Hôpitaux existants: ${existingHospitals.length}`);
    
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
        }
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
        }
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
        }
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
        }
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
        }
      }
    ];

    let addedCount = 0;
    
    for (const hospitalData of hospitalsData) {
      const existing = await Hospital.findOne({ name: hospitalData.name });
      if (!existing) {
        try {
          const hospital = new Hospital(hospitalData);
          await hospital.save();
          addedCount++;
          console.log(`  ✅ Hôpital ajouté: ${hospitalData.name}`);
        } catch (error) {
          console.error(`  ❌ Erreur pour ${hospitalData.name}:`, error.message);
          
          // Si l'erreur est due à bcrypt, on crée l'hôpital sans le hashage
          if (error.message.includes('bcrypt')) {
            try {
              // Créer l'hôpital directement sans passer par le pre-save hook
              const hospital = await Hospital.create([hospitalData], { bypassMiddleware: true });
              addedCount++;
              console.log(`  ✅ Hôpital ajouté (sans hash): ${hospitalData.name}`);
            } catch (error2) {
              console.error(`  ❌ Erreur alternative pour ${hospitalData.name}:`, error2.message);
            }
          }
        }
      } else {
        console.log(`  ℹ️  Existe déjà: ${hospitalData.name}`);
      }
    }
    
    console.log(`\n🎯 Total d'hôpitaux ajoutés: ${addedCount}`);
    
    // Vérification finale
    const finalHospitals = await Hospital.find({});
    console.log(`📋 Total final d'hôpitaux: ${finalHospitals.length}`);
    
    finalHospitals.forEach((hospital, index) => {
      console.log(`  ${index + 1}. ${hospital.name} - ${hospital.address}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des hôpitaux:', error);
  }
};

const main = async () => {
  await connectDB();
  await addHospitalsOnly();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Ajout des hôpitaux terminé!');
};

main().catch(console.error);
