const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/user');
const { registerValidator, loginValidator, validation } = require('../middlewares/Validator');
const isAuth = require('../middlewares/isAuth');






router.post('/register',registerValidator(),validation, register);
router.post('/login',loginValidator(),validation, login);
router.get('/current', isAuth, (req, res) => { res.send(req.user) });

module.exports = router;