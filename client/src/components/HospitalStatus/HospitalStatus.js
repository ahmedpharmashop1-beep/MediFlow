import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  LocalHospital,
  AccessTime,
  People,
  Warning,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

const HospitalStatus = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHospitalStatus();
  }, []);

  const fetchHospitalStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/hospital/queues');
      setHospitals(response.data.hospitals || []);
    } catch (err) {
      setError('Erreur lors du chargement du statut des hôpitaux');
      // Fallback data for demonstration
      setHospitals([
        {
          name: 'Hôpital Central',
          estimatedWaitMin: 95,
          patientsAhead: 14,
          saturated: false,
          capacity: { totalBeds: 200, occupiedBeds: 180 },
          specialties: ['Médecine générale', 'Cardiologie', 'Urgence']
        },
        {
          name: 'Hôpital Régional',
          estimatedWaitMin: 180,
          patientsAhead: 26,
          saturated: true,
          capacity: { totalBeds: 150, occupiedBeds: 145 },
          specialties: ['Médecine générale', 'Pédiatrie', 'Gynécologie']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCapacityPercentage = (hospital) => {
    if (!hospital.capacity) return 0;
    return Math.round((hospital.capacity.occupiedBeds / hospital.capacity.totalBeds) * 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          🏥 Statut des Hôpitaux
        </Typography>
        <Tooltip title="Actualiser">
          <IconButton onClick={fetchHospitalStatus} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {hospitals.map((hospital, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{
              height: '100%',
              border: '1px solid',
              borderColor: hospital.saturated ? 'error.main' : 'divider',
              '&:hover': {
                boxShadow: 3,
                borderColor: hospital.saturated ? 'error.main' : 'primary.main'
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalHospital color={hospital.saturated ? 'error' : 'primary'} />
                    <Typography variant="h6" fontWeight="bold">
                      {hospital.name}
                    </Typography>
                  </Box>

                  {hospital.saturated && (
                    <Chip
                      icon={<Warning />}
                      label="SATURÉ"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>

                {/* Queue Status */}
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    File d'attente aux urgences
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Attente estimée: {hospital.estimatedWaitMin} min
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <People sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Patients devant vous: {hospital.patientsAhead}
                    </Typography>
                  </Box>
                </Box>

                {/* Capacity Status */}
                {hospital.capacity && (
                  <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Occupation des lits
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="body2">
                        {hospital.capacity.occupiedBeds}/{hospital.capacity.totalBeds} lits occupés
                      </Typography>
                      <Chip
                        label={`${getCapacityPercentage(hospital)}%`}
                        color={getCapacityColor(getCapacityPercentage(hospital))}
                        size="small"
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={getCapacityPercentage(hospital)}
                      color={getCapacityColor(getCapacityPercentage(hospital))}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                {/* Specialties */}
                {hospital.specialties && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Spécialités disponibles
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {hospital.specialties.slice(0, 4).map((specialty, idx) => (
                        <Chip
                          key={idx}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                      {hospital.specialties.length > 4 && (
                        <Chip
                          label={`+${hospital.specialties.length - 4}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Status Indicator */}
                <Box mt={2} p={1} borderRadius={1} sx={{
                  backgroundColor: hospital.saturated ? 'error.50' : 'success.50',
                  border: '1px solid',
                  borderColor: hospital.saturated ? 'error.200' : 'success.200'
                }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {hospital.saturated ? (
                      <Warning color="error" />
                    ) : (
                      <CheckCircle color="success" />
                    )}
                    <Typography variant="body2" color={hospital.saturated ? 'error.main' : 'success.main'}>
                      {hospital.saturated
                        ? 'Hôpital saturé - Évitez si possible'
                        : 'Hôpital opérationnel'
                      }
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>ℹ️ Information:</strong> Ces données sont mises à jour en temps réel.
          En cas d'urgence, contactez le SAMU au 15.
        </Typography>
      </Alert>
    </Box>
  );
};

export default HospitalStatus;