const Appointment = require('../Model/Appointment');
const Hospital = require('../Model/Hospital');
const Compte = require('../Model/compte');
const isAuth = require('../middlewares/isAuth');

exports.createAppointment = [isAuth, async (req, res) => {
  try {
    const {
      doctorId,
      hospitalId,
      specialty,
      appointmentDate,
      appointmentTime,
      reason = '',
      priority = 'normal'
    } = req.body;

    const patientId = req.user._id;

    // Validate required fields
    if (!doctorId || !hospitalId || !specialty || !appointmentDate || !appointmentTime) {
      return res.status(400).send({ msg: 'Missing required fields' });
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ msg: 'Hospital not found' });
    }

    // Check if doctor exists and is a doctor
    const doctor = await Compte.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).send({ msg: 'Doctor not found' });
    }

    // Check for scheduling conflicts
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).send({ msg: 'Time slot already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      hospitalId,
      specialty,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      priority
    });

    return res.status(201).send({
      msg: 'Appointment scheduled successfully',
      appointment: await appointment.populate(['patientId', 'doctorId', 'hospitalId'])
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to schedule appointment', error });
  }
}];

exports.getPatientAppointments = [isAuth, async (req, res) => {
  try {
    const patientId = req.user._id;
    const { status, upcoming = true } = req.query;

    let query = { patientId };

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.appointmentDate = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'confirmed'] };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName')
      .populate('hospitalId', 'name address phone')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.status(200).send({ appointments });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch appointments', error });
  }
}];

exports.getDoctorAppointments = [isAuth, async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { date, status } = req.query;

    let query = { doctorId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName email phone')
      .populate('hospitalId', 'name')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.status(200).send({ appointments });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch appointments', error });
  }
}];

exports.updateAppointmentStatus = [isAuth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ msg: 'Appointment not found' });
    }

    // Check permissions (patient can only update their own, doctor can update their appointments)
    if (appointment.patientId.toString() !== userId.toString() &&
        appointment.doctorId.toString() !== userId.toString()) {
      return res.status(403).send({ msg: 'Not authorized to update this appointment' });
    }

    // Update appointment
    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    return res.status(200).send({
      msg: 'Appointment updated successfully',
      appointment: await appointment.populate(['patientId', 'doctorId', 'hospitalId'])
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to update appointment', error });
  }
}];

exports.addCommunication = [isAuth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { type, message } = req.body;
    const userId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ msg: 'Appointment not found' });
    }

    // Check permissions
    if (appointment.patientId.toString() !== userId.toString() &&
        appointment.doctorId.toString() !== userId.toString()) {
      return res.status(403).send({ msg: 'Not authorized to add communication' });
    }

    appointment.communications.push({
      type,
      message,
      sentBy: userId
    });

    await appointment.save();

    return res.status(200).send({
      msg: 'Communication added successfully',
      appointment
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to add communication', error });
  }
}];

exports.getHospitalAppointments = [isAuth, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { date, specialty } = req.query;

    let query = { hospitalId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    if (specialty) {
      query.specialty = specialty;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.status(200).send({ appointments });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch hospital appointments', error });
  }
}];

// Get available time slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).send({ msg: 'Doctor ID and date are required' });
    }

    const appointmentDate = new Date(date);

    // Get doctor's existing appointments for the date
    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate,
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate time slots (assuming 30-minute slots from 9 AM to 5 PM)
    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(timeString);
      }
    }

    // Filter out booked slots
    const availableSlots = timeSlots.filter(slot => {
      return !existingAppointments.some(apt => apt.appointmentTime === slot);
    });

    return res.status(200).send({ availableSlots });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch available slots', error });
  }
};