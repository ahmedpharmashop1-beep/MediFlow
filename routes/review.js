const express = require('express');
const {
  createReview,
  getPharmacyReviews,
  getPatientReviews,
  updateReview,
  deleteReview
} = require('../controllers/review');

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get reviews for a specific pharmacy
router.get('/pharmacy/:pharmacyId', getPharmacyReviews);

// Get reviews by the authenticated patient
router.get('/my-reviews', getPatientReviews);

// Update a review
router.put('/:reviewId', updateReview);

// Delete a review
router.delete('/:reviewId', deleteReview);

module.exports = router;