const jwt = require('jsonwebtoken');
const Compte = require('../Model/compte');

module.exports = async function isAuth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: missing token' }] });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const compte = await Compte.findById(decoded.user?.id).select('-password');
    if (!compte) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: compte not found' }] });
    }

    req.compte = compte;
    // backward compatibility with existing middleware/routes
    req.user = compte;
    next();
  } catch (error) {
    return res.status(401).send({ errors: [{ msg: 'Not authorized: invalid token' }] });
  }
};

