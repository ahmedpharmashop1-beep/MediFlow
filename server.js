const express = require('express');
const cors = require('cors');
const app = express(); // creation d'instance
app.use(express.json()); // middleware pour parser le json
app.use(cors());
require('dotenv').config();


// connection to the database
const connectDB = require('./config/connectDB');
connectDB();

//create routes
app.use('/api/user', require('./routes/user'));
app.use('/api/food', require('./routes/food'));


// server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT,error => {
    error ? console.error (`fail to connect,${error}`) :
    console.log(`Connected to MongoDB on port ${PORT}`);
});
