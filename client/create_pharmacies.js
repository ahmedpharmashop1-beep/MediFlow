const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const API_URL = 'http://localhost:5000';
const MONGODB_URI = 'mongodb://localhost:27017/mediflow';

// Pharmacies à créer
const pharmacies = [
  {
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    email: 'ahmed.benali@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie du Centre',
    address: '123 Rue de la Paix, Tunis',
    phone: '+216 71 123 456',
    rating: 4.5,
    ordersCount: 156,
    deliveryTime: '30 min',
    isConnected: true
  },
  {
    firstName: 'Fatma',
    lastName: 'Mansouri',
    email: 'fatma.mansouri@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie El Menzah',
    address: '45 Avenue Habib Bourguiba, El Menzah, Tunis',
    phone: '+216 71 789 012',
    rating: 4.2,
    ordersCount: 124,
    deliveryTime: '45 min',
    isConnected: true
  },
  {
    firstName: 'Mohamed',
    lastName: 'Trabelsi',
    email: 'mohamed.trabelsi@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie La Marsa',
    address: '78 Rue Gamal Abdel Nasser, La Marsa, Tunis',
    phone: '+216 71 345 678',
    rating: 4.8,
    ordersCount: 189,
    deliveryTime: '25 min',
    isConnected: true
  },
  {
    firstName: 'Sonia',
    lastName: 'Khemiri',
    email: 'sonia.khemiri@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie Sousse',
    address: '15 Avenue Farhat Hached, Sousse',
    phone: '+216 73 234 567',
    rating: 4.3,
    ordersCount: 98,
    deliveryTime: '40 min',
    isConnected: true
  },
  {
    firstName: 'Karim',
    lastName: 'Brahmi',
    email: 'karim.brahmi@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie Sfax',
    address: '200 Avenue Hedi Chaker, Sfax',
    phone: '+216 74 567 890',
    rating: 4.6,
    ordersCount: 167,
    deliveryTime: '35 min',
    isConnected: true
  },
  {
    firstName: 'Leila',
    lastName: 'Hachani',
    email: 'leila.hachani@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie Bizerte',
    address: '33 Rue Mongi Slim, Bizerte',
    phone: '+216 72 678 901',
    rating: 4.4,
    ordersCount: 134,
    deliveryTime: '30 min',
    isConnected: true
  },
  {
    firstName: 'Rached',
    lastName: 'Jebali',
    email: 'rached.jebali@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie Gabès',
    address: '88 Avenue Abdelkader El Ghazzi, Gabès',
    phone: '+216 75 789 012',
    rating: 4.1,
    ordersCount: 87,
    deliveryTime: '50 min',
    isConnected: false
  },
  {
    firstName: 'Mariem',
    lastName: 'Saidani',
    email: 'mariem.saidani@pharmacie.tn',
    password: 'password123',
    role: 'pharmacist',
    pharmacyName: 'Pharmacie Nabeul',
    address: '12 Rue Habib Thameur, Nabeul',
    phone: '+216 72 123 456',
    rating: 4.7,
    ordersCount: 201,
    deliveryTime: '20 min',
    isConnected: true
  }
];

// Fonction pour tester les endpoints
async function testEndpoints() {
  const endpoints = [
    '/api/comptes',
    '/api/register',
    '/api/auth/register',
    '/register',
    '/auth/register'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Test de: ${API_URL}${endpoint}`);
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.response?.status || error.message}`);
    }
  }
}

// Fonction pour créer les pharmacies
async function createPharmacies() {
  try {
    console.log('🚀 Début de la création des pharmacies...');
    
    // Tester les endpoints d'abord
    await testEndpoints();
    
    // Se connecter à MongoDB pour vérifier
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Créer chaque pharmacie
    for (const pharmacy of pharmacies) {
      try {
        console.log(`📝 Création de: ${pharmacy.pharmacyName}`);
        
        // Essayer différents endpoints
        const endpoints = [
          '/api/comptes',
          '/api/register',
          '/api/auth/register',
          '/register',
          '/auth/register'
        ];
        
        let created = false;
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.post(`${API_URL}${endpoint}`, pharmacy, {
              headers: { 
                'Content-Type': 'application/json'
              }
            });
            
            if (response.data.success) {
              console.log(`✅ ${pharmacy.pharmacyName} créée avec succès via ${endpoint}`);
              console.log(`   ID: ${response.data.compte._id}`);
              created = true;
              break;
            }
          } catch (error) {
            // Continuer avec le prochain endpoint
            continue;
          }
        }
        
        if (!created) {
          console.log(`❌ Impossible de créer ${pharmacy.pharmacyName} - aucun endpoint fonctionnel`);
        }
        
        // Attendre un peu entre chaque création
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ Erreur pour ${pharmacy.pharmacyName}:`, error.message);
      }
    }
    
    console.log('🎉 Création des pharmacies terminée!');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Fonction pour vérifier les pharmacies existantes
async function checkPharmacies() {
  try {
    console.log('🔍 Vérification des pharmacies existantes...');
    
    const response = await axios.get(`${API_URL}/api/comptes`);
    const comptes = response.data.comptes || [];
    
    const pharmacists = comptes.filter(compte => compte.role === 'pharmacist');
    
    console.log(`📊 Nombre total de pharmaciens: ${pharmacists.length}`);
    
    pharmacists.forEach(pharmacist => {
      console.log(`   🏥 ${pharmacist.pharmacyName || 'Nom non spécifié'} - ${pharmacist.email}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }
}

// Menu principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--check')) {
    await checkPharmacies();
  } else if (args.includes('--create')) {
    await createPharmacies();
  } else {
    console.log('📋 Usage:');
    console.log('   node create_pharmacies.js --create  # Créer toutes les pharmacies');
    console.log('   node create_pharmacies.js --check   # Vérifier les pharmacies existantes');
    console.log('');
    console.log('🏥 Pharmacies à créer:');
    pharmacies.forEach((pharmacy, index) => {
      console.log(`   ${index + 1}. ${pharmacy.pharmacyName} - ${pharmacy.address}`);
    });
  }
}

// Exécuter
main();
