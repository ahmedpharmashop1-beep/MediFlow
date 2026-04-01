const express = require('express');
const Pharmacy = require('../Model/Pharmacy');
const Medicine = require('../Model/Medicine');
const MedicineStock = require('../Model/MedicineStock');
const MedicationReservation = require('../Model/MedicationReservation');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

const getPharmacyForCompte = async (compte) => {
  if (!compte) return null;
  if (compte.role === 'pharmacist') {
    let pharmacy = await Pharmacy.findOne({ name: compte.pharmacyName });
    if (!pharmacy) {
      pharmacy = await Pharmacy.create({
        name: compte.pharmacyName || 'Pharmacy',
        address: compte.address || '',
        phone: compte.phone || '',
        lat: 0,
        lng: 0,
      });
    }
    return pharmacy;
  }
  if (compte.role === 'cnam_admin' || compte.isAdmin) return null;
  return null;
};

router.get('/all', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    return res.status(200).send({ pharmacies });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacies', error });
  }
});

// Get pharmacies by hospital ID
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const pharmacies = await Pharmacy.find({ 
      hospitalId: hospitalId,
      isHospitalPharmacy: true 
    }).sort({ createdAt: -1 });
    
    return res.status(200).send({ 
      pharmacies,
      message: pharmacies.length === 0 ? 'No internal pharmacies found for this hospital' : null
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch hospital pharmacies', error });
  }
});

