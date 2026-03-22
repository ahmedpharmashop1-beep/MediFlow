const express = require('express');
const {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  updateQueueStatus,
  getHospitalStats
} = require('../controllers/hospital');

const router = express.Router();

// Get all hospitals (public)
router.get('/', getAllHospitals);

// Get hospital by ID (public)
router.get('/:hospitalId', getHospitalById);

// Get hospital statistics (public)
router.get('/:hospitalId/stats', getHospitalStats);

// Create hospital (admin only)
router.post('/', createHospital);

// Update hospital (admin only)
router.put('/:hospitalId', updateHospital);

// Update queue status (authenticated users)
router.put('/:hospitalId/queue', updateQueueStatus);

// Legacy endpoint for queue status (backward compatibility)
router.get('/queues', async (req, res) => {
  try {
    const { getAllHospitals } = require('../controllers/hospital');
    const result = await getAllHospitals(req, res);
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch queues', error });
  }
});

module.exports = router;

