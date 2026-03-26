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

// Admin CRUD routes
router.get('/', [isAuth, isAdmin], getAllComptes);
router.get('/:id', [isAuth, isAdmin], getCompteById);
router.put('/:id', [isAuth, isAdmin], updateCompte);
router.delete('/:id', [isAuth, isAdmin], deleteCompte);

// Route pour créer plusieurs pharmacies
router.post('/create-pharmacies', [isAuth, isAdmin], createMultiplePharmacies);

module.exports = router;

