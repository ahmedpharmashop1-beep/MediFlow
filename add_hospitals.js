const mongoose = require('mongoose');
require('dotenv').config();

// Importer le modèle Hospital
const Hospital = require('./Model/Hospital');

const hospitalsData = [
  {
    name: 'Hôpital Charles Nicolle',
    address: 'Boulevard 9 Avril 1938, Tunis 1006, Tunisie',
    phone: '+216 71 570 100',
    email: 'contact@charlesnicolle.gov.tn',
    password: 'hospital123',
    lat: 36.806494,
    lng: 10.181493,
    type: 'general',
    specialties: ['Médecine Interne', 'Cardiologie adulte', 'Dermatologie', 'Endocrinologie', 'Gastro-entérologie', 'Maladies Infectieuses'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Cardiovasculaire', 'Chirurgie Orthopédique', 'ORL', 'Urologie', 'Chirurgie Thoracique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 800,
      occupiedBeds: 650,
      emergencyCapacity: 50
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Rabta',
    address: 'Rue Jebbari, El Menzah, Tunis 1004, Tunisie',
    phone: '+216 71 561 100',
    email: 'contact@rabta.gov.tn',
    password: 'hospital123',
    lat: 36.842842,
    lng: 10.166719,
    type: 'general',
    specialties: [
      'Cardiologie adulte',
      'Cardiologie pédiatrique (seul service de cardio-pédiatrie du pays, accueillant 7000 enfants par an)',
      'Dermatologie',
      'Endocrinologie',
      'Gastroentérologie (services A et B)',
      'Maladies infectieuses',
      'Médecine interne',
      'Exploration fonctionnelle et réanimation cardiaque'
    ],
    surgicalSpecialties: [
      'Anesthésie-Réanimation',
      'Chirurgie Générale (Services A et B)',
      'Chirurgie Cardio-vasculaire',
      'Chirurgie Orthopédique et Traumatologique',
      'ORL / Oto-rhino-laryngologie et Maxillo-faciale',
      'Urologie'
    ],
    emergencyServices: [
      'Service des Urgences (Disponible 24/7)',
      'Services de consultations externes'
    ],
    capacity: {
      totalBeds: 1200,
      occupiedBeds: 950,
      emergencyCapacity: 80
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Habib Thameur',
    address: 'Place du 9 Avril 1938, Tunis 1002, Tunisie',
    phone: '+216 71 847 200',
    email: 'contact@habibthameur.gov.tn',
    password: 'hospital123',
    lat: 36.801749,
    lng: 10.170834,
    type: 'specialized',
    specialties: ['Cardiologie adulte', 'Exploration fonctionnelle et réanimation cardiaque', 'Médecine Interne'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie Cardiovasculaire', 'Chirurgie Thoracique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 300,
      occupiedBeds: 250,
      emergencyCapacity: 20
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Mongi Slim',
    address: 'Avenue Kheireddine, La Marsa 2078, Tunisie',
    phone: '+216 71 740 000',
    email: 'contact@mongislim.gov.tn',
    password: 'hospital123',
    lat: 36.879559,
    lng: 10.319832,
    type: 'general',
    specialties: ['Médecine Interne', 'Cardiologie adulte', 'Cardiologie pédiatrique', 'Dermatologie', 'Gynécologie', 'Orthopédie', 'Pédiatrie'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Cardiovasculaire', 'Chirurgie Orthopédique et Traumatologique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 400,
      occupiedBeds: 320,
      emergencyCapacity: 30
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Aziza Othmana',
    address: 'Bab Menara, Médina, Tunis 1008, Tunisie',
    phone: '+216 71 560 300',
    email: 'contact@azizaothmana.gov.tn',
    password: 'hospital123',
    lat: 36.799372,
    lng: 10.173895,
    type: 'general',
    specialties: ['Médecine Interne', 'Gynécologie', 'Pédiatrie', 'Chirurgie', 'Urgence'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Orthopédique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 350,
      occupiedBeds: 280,
      emergencyCapacity: 25
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Clinique El Manar',
    address: 'Avenue du Japon, Tunis',
    phone: '+216 71 890 000',
    email: 'contact@elmanar.clinic.tn',
    password: 'hospital123',
    lat: 36.8100,
    lng: 10.1800,
    type: 'clinic',
    specialties: ['Cardiologie', 'Radiologie', 'Chirurgie', 'Ophtalmologie'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Cardiovasculaire'],
    emergencyServices: ['Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 150,
      occupiedBeds: 120,
      emergencyCapacity: 15
    },
    operatingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '16:00' },
      sunday: { open: '09:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Fattouma Bourguiba',
    address: 'Avenue Farhat Hached, Monastir',
    phone: '+216 73 462 000',
    email: 'contact@fattoumabourguiba.gov.tn',
    password: 'hospital123',
    lat: 35.7643,
    lng: 10.8113,
    type: 'general',
    specialties: ['Médecine Interne', 'Cardiologie adulte', 'Pédiatrie', 'Gynécologie', 'Orthopédie', 'Chirurgie', 'Urgence', 'Neurologie'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Cardiovasculaire', 'Chirurgie Orthopédique et Traumatologique', 'ORL', 'Urologie', 'Chirurgie Thoracique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 500,
      occupiedBeds: 400,
      emergencyCapacity: 40
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Tahar Sfar',
    address: 'Rue Mongi Slim, Mahdia',
    phone: '+216 73 684 000',
    email: 'contact@taharsfar.gov.tn',
    password: 'hospital123',
    lat: 35.5049,
    lng: 11.0622,
    type: 'general',
    specialties: ['Médecine Interne', 'Chirurgie', 'Pédiatrie', 'Gynécologie', 'Urgence'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Orthopédique'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 250,
      occupiedBeds: 200,
      emergencyCapacity: 20
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  },
  {
    name: 'Hôpital Regional de Sfax',
    address: 'Route de l\'Aéroport, Sfax',
    phone: '+216 74 411 000',
    email: 'contact@hospitalsfax.gov.tn',
    password: 'hospital123',
    lat: 34.7406,
    lng: 10.7603,
    type: 'general',
    specialties: ['Médecine Interne', 'Cardiologie adulte', 'Dermatologie', 'Endocrinologie', 'Gastro-entérologie', 'Maladies Infectieuses', 'Radiologie'],
    surgicalSpecialties: ['Anesthésie Réanimation', 'Chirurgie A et B', 'Chirurgie Cardiovasculaire', 'Chirurgie Orthopédique et Traumatologique', 'ORL', 'Urologie'],
    emergencyServices: ['Service des Urgences (accueil 24/7)', 'Laboratoires d\'analyses et imagerie médicale', 'Consultations externes'],
    capacity: {
      totalBeds: 600,
      occupiedBeds: 480,
      emergencyCapacity: 45
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: '08:00', close: '14:00' }
    }
  }
];

async function addHospitals() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.DB_URI);
    
    console.log('Connecté à la base de données MongoDB');
    
    // Vérifier si des hôpitaux existent déjà
    const existingHospitals = await Hospital.countDocuments();
    console.log(`Nombre d'hôpitaux existants: ${existingHospitals}`);
    
    if (existingHospitals === 0) {
      // Ajouter les hôpitaux
      const result = await Hospital.insertMany(hospitalsData);
      console.log(`${result.length} hôpitaux ajoutés avec succès!`);
      
      // Afficher les hôpitaux ajoutés
      result.forEach((hospital, index) => {
        console.log(`${index + 1}. ${hospital.name} - ${hospital.address}`);
      });
    } else {
      console.log('Des hôpitaux existent déjà dans la base de données.');
      
      // Afficher les hôpitaux existants
      const hospitals = await Hospital.find({}, 'name address type');
      console.log('Hôpitaux existants:');
      hospitals.forEach((hospital, index) => {
        console.log(`${index + 1}. ${hospital.name} - ${hospital.address} (${hospital.type})`);
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout des hôpitaux:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion à la base de données fermée');
  }
}

// Exécuter la fonction
addHospitals();
