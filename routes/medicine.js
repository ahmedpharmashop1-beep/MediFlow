const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const Medicine = require('../Model/Medicine');
const Pharmacy = require('../Model/Pharmacy');
const MedicineStock = require('../Model/MedicineStock');
const MedicationReservation = require('../Model/MedicationReservation');

const toRad = (value) => (value * Math.PI) / 180;
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// -----------------------------
// Admin: seed pharmacies/medicines/stocks
// -----------------------------

router.post('/pharmacies', [isAuth, isAdmin], async (req, res) => {
  try {
    const { name, address = '', lat, lng } = req.body;
    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).send({ msg: 'Missing fields: name, lat, lng' });
    }

    const pharmacy = await Pharmacy.create({
      name,
      address,
      lat: Number(lat),
      lng: Number(lng),
    });
    return res.status(201).send({ msg: 'Pharmacy created', pharmacy });
  } catch (error) {
    return res.status(400).send({ msg: 'Pharmacy not created', error });
  }
});

router.post('/medicines', [isAuth, isAdmin], async (req, res) => {
  try {
    const { name, dosage = '', form = '' } = req.body;
    if (!name) return res.status(400).send({ msg: 'Missing field: name' });

    const medicine = await Medicine.create({
      name,
      dosage,
      form,
    });
    return res.status(201).send({ msg: 'Medicine created', medicine });
  } catch (error) {
    return res.status(400).send({ msg: 'Medicine not created', error });
  }
});

router.post('/stocks/upsert', [isAuth, isAdmin], async (req, res) => {
  try {
    const { medicineId, pharmacyId, stockCount } = req.body;
    if (!medicineId || !pharmacyId || stockCount === undefined) {
      return res.status(400).send({ msg: 'Missing fields: medicineId, pharmacyId, stockCount' });
    }

    const stock = await MedicineStock.findOneAndUpdate(
      { medicineId, pharmacyId },
      { $set: { stockCount: Number(stockCount) } },
      { upsert: true, new: true }
    );

    return res.status(201).send({ msg: 'Stock upserted', stock });
  } catch (error) {
    return res.status(400).send({ msg: 'Stock not upserted', error });
  }
});

// -----------------------------
// Patient: search & reserve
// -----------------------------

// GET /api/medicine/search?medicineId=... OR medicineName=...&lat=...&lng=...&radiusKm=...
router.get('/search', async (req, res) => {
  try {
    const { medicineId, medicineName = '', lat, lng, radiusKm = 5, quantity } = req.query;

    let medicineIds = [];
    if (medicineId) {
      medicineIds = [medicineId];
    } else if (medicineName) {
      const medicines = await Medicine.find({
        name: { $regex: String(medicineName).trim(), $options: 'i' },
      }).select('_id');
      medicineIds = medicines.map((m) => m._id);
    } else {
      return res.status(400).send({ msg: 'Provide medicineId or medicineName' });
    }

    if (medicineIds.length === 0) {
      return res.status(200).send({ results: [] });
    }

    const latNum = lat !== undefined ? Number(lat) : null;
    const lngNum = lng !== undefined ? Number(lng) : null;
    const radiusKmNum = Number(radiusKm);
    const qtyNeeded = quantity !== undefined ? Number(quantity) : null;

    const stocks = await MedicineStock.find({ medicineId: { $in: medicineIds } })
      .populate('medicineId')
      .populate('pharmacyId');

    const results = [];
    for (const s of stocks) {
      const availableQty = s.stockCount - s.reservedCount;
      if (availableQty <= 0) continue;
      if (qtyNeeded !== null && availableQty < qtyNeeded) continue;

      const pharmacy = s.pharmacyId;
      let distanceKm = null;
      if (latNum !== null && lngNum !== null) {
        distanceKm = haversineKm(latNum, lngNum, pharmacy.lat, pharmacy.lng);
        if (distanceKm > radiusKmNum) continue;
      }

      results.push({
        medicine: s.medicineId,
        pharmacy: {
          _id: pharmacy._id,
          name: pharmacy.name,
          address: pharmacy.address,
          lat: pharmacy.lat,
          lng: pharmacy.lng,
        },
        availableQty,
        distanceKm,
      });
    }

    // If we have location, sort by distance; otherwise sort by best availability
    results.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      return b.availableQty - a.availableQty;
    });

    return res.status(200).send({ results });
  } catch (error) {
    return res.status(400).send({ msg: 'Search failed', error });
  }
});

router.post('/reserve', [isAuth], async (req, res) => {
  try {
    const { medicineId, pharmacyId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    if (!medicineId || !pharmacyId) {
      return res.status(400).send({ msg: 'Missing fields: medicineId, pharmacyId' });
    }
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).send({ msg: 'quantity must be >= 1' });
    }

    // Use an atomic condition to avoid negative stock under concurrency.
    const updatedStock = await MedicineStock.findOneAndUpdate(
      {
        medicineId,
        pharmacyId,
        $expr: {
          $gte: [{ $subtract: ['$stockCount', '$reservedCount'] }, qty],
        },
      },
      { $inc: { reservedCount: qty } },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(409).send({ msg: 'Not enough stock available for reservation' });
    }

    const reservationCode = crypto.randomBytes(8).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    try {
      const reservation = await MedicationReservation.create({
        patientId: req.user._id,
        medicineId,
        pharmacyId,
        quantity: qty,
        status: 'reserved',
        reservationCode,
        expiresAt,
      });

      return res.status(201).send({
        msg: 'Reservation created',
        reservation,
        qrPayload: reservationCode,
        expiresAt,
      });
    } catch (reservationError) {
      // Rollback reservedCount if reservation insertion fails
      await MedicineStock.findByIdAndUpdate(updatedStock._id, { $inc: { reservedCount: -qty } });
      throw reservationError;
    }
  } catch (error) {
    return res.status(400).send({ msg: 'Reservation failed', error });
  }
});

router.get('/reservations/me', [isAuth], async (req, res) => {
  try {
    const reservations = await MedicationReservation.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('medicineId')
      .populate('pharmacyId');
    return res.status(200).send({ reservations });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot load reservations', error });
  }
});

// Admin/pharmacy: mark as collected (or expired) using the QR code payload
router.post('/reservations/:code/collect', [isAuth, isAdmin], async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();

    const reservation = await MedicationReservation.findOne({ reservationCode: code });
    if (!reservation) return res.status(404).send({ msg: 'Reservation not found' });
    if (reservation.status !== 'reserved') {
      return res.status(400).send({ msg: `Reservation status is '${reservation.status}'` });
    }

    const stock = await MedicineStock.findOne({
      medicineId: reservation.medicineId,
      pharmacyId: reservation.pharmacyId,
    });

    if (!stock) return res.status(404).send({ msg: 'Stock not found for reservation' });
    if (stock.reservedCount < reservation.quantity) {
      return res.status(409).send({ msg: 'Stock state inconsistent with reservation' });
    }

    const isExpired = reservation.expiresAt < now;

    reservation.status = isExpired ? 'expired' : 'collected';
    reservation.collectedAt = isExpired ? null : now;
    await reservation.save();

    await MedicineStock.findByIdAndUpdate(stock._id, { $inc: { reservedCount: -reservation.quantity } });

    return res.status(200).send({ msg: 'Reservation updated', reservation });
  } catch (error) {
    return res.status(400).send({ msg: 'Collect failed', error });
  }
});

module.exports = router;

