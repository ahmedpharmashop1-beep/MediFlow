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

exports.register = async (req, res) => {
  try {
    console.log('Register request received:', JSON.stringify(req.body));
    const { firstName, lastName, name, email, password, role = 'patient', ...otherData } = req.body;
    
    const Model = models[role];
    if (!Model) {
      return res.status(400).send({ errors: [{ msg: 'Invalid role' }] });
    }

    // Validation selon le rôle
    if (role === 'patient') {
      if (!firstName || !lastName) {
        return res.status(400).send({
          errors: [{ msg: 'First name and last name are required', firstName: 'required', lastName: 'required' }]
        });
      }
      if (!otherData.insuranceType || !otherData.insuranceCode) {
        return res.status(400).send({
          errors: [{ msg: 'Insurance type and unique code are required', insuranceType: 'required', insuranceCode: 'required' }]
        });
      }
    } else if (['pharmacist', 'doctor'].includes(role)) {
      if (!firstName || !lastName) {
        return res.status(400).send({ errors: [{ msg: 'First name and last name are required' }] });
      }
    }
    
    if (['hospital', 'cnam_admin'].includes(role)) {
      if (!name) {
        return res.status(400).send({ errors: [{ msg: 'Name is required' }] });
      }
    }
    
    if (!email || !password) {
      return res.status(400).send({ errors: [{ msg: 'Email and password are required' }] });
    }

    // Check if user exists in ANY collection
    const searchResults = await Promise.all(
      getAllModels().map(m => m.findOne({ email }))
    );
    if (searchResults.some(u => u)) {
      return res.status(400).send({ errors: [{ msg: 'User already exists' }] });
    }

    // Data preparation
    const userData = { email, password, role, ...otherData };
    if (['patient', 'pharmacist', 'doctor'].includes(role)) {
      userData.firstName = firstName;
      userData.lastName = lastName;
    } else {
      userData.name = name;
    }

    const user = await Model.create(userData);

    const token = jwt.sign(
      { user: { id: user._id, role: user.role, email: user.email } },
      process.env.SECRET_KEY,
      { expiresIn: '48h' }
    );
    const cleanUser = user.toObject();
    delete cleanUser.password;

    return res.status(201).send({ msg: 'Registered successfully', compte: cleanUser, user: cleanUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).send({ errors: [{ msg: 'Registration failed', error: error.message }] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in any collection
    let user = null;
    for (const Model of getAllModels()) {
      user = await Model.findOne({ email });
      if (user) break;
    }

    if (!user) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const token = jwt.sign(
      { user: { id: user._id, role: user.role, email: user.email } },
      process.env.SECRET_KEY,
      { expiresIn: '48h' }
    );
    const cleanUser = user.toObject();
    delete cleanUser.password;

    return res.status(200).send({ msg: 'Login success', compte: cleanUser, user: cleanUser, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).send({ errors: [{ msg: 'Login failed' }] });
  }
};

const fs = require('fs');
const path = require('path');

exports.getAllComptes = async (req, res) => {
  try {
    const logPath = path.join(__dirname, '../debug_api.txt');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] getAllComptes called by user: ${req.user?._id} role: ${req.user?.role}\n`);
    console.log('getAllComptes called by user:', req.user?._id, 'role:', req.user?.role);
    const results = await Promise.all(
      getAllModels().map(m => m.find({}).select('-password'))
    );
    // Flatten results
    const allUsers = results.flat().sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).send({ comptes: allUsers });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch comptes', error: error.message });
  }
};

exports.getCompteById = async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;
    for (const Model of getAllModels()) {
      user = await Model.findById(id).select('-password');
      if (user) break;
    }
    
    if (!user) return res.status(404).send({ msg: 'Compte not found' });
    return res.status(200).send({ compte: user });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch compte', error: error.message });
  }
};

exports.updateCompte = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    let user = null;
    let FoundModel = null;
    for (const Model of getAllModels()) {
      user = await Model.findById(id);
      if (user) {
        FoundModel = Model;
        break;
      }
    }

    if (!user) return res.status(404).send({ msg: 'Compte not found' });

    // Handle email update separately to check for duplicates
    if (updateData.email && updateData.email !== user.email) {
      const existing = await Promise.all(getAllModels().map(m => m.findOne({ email: updateData.email })));
      if (existing.some(u => u)) return res.status(400).send({ msg: 'Email already in use' });
    }

    // Apply updates
    Object.keys(updateData).forEach(key => {
      if (key !== 'password' && key !== '_id') {
        user[key] = updateData[key];
      }
    });

    const updated = await user.save();
    const cleanUser = updated.toObject();
    delete cleanUser.password;

    return res.status(200).send({ msg: 'Compte updated', compte: cleanUser });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(400).send({ msg: 'Cannot update compte', error: error.message });
  }
};

exports.deleteCompte = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    for (const Model of getAllModels()) {
      deleted = await Model.findByIdAndDelete(id);
      if (deleted) break;
    }
    
    if (!deleted) return res.status(404).send({ msg: 'Compte not found' });
    return res.status(200).send({ msg: 'Compte deleted' });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot delete compte', error: error.message });
  }
};

// Fonction pour créer plusieurs pharmacies
exports.createMultiplePharmacies = async (req, res) => {
  try {
    console.log('🚀 Début de la création des pharmacies...');
    
    const pharmacies = [
      {
        firstName: 'Fatma',
        lastName: 'Mansouri',
        email: 'fatma.mansouri@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 789 012',
        pharmacyName: 'Pharmacie El Menzah',
        pharmacyAddress: '45 Avenue Habib Bourguiba, El Menzah, Tunis',
        licenseNumber: 'PH002',
        rating: 4.2
      },
      {
        firstName: 'Mohamed',
        lastName: 'Trabelsi',
        email: 'mohamed.trabelsi@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 71 345 678',
        pharmacyName: 'Pharmacie La Marsa',
        pharmacyAddress: '78 Rue Gamal Abdel Nasser, La Marsa, Tunis',
        licenseNumber: 'PH003',
        rating: 4.8
      },
      {
        firstName: 'Sonia',
        lastName: 'Khemiri',
        email: 'sonia.khemiri@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 73 234 567',
        pharmacyName: 'Pharmacie Sousse',
        pharmacyAddress: '15 Avenue Farhat Hached, Sousse',
        licenseNumber: 'PH004',
        rating: 4.3
      },
      {
        firstName: 'Karim',
        lastName: 'Brahmi',
        email: 'karim.brahmi@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 74 567 890',
        pharmacyName: 'Pharmacie Sfax',
        pharmacyAddress: '200 Avenue Hedi Chaker, Sfax',
        licenseNumber: 'PH005',
        rating: 4.6
      },
      {
        firstName: 'Leila',
        lastName: 'Hachani',
        email: 'leila.hachani@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 72 678 901',
        pharmacyName: 'Pharmacie Bizerte',
        pharmacyAddress: '33 Rue Mongi Slim, Bizerte',
        licenseNumber: 'PH006',
        rating: 4.4
      },
      {
        firstName: 'Rached',
        lastName: 'Jebali',
        email: 'rached.jebali@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 75 789 012',
        pharmacyName: 'Pharmacie Gabès',
        pharmacyAddress: '88 Avenue Abdelkader El Ghazzi, Gabès',
        licenseNumber: 'PH007',
        rating: 4.1
      },
      {
        firstName: 'Mariem',
        lastName: 'Saidani',
        email: 'mariem.saidani@pharmacie.tn',
        password: 'password123',
        role: 'pharmacist',
        phone: '+216 72 123 456',
        pharmacyName: 'Pharmacie Nabeul',
        pharmacyAddress: '12 Rue Habib Thameur, Nabeul',
        licenseNumber: 'PH008',
        rating: 4.7
      }
    ];

    const results = [];
    
    for (const pharmacyData of pharmacies) {
      try {
        // Vérifier si la pharmacie existe déjà
        const existingPharmacy = await Pharmacist.findOne({ email: pharmacyData.email });
        
        if (existingPharmacy) {
          results.push({
            name: pharmacyData.pharmacyName,
            success: false,
            error: 'Existe déjà'
          });
          continue;
        }

        // Créer la pharmacie en utilisant la même méthode que register
        const user = await Pharmacist.create(pharmacyData);
        
        results.push({
          name: pharmacyData.pharmacyName,
          success: true,
          id: user._id
        });
        
        console.log(`✅ ${pharmacyData.pharmacyName} créée avec succès`);
        
      } catch (error) {
        if (error.code === 11000) {
          results.push({
            name: pharmacyData.pharmacyName,
            success: false,
            error: 'Existe déjà'
          });
        } else {
          results.push({
            name: pharmacyData.pharmacyName,
            success: false,
            error: error.message
          });
        }
      }
    }
    
    console.log('🎉 Création des pharmacies terminée!');
    
    return res.status(200).send({ 
      msg: 'Pharmacies creation completed', 
      results: results 
    });
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return res.status(400).send({ msg: 'Cannot create pharmacies', error: error.message });
  }
};
