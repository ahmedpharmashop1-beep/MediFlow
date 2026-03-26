const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../Model/Patient');
const Doctor = require('../Model/Doctor');
const Pharmacist = require('../Model/Pharmacist');
const CnamAdmin = require('../Model/CnamAdmin');
const Hospital = require('../Model/Hospital');
// Migration complete: Compte removed

const models = {
  patient: Patient,
  doctor: Doctor,
  pharmacist: Pharmacist,
  cnam_admin: CnamAdmin,
  hospital: Hospital
};

const getAllModels = () => Object.values(models);

// Login route for all user types
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Veuillez fournir email et mot de passe' });
    }

    // Find user in ANY collection
    let user = null;
    for (const Model of getAllModels()) {
      user = await Model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Verify token route
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'Token non fourni' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.user ? decoded.user.id : decoded.id;
    const role = decoded.user ? decoded.user.role : decoded.role;

    // Use role to find user faster, fallback to all collections
    let user = null;
    if (role && models[role]) {
      user = await models[role].findById(userId).select('-password');
    }

    if (!user) {
      for (const Model of getAllModels()) {
        user = await Model.findById(userId).select('-password');
        if (user) break;
      }
    }

    if (!user) {
      return res.status(401).json({ msg: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name || `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
});

module.exports = router;
