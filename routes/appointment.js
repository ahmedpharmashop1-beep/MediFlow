const express = require('express');
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  addCommunication,
  getHospitalAppointments,
  getAvailableSlots,
  getDoctorsByHospital,
  getNotifications,
  markNotificationRead,
  createDirectNotification
} = require('../controllers/appointment');

const router = express.Router();

// Get notifications
router.get('/notifications', getNotifications);

// Mark notification as read
router.put('/notifications/:notificationId/read', markNotificationRead);

// Create direct notification (for demo/system)
router.post('/notification', createDirectNotification);

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

// Get doctors by hospital and specialty
router.get('/doctors-by-hospital', getDoctorsByHospital);

// Diagnostic endpoint - see all doctors
router.get('/debug/all-doctors', getDoctorsByHospital);

module.exports = router;