// Get pharmacies by type (private - jour, nuit, garde)
router.get('/type/:pharmacyType', async (req, res) => {
  try {
    const { pharmacyType } = req.params;
    
    // Validate pharmacy type
    if (!['jour', 'nuit', 'garde'].includes(pharmacyType)) {
      return res.status(400).send({ msg: 'Invalid pharmacy type. Must be: jour, nuit, or garde' });
    }
    
    const pharmacies = await Pharmacy.find({ 
      pharmacyType: pharmacyType,
      isHospitalPharmacy: false // Get private pharmacies only
    }).sort({ rating: -1, createdAt: -1 });
    
    return res.status(200).send({ 
      pharmacies,
      type: pharmacyType,
      count: pharmacies.length
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacies by type', error });
  }
});

router.get('/search-medicines', async (req, res) => {
  try {
    const { limit = 100, search, pharmacyType } = req.query;
    
    // Construire la requête pour les pharmacies privées
    let pharmacyQuery = {
      isHospitalPharmacy: false // Exclure les pharmacies hospitalières
    };
    
    // Filtrer par type de pharmacie si spécifié
    if (pharmacyType && pharmacyType !== 'all') {
      pharmacyQuery.pharmacyType = pharmacyType;
    }
    
    // Récupérer les pharmacies privées correspondantes
    const pharmacies = await Pharmacy.find(pharmacyQuery).select('_id');
    const pharmacyIds = pharmacies.map(p => p._id);
    
    // Construire la requête pour les stocks de médicaments
    let stockQuery = {};
    
    // Filtrer par pharmacies
    if (pharmacyIds.length > 0) {
      stockQuery.pharmacyId = { $in: pharmacyIds };
    } else {
      // Aucune pharmacy trouvée
      return res.status(200).send({ medicines: [] });
    }
    
    // Si une recherche est spécifiée, filtrer par nom de médicament
    if (search) {
      const medicines = await Medicine.find({ 
        name: { $regex: search, $options: 'i' } 
      }).select('_id');
      
      const medicineIds = medicines.map(m => m._id);
      
      if (medicineIds.length > 0) {
        stockQuery.medicineId = { $in: medicineIds };
      } else {
        // Aucun médicament trouvé
        return res.status(200).send({ medicines: [] });
      }
    }
    
    // Récupérer les stocks de médicaments
    const stocks = await MedicineStock.find(stockQuery)
      .populate('medicineId')
      .populate('pharmacyId')
      .limit(parseInt(limit));
    
    // Formater les résultats pour le frontend
    const medicines = stocks.map((s) => ({
      _id: s._id,
      medicine: {
        _id: s.medicineId?._id,
        name: s.medicineId?.name || 'Sans nom',
        commercialName: s.medicineId?.name || 'Sans nom',
        description: s.description || 'Médicament sans description'
      },
      pharmacy: {
        _id: s.pharmacyId?._id,
        name: s.pharmacyId?.name || 'Pharmacie sans nom',
        address: s.pharmacyId?.address || 'Adresse non disponible',
        phone: s.pharmacyId?.phone || 'Téléphone non disponible',
        rating: s.pharmacyId?.rating || 4.5,
        pharmacyType: s.pharmacyId?.pharmacyType || 'jour',
        // Ajouter une distance simulée pour le tri
        distance: Math.random() * 10 // Distance simulée entre 0-10km
      },
      stock: s.stockCount,
      reservedStock: s.reservedCount,
      availableStock: s.stockCount - s.reservedCount,
      price: s.price,
      description: s.description,
      category: s.category,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));
    
    return res.status(200).send({ medicines });
  } catch (error) {
    console.error('Error in search-medicines:', error);
    return res.status(400).send({ msg: 'Cannot search medicines', error });
  }
});

router.get('/medicines', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    let stockQuery = {};

    if (compte.role === 'pharmacist') {
      const pharmacy = await getPharmacyForCompte(compte);
      if (!pharmacy) return res.status(404).send({ msg: 'Pharmacy profile not found' });
      stockQuery = { pharmacyId: pharmacy._id };
    } else if (compte.role === 'cnam_admin' || compte.isAdmin) {
      // admin can see all
      stockQuery = {};
    } else {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const stocks = await MedicineStock.find(stockQuery)
      .populate('medicineId')
      .populate('pharmacyId');

    const medicines = stocks.map((s) => ({
      _id: s._id,
      medicineId: s.medicineId?._id,
      name: s.medicineId?.name || s.description || 'Sans nom',
      dosage: s.medicineId?.dosage || '',
      form: s.medicineId?.form || '',
      description: s.description || '',
      category: s.category || '',
      price: s.price || 0,
      stock: s.stockCount,
      reservedCount: s.reservedCount,
      pharmacy: s.pharmacyId ? {
        _id: s.pharmacyId._id,
        name: s.pharmacyId.name,
        address: s.pharmacyId.address,
      } : null,
    }));

    return res.status(200).send({ medicines });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacy medicines', error });
  }
});

router.post('/medicines', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Unauthorized' });
    }

    const { name, description = '', price = 0, stock = 0, category = '', dosage = '', form = '' } = req.body;
    if (!name) return res.status(400).send({ msg: 'Missing field: name' });

    let medicine = await Medicine.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (!medicine) {
      medicine = await Medicine.create({ name: name.trim(), dosage, form });
    } else {
      if (dosage || form) {
        medicine.dosage = dosage || medicine.dosage;
        medicine.form = form || medicine.form;
        await medicine.save();
      }
    }

    const pharmacy = await getPharmacyForCompte(compte);
    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const pharmacyId = pharmacy ? pharmacy._id : null;

    const existingStock = await MedicineStock.findOne({ medicineId: medicine._id, pharmacyId });
    let medicineStock;

    if (existingStock) {
      existingStock.stockCount = Number(stock);
      existingStock.price = Number(price);
      existingStock.description = description;
      existingStock.category = category;
      await existingStock.save();
      medicineStock = existingStock;
    } else {
      medicineStock = await MedicineStock.create({
        medicineId: medicine._id,
        pharmacyId,
        stockCount: Number(stock),
        reservedCount: 0,
        price: Number(price),
        description,
        category,
      });
    }

    return res.status(201).send({ msg: 'Medicine saved', medicine: {
      _id: medicineStock._id,
      medicineId: medicine._id,
      name: medicine.name,
      dosage: medicine.dosage,
      form: medicine.form,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
    }});
  } catch (error) {
    return res.status(400).send({ msg: 'Could not save medicine', error });
  }
});

