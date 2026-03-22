import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Rating,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Star,
  Send
} from '@mui/icons-material';
import axios from 'axios';

const ReviewForm = ({ pharmacyId, pharmacyName, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reviews', {
        pharmacyId,
        rating,
        comment: comment.trim(),
        isVerified: false // Could be set to true if user has purchased from pharmacy
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setRating(0);
      setComment('');

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Donner votre avis sur {pharmacyName}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Merci pour votre avis !
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Note *
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" />}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Commentaire (optionnel)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 500 }}
            helperText={`${comment.length}/500 caractères`}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            disabled={loading || rating === 0}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;