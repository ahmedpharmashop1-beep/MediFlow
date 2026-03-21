const express = require('express');
const { register, login } = require('../controllers/patient');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', isAuth, (req, res) => {
  res.status(200).send(req.patient);
});

module.exports = router;

