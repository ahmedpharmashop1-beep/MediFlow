const mongoose = require('mongoose');
const dns = require('dns');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Patient = require('./Model/Patient');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Connect to database using same config as server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const resetPatientPasswords = async () => {
  try {
    console.log('\n🔧 Resetting patient passwords to "password123"...\n');
    
    const patients = await Patient.find({});
    
    for (const patient of patients) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Update patient password
      await Patient.findByIdAndUpdate(patient._id, { password: hashedPassword });
      
      console.log(`✅ Password reset for: ${patient.email} (${patient.firstName} ${patient.lastName})`);
    }
    
    console.log(`\n🎉 Successfully reset passwords for ${patients.length} patients!`);
    console.log('🔑 New password for all patients: password123');
    
  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  }
};

const main = async () => {
  await connectDB();
  await resetPatientPasswords();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

main().catch(console.error);
