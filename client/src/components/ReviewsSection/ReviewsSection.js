import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  RateReview,
  Close
} from '@mui/icons-material';
import axios from 'axios';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewForm from '../ReviewForm/ReviewForm';

const ReviewsSection = ({ pharmacyId, pharmacyName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  useEffect(() => {
    fetchReviews();
  }, [pharmacyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/reviews/pharmacy/${pharmacyId}`);
      setReviews(response.data.reviews);

      // Check if current user has already reviewed
      if (user && response.data.reviews.some(review => review.patientId._id === user._id)) {
        setHasUserReviewed(true);
      }
    } catch (err) {
      setError('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewDialog = () => {
    setOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setOpen(false);
  };

  const handleReviewSubmitted = () => {
    setOpen(false);
    setHasUserReviewed(true);
    fetchReviews(); // Refresh reviews
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Avis ({reviews.length})
        </Typography>

        {token && !hasUserReviewed && (
          <Button
            variant="outlined"
            startIcon={<RateReview />}
            onClick={handleOpenReviewDialog}
            size="small"
          >
            Donner un avis
          </Button>
        )}
      </Box>

      {reviews.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Aucun avis pour le moment
          </Typography>
          {token && !hasUserReviewed && (
            <Button
              variant="contained"
              startIcon={<RateReview />}
              onClick={handleOpenReviewDialog}
              sx={{ mt: 2 }}
            >
              Soyez le premier à donner votre avis
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Donner votre avis
          <Button
            onClick={handleCloseReviewDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent>
          <ReviewForm
            pharmacyId={pharmacyId}
            pharmacyName={pharmacyName}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReviewsSection;