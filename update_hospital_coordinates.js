const mongoose = require('mongoose');
require('dotenv').config();
const Hospital = require('./Model/Hospital');

// Coordonnées GPS précises pour les hôpitaux tunisiens
const preciseCoordinates = {
  'Hôpital Charles Nicolle': {
    lat: 36.806494,
    lng: 10.181493,
    address: 'Boulevard 9 Avril 1938, Tunis 1006, Tunisie'
  },
  'Hôpital Rabta': {
    lat: 36.842842,
    lng: 10.166719,
    address: 'Rue Jebbari, El Menzah, Tunis 1004, Tunisie'
  },
  'Hôpital Habib Thameur': {
    lat: 36.801749,
    lng: 10.170834,
    address: 'Place du 9 Avril 1938, Tunis 1002, Tunisie'
  },
  'Hôpital Mongi Slim': {
    lat: 36.879559,
    lng: 10.319832,
    address: 'Avenue Kheireddine, La Marsa 2078, Tunisie'
  },
  'Hôpital Aziza Othmana': {
    lat: 36.799372,
    lng: 10.173895,
    address: 'Bab Menara, Médina, Tunis 1008, Tunisie'
  }
};

async function updateHospitalCoordinates() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.DB_URI);
    console.log('Connecté à MongoDB');

    // Mettre à jour chaque hôpital avec ses coordonnées précises
    for (const [hospitalName, coords] of Object.entries(preciseCoordinates)) {
      const result = await Hospital.updateOne(
        { name: hospitalName },
        { 
          $set: {
            lat: coords.lat,
            lng: coords.lng,
            address: coords.address
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${hospitalName} mis à jour avec les coordonnées précises:`);
        console.log(`   📍 Lat: ${coords.lat}, Lng: ${coords.lng}`);
        console.log(`   📍 Adresse: ${coords.address}`);
      } else if (result.matchedCount > 0) {
        console.log(`ℹ️ ${hospitalName} déjà à jour ou non trouvé`);
      } else {
        console.log(`❌ ${hospitalName} non trouvé dans la base de données`);
      }
      console.log('---');
    }

    console.log('🎉 Mise à jour des coordonnées GPS terminée!');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion à la base de données fermée');
  }
}

updateHospitalCoordinates();