router.put('/medicines/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const { name, description, price, stock, category, dosage, form } = req.body;

    const pharmacy = await getPharmacyForCompte(compte);
    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const filters = { _id: id };
    if (pharmacy) filters.pharmacyId = pharmacy._id;

    const medicineStock = await MedicineStock.findOne(filters);
    if (!medicineStock) return res.status(404).send({ msg: 'Pharmacy medicine not found' });

    if (stock !== undefined) medicineStock.stockCount = Number(stock);
    if (price !== undefined) medicineStock.price = Number(price);
    if (description !== undefined) medicineStock.description = description;
    if (category !== undefined) medicineStock.category = category;

    await medicineStock.save();

    if (name || dosage || form) {
      const medicine = await Medicine.findById(medicineStock.medicineId);
      if (medicine) {
        if (name) medicine.name = name;
        if (dosage) medicine.dosage = dosage;
        if (form) medicine.form = form;
        await medicine.save();
      }
    }

    return res.status(200).send({ msg: 'Pharmacy medicine updated', medicineStock });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot update pharmacy medicine', error });
  }
});

router.delete('/medicines/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const pharmacy = await getPharmacyForCompte(compte);

    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const filters = { _id: id };
    if (pharmacy) filters.pharmacyId = pharmacy._id;

    const medicineStock = await MedicineStock.findOneAndDelete(filters);
    if (!medicineStock) return res.status(404).send({ msg: 'Pharmacy medicine not found' });

    return res.status(200).send({ msg: 'Pharmacy medicine deleted' });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot delete pharmacy medicine', error });
  }
});

router.get('/reservations', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const pharmacy = await getPharmacyForCompte(compte);
    const query = {};

    if (pharmacy) query.pharmacyId = pharmacy._id;
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const reservations = await MedicationReservation.find(query)
      .populate('patientId', 'firstName lastName email')
      .populate('medicineId', 'name')
      .populate('pharmacyId', 'name address');

    const normalized = reservations.map((r) => ({
      _id: r._id,
      patient: r.patientId ? {
        _id: r.patientId._id,
        name: `${r.patientId.firstName || ''} ${r.patientId.lastName || ''}`.trim() || r.patientId.email,
      } : null,
      medicine: r.medicineId ? { _id: r.medicineId._id, name: r.medicineId.name } : null,
      pharmacy: r.pharmacyId ? { _id: r.pharmacyId._id, name: r.pharmacyId.name } : null,
      quantity: r.quantity,
      status: r.status,
      createdAt: r.createdAt,
    }));

    return res.status(200).send({ reservations: normalized });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch reservations', error });
  }
});

router.put('/reservations/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'collected', 'expired'].includes(status)) {
      return res.status(400).send({ msg: 'Invalid status' });
    }

    const pharmacy = await getPharmacyForCompte(compte);
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const query = { _id: id };
    if (pharmacy) query.pharmacyId = pharmacy._id;

    const reservation = await MedicationReservation.findOne(query);
    if (!reservation) return res.status(404).send({ msg: 'Reservation not found' });

    if (reservation.status === status) return res.status(200).send({ msg: 'No change', reservation });

    const previousStatus = reservation.status;
    reservation.status = status;
    if (status === 'cancelled') reservation.cancelledAt = new Date();
    if (status === 'collected') reservation.collectedAt = new Date();
    await reservation.save();

    // Ajuster stock réservé si transition from reserved
    if (previousStatus === 'reserved' && ['cancelled', 'confirmed', 'collected', 'expired'].includes(status)) {
      await MedicineStock.findOneAndUpdate(
        { medicineId: reservation.medicineId, pharmacyId: reservation.pharmacyId },
        { $inc: { reservedCount: -reservation.quantity }}
      );
    }

    return res.status(200).send({ msg: 'Reservation status updated', reservation });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot update reservation', error });
  }
});

