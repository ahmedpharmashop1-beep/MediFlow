const axios = require('axios');

const testMedicinesSearch = async () => {
  const medicinesToTest = ['Doliprane', 'Aspirine', 'Vitamine C'];
  
  console.log('🔍 Test de recherche des médicaments ajoutés...\n');
  
  for (const medicineName of medicinesToTest) {
    try {
      console.log(`🔍 Recherche de: ${medicineName}`);
      
      const response = await axios.get(`http://localhost:5000/api/pharmacy/medicines/search/${medicineName}`);
      
      if (response.data && response.data.length > 0) {
        console.log(`✅ ${medicineName} trouvé dans ${response.data.length} pharmacie(s):`);
        
        response.data.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.pharmacy.name} - ${result.price}DT - Stock: ${result.availableQty || result.stock || 'N/A'}`);
        });
      } else {
        console.log(`❌ ${medicineName} non trouvé`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche de ${medicineName}:`, error.message);
    }
  }
  
  console.log('🏁 Test de recherche terminé');
};

const main = async () => {
  await testMedicinesSearch();
};

main().catch(console.error);
