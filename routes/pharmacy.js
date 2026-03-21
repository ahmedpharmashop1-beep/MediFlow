const express = require('express');
const Pharmacy = require('../Model/Pharmacy');

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    return res.status(200).send({ pharmacies });
  } catch (error) {
    return res.status(400).send({ msg: 'Cannot fetch pharmacies', error });
  }
});

module.exports = router;

