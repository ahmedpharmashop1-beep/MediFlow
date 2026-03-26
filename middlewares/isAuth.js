const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
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

module.exports = async function isAuth(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('isAuth: raw token received:', token);
    if (!token) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: missing token' }] });
    }


    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Extract ID and role from token (payload.user.id or payload.id)
    const userId = decoded.user ? decoded.user.id : decoded.id;
    const role = decoded.user ? decoded.user.role : decoded.role;
    
    let user = null;
    if (role && models[role]) {
      user = await models[role].findById(userId).select('-password');
    }

    if (!user) {
      // Fallback search in all collections
      for (const Model of Object.values(models)) {
        user = await Model.findById(userId).select('-password');
        if (user) break;
      }
    }

    if (!user) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: user not found' }] });
    }

    req.compte = user;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).send({ errors: [{ msg: 'Token no longer valid' }] });
  }
};
