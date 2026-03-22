const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../Model/patient');
const Pharmacist = require('../Model/Pharmacist');
const Doctor = require('../Model/Doctor');
const CnamAdmin = require('../Model/CnamAdmin');

// Login route for all user types
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Veuillez fournir email et mot de passe' });
    }

    // Check all user collections
    let user = null;
    let role = null;

    // Check patient
    user = await Patient.findOne({ email });
    if (user) role = 'patient';

    // Check pharmacist
    if (!user) {
      user = await Pharmacist.findOne({ email });
      if (user) role = 'pharmacist';
    }

    // Check doctor
    if (!user) {
      user = await Doctor.findOne({ email });
      if (user) role = 'doctor';
    }

    // Check CNAM admin
    if (!user) {
      user = await CnamAdmin.findOne({ email });
      if (user) role = 'cnam_admin';
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
        role: role
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
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: role
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
    
    // Find user based on role
    let user = null;
    
    switch (decoded.user.role) {
      case 'patient':
        user = await Patient.findById(decoded.user.id).select('-password');
        break;
      case 'pharmacist':
        user = await Pharmacist.findById(decoded.user.id).select('-password');
        break;
      case 'doctor':
        user = await Doctor.findById(decoded.user.id).select('-password');
        break;
      case 'cnam_admin':
        user = await CnamAdmin.findById(decoded.user.id).select('-password');
        break;
    }

    if (!user) {
      return res.status(401).json({ msg: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name || `${user.firstName} ${user.lastName}`,
        role: decoded.user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
});

module.exports = router;
