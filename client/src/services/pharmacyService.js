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

// Base de médicaments unique pour chaque pharmacie - MISE À JOUR IMMÉDIATE - VERSION 3.0
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
    { name: 'Zithromax', category: 'Antibiotique', price: 18.90, description: 'Azithromycine 250mg', stock: 28, status: 'disponible' },
    { name: 'Klacid', category: 'Antibiotique', price: 22.40, description: 'Clarithromycine 500mg', stock: 19, status: 'disponible' },
    { name: 'Tavanic', category: 'Antibiotique', price: 28.70, description: 'Lévofloxacine 500mg', stock: 11, status: 'stock_faible' },
    { name: 'Ciflox', category: 'Antibiotique', price: 15.30, description: 'Ciprofloxacine 500mg', stock: 34, status: 'disponible' },
    { name: 'Keflex', category: 'Antibiotique', price: 9.80, description: 'Céphalexine 500mg', stock: 52, status: 'disponible' },
    { name: 'Garamycin', category: 'Antibiotique', price: 0, status: 'rupture', description: 'Gentamicine 80mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Vancocin', category: 'Antibiotique', price: 41.50, description: 'Vancomycine 1g', stock: 6, status: 'stock_faible' },
    { name: 'Merrem', category: 'Antibiotique', price: 48.90, description: 'Méropénème 1g', stock: 2, status: 'stock_faible' }
  ],
  pharm3: [
    { name: 'Coumadine', category: 'Anticoagulant', price: 12.30, description: 'Warfarine 5mg', stock: 38, status: 'disponible' },
    { name: 'Héparine', category: 'Anticoagulant', price: 18.70, description: 'Héparine 5000UI', stock: 41, status: 'disponible' },
    { name: 'Lovenox', category: 'Anticoagulant', price: 21.90, description: 'Enoxaparine 40mg', stock: 47, status: 'disponible' },
    { name: 'Plavix', category: 'Antiagrégant', price: 27.80, description: 'Clopidogrel 75mg', stock: 23, status: 'disponible' },
    { name: 'Efient', category: 'Antiagrégant', price: 36.40, description: 'Prasugrel 10mg', stock: 12, status: 'stock_faible' },
    { name: 'Brilique', category: 'Antiagrégant', price: 0, status: 'rupture', description: 'Ticagrelor 90mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Zyloric', category: 'Goutte', price: 13.20, description: 'Allopurinol 300mg', stock: 25, status: 'disponible' },
    { name: 'Colchicine', category: 'Goutte', price: 9.70, description: 'Colchicine 0.5mg', stock: 15, status: 'disponible' }
  ],
  pharm4: [
    { name: 'Lasilix', category: 'Diurétique', price: 6.90, description: 'Furosémide 40mg', stock: 58, status: 'disponible' },
    { name: 'Esidrex', category: 'Diurétique', price: 5.40, description: 'Hydrochlorothiazide 25mg', stock: 42, status: 'disponible' },
    { name: 'Aldactone', category: 'Diurétique', price: 8.30, description: 'Spironolactone 25mg', stock: 19, status: 'disponible' },
    { name: 'Cordarone', category: 'Antiarythmique', price: 31.70, description: 'Amiodarone 200mg', stock: 7, status: 'stock_faible' },
    { name: 'Multaq', category: 'Antiarythmique', price: 0, status: 'rupture', description: 'Dronédarone 400mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Sotalex', category: 'Antiarythmique', price: 14.90, description: 'Sotalol 80mg', stock: 16, status: 'disponible' },
    { name: 'Tildiem', category: 'Anticalcique', price: 18.80, description: 'Diltiazem 60mg', stock: 29, status: 'disponible' },
    { name: 'Isoptine', category: 'Anticalcique', price: 16.70, description: 'Vérapamil 80mg', stock: 37, status: 'disponible' }
  ],
  pharm5: [
    { name: 'Triflucan', category: 'Antifongique', price: 16.80, description: 'Fluconazole 150mg', stock: 31, status: 'disponible' },
    { name: 'Sporanox', category: 'Antifongique', price: 21.70, description: 'Itraconazole 100mg', stock: 13, status: 'stock_faible' },
    { name: 'Vfend', category: 'Antifongique', price: 0, status: 'rupture', description: 'Voriconazole 200mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Fungizone', category: 'Antifongique', price: 39.80, description: 'Amphotéricine B 50mg', stock: 9, status: 'stock_faible' },
    { name: 'Cancidas', category: 'Antifongique', price: 52.70, description: 'Caspofungine 70mg', stock: 5, status: 'stock_faible' },
    { name: 'Lamisil', category: 'Antifongique', price: 14.40, description: 'Terbinafine 250mg', stock: 38, status: 'disponible' },
    { name: 'Travogen', category: 'Antifongique', price: 9.90, description: 'Clotrimazole 1%', stock: 45, status: 'disponible' }
  ],
  pharm6: [
    { name: 'Zovirax', category: 'Antiviral', price: 25.90, description: 'Acyclovir 400mg', stock: 41, status: 'disponible' },
    { name: 'Valtrex', category: 'Antiviral', price: 38.70, description: 'Valacyclovir 500mg', stock: 19, status: 'disponible' },
    { name: 'Famvir', category: 'Antiviral', price: 0, status: 'rupture', description: 'Famciclovir 250mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Cymevene', category: 'Antiviral', price: 46.80, description: 'Ganciclovir 500mg', stock: 12, status: 'stock_faible' },
    { name: 'Rebetol', category: 'Antiviral', price: 20.50, description: 'Ribavirine 200mg', stock: 14, status: 'stock_faible' },
    { name: 'Epivir', category: 'Antiviral', price: 16.70, description: 'Lamivudine 150mg', stock: 32, status: 'disponible' },
    { name: 'Viread', category: 'Antiviral', price: 34.20, description: 'Ténofovir 300mg', stock: 8, status: 'stock_faible' }
  ],
  pharm7: [
    { name: 'Fentanyl', category: 'Antalgique fort', price: 42.80, description: 'Fentanyl 25mcg', stock: 5, status: 'stock_faible' },
    { name: 'Actiskenan', category: 'Antalgique fort', price: 31.90, description: 'Morphine 10mg', stock: 3, status: 'stock_faible' },
    { name: 'Oxycontin', category: 'Antalgique fort', price: 0, status: 'rupture', description: 'Oxycodone 10mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Dilaudid', category: 'Antalgique fort', price: 47.30, description: 'Hydromorphone 4mg', stock: 6, status: 'stock_faible' },
    { name: 'Méthadone', category: 'Traitement dépendance', price: 18.80, description: 'Méthadone 10mg', stock: 4, status: 'stock_faible' },
    { name: 'Subutex', category: 'Traitement dépendance', price: 32.50, description: 'Buprénorphine 8mg', stock: 7, status: 'stock_faible' }
  ],
  pharm8: [
    { name: 'Prozac', category: 'Antidépresseur', price: 22.80, description: 'Fluoxétine 20mg', stock: 9, status: 'stock_faible' },
    { name: 'Zoloft', category: 'Antidépresseur', price: 29.70, description: 'Sertraline 50mg', stock: 36, status: 'disponible' },
    { name: 'Desyrel', category: 'Antidépresseur', price: 20.50, description: 'Trazodone 50mg', stock: 21, status: 'disponible' },
    { name: 'Seroquel', category: 'Antipsychotique', price: 0, status: 'rupture', description: 'Quétapine 25mg', stock: 0 }, // SEULE RUPTURE
    { name: 'Temesta', category: 'Anxiolytique', price: 21.40, description: 'Lorazépam 1mg', stock: 14, status: 'disponible' },
    { name: 'Neurontin', category: 'Antiépileptique', price: 26.40, description: 'Gabapentine 300mg', stock: 16, status: 'disponible' },
    { name: 'Lyrica', category: 'Antiépileptique', price: 36.60, description: 'Pregabaline 75mg', stock: 11, status: 'stock_faible' }
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

  console.log(`🔍 Recherche de "${medicineName}" dans toutes les pharmacies...`);

  try {
    // Utiliser directement nos bases de données statiques avec les vrais noms de pharmacies
    const pharmacyData = [
      { id: '69c3ce402b562707c76e8adc', name: 'Pharmacie du Centre', address: '123 Rue de la Paix, Tunis', phone: '+216 71 123 456', rating: 4.5 },
      { id: '69c3ce402b562707c76e8add', name: 'Pharmacie El Menzah', address: '45 Avenue Habib Bourguiba, El Menzah, Tunis', phone: '+216 71 789 012', rating: 4.2 },
      { id: '69c3ce402b562707c76e8ade', name: 'Pharmacie La Marsa', address: '78 Rue Gamal Abdel Nasser, La Marsa, Tunis', phone: '+216 71 345 678', rating: 4.8 },
      { id: '69c3ce402b562707c76e8adf', name: 'Pharmacie Sousse', address: '15 Avenue Farhat Hached, Sousse', phone: '+216 73 234 567', rating: 4.3 },
      { id: '69c3ce402b562707c76e8ae0', name: 'Pharmacie Sfax', address: '200 Avenue Hedi Chaker, Sfax', phone: '+216 74 567 890', rating: 4.6 },
      { id: '69c3ce402b562707c76e8ae1', name: 'Pharmacie Bizerte', address: '33 Rue Mongi Slim, Bizerte', phone: '+216 72 678 901', rating: 4.4 },
      { id: '69c3ce402b562707c76e8ae2', name: 'Pharmacie Gabès', address: '88 Avenue Abdelkader El Ghazzi, Gabès', phone: '+216 75 789 012', rating: 4.1 },
      { id: '69c3ce402b562707c76e8ae3', name: 'Pharmacie Nabeul', address: '12 Rue Habib Thameur, Nabeul', phone: '+216 72 123 456', rating: 4.7 }
    ];

    // Mapper les IDs vers nos bases de données
    const idMapping = {
      '69c3ce402b562707c76e8adc': 'pharm1',
      '69c3ce402b562707c76e8add': 'pharm2', 
      '69c3ce402b562707c76e8ade': 'pharm3',
      '69c3ce402b562707c76e8adf': 'pharm4',
      '69c3ce402b562707c76e8ae0': 'pharm5',
      '69c3ce402b562707c76e8ae1': 'pharm6',
      '69c3ce402b562707c76e8ae2': 'pharm7',
      '69c3ce402b562707c76e8ae3': 'pharm8'
    };

    // Parcourir toutes les pharmacies avec leurs vraies bases de données
    pharmacyData.forEach(pharmacy => {
      const mappedId = idMapping[pharmacy.id];
      if (mappedId) {
        const medicines = generateUniqueMedicineDatabase(mappedId, pharmacy.name);
        console.log(`📊 ${pharmacy.name}: ${medicines.length} médicaments trouvés`);
        
        // Rechercher dans les médicaments de cette pharmacie
        medicines.forEach(medicine => {
          if (medicine.name.toLowerCase().includes(searchTerm)) {
            console.log(`✅ Trouvé: ${medicine.name} dans ${pharmacy.name} (stock: ${medicine.stock}, prix: ${medicine.price}DT)`);
            results.push({
              id: `${pharmacy.id}-${medicine.id || Math.random().toString(36).substr(2, 9)}`,
              medicine: {
                _id: medicine.id || Math.random().toString(36).substr(2, 9),
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
      }
    });

    console.log(`🎯 Résultat final: ${results.length} médicaments trouvés`);
    return results;

  } catch (error) {
    console.error('Erreur lors de la recherche des médicaments:', error);
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

// Exporter la fonction pour l'utiliser dans d'autres composants
export { generateUniqueMedicineDatabase };
