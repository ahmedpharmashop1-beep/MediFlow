const fs = require('fs');
const path = require('path');

module.exports = function isAdmin(req, res, next) {
  const logPath = path.join(__dirname, '../debug_api.txt');
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] isAdmin called for user: ${req.user?._id} role: ${req.user?.role} isAdmin: ${req.user?.isAdmin}\n`);
  
  if (!req.user || (!req.user.isAdmin && req.user.role !== 'cnam_admin')) {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] isAdmin: ACCESS DENIED\n`);
    return res.status(403).send({ errors: [{ msg: 'Forbidden: admin only' }] });
  }
  
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] isAdmin: ACCESS GRANTED\n`);
  next();
};


