import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  LocalPhone,
  Star,
  Directions,
  RateReview
} from '@mui/icons-material';

const PharmacyCard = ({
  pharmacy,
  medicine,
  availableQty,
  requestedQty,
  distanceKm,
  onReserve,
  loading,
  showReservationButton = true,
  onViewReviews
}) => {
  const handleGetDirections = () => {
    const address = encodeURIComponent(pharmacy.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {pharmacy.name}
          </Typography>
          {distanceKm !== null && distanceKm !== undefined && (
            <Chip
              icon={<LocationOn />}
              label={`${distanceKm.toFixed(1)} km`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" mb={1} color="text.secondary">
          <LocationOn sx={{ fontSize: 16, mr: 1 }} />
          <Typography variant="body2">
            {pharmacy.address}
          </Typography>
        </Box>

        {pharmacy.phone && (
          <Box display="flex" alignItems="center" mb={1} color="text.secondary">
            <LocalPhone sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="body2">
              {pharmacy.phone}
            </Typography>
          </Box>
        )}

        {pharmacy.rating && (
          <Box display="flex" alignItems="center" mb={2}>
            <Star sx={{ fontSize: 16, mr: 1, color: 'gold' }} />
            <Typography variant="body2">
              {pharmacy.rating} ({pharmacy.reviewCount || 0} avis)
            </Typography>
          </Box>
        )}

        <Box 
          sx={{ 
            backgroundColor: 'grey.50', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {medicine?.commercialName || medicine?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {medicine?.description || `Disponibilité: ${availableQty} unités`}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" fontWeight="bold">
              Stock: <span style={{ color: availableQty >= requestedQty ? 'green' : 'red' }}>
                {availableQty}
              </span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Demandé: {requestedQty}
            </Typography>
          </Box>
        </Box>

        {pharmacy.openingHours && (
          <Box display="flex" alignItems="center" mt={1} color="text.secondary">
            <AccessTime sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption">
              {pharmacy.openingHours}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="Obtenir l'itinéraire">
            <IconButton 
              onClick={handleGetDirections}
              color="primary"
              size="small"
            >
              <Directions />
            </IconButton>
          </Tooltip>
          
          {onViewReviews && (
            <Tooltip title="Voir les avis">
              <IconButton 
                onClick={() => onViewReviews(pharmacy)}
                color="secondary"
                size="small"
              >
                <RateReview />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {showReservationButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onReserve({ pharmacy, medicine, availableQty })}
            disabled={loading || availableQty < requestedQty}
            sx={{
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            {loading ? 'Réservation...' : 'Réserver'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default PharmacyCard;
