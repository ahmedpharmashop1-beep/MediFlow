const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Compte = require('../Model/compte');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, role = 'patient' } = req.body;
    
    // Validation selon le rôle
    if (['patient', 'pharmacist', 'doctor'].includes(role)) {
      if (!firstName || !lastName) {
        return res.status(400).send({ errors: [{ msg: 'First name and last name are required for this role' }] });
      }
    }
    
    if (['hospital', 'cnam_admin'].includes(role)) {
      if (!name) {
        return res.status(400).send({ errors: [{ msg: 'Organization name is required for this role' }] });
      }
    }
    
    if (!email || !password) {
      return res.status(400).send({ errors: [{ msg: 'Email and password are required' }] });
    }

    const existing = await Compte.findOne({ email });
    if (existing) return res.status(400).send({ errors: [{ msg: 'Compte already exists' }] });

    const hashed = await bcrypt.hash(password, 10);
    
    // Créer l'objet avec les champs appropriés selon le rôle
    const compteData = {
      email,
      password: hashed,
      role,
      isAdmin: role === 'cnam_admin',
    };
    
    // Ajouter les champs selon le rôle
    if (['patient', 'pharmacist', 'doctor'].includes(role)) {
      compteData.firstName = firstName;
      compteData.lastName = lastName;
    }
    
    if (['hospital', 'cnam_admin'].includes(role)) {
      compteData.name = name;
    }
    
    const compte = await Compte.create(compteData);

    const token = jwt.sign({ id: compte._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
    const cleanCompte = compte.toObject();
    delete cleanCompte.password;

    return res.status(201).send({ msg: 'Compte registered', compte: cleanCompte, token });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).send({ errors: [{ msg: 'Registration failed', error: error.message }] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const compte = await Compte.findOne({ email });
    if (!compte) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const ok = await bcrypt.compare(password, compte.password);
    if (!ok) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const token = jwt.sign({ id: compte._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
    const cleanCompte = compte.toObject();
    delete cleanCompte.password;

    return res.status(200).send({ msg: 'Login success', compte: cleanCompte, token });
  } catch (error) {
    return res.status(400).send({ errors: [{ msg: 'Login failed' }] });
  }
};

exports.getAllComptes = async (req, res) => {
  try {
    const comptes = await Compte.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).send({ comptes: comptes });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch comptes', error: error.message });
  }
};

exports.getCompteById = async (req, res) => {
  try {
    const { id } = req.params;
    const compte = await Compte.findById(id).select('-password');
    if (!compte) return res.status(404).send({ msg: 'Compte not found' });
    return res.status(200).send({ compte });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch compte', error: error.message });
  }
};

exports.updateCompte = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, name, phone, email, address, speciality, hospital, pharmacyName, status } = req.body;
    
    const compte = await Compte.findById(id);
    if (!compte) return res.status(404).send({ msg: 'Compte not found' });

    if (firstName) compte.firstName = firstName;
    if (lastName) compte.lastName = lastName;
    if (name) compte.name = name;
    if (phone) compte.phone = phone;
    if (email && email !== compte.email) {
      const existing = await Compte.findOne({ email });
      if (existing) return res.status(400).send({ msg: 'Email already in use' });
      compte.email = email;
    }
    if (address) compte.address = address;
    if (speciality) compte.speciality = speciality;
    if (hospital) compte.hospital = hospital;
    if (pharmacyName) compte.pharmacyName = pharmacyName;
    if (status) compte.status = status;

    const updated = await compte.save();
    const cleanCompte = updated.toObject();
    delete cleanCompte.password;

    return res.status(200).send({ msg: 'Compte updated', compte: cleanCompte });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot update compte', error: error.message });
  }
};

exports.deleteCompte = async (req, res) => {
  try {
    const { id } = req.params;
    const compte = await Compte.findByIdAndDelete(id);
    if (!compte) return res.status(404).send({ msg: 'Compte not found' });
    return res.status(200).send({ msg: 'Compte deleted' });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot delete compte', error: error.message });
  }
};
