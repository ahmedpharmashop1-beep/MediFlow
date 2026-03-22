// importation of mongoose
const mongoose = require('mongoose');

// connection to the database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB connected successfully');
    console.log('Connected to database:', conn.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// exportation of the connection function
module.exports = connectDB;