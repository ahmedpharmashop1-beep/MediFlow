const express = require('express');
const { register, login, getAllComptes, getCompteById, updateCompte, deleteCompte, createMultiplePharmacies } = require('../controllers/comptes');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', isAuth, (req, res) => {
  res.status(200).send(req.compte);
});

// Route publique pour récupérer les agences CNAM
router.get('/cnam-agencies', async (req, res) => {
  try {
    const CnamAdmin = require('../Model/CnamAdmin');
    const agencies = await CnamAdmin.find({}, 'name email phone officeAddress department position accessLevel'); // Sélectionner uniquement les champs nécessaires
    res.status(200).json(agencies);
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la récupération des agences CNAM', error: error.message });
  }
});

// Admin CRUD routes
router.get('/', [isAuth, isAdmin], getAllComptes);
router.get('/:id', [isAuth, isAdmin], getCompteById);
router.put('/:id', [isAuth, isAdmin], updateCompte);
router.delete('/:id', [isAuth, isAdmin], deleteCompte);

// Route pour créer plusieurs pharmacies
router.post('/create-pharmacies', [isAuth, isAdmin], createMultiplePharmacies);

module.exports = router;

