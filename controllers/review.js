const Review = require('../Model/Review');
const Pharmacy = require('../Model/Pharmacy');
const isAuth = require('../middlewares/isAuth');

exports.createReview = [isAuth, async (req, res) => {
  try {
    const { pharmacyId, rating, comment = '', isVerified = false } = req.body;
    const patientId = req.user._id;

    if (!pharmacyId || !rating) {
      return res.status(400).send({ msg: 'Missing required fields: pharmacyId, rating' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).send({ msg: 'Rating must be between 1 and 5' });
    }

    // Check if pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).send({ msg: 'Pharmacy not found' });
    }

    // Create or update review
    const review = await Review.findOneAndUpdate(
      { patientId, pharmacyId },
      { rating, comment, isVerified },
      { upsert: true, new: true }
    );

    // Update pharmacy rating and review count
    await updatePharmacyRating(pharmacyId);

    return res.status(201).send({ msg: 'Review submitted successfully', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ msg: 'You have already reviewed this pharmacy' });
    }
    return res.status(400).send({ msg: 'Failed to submit review', error });
  }
}];

exports.getPharmacyReviews = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!pharmacyId) {
      return res.status(400).send({ msg: 'Pharmacy ID is required' });
    }

    const reviews = await Review.find({ pharmacyId })
      .populate('patientId', 'firstname lastname')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ pharmacyId });

    return res.status(200).send({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch reviews', error });
  }
};

exports.getPatientReviews = [isAuth, async (req, res) => {
  try {
    const patientId = req.user._id;
    const reviews = await Review.find({ patientId })
      .populate('pharmacyId', 'name address')
      .sort({ createdAt: -1 });

    return res.status(200).send({ reviews });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to fetch your reviews', error });
  }
}];

exports.updateReview = [isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, isVerified } = req.body;
    const patientId = req.user._id;

    if (!reviewId) {
      return res.status(400).send({ msg: 'Review ID is required' });
    }

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, patientId },
      { rating, comment, isVerified },
      { new: true }
    );

    if (!review) {
      return res.status(404).send({ msg: 'Review not found or you do not have permission to update it' });
    }

    // Update pharmacy rating
    await updatePharmacyRating(review.pharmacyId);

    return res.status(200).send({ msg: 'Review updated successfully', review });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to update review', error });
  }
}];

exports.deleteReview = [isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const patientId = req.user._id;

    const review = await Review.findOneAndDelete({ _id: reviewId, patientId });

    if (!review) {
      return res.status(404).send({ msg: 'Review not found or you do not have permission to delete it' });
    }

    // Update pharmacy rating
    await updatePharmacyRating(review.pharmacyId);

    return res.status(200).send({ msg: 'Review deleted successfully' });
  } catch (error) {
    return res.status(400).send({ msg: 'Failed to delete review', error });
  }
}];

// Helper function to update pharmacy rating and review count
async function updatePharmacyRating(pharmacyId) {
  try {
    const mongoose = require('mongoose');
    const result = await Review.aggregate([
      { $match: { pharmacyId: new mongoose.Types.ObjectId(pharmacyId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const rating = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
    const reviewCount = result.length > 0 ? result[0].reviewCount : 0;

    await Pharmacy.findByIdAndUpdate(pharmacyId, { rating, reviewCount });
  } catch (error) {
    console.error('Error updating pharmacy rating:', error);
  }
}