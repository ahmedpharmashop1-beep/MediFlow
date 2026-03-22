const express = require('express');
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  addCommunication,
  getHospitalAppointments,
  getAvailableSlots
} = require('../controllers/appointment');

const router = express.Router();

// Create a new appointment
router.post('/', createAppointment);

// Get appointments for the authenticated patient
router.get('/my-appointments', getPatientAppointments);

// Get appointments for the authenticated doctor
router.get('/doctor-appointments', getDoctorAppointments);

// Update appointment status
router.put('/:appointmentId/status', updateAppointmentStatus);

// Add communication to appointment
router.post('/:appointmentId/communication', addCommunication);

// Get appointments for a specific hospital
router.get('/hospital/:hospitalId', getHospitalAppointments);

// Get available time slots for a doctor on a specific date
router.get('/available-slots', getAvailableSlots);

module.exports = router;