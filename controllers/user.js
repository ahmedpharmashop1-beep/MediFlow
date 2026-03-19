const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).send({errors:[{msg:'User already exists'}]});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({...req.body});
        newUser.password = hashedPassword;
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
        res.status(200).send({msg: 'User registered successfully', user: newUser, token});
    
    
    } catch (error) {
        res.status(400).send({errors:[{msg:'try again'}]}); 
        
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).send({errors:[{msg:'email incorrect'}]});
        }
        const checkPassword = await bcrypt.compare(password, foundUser.password);
        if (!checkPassword) {
            return res.status(400).send({errors:[{msg:'password incorrect'}]});
        }
        const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, { expiresIn: '48h' });
        res.status(200).send({msg: 'User logged in successfully', user: foundUser, token});

    } catch (error) {
        res.status(400).send({errors:[{msg:'try again'}]});
    }   
};

