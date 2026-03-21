import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  LocalPharmacy,
  QrCode,
  ContentCopy
} from '@mui/icons-material';

const ReservationCard = ({
  reservation,
  qrPayload,
  expiresAt,
  pharmacy,
  medicine,
  quantity
}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrPayload || reservation?.reservationCode);
  };

  const formatExpirationTime = () => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffMs = expiration - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) return 'Expiré';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}min`;
  };

  const isExpired = new Date() > new Date(expiresAt);

  return (
    <Card 
      sx={{ 
        mt: 3,
        border: isExpired ? '2px solid red' : '2px solid green',
        backgroundColor: isExpired ? 'error.light' : 'success.light',
        animation: 'slideIn 0.5s ease-out'
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <CheckCircle 
            sx={{ 
              fontSize: 28, 
              mr: 2,
              color: isExpired ? 'error.main' : 'success.main'
            }} 
          />
          <Typography variant="h6" color={isExpired ? 'error.main' : 'success.main'}>
            {isExpired ? 'Réservation expirée' : 'Réservation confirmée'}
          </Typography>
        </Box>

        <Alert 
          severity={isExpired ? 'error' : 'success'} 
          sx={{ mb: 2 }}
        >
          {isExpired 
            ? 'Votre réservation a expiré. Veuillez effectuer une nouvelle recherche.'
            : 'Présentez ce code à la pharmacie pour retirer vos médicaments.'
          }
        </Alert>

        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Code de réservation
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ 
              backgroundColor: 'grey.100', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {qrPayload || reservation?.reservationCode}
            <Button
              startIcon={<ContentCopy />}
              onClick={handleCopyCode}
              size="small"
              variant="outlined"
            >
              Copier
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Expire dans:
            </Typography>
          </Box>
          <Chip
            label={formatExpirationTime()}
            color={isExpired ? 'error' : 'warning'}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <LocalPharmacy sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Pharmacie:
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight="bold">
            {pharmacy?.name}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Médicament:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {medicine?.commercialName || medicine?.name} ({quantity} unités)
          </Typography>
        </Box>

        {!isExpired && (
          <Box mt={2} textAlign="center">
            <QrCode sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
            <Typography variant="caption" display="block" color="text.secondary">
              QR Code disponible en version complète
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
