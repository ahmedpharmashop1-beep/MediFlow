const Hospital = require('../Model/Hospital');
const Appointment = require('../Model/Appointment');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

exports.createHospital = [isAuth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      lat,
      lng,
      type = 'general',
      specialties = [],
      totalBeds = 0,
      emergencyCapacity = 0
    } = req.body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return res.status(400).send({ msg: 'Missing required fields: name, address, lat, lng' });
    }

    const hospital = await Hospital.create({
      name,
      address,
      phone,
      email,
      lat: Number(lat),
      lng: Number(lng),
      type,
      specialties,
      capacity: {
        totalBeds: Number(totalBeds),
        emergencyCapacity: Number(emergencyCapacity)
      }
    });

    return res.status(201).send({ msg: 'Hospital created successfully', hospital });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ msg: 'Hospital name already exists' });
    }
    return res.status(400).send({ msg: 'Failed to create hospital', error });
  }
}];

exports.getAllHospitals = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 10, specialty } = req.query;

    let query = {};

    if (specialty) {
      query.specialties = specialty;
    }

    const hospitals = await Hospital.find(query);

    let hospitalsWithDistance = hospitals;

    // Calculate distances if coordinates provided
    if (lat !== undefined && lng !== undefined) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const radiusKmNum = Number(radiusKm);

      hospitalsWithDistance = hospitals
        .map(hospital => {
          const distance = calculateDistance(latNum, lngNum, hospital.lat, hospital.lng);
          return { ...hospital.toObject(), distance };
        })
        .filter(hospital => hospital.distance <= radiusKmNum)
        .sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).send({ hospitals: hospitalsWithDistance });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch hospitals', error });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ msg: 'Hospital not found' });
    }

    return res.status(200).send({ hospital });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch hospital', error });
  }
};

exports.updateHospital = [isAuth, isAdmin, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const updates = req.body;

    const hospital = await Hospital.findByIdAndUpdate(hospitalId, updates, { new: true });
    if (!hospital) {
      return res.status(404).send({ msg: 'Hospital not found' });
    }

    return res.status(200).send({ msg: 'Hospital updated successfully', hospital });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to update hospital', error });
  }
}];

exports.updateQueueStatus = [isAuth, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { estimatedWaitMin, patientsAhead, isSaturated } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ msg: 'Hospital not found' });
    }

    hospital.queueStatus = {
      estimatedWaitMin: Number(estimatedWaitMin),
      patientsAhead: Number(patientsAhead),
      isSaturated: Boolean(isSaturated),
      lastUpdated: new Date()
    };

    await hospital.save();

    return res.status(200).send({ msg: 'Queue status updated successfully', hospital });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to update queue status', error });
  }
}],

exports.getHospitalStats = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Get appointment statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    const totalAppointments = await Appointment.countDocuments({ hospitalId });

    const hospital = await Hospital.findById(hospitalId);

    return res.status(200).send({
      stats: {
        todayAppointments,
        totalAppointments,
        queueStatus: hospital.queueStatus,
        capacity: hospital.capacity
      }
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch hospital stats', error });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}