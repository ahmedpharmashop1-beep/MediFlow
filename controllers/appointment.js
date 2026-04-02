const Appointment = require('../Model/Appointment');
const Hospital = require('../Model/Hospital');
const Doctor = require('../Model/Doctor');
const Patient = require('../Model/Patient');
const Notification = require('../Model/Notification');
const isAuth = require('../middlewares/isAuth');

exports.createAppointment = [isAuth, async (req, res) => {
  try {
    console.log('🔍 Full request:', {
      user: req.user?._id,
      body: req.body
    });

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

    console.log('📋 Creating appointment with:', {
      patientId,
      doctorId,
      hospitalId,
      specialty,
      appointmentDate,
      appointmentTime
    });

    // Validate required fields
    if (!doctorId || !specialty || !appointmentDate || !appointmentTime) {
      console.error('❌ Missing fields - doctorId:', doctorId, 'specialty:', specialty, 'date:', appointmentDate, 'time:', appointmentTime);
      return res.status(400).send({ msg: 'Missing required fields' });
    }

    // Check if doctor exists
    console.log('🔎 Searching for doctor:', doctorId);
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error('❌ Doctor not found:', doctorId);
      console.log('Available doctors count:', await Doctor.countDocuments());
      return res.status(404).send({ msg: 'Doctor not found', doctorId });
    }

    console.log('✅ Doctor found:', doctor.firstName, doctor.lastName);

    // Check if hospital exists (only if not a private appointment)
    if (hospitalId && hospitalId !== 'private') {
      console.log('🏥 Checking hospital:', hospitalId);
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        console.error('❌ Hospital not found:', hospitalId);
        return res.status(404).send({ msg: 'Hospital not found' });
      }
    }

    // Check for scheduling conflicts
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      console.error('❌ Time slot already booked');
      return res.status(409).send({ msg: 'Time slot already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      hospitalId: (hospitalId && hospitalId !== 'private') ? hospitalId : null,
      specialty,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      priority,
      status: 'confirmed'
    });

    console.log('✅ Appointment created successfully:', appointment._id);

    // Create notifications for both Patient and Doctor
    try {
      // Find hospital name if it's a hospital appointment
      let hospitalName = 'l’hôpital';
      if (hospitalId && hospitalId !== 'private') {
        const hospital = await Hospital.findById(hospitalId);
        if (hospital) hospitalName = hospital.name;
      }

      await Notification.create([
        {
          userId: patientId,
          userType: 'patient',
          title: '✅ Rendez-vous hospitalier confirmé',
          message: `Votre rendez-vous en ${specialty} à ${hospitalName} avec le Dr. ${doctor.firstName} ${doctor.lastName} est prévu le ${appointmentDate} à ${appointmentTime}.`,
          type: 'appointment'
        },
        {
          userId: doctorId,
          userType: 'doctor',
          title: '📅 Nouveau rendez-vous hospitalier',
          message: `Un nouveau rendez-vous pour ${specialty} a été planifié par ${req.user.firstName} ${req.user.lastName} le ${appointmentDate} à ${appointmentTime}.`,
          type: 'appointment'
        }
      ]);
      console.log('✅ Notifications created successfully');
    } catch (notifError) {
      console.error('⚠️ Failed to create notifications:', notifError.message);
      // Don't fail the entire appointment request if notifications fail
    }

    return res.status(201).send({
      success: true,
      msg: 'Appointment scheduled successfully',
      appointment: await appointment.populate(['patientId', 'doctorId', 'hospitalId'])
    });
  } catch (error) {
    console.error('❌ createAppointment error:', error);
    console.error('Stack:', error.stack);
    return res.status(500).send({
      success: false,
      msg: 'Error creating appointment',
      error: error.message
    });
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

    // Get detailed info for notification
    const fullAppointment = await Appointment.findById(appointmentId)
      .populate('hospitalId', 'name')
      .populate('doctorId', 'firstName lastName');

    // Notify other party
    const otherUserId = userId.toString() === appointment.patientId.toString() ? appointment.doctorId : appointment.patientId;
    const userType = userId.toString() === appointment.patientId.toString() ? 'doctor' : 'patient';
    
    let hospitalPart = '';
    if (fullAppointment.hospitalId) {
      hospitalPart = ` à ${fullAppointment.hospitalId.name}`;
    }

    await Notification.create({
      userId: otherUserId,
      userType,
      title: status === 'confirmed' ? '✅ Rendez-vous confirmé' : '🔄 Statut mis à jour',
      message: `Le statut de votre rendez-vous en ${fullAppointment.specialty}${hospitalPart} avec le Dr. ${fullAppointment.doctorId.firstName} ${fullAppointment.doctorId.lastName} a été changé en: ${status}`,
      type: 'appointment'
    });

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

    // Notify other party
    const otherUserId = userId.toString() === appointment.patientId.toString() ? appointment.doctorId : appointment.patientId;
    const userRole = userId.toString() === appointment.patientId.toString() ? 'doctor' : 'patient';

    await Notification.create({
      userId: otherUserId,
      userType: userRole,
      title: '💬 Nouveau message',
      message: `Vous avez reçu un nouveau message concernant votre rendez-vous.`,
      type: 'appointment'
    });

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

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({ msg: 'Doctor not found' });
    }

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(appointmentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get doctor's existing appointments for the date
    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: appointmentDate, $lt: nextDay },
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate time slots based on doctor's availability or default
    let timeSlots = [];
    if (doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0) {
      // Use doctor's specific slots if defined
      doctor.availableTimeSlots.forEach(range => {
        let [startH, startM] = range.start.split(':').map(Number);
        let [endH, endM] = range.end.split(':').map(Number);

        let current = startH * 60 + startM;
        const end = endH * 60 + endM;

        while (current < end) {
          const h = Math.floor(current / 60).toString().padStart(2, '0');
          const m = (current % 60).toString().padStart(2, '0');
          timeSlots.push(`${h}:${m}`);
          current += 30; // 30-minute default
        }
      });
    } else {
      // Default slots: 09:00 to 17:00
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          timeSlots.push(timeString);
        }
      }
    }

    // Filter out booked slots
    const availableSlots = timeSlots.map(slot => {
      const isBooked = existingAppointments.some(apt => apt.appointmentTime === slot);
      return {
        time: slot,
        available: !isBooked
      };
    });

    return res.status(200).send({ availableSlots });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch available slots', error });
  }
};

// Get doctors by hospital and specialty
exports.getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId, hospitalName, specialty } = req.query;
    let query = {};
    if (hospitalId) query.hospitalId = hospitalId;
    if (hospitalName) query.hospitalName = hospitalName;
    if (specialty) query.specialization = specialty;

    const doctors = await Doctor.find(query).select('-password');
    return res.status(200).send({ doctors });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch doctors', error });
  }
};

// Get notifications for the authenticated user
exports.getNotifications = [isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    return res.status(200).send({ notifications });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch notifications', error: error.message });
  }
}];

// Mark notification as read
exports.markNotificationRead = [isAuth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).send({ msg: 'Notification not found' });
    }
    
    return res.status(200).send({ msg: 'Notification marked as read', notification });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to update notification', error: error.message });
  }
}];

// Direct notification creation for demo purposes or special system alerts
exports.createDirectNotification = [isAuth, async (req, res) => {
  try {
    const { title, message, type = 'appointment' } = req.body;
    const userId = req.user._id;
    const userType = req.user.role || 'patient';

    const notification = await Notification.create({
      userId,
      userType,
      title,
      message,
      type
    });

    return res.status(201).send({ success: true, notification });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to create notification', error: error.message });
  }
}];