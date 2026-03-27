const axios = require('axios');

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

async function updateCoordinatesViaAPI() {
  try {
    console.log('🔄 Mise à jour des coordonnées GPS via API...\n');

    // D'abord récupérer tous les hôpitaux existants
    const response = await axios.get('http://localhost:5000/api/hospital');
    const hospitals = response.data.hospitals;

    console.log(`📋 ${hospitals.length} hôpitaux trouvés dans la base de données\n`);

    // Mettre à jour chaque hôpital
    for (const hospital of hospitals) {
      const coords = preciseCoordinates[hospital.name];
      
      if (coords) {
        try {
          const updateResponse = await axios.put(`http://localhost:5000/api/hospital/${hospital._id}`, {
            lat: coords.lat,
            lng: coords.lng,
            address: coords.address
          });

          console.log(`✅ ${hospital.name} mis à jour avec succès:`);
          console.log(`   📍 Lat: ${coords.lat}, Lng: ${coords.lng}`);
          console.log(`   📍 Adresse: ${coords.address}`);
          console.log('---');
        } catch (updateError) {
          console.log(`❌ Erreur lors de la mise à jour de ${hospital.name}:`, updateError.message);
        }
      } else {
        console.log(`⚠️ ${hospital.name} - Coordonnées non trouvées dans la liste`);
      }
    }

    console.log('\n🎉 Mise à jour des coordonnées GPS terminée!');
    console.log('\n📍 Coordonnées GPS précises appliquées:');
    console.log('• Hôpital Charles Nicolle: 36.806494, 10.181493');
    console.log('• Hôpital Rabta: 36.842842, 10.166719');
    console.log('• Hôpital Habib Thameur: 36.801749, 10.170834');
    console.log('• Hôpital Mongi Slim: 36.879559, 10.319832');
    console.log('• Hôpital Aziza Othmana: 36.799372, 10.173895');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour via API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Assurez-vous que le serveur backend est démarré (node server.js)');
    }
  }
}

updateCoordinatesViaAPI();
