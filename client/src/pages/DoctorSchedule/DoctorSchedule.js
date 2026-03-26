import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Schedule,
  AccessTime,
  Save,
  Add,
  Delete,
  EventAvailable,
  EventBusy
} from '@mui/icons-material';

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // État du formulaire
  const [schedule, setSchedule] = useState({
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableTimeSlots: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ]
  });
  
  const [newTimeSlot, setNewTimeSlot] = useState({ start: '', end: '' });
  const [addTimeSlotOpen, setAddTimeSlotOpen] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Jours de la semaine
  const daysOfWeek = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  // Charger les horaires existants
  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/doctors/${user._id}/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.schedule) {
        setSchedule(response.data.schedule);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des horaires:', err);
      setError(err?.response?.data?.msg || 'Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    if (!token || user.role !== 'doctor') {
      navigate('/login');
      return;
    }
    fetchSchedule();
  }, [navigate, token, user.role, fetchSchedule]);

  // Sauvegarder les horaires
  const handleSaveSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`http://localhost:5000/api/schedule/doctors/${user._id}/schedule`, schedule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Horaires mis à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err?.response?.data?.msg || 'Erreur lors de la sauvegarde des horaires');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les jours de disponibilité
  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  // Ajouter un créneau horaire
  const handleAddTimeSlot = () => {
    if (newTimeSlot.start && newTimeSlot.end) {
      setSchedule(prev => ({
        ...prev,
        availableTimeSlots: [...prev.availableTimeSlots, { ...newTimeSlot }]
      }));
      setNewTimeSlot({ start: '', end: '' });
      setAddTimeSlotOpen(false);
    }
  };

  // Supprimer un créneau horaire
  const handleRemoveTimeSlot = (index) => {
    setSchedule(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index)
    }));
  };

  if (loading && !schedule.availableDays.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Chargement des horaires...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        <Schedule sx={{ mr: 2, verticalAlign: 'middle' }} />
        Gestion des Horaires
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Jours de disponibilité */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                Jours de disponibilité
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {daysOfWeek.map(day => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Switch
                        checked={schedule.availableDays.includes(day.value)}
                        onChange={() => handleDayToggle(day.value)}
                        color="primary"
                      />
                    }
                    label={day.label}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Créneaux horaires */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                  <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Créneaux horaires
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setAddTimeSlotOpen(true)}
                  size="small"
                >
                  Ajouter
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {schedule.availableTimeSlots.map((slot, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<EventAvailable />}
                      label={`${slot.start} - ${slot.end}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleRemoveTimeSlot(index)}
                    >
                      Supprimer
                    </Button>
                  </Box>
                ))}
              </Box>

              {schedule.availableTimeSlots.length === 0 && (
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="text.secondary">
                    Aucun créneau horaire défini
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Aperçu des disponibilités */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                Aperçu des disponibilités
              </Typography>
              
              <Grid container spacing={2}>
                {daysOfWeek.map(day => {
                  const isAvailable = schedule.availableDays.includes(day.value);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={day.value}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: isAvailable ? '#e8f5e8' : '#ffebee',
                          border: `2px solid ${isAvailable ? '#4caf50' : '#f44336'}`,
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {day.label}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {isAvailable ? (
                            <Chip
                              icon={<EventAvailable />}
                              label="Disponible"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<EventBusy />}
                              label="Non disponible"
                              color="error"
                              size="small"
                            />
                          )}
                        </Box>
                        {isAvailable && schedule.availableTimeSlots.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {schedule.availableTimeSlots.map((slot, index) => (
                              <Chip
                                key={index}
                                label={`${slot.start} - ${slot.end}`}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bouton de sauvegarde */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSaveSchedule}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #2c7fb8)'
            }
          }}
        >
          {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les horaires'}
        </Button>
      </Box>

      {/* Dialogue pour ajouter un créneau */}
      <Dialog open={addTimeSlotOpen} onClose={() => setAddTimeSlotOpen(false)}>
        <DialogTitle>Ajouter un créneau horaire</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Heure de début"
              type="time"
              value={newTimeSlot.start}
              onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start: e.target.value })}
              fullWidth
            />
            <TextField
              label="Heure de fin"
              type="time"
              value={newTimeSlot.end}
              onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTimeSlotOpen(false)}>Annuler</Button>
          <Button onClick={handleAddTimeSlot} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorSchedule;
