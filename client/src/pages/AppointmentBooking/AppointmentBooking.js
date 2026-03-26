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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  Search,
  MedicalServices,
  Phone,
  Email,
  CalendarToday,
  LocationOn,
  Star,
  Person
} from '@mui/icons-material';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Données
  const [doctors, setDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const specialties = [
    'Médecine générale',
    'Cardiologie',
    'Dermatologie',
    'Pédiatrie',
    'Gynécologie',
    'Ophtalmologie',
    'ORL',
    'Psychiatrie',
    'Radiologie',
    'Orthopédie'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Rechercher les médecins disponibles
  const searchAvailableDoctors = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/schedule/doctors/available', {
        params: {
          date: selectedDate,
          time: selectedTime,
          specialty: selectedSpecialty
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAvailableDoctors(response.data.availableDoctors || []);
    } catch (err) {
      console.error('Erreur lors de la recherche des médecins:', err);
      setError(err?.response?.data?.msg || 'Erreur lors de la recherche des médecins disponibles');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTime, selectedSpecialty, token]);

  // Effet pour déclencher la recherche
  useEffect(() => {
    searchAvailableDoctors();
  }, [searchAvailableDoctors]);

  // Ouvrir le dialogue de réservation
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingDialogOpen(true);
  };

  // Confirmer la réservation
  const handleConfirmBooking = async () => {
    if (!selectedDoctor) return;

    try {
      setBookingLoading(true);
      
      const appointmentData = {
        doctorId: selectedDoctor._id,
        specialty: selectedDoctor.specialization,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: 'Rendez-vous médical'
      };

      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Rendez-vous pris avec succès !');
      setBookingDialogOpen(false);
      setSelectedDoctor(null);
      
      setTimeout(() => {
        setSuccess(null);
        navigate('/appointments');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      setError(err?.response?.data?.msg || 'Erreur lors de la prise de rendez-vous');
    } finally {
      setBookingLoading(false);
    }
  };

  // Filtrer les médecins
  const filteredDoctors = availableDoctors.filter(doctor => {
    const searchMatch = !searchTerm || 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const specialtyMatch = !selectedSpecialty || doctor.specialization === selectedSpecialty;
    
    return searchMatch && specialtyMatch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        <CalendarToday sx={{ mr: 2, verticalAlign: 'middle' }} />
        Prendre un Rendez-vous
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

      {/* Section de recherche et filtres */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rechercher un médecin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#FF9800' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                label="Spécialité"
              >
                <MenuItem value="">Toutes les spécialités</MenuItem>
                {specialties.map(specialty => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Date du rendez-vous"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Heure souhaitée</InputLabel>
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                label="Heure souhaitée"
                disabled={!selectedDate}
              >
                <MenuItem value="">Sélectionner une heure</MenuItem>
                {timeSlots.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bouton de recherche */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={searchAvailableDoctors}
          disabled={!selectedDate || !selectedTime || loading}
          sx={{
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #FF9800, #F57C00)',
            '&:hover': {
              background: 'linear-gradient(45deg, #F57C00, #E65100)'
            }
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : <Search sx={{ mr: 1 }} />}
          Rechercher les médecins disponibles
        </Button>
      </Box>

      {/* Liste des médecins disponibles */}
      {filteredDoctors.length > 0 && (
        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
          {filteredDoctors.length} médecin(s) disponible(s) pour le {selectedDate} à {selectedTime}
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredDoctors.map(doctor => (
          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
            <Card sx={{
              height: '100%',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: '#FF9800' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialization}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip
                    icon={<LocationOn />}
                    label={doctor.hospitalName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Star sx={{ color: '#FFD700', mr: 0.5 }} />
                    <Typography variant="body2">
                      {doctor.rating || '4.5'} ({doctor.reviews || 0} avis)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MedicalServices sx={{ color: '#FF9800', mr: 0.5 }} />
                    <Typography variant="body2">
                      {doctor.experience} ans d'expérience
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ color: '#FF9800', mr: 1 }} />
                    <Typography variant="body2">{doctor.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ color: '#FF9800', mr: 1 }} />
                    <Typography variant="body2">{doctor.email}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CalendarToday />}
                  onClick={() => handleBookAppointment(doctor)}
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049, #3d8b40)'
                    }
                  }}
                >
                  Prendre rendez-vous
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDoctors.length === 0 && selectedDate && selectedTime && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Aucun médecin disponible pour cette date et heure
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Essayez une autre date ou heure
          </Typography>
        </Box>
      )}

      {/* Dialogue de confirmation de réservation */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmer le rendez-vous</DialogTitle>
        <DialogContent>
          {selectedDoctor && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Vous avez sélectionné :
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDoctor.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDoctor.hospitalName}
                </Typography>
              </Box>
              <Typography variant="body1">
                <strong>Date :</strong> {selectedDate}<br />
                <strong>Heure :</strong> {selectedTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            disabled={bookingLoading}
            color="primary"
          >
            {bookingLoading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentBooking;