// Endpoint temporaire pour créer les stocks de médicaments
// Endpoint pour créer EXPLICITEMENT les pharmacies privées (NON hospitalières)
router.post('/create-private-pharmacies', async (req, res) => {
  try {
    console.log('\n=== CRÉATION DES PHARMACIES PRIVÉES ===');
    
    // 1. Supprimer toutes les pharmacies privées existantes
    await Pharmacy.deleteMany({ isHospitalPharmacy: false });
    console.log('✅ Pharmacies privées supprimées');
    
    // 2. Créer un ensemble de pharmacies privées de test - Classées par type
    const privatePharmaciesData = [
      // 🌞 PHARMACIES DE JOUR (Ouvertes 8h-21h)
      { name: 'Pharmacie du Centre', address: 'Tunis Centre', phone: '71 123 456', pharmacyType: 'jour', lat: 36.8008, lng: 10.1800 },
      { name: 'Pharmacie El Menzah', address: 'El Menzah, Tunis', phone: '71 234 567', pharmacyType: 'jour', lat: 36.8428, lng: 10.2006 },
      { name: 'Pharmacie La Marsa', address: 'La Marsa, Tunis', phone: '71 345 678', pharmacyType: 'jour', lat: 36.8774, lng: 10.3146 },
      { name: 'Pharmacie Sidi Bouzid', address: 'Sidi Bouzid', phone: '71 678 901', pharmacyType: 'jour', lat: 35.0374, lng: 9.4906 },
      { name: 'Pharmacie Sousse', address: 'Sousse', phone: '73 123 456', pharmacyType: 'jour', lat: 35.8256, lng: 10.6369 },
      { name: 'Pharmacie Kairouan', address: 'Kairouan', phone: '77 123 456', pharmacyType: 'jour', lat: 35.6738, lng: 10.1009 },
      { name: 'Pharmacie Ben Arous', address: 'Ben Arous', phone: '71 789 012', pharmacyType: 'jour', lat: 36.7490, lng: 10.2360 },
      { name: 'Pharmacie Manouba', address: 'Manouba', phone: '71 890 123', pharmacyType: 'jour', lat: 36.8101, lng: 10.0909 },
      
      // 🌙 PHARMACIES DE NUIT (Ouvertes 21h-8h)
      { name: 'Pharmacie de Nuit Tunis', address: 'Tunis Nord', phone: '71 456 789', pharmacyType: 'nuit', lat: 36.7884, lng: 10.1706 },
      { name: 'Pharmacie Sfax Nuit', address: 'Sfax', phone: '74 123 456', pharmacyType: 'nuit', lat: 34.7406, lng: 10.7603 },
      { name: 'Pharmacie Bizerte Nuit', address: 'Bizerte', phone: '72 234 567', pharmacyType: 'nuit', lat: 37.2745, lng: 9.8735 },
      { name: 'Pharmacie Monastir Nuit', address: 'Monastir', phone: '73 345 678', pharmacyType: 'nuit', lat: 35.7595, lng: 10.8267 },
      
      // 🏥 PHARMACIES DE GARDE (Ouvertes uniquement week-end et jours fériés)
      { name: 'Pharmacie Carthage Garde', address: 'Carthage', phone: '71 567 890', pharmacyType: 'garde', lat: 36.8516, lng: 10.3266 },
      { name: 'Pharmacie Gafsa Garde', address: 'Gafsa', phone: '76 123 456', pharmacyType: 'garde', lat: 34.4264, lng: 8.7820 },
      { name: 'Pharmacie Tozeur Garde', address: 'Tozeur', phone: '76 456 789', pharmacyType: 'garde', lat: 33.9197, lng: 8.1353 },
      { name: 'Pharmacie Douz Garde', address: 'Douz', phone: '75 567 890', pharmacyType: 'garde', lat: 33.4654, lng: 9.0539 }
    ];
    
    console.log('\n📦 Création des pharmacies privées:');
    const createdPharmacies = [];
    for (const data of privatePharmaciesData) {
      const newPharmacy = new Pharmacy({
        ...data,
        isHospitalPharmacy: false, // ✅ IMPORTANT: Marquer comme NON-hospitalière
        hospitalId: null,           // ✅ Pas d'hôpital associé
        rating: 4.5,
        reviewCount: 10
      });
      await newPharmacy.save();
      createdPharmacies.push(newPharmacy);
      console.log(`   ✅ ${data.name} (${data.pharmacyType})`);
    }
    
    console.log(`\n✅ ${createdPharmacies.length} pharmacies privées créées avec succès`);
    console.log('   Chaque pharmacie: isHospitalPharmacy = FALSE');
    
    res.status(200).json({
      success: true,
      message: `${createdPharmacies.length} pharmacies privées créées avec succès`,
      pharmaciesCreated: createdPharmacies.length,
      pharmacies: createdPharmacies.map(p => ({
        id: p._id,
        name: p.name,
        type: p.pharmacyType,
        isPrivate: !p.isHospitalPharmacy
      }))
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint de diagnostic
router.get('/private-pharmacies-all', async (req, res) => {
  try {
    console.log('\n=== DIAGNOSTIC PHARMACIES PRIVÉES ===');
    
    // 1. Compter toutes les pharmacies
    const allPharmacies = await Pharmacy.find({});
    console.log(`Total pharmacies: ${allPharmacies.length}`);
    
    // 2. Compter les pharmacies avec isHospitalPharmacy: false
    const privatePharmacies = await Pharmacy.find({ isHospitalPharmacy: false });
    console.log(`Pharmacies privées (isHospitalPharmacy: false): ${privatePharmacies.length}`);
    
    // 3. Compter les pharmacies avec isHospitalPharmacy: true
    const hospitalPharmacies = await Pharmacy.find({ isHospitalPharmacy: true });
    console.log(`Pharmacies hospitalières (isHospitalPharmacy: true): ${hospitalPharmacies.length}`);
    
    // 4. Compter les pharmacies sans ce champ
    const undefinedPharmacies = await Pharmacy.find({ isHospitalPharmacy: { $exists: false } });
    console.log(`Pharmacies sans isHospitalPharmacy: ${undefinedPharmacies.length}`);
    
    // 5. Vérifier les stocks et leurs pharmacies
    const allStocks = await MedicineStock.find({}).populate('pharmacyId');
    console.log(`Total stocks: ${allStocks.length}`);
    
    // 6. Grouper les stocks par pharmacie
    const stocksByPharmacy = {};
    allStocks.forEach(s => {
      const phId = s.pharmacyId?._id?.toString();
      if (!stocksByPharmacy[phId]) {
        stocksByPharmacy[phId] = {
          pharmacy: s.pharmacyId?.name,
          isHospital: s.pharmacyId?.isHospitalPharmacy,
          count: 0
        };
      }
      stocksByPharmacy[phId].count++;
    });
    
    console.log('\n=== STOCKS PAR PHARMACIE ===');
    Object.values(stocksByPharmacy).forEach((item, i) => {
      const type = item.isHospital === false ? '🏪 PRIVÉE' : item.isHospital === true ? '🏥 HÔPITAL' : '❓ UNDEFINED';
      console.log(`${i+1}. ${type} ${item.pharmacy}: ${item.count} stocks`);
    });
    
    // Retourner les données filtrées correctement
    const pharmaciesWithStocks = privatePharmacies.map(p => {
      const pharmacyStocks = allStocks.filter(s => s.pharmacyId?._id?.toString() === p._id?.toString());
      return {
        pharmacyId: p._id,
        name: p.name,
        type: p.pharmacyType,
        stockCount: pharmacyStocks.length,
        stocks: pharmacyStocks.map(s => ({
          medicineName: s.medicineId?.name,
          quantity: s.stockCount
        }))
      };
    });
    
    return res.status(200).json({
      totalAllPharmacies: allPharmacies.length,
      totalPrivatePharmacies: privatePharmacies.length,
      totalHospitalPharmacies: hospitalPharmacies.length,
      totalStocks: allStocks.length,
      stocksByPrivatePharmacies: Object.values(stocksByPharmacy).filter(p => p.isHospital === false).reduce((acc, p) => acc + p.count, 0),
      pharmaciesWithStocks: pharmaciesWithStocks
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/init-stocks', async (req, res) => {
  try {
    console.log('\n=== INITIALISATION DES STOCKS POUR PHARMACIES PRIVÉES ===');
    
    // 1. Récupérer UNIQUEMENT les pharmacies privées (isHospitalPharmacy: false)
    let privatePharmacies = await Pharmacy.find({ isHospitalPharmacy: false });
    console.log(`🏪 Pharmacies privées trouvées: ${privatePharmacies.length}`);
    
    if (privatePharmacies.length === 0) {
      console.log('\n⚠️  Aucune pharmacie privée trouvée!');
      console.log('💡 SOLUTION: Appel d\'abord /create-private-pharmacies');
      return res.status(400).json({
        success: false,
        error: 'Aucune pharmacie privée trouvée. Appelez d\'abord POST /api/pharmacy/create-private-pharmacies'
      });
    }
    
    // 2. Supprimer les anciens stocks UNIQUEMENT pour les pharmacies privées
    await MedicineStock.deleteMany({ 
      pharmacyId: { $in: privatePharmacies.map(p => p._id) }
    });
    console.log('🗑️  Anciens stocks des pharmacies privées supprimés');
    
    // 3. Créer les médicaments de base
    const medicinesList = [
      'Doliprane 500mg', 'Doliprane 1000mg', 'Paracétamol 1000mg',
      'Ibuprofène 400mg', 'Amoxicilline 500mg', 'Amoxicilline 1g',
      'Augmentin 1g', 'Ventoline', 'Oméprazole 20mg',
      'Metformine 850mg', 'Lisinopril 10mg', 'Aspirine 100mg',
      'Vitamine C 500mg', 'Ciprofloxacine 500mg', 'Insuline Glargine'
    ];
    
    const medicineMap = {};
    console.log('\n💊 Médicaments:');
    for (const medName of medicinesList) {
      let medicine = await Medicine.findOne({ name: medName });
      if (!medicine) {
        medicine = new Medicine({
          name: medName,
          description: `Médicament: ${medName}`
        });
        await medicine.save();
        console.log(`   ✅ ${medName}`);
      }
      medicineMap[medName] = medicine._id;
    }
    
    // 4. Créer les stocks pour chaque pharmacie privée
    let totalCreated = 0;
    let totalRuptures = 0;
    const medicineNames = Object.keys(medicineMap);
    
    console.log('\n📦 Création des stocks par pharmacie privée:\n');
    for (const pharmacy of privatePharmacies) {
      console.log(`🏪 ${pharmacy.name} (${pharmacy.pharmacyType})`);
      
      // 4-6 médicaments différents par pharmacie
      const numMeds = 4 + Math.floor(Math.random() * 3);
      const selectedMeds = medicineNames.sort(() => 0.5 - Math.random()).slice(0, numMeds);
      
      for (let i = 0; i < selectedMeds.length; i++) {
        const medName = selectedMeds[i];
        
        // Le premier médicament a 30% de chance d'être en rupture
        const stockCount = i === 0 && Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 30) + 3;
        const price = (Math.random() * 40 + 5).toFixed(2);
        
        const newStock = new MedicineStock({
          medicineId: medicineMap[medName],
          pharmacyId: pharmacy._id,
          stockCount: stockCount,
          reservedCount: 0,
          price: price,
          description: `${medName} chez ${pharmacy.name}`,
          category: 'Médicament'
        });
        
        await newStock.save();
        totalCreated++;
        
        if (stockCount === 0) {
          totalRuptures++;
          console.log(`   ⚠️  RUPTURE: ${medName} (0 unités)`);
        } else {
          console.log(`   ✅ ${medName}: ${stockCount} unités @ ${price}DT`);
        }
      }
      console.log('');
    }
    
    console.log(`✅ INITIALISATION TERMINÉE`);
    console.log(`   📦 Total stocks créés: ${totalCreated}`);
    console.log(`   🚨 Ruptures de stock: ${totalRuptures}`);
    console.log(`   🏪 Pharmacies: ${privatePharmacies.length}`);
    
    res.status(200).json({
      success: true,
      message: `Stocks création: ${totalCreated} dont ${totalRuptures} ruptures`,
      data: {
        totalCreated,
        totalRuptures,
        pharmaciesCount: privatePharmacies.length,
        medicinesCount: Object.keys(medicineMap).length
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des stocks:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

