const express = require('express');
const Pharmacy = require('../Model/Pharmacy');
const Medicine = require('../Model/Medicine');
const MedicineStock = require('../Model/MedicineStock');
const MedicationReservation = require('../Model/MedicationReservation');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

const getPharmacyForCompte = async (compte) => {
  if (!compte) return null;
  if (compte.role === 'pharmacist') {
    let pharmacy = await Pharmacy.findOne({ name: compte.pharmacyName });
    if (!pharmacy) {
      pharmacy = await Pharmacy.create({
        name: compte.pharmacyName || 'Pharmacy',
        address: compte.address || '',
        phone: compte.phone || '',
        lat: 0,
        lng: 0,
      });
    }
    return pharmacy;
  }
  if (compte.role === 'cnam_admin' || compte.isAdmin) return null;
  return null;
};

router.get('/all', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    return res.status(200).send({ pharmacies });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacies', error });
  }
});

router.get('/medicines', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    let stockQuery = {};

    if (compte.role === 'pharmacist') {
      const pharmacy = await getPharmacyForCompte(compte);
      if (!pharmacy) return res.status(404).send({ msg: 'Pharmacy profile not found' });
      stockQuery = { pharmacyId: pharmacy._id };
    } else if (compte.role === 'cnam_admin' || compte.isAdmin) {
      // admin can see all
      stockQuery = {};
    } else {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const stocks = await MedicineStock.find(stockQuery)
      .populate('medicineId')
      .populate('pharmacyId');

    const medicines = stocks.map((s) => ({
      _id: s._id,
      medicineId: s.medicineId?._id,
      name: s.medicineId?.name || s.description || 'Sans nom',
      dosage: s.medicineId?.dosage || '',
      form: s.medicineId?.form || '',
      description: s.description || '',
      category: s.category || '',
      price: s.price || 0,
      stock: s.stockCount,
      reservedCount: s.reservedCount,
      pharmacy: s.pharmacyId ? {
        _id: s.pharmacyId._id,
        name: s.pharmacyId.name,
        address: s.pharmacyId.address,
      } : null,
    }));

    return res.status(200).send({ medicines });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacy medicines', error });
  }
});

router.post('/medicines', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Unauthorized' });
    }

    const { name, description = '', price = 0, stock = 0, category = '', dosage = '', form = '' } = req.body;
    if (!name) return res.status(400).send({ msg: 'Missing field: name' });

    let medicine = await Medicine.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (!medicine) {
      medicine = await Medicine.create({ name: name.trim(), dosage, form });
    } else {
      if (dosage || form) {
        medicine.dosage = dosage || medicine.dosage;
        medicine.form = form || medicine.form;
        await medicine.save();
      }
    }

    const pharmacy = await getPharmacyForCompte(compte);
    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const pharmacyId = pharmacy ? pharmacy._id : null;

    const existingStock = await MedicineStock.findOne({ medicineId: medicine._id, pharmacyId });
    let medicineStock;

    if (existingStock) {
      existingStock.stockCount = Number(stock);
      existingStock.price = Number(price);
      existingStock.description = description;
      existingStock.category = category;
      await existingStock.save();
      medicineStock = existingStock;
    } else {
      medicineStock = await MedicineStock.create({
        medicineId: medicine._id,
        pharmacyId,
        stockCount: Number(stock),
        reservedCount: 0,
        price: Number(price),
        description,
        category,
      });
    }

    return res.status(201).send({ msg: 'Medicine saved', medicine: {
      _id: medicineStock._id,
      medicineId: medicine._id,
      name: medicine.name,
      dosage: medicine.dosage,
      form: medicine.form,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
    }});
  } catch (error) {
    return res.status(400).send({ msg: 'Could not save medicine', error });
  }
});

