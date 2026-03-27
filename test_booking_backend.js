const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/pharmashop/Desktop/MediFlow/.env' });

const Hospital = require('c:/Users/pharmashop/Desktop/MediFlow/Model/Hospital');
const Doctor = require('c:/Users/pharmashop/Desktop/MediFlow/Model/Doctor');
const Appointment = require('c:/Users/pharmashop/Desktop/MediFlow/Model/Appointment');
const { getAvailableSlots, getDoctorsByHospital } = require('c:/Users/pharmashop/Desktop/MediFlow/controllers/appointment');

async function test() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to DB');

    const hospital = await Hospital.findOne();
    if (!hospital) {
      console.log('No hospital found');
      return;
    }
    console.log('Testing with Hospital:', hospital.name);

    // Mock req and res for getDoctorsByHospital
    const reqDoctors = { query: { hospitalName: hospital.name } };
    const resDoctors = {
      status: (code) => ({
        send: (data) => {
          console.log('Doctors Found:', data.doctors.length);
          if (data.doctors.length > 0) {
            console.log('First Doctor:', data.doctors[0].firstName, data.doctors[0].lastName);
            testSlots(data.doctors[0]._id);
          } else {
            console.log('Please add a doctor to this hospital to test slots');
            process.exit(0);
          }
        }
      })
    };
    await getDoctorsByHospital(reqDoctors, resDoctors);

  } catch (err) {
    console.error(err);
  }
}

async function testSlots(doctorId) {
  const date = new Date().toISOString().split('T')[0];
  const reqSlots = { query: { doctorId, date } };
  const resSlots = {
    status: (code) => ({
      send: (data) => {
        console.log('Available Slots for', date, ':', data.availableSlots.length);
        console.log('First 3 slots:', data.availableSlots.slice(0, 3));
        process.exit(0);
      }
    })
  };
  await getAvailableSlots(reqSlots, resSlots);
}

test();
