import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Rating,
  Chip
} from '@mui/material';
import {
  Person,
  Verified
} from '@mui/icons-material';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {review.patientId?.firstname ? review.patientId.firstname[0].toUpperCase() : <Person />}
          </Avatar>

          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.patientId?.firstname} {review.patientId?.lastname}
              </Typography>
              {review.isVerified && (
                <Chip
                  icon={<Verified />}
                  label="Vérifié"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(review.createdAt)}
              </Typography>
            </Box>

            {review.comment && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;