router.put('/medicines/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const { name, description, price, stock, category, dosage, form } = req.body;

    const pharmacy = await getPharmacyForCompte(compte);
    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const filters = { _id: id };
    if (pharmacy) filters.pharmacyId = pharmacy._id;

    const medicineStock = await MedicineStock.findOne(filters);
    if (!medicineStock) return res.status(404).send({ msg: 'Pharmacy medicine not found' });

    if (stock !== undefined) medicineStock.stockCount = Number(stock);
    if (price !== undefined) medicineStock.price = Number(price);
    if (description !== undefined) medicineStock.description = description;
    if (category !== undefined) medicineStock.category = category;

    await medicineStock.save();

    if (name || dosage || form) {
      const medicine = await Medicine.findById(medicineStock.medicineId);
      if (medicine) {
        if (name) medicine.name = name;
        if (dosage) medicine.dosage = dosage;
        if (form) medicine.form = form;
        await medicine.save();
      }
    }

    return res.status(200).send({ msg: 'Pharmacy medicine updated', medicineStock });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot update pharmacy medicine', error });
  }
});

router.delete('/medicines/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const pharmacy = await getPharmacyForCompte(compte);

    if (!pharmacy && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(404).send({ msg: 'Pharmacy profile not found' });
    }

    const filters = { _id: id };
    if (pharmacy) filters.pharmacyId = pharmacy._id;

    const medicineStock = await MedicineStock.findOneAndDelete(filters);
    if (!medicineStock) return res.status(404).send({ msg: 'Pharmacy medicine not found' });

    return res.status(200).send({ msg: 'Pharmacy medicine deleted' });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot delete pharmacy medicine', error });
  }
});

router.get('/reservations', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const pharmacy = await getPharmacyForCompte(compte);
    const query = {};

    if (pharmacy) query.pharmacyId = pharmacy._id;
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const reservations = await MedicationReservation.find(query)
      .populate('patientId', 'firstName lastName email')
      .populate('medicineId', 'name')
      .populate('pharmacyId', 'name address');

    const normalized = reservations.map((r) => ({
      _id: r._id,
      patient: r.patientId ? {
        _id: r.patientId._id,
        name: `${r.patientId.firstName || ''} ${r.patientId.lastName || ''}`.trim() || r.patientId.email,
      } : null,
      medicine: r.medicineId ? { _id: r.medicineId._id, name: r.medicineId.name } : null,
      pharmacy: r.pharmacyId ? { _id: r.pharmacyId._id, name: r.pharmacyId.name } : null,
      quantity: r.quantity,
      status: r.status,
      createdAt: r.createdAt,
    }));

    return res.status(200).send({ reservations: normalized });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch reservations', error });
  }
});

router.put('/reservations/:id', isAuth, async (req, res) => {
  try {
    const compte = req.compte;
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'collected', 'expired'].includes(status)) {
      return res.status(400).send({ msg: 'Invalid status' });
    }

    const pharmacy = await getPharmacyForCompte(compte);
    if (compte.role !== 'pharmacist' && !(compte.isAdmin || compte.role === 'cnam_admin')) {
      return res.status(403).send({ msg: 'Access denied' });
    }

    const query = { _id: id };
    if (pharmacy) query.pharmacyId = pharmacy._id;

    const reservation = await MedicationReservation.findOne(query);
    if (!reservation) return res.status(404).send({ msg: 'Reservation not found' });

    if (reservation.status === status) return res.status(200).send({ msg: 'No change', reservation });

    const previousStatus = reservation.status;
    reservation.status = status;
    if (status === 'cancelled') reservation.cancelledAt = new Date();
    if (status === 'collected') reservation.collectedAt = new Date();
    await reservation.save();

    // Ajuster stock réservé si transition from reserved
    if (previousStatus === 'reserved' && ['cancelled', 'confirmed', 'collected', 'expired'].includes(status)) {
      await MedicineStock.findOneAndUpdate(
        { medicineId: reservation.medicineId, pharmacyId: reservation.pharmacyId },
        { $inc: { reservedCount: -reservation.quantity }}
      );
    }

    return res.status(200).send({ msg: 'Reservation status updated', reservation });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot update reservation', error });
  }
});

module.exports = router;

