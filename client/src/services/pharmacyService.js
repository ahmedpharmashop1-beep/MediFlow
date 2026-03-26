// Service pour gérer les bases de données des pharmaciens

// Importation des modules nécessaires
import axios from 'axios';

// Fonction pour récupérer les pharmacies réelles depuis l'API
const getRealPharmacies = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:5000/api/comptes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Filtrer uniquement les pharmaciens
    const pharmacists = response.data.comptes.filter(compte => compte.role === 'pharmacist');
    
    // Transformer les données en format attendu
    return pharmacists.map(pharmacist => ({
      id: pharmacist._id,
      name: pharmacist.pharmacyName || `Pharmacie ${pharmacist.firstName} ${pharmacist.lastName}`,
      address: pharmacist.address || 'Adresse non spécifiée',
      phone: pharmacist.phone || 'Téléphone non spécifié',
      rating: pharmacist.rating || 4.0,
      medicines: generateUniqueMedicineDatabase(pharmacist._id, pharmacist.pharmacyName || `Pharmacie ${pharmacist.firstName} ${pharmacist.lastName}`)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des pharmacies:', error);
    return [];
  }
};

// Base de médicaments unique pour chaque pharmacie - TOTALEMENT DIFFÉRENTES - VERSION 2.0
const pharmacyMedicineDatabases = {
  pharm1: [
    { name: 'Doliprane', category: 'Antalgique', price: 2.50, description: 'Paracétamol 500mg', stock: 45, status: 'disponible' },
    { name: 'Ibuprofène', category: 'Anti-inflammatoire', price: 3.20, description: 'Ibuprofène 400mg', stock: 32, status: 'disponible' },
    { name: 'Amoxicilline', category: 'Antibiotique', price: 8.50, description: 'Amoxicilline 1g', stock: 18, status: 'disponible' },
    { name: 'Aspirine', category: 'Antalgique', price: 1.80, description: 'Aspirine 100mg', stock: 67, status: 'disponible' },
    { name: 'Ventoline', category: 'Bronchodilatateur', price: 12.00, description: 'Ventoline Spray', stock: 8, status: 'stock_faible' },
    { name: 'Insuline', category: 'Diabète', price: 45.00, description: 'Insuline Glargine', stock: 24, status: 'disponible' },
    { name: 'Prednisolone', category: 'Corticoïde', price: 15.50, description: 'Prednisolone 5mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Oméprazole', category: 'Anti-ulcéreux', price: 7.80, description: 'Oméprazole 20mg', stock: 41, status: 'disponible' }
  ],
  pharm2: [
    { name: 'Azithromycine', category: 'Antibiotique', price: 16.70, description: 'Azithromycine 250mg', stock: 35, status: 'disponible' },
    { name: 'Clarithromycine', category: 'Antibiotique', price: 19.30, description: 'Clarithromycine 500mg', stock: 26, status: 'disponible' },
    { name: 'Lévofloxacine', category: 'Antibiotique', price: 24.80, description: 'Lévofloxacine 500mg', stock: 14, status: 'stock_faible' },
    { name: 'Ciprofloxacine', category: 'Antibiotique', price: 12.90, description: 'Ciprofloxacine 500mg', stock: 31, status: 'disponible' },
    { name: 'Céphalexine', category: 'Antibiotique', price: 8.40, description: 'Céphalexine 500mg', stock: 48, status: 'disponible' },
    { name: 'Gentamicine', category: 'Antibiotique', price: 18.60, description: 'Gentamicine 80mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Vancomycine', category: 'Antibiotique', price: 35.70, description: 'Vancomycine 1g', stock: 7, status: 'stock_faible' },
    { name: 'Méropénème', category: 'Antibiotique', price: 41.20, description: 'Méropénème 1g', stock: 3, status: 'stock_faible' }
  ],
  pharm3: [
    { name: 'Warfarine', category: 'Anticoagulant', price: 9.60, description: 'Warfarine 5mg', stock: 41, status: 'disponible' },
    { name: 'Héparine', category: 'Anticoagulant', price: 15.70, description: 'Héparine 5000UI', stock: 36, status: 'disponible' },
    { name: 'Enoxaparine', category: 'Anticoagulant', price: 18.90, description: 'Enoxaparine 40mg', stock: 44, status: 'disponible' },
    { name: 'Clopidogrel', category: 'Antiagrégant', price: 24.60, description: 'Clopidogrel 75mg', stock: 27, status: 'disponible' },
    { name: 'Prasugrel', category: 'Antiagrégant', price: 32.80, description: 'Prasugrel 10mg', stock: 15, status: 'stock_faible' },
    { name: 'Ticagrelor', category: 'Antiagrégant', price: 45.70, description: 'Ticagrelor 90mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Allopurinol', category: 'Goutte', price: 10.80, description: 'Allopurinol 300mg', stock: 22, status: 'disponible' },
    { name: 'Colchicine', category: 'Goutte', price: 8.90, description: 'Colchicine 0.5mg', stock: 18, status: 'disponible' }
  ],
  pharm4: [
    { name: 'Furosémide', category: 'Diurétique', price: 5.80, description: 'Furosémide 40mg', stock: 53, status: 'disponible' },
    { name: 'Hydrochlorothiazide', category: 'Diurétique', price: 4.90, description: 'Hydrochlorothiazide 25mg', stock: 37, status: 'disponible' },
    { name: 'Spironolactone', category: 'Diurétique', price: 7.80, description: 'Spironolactone 25mg', stock: 22, status: 'disponible' },
    { name: 'Amiodarone', category: 'Antiarythmique', price: 28.70, description: 'Amiodarone 200mg', stock: 8, status: 'stock_faible' },
    { name: 'Dronédarone', category: 'Antiarythmique', price: 35.80, description: 'Dronédarone 400mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Sotalol', category: 'Antiarythmique', price: 12.40, description: 'Sotalol 80mg', stock: 19, status: 'disponible' },
    { name: 'Diltiazem', category: 'Anticalcique', price: 16.80, description: 'Diltiazem 60mg', stock: 26, status: 'disponible' },
    { name: 'Vérapamil', category: 'Anticalcique', price: 14.70, description: 'Vérapamil 80mg', stock: 34, status: 'disponible' }
  ],
  pharm5: [
    { name: 'Fluconazole', category: 'Antifongique', price: 14.80, description: 'Fluconazole 150mg', stock: 28, status: 'disponible' },
    { name: 'Itraconazole', category: 'Antifongique', price: 18.70, description: 'Itraconazole 100mg', stock: 15, status: 'stock_faible' },
    { name: 'Voriconazole', category: 'Antifongique', price: 24.50, description: 'Voriconazole 200mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Amphotéricine B', category: 'Antifongique', price: 35.80, description: 'Amphotéricine B 50mg', stock: 12, status: 'disponible' },
    { name: 'Caspofungine', category: 'Antifongique', price: 45.70, description: 'Caspofungine 70mg', stock: 8, status: 'stock_faible' },
    { name: 'Terbinafine', category: 'Antifongique', price: 12.40, description: 'Terbinafine 250mg', stock: 35, status: 'disponible' },
    { name: 'Clotrimazole', category: 'Antifongique', price: 8.70, description: 'Clotrimazole 1%', stock: 42, status: 'disponible' }
  ],
  pharm6: [
    { name: 'Acyclovir', category: 'Antiviral', price: 22.90, description: 'Acyclovir 400mg', stock: 38, status: 'disponible' },
    { name: 'Valacyclovir', category: 'Antiviral', price: 35.70, description: 'Valacyclovir 500mg', stock: 24, status: 'disponible' },
    { name: 'Famciclovir', category: 'Antiviral', price: 28.40, description: 'Famciclovir 250mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Ganciclovir', category: 'Antiviral', price: 42.80, description: 'Ganciclovir 500mg', stock: 16, status: 'disponible' },
    { name: 'Ribavirine', category: 'Antiviral', price: 18.50, description: 'Ribavirine 200mg', stock: 17, status: 'stock_faible' },
    { name: 'Lamivudine', category: 'Antiviral', price: 14.70, description: 'Lamivudine 150mg', stock: 29, status: 'disponible' },
    { name: 'Ténofovir', category: 'Antiviral', price: 31.20, description: 'Ténofovir 300mg', stock: 11, status: 'disponible' }
  ],
  pharm7: [
    { name: 'Fentanyl', category: 'Antalgique fort', price: 35.80, description: 'Fentanyl 25mcg', stock: 6, status: 'disponible' },
    { name: 'Morphine', category: 'Antalgique fort', price: 28.90, description: 'Morphine 10mg', stock: 4, status: 'stock_faible' },
    { name: 'Oxycodone', category: 'Antalgique fort', price: 38.70, description: 'Oxycodone 10mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Hydromorphone', category: 'Antalgique fort', price: 42.30, description: 'Hydromorphone 4mg', stock: 8, status: 'stock_faible' },
    { name: 'Méthadone', category: 'Traitement dépendance', price: 15.80, description: 'Méthadone 10mg', stock: 5, status: 'stock_faible' },
    { name: 'Buprénorphine', category: 'Traitement dépendance', price: 28.50, description: 'Buprénorphine 8mg', stock: 8, status: 'stock_faible' }
  ],
  pharm8: [
    { name: 'Fluoxétine', category: 'Antidépresseur', price: 19.80, description: 'Fluoxétine 20mg', stock: 12, status: 'stock_faible' },
    { name: 'Sertraline', category: 'Antidépresseur', price: 26.70, description: 'Sertraline 50mg', stock: 33, status: 'disponible' },
    { name: 'Trazodone', category: 'Antidépresseur', price: 18.50, description: 'Trazodone 50mg', stock: 24, status: 'disponible' },
    { name: 'Quétapine', category: 'Antipsychotique', price: 45.20, description: 'Quétapine 25mg', stock: 0, status: 'rupture' }, // SEULE RUPTURE
    { name: 'Lorazépam', category: 'Anxiolytique', price: 19.40, description: 'Lorazépam 1mg', stock: 17, status: 'disponible' },
    { name: 'Gabapentine', category: 'Antiépileptique', price: 23.40, description: 'Gabapentine 300mg', stock: 19, status: 'disponible' },
    { name: 'Pregabaline', category: 'Antiépileptique', price: 32.60, description: 'Pregabaline 75mg', stock: 14, status: 'stock_faible' }
  ]
};

// Générateur de base de données unique pour chaque pharmacie
const generateUniqueMedicineDatabase = (pharmacyId, pharmacyName) => {
  // Ajouter un timestamp pour forcer le rechargement (cache busting)
  const timestamp = new Date().getTime();
  console.log(`🔄 Chargement base de données pour ${pharmacyName} (v${timestamp})`);
  
  return pharmacyMedicineDatabases[pharmacyId] || [];
};

// Base de données simulée des pharmaciens et leurs médicaments (fallback)
const fallbackPharmacyDatabase = {
  'pharm1': {
    id: 'pharm1',
    name: 'Pharmacie du Centre',
    address: '123 Rue de la Paix, Tunis',
    phone: '+216 71 123 456',
    rating: 4.5,
    medicines: generateUniqueMedicineDatabase('pharm1', 'Pharmacie du Centre')
  },
  'pharm2': {
    id: 'pharm2',
    name: 'Pharmacie El Menzah',
    address: '45 Avenue Habib Bourguiba, El Menzah, Tunis',
    phone: '+216 71 789 012',
    rating: 4.2,
    medicines: generateUniqueMedicineDatabase('pharm2', 'Pharmacie El Menzah')
  },
  'pharm3': {
    id: 'pharm3',
    name: 'Pharmacie La Marsa',
    address: '78 Rue Gamal Abdel Nasser, La Marsa, Tunis',
    phone: '+216 71 345 678',
    rating: 4.8,
    medicines: generateUniqueMedicineDatabase('pharm3', 'Pharmacie La Marsa')
  },
  'pharm4': {
    id: 'pharm4',
    name: 'Pharmacie Sousse',
    address: '15 Avenue Farhat Hached, Sousse',
    phone: '+216 73 234 567',
    rating: 4.3,
    medicines: generateUniqueMedicineDatabase('pharm4', 'Pharmacie Sousse')
  },
  'pharm5': {
    id: 'pharm5',
    name: 'Pharmacie Sfax',
    address: '200 Avenue Hedi Chaker, Sfax',
    phone: '+216 74 567 890',
    rating: 4.6,
    medicines: generateUniqueMedicineDatabase('pharm5', 'Pharmacie Sfax')
  },
  'pharm6': {
    id: 'pharm6',
    name: 'Pharmacie Bizerte',
    address: '33 Rue Mongi Slim, Bizerte',
    phone: '+216 72 678 901',
    rating: 4.4,
    medicines: generateUniqueMedicineDatabase('pharm6', 'Pharmacie Bizerte')
  },
  'pharm7': {
    id: 'pharm7',
    name: 'Pharmacie Gabès',
    address: '88 Avenue Abdelkader El Ghazzi, Gabès',
    phone: '+216 75 789 012',
    rating: 4.1,
    medicines: generateUniqueMedicineDatabase('pharm7', 'Pharmacie Gabès')
  },
  'pharm8': {
    id: 'pharm8',
    name: 'Pharmacie Nabeul',
    address: '12 Rue Habib Thameur, Nabeul',
    phone: '+216 72 123 456',
    rating: 4.7,
    medicines: generateUniqueMedicineDatabase('pharm8', 'Pharmacie Nabeul')
  }
};

// Fonction pour rechercher des médicaments dans toutes les pharmacies
export const searchMedicinesInPharmacies = async (medicineName) => {
  if (!medicineName || medicineName.trim() === '') {
    return [];
  }

  const searchTerm = medicineName.toLowerCase().trim();
  const results = [];

  try {
    // Récupérer les pharmacies réelles
    const realPharmacies = await getRealPharmacies();
    
    // Si aucune pharmacie réelle n'est trouvée, utiliser le fallback
    const pharmacies = realPharmacies.length > 0 ? realPharmacies : Object.values(fallbackPharmacyDatabase);

    // Parcourir toutes les pharmacies
    pharmacies.forEach(pharmacy => {
      // Rechercher dans les médicaments de chaque pharmacie
      pharmacy.medicines.forEach(medicine => {
        if (medicine.name.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `${pharmacy.id}-${medicine.id}`,
            medicine: {
              _id: medicine.id.toString(),
              name: medicine.name,
              description: `Médicament disponible à ${pharmacy.name}`,
              price: medicine.price
            },
            pharmacy: {
              _id: pharmacy.id,
              name: pharmacy.name,
              address: pharmacy.address,
              phone: pharmacy.phone,
              rating: pharmacy.rating,
              distance: Math.random() * 5 + 0.5 // Distance simulée
            },
            availableQty: medicine.stock,
            price: medicine.price,
            stock: medicine.status
          });
        }
      });
    });

    // Trier par pertinence (nom exact en premier, puis par prix)
    return results.sort((a, b) => {
      const aExact = a.medicine.name.toLowerCase() === searchTerm;
      const bExact = b.medicine.name.toLowerCase() === searchTerm;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.price - b.price;
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
};

// Fonction pour obtenir les détails d'une pharmacie
export const getPharmacyById = async (pharmacyId) => {
  try {
    const realPharmacies = await getRealPharmacies();
    const pharmacy = realPharmacies.find(p => p.id === pharmacyId);
    
    if (pharmacy) return pharmacy;
    
    // Fallback sur les données simulées
    return fallbackPharmacyDatabase[pharmacyId] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la pharmacie:', error);
    return fallbackPharmacyDatabase[pharmacyId] || null;
  }
};

// Fonction pour obtenir toutes les pharmacies
export const getAllPharmacies = async () => {
  try {
    const realPharmacies = await getRealPharmacies();
    return realPharmacies.length > 0 ? realPharmacies : Object.values(fallbackPharmacyDatabase);
  } catch (error) {
    console.error('Erreur lors de la récupération des pharmacies:', error);
    return Object.values(fallbackPharmacyDatabase);
  }
};

// Fonction pour obtenir les médicaments d'une pharmacie spécifique
export const getPharmacyMedicines = async (pharmacyId) => {
  try {
    const pharmacy = await getPharmacyById(pharmacyId);
    return pharmacy ? pharmacy.medicines : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    return [];
  }
};

// Fonction pour créer une nouvelle pharmacie
export const createPharmacy = async (pharmacyData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:5000/api/comptes', {
      ...pharmacyData,
      role: 'pharmacist'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      return {
        success: true,
        pharmacy: response.data.compte
      };
    } else {
      return {
        success: false,
        error: response.data.msg || 'Erreur lors de la création'
      };
    }
  } catch (error) {
    console.error('Erreur lors de la création de la pharmacie:', error);
    return {
      success: false,
      error: error.response?.data?.msg || 'Erreur serveur'
    };
  }
};

// Fonction pour créer plusieurs pharmacies (pour l'initialisation)
export const createMultiplePharmacies = async () => {
  const pharmaciesData = [
    {
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      email: 'ahmed.benali@pharmacie.tn',
      password: 'password123',
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
      pharmacyName: 'Pharmacie Nabeul',
      address: '12 Rue Habib Thameur, Nabeul',
      phone: '+216 72 123 456',
      rating: 4.7,
      ordersCount: 201,
      deliveryTime: '20 min',
      isConnected: true
    }
  ];

  const results = [];
  
  for (const pharmacyData of pharmaciesData) {
    try {
      const result = await createPharmacy(pharmacyData);
      results.push({
        name: pharmacyData.pharmacyName,
        ...result
      });
      
      // Attendre un peu entre chaque création
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        name: pharmacyData.pharmacyName,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};
