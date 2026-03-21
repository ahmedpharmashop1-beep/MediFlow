const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../Model/patient');

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role = 'patient' } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).send({ errors: [{ msg: 'Missing required fields' }] });
    }

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).send({ errors: [{ msg: 'Patient already exists' }] });

    const hashed = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      firstname,
      lastname,
      email,
      password: hashed,
      role,
      isAdmin: role === 'cnam_admin',
    });

    const token = jwt.sign({ id: patient._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
    const cleanPatient = patient.toObject();
    delete cleanPatient.password;

    return res.status(201).send({ msg: 'Patient registered', patient: cleanPatient, token });
  } catch (error) {
    return res.status(400).send({ errors: [{ msg: 'Registration failed' }] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const ok = await bcrypt.compare(password, patient.password);
    if (!ok) return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });

    const token = jwt.sign({ id: patient._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
    const cleanPatient = patient.toObject();
    delete cleanPatient.password;

    return res.status(200).send({ msg: 'Login success', patient: cleanPatient, token });
  } catch (error) {
    return res.status(400).send({ errors: [{ msg: 'Login failed' }] });
  }
};

