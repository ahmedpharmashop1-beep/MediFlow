// importation of mongoose
const mongoose = require('mongoose');

// connection to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }

};
// exportation of the connection function
module.exports = connectDB;