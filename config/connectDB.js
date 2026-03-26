const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// connection to the database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    if (error.message.includes('querySrv ETIMEOUT') || error.message.includes('ECONNREFUSED')) {
      console.log('TIP: This might be a DNS or IP whitelist issue. Check your MongoDB Atlas settings.');
    }
    process.exit(1);
  }
};

// exportation of the connection function
module.exports = connectDB;