const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Force IPv4 for DNS resolution
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const Doctor = require('./Model/Doctor');

async function checkDoctors() {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}\n`);

    const doctors = await Doctor.find().select('-password');
    console.log(`📋 Found ${doctors.length} doctors in the database\n`);

    if (doctors.length > 0) {
      console.log('Doctors list:');
      doctors.forEach((doc, index) => {
        console.log(`\n${index + 1}. ${doc.firstName} ${doc.lastName}`);
        console.log(`   📧 Email: ${doc.email}`);
        console.log(`   🏥 Hospital: ${doc.hospitalName || 'Cabinet privé'}`);
        console.log(`   🔬 Specialization: ${doc.specialization || 'N/A'}`);
        console.log(`   📱 Phone: ${doc.phone || 'N/A'}`);
        console.log(`   📅 Days: ${doc.availableDays ? doc.availableDays.join(', ') : 'N/A'}`);
        console.log(`   ⏰ Slots: ${doc.availableTimeSlots ? JSON.stringify(doc.availableTimeSlots) : 'N/A'}`);
        console.log(`   💰 Consultation Fee: ${doc.consultationFee || 'N/A'} TND`);
        console.log(`   ⭐ Rating: ${doc.rating || 'N/A'}`);
      });
    } else {
      console.log('⚠️  No doctors found in the database!');
      console.log('\nYou need to register doctors first. Use the registration page or API to add doctors.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

checkDoctors();
