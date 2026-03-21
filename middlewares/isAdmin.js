module.exports = function isAdmin(req, res, next) {
  if (!req.user || (!req.user.isAdmin && req.user.role !== 'cnam_admin')) {
    return res.status(403).send({ errors: [{ msg: 'Forbidden: admin only' }] });
  }
  next();
};

