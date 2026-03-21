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
app.use('/api/patient', require('./routes/patient'));
app.use('/api/medicine', require('./routes/medicine'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/hospital', require('./routes/hospital'));
app.use('/api/cnam', require('./routes/cnam'));

// server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT,error => {
    error ? console.error (`fail to connect,${error}`) :
    console.log(`Connected to MongoDB on port ${PORT}`);
});
