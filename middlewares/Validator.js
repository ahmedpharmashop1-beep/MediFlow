const {check, validationResult} = require('express-validator');

exports.registerValidator = () => [
    check("firstname", "Name is required").notEmpty(),
    check("name", "Name is required").notEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
];

exports.loginValidator = () => [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
];

exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).send({ error: {errors: errors.array() }});
    }
    next();
};