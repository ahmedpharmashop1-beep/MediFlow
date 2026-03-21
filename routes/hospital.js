const express = require('express');

const router = express.Router();

// Minimal hospital queue endpoint (ready for real DB data)
router.get('/queues', async (req, res) => {
  return res.status(200).send({
    hospitals: [
      { name: 'Hopital Central', estimatedWaitMin: 95, patientsAhead: 14, saturated: false },
      { name: 'Hopital Regional', estimatedWaitMin: 180, patientsAhead: 26, saturated: true },
    ],
  });
});

module.exports = router;

