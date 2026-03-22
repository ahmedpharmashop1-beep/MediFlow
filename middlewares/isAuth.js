const jwt = require('jsonwebtoken');
const Patient = require('../Model/patient');

module.exports = async function isAuth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: missing token' }] });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const patient = await Patient.findById(decoded.user?.id).select('-password');
    if (!patient) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: patient not found' }] });
    }

    req.patient = patient;
    // backward compatibility with existing middleware/routes
    req.user = patient;
    next();
  } catch (error) {
    return res.status(401).send({ errors: [{ msg: 'Not authorized: invalid token' }] });
  }
};

