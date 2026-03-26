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

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ msg: 'Veuillez fournir email et mot de passe' });
    }

    // Find user in ANY collection
    let user = null;
    let foundIn = null;
    
    for (const [role, Model] of Object.entries(models)) {
      console.log(`🔍 Searching in ${role} collection...`);
      user = await Model.findOne({ email });
      if (user) {
        foundIn = role;
        console.log(`✅ User found in ${role}:`, { 
          id: user._id, 
          email: user.email, 
          role: user.role,
          hasPassword: !!user.password 
        });
        break;
      }
    }

    if (!user) {
      console.log('❌ User not found in any collection');
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Check password
    console.log('🔑 Checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);
    
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

    console.log('🎫 Creating JWT token for role:', user.role);

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('❌ JWT signing error:', err);
          throw err;
        }
        
        const response = {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role
          }
        };
        
        console.log('✅ Login successful:', { 
          role: response.user.role,
          email: response.user.email,
          hasToken: !!token
        });
        
        res.json(response);
      }
    );
  } catch (error) {
    console.error('💥 Login error:', error);
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
