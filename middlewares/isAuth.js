const jwt = require('jsonwebtoken');
const Compte = require('../Model/compte');

module.exports = async function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ errors: [{ msg: 'Not authorized: missing token' }] });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Handle both token structures: direct id or nested user.id
    const userId = decoded.user ? decoded.user.id : decoded.id;
    
    const compte = await Compte.findById(userId).select('-password');
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

