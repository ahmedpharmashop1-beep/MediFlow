const express = require('express');
const cors = require('cors');
const app = express(); // creation d'instance
app.use(express.json()); // middleware pour parser le json
app.use(cors());
require('dotenv').config();

// connection to the database
const connectDB = require('./config/connectDB');
connectDB();

// Importer la fonction de configuration des pharmacies
const setupPharmacies = require('./setup_pharmacies');
const deleteDuplicatePharmacy = require('./delete_duplicate_server');

//create routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comptes', require('./routes/comptes'));
app.use('/api/medicine', require('./routes/medicine'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/schedule', require('./routes/schedule'));
// app.use('/api/hospital', require('./routes/hospital'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/cnam', require('./routes/cnam'));
app.use('/api/reviews', require('./routes/review'));

// Configurer les pharmacies après la connexion à la base de données
setTimeout(() => {
  setupPharmacies();
  deleteDuplicatePharmacy();
}, 3000);

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, error => {
    if (error) {
        console.error(`Failed to connect: ${error}`);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
