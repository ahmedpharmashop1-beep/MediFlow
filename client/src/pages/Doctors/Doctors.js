import React, { useState, useEffect } from 'react';
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
  Avatar,
  Rating,
  Paper,
  InputAdornment,
  Fab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search,
  MedicalServices,
  Phone,
  Email,
  FilterList,
  LocalHospital,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';

const Doctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les médecins
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Marie Dubois',
        specialty: 'Cardiologie',
        hospital: 'Hôpital Saint-Louis',
        experience: 15,
        rating: 4.8,
        reviews: 127,
        phone: '+33 1 23 45 67 89',
        email: 'm.dubois@saintlouis.fr',
        avatar: '👩‍⚕️',
        consultationFee: 80,
        availableToday: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' }
        ]
      },
      {
        id: 2,
        name: 'Dr. Jean Martin',
        specialty: 'Pédiatrie',
        hospital: 'Clinique des Enfants',
        experience: 12,
        rating: 4.9,
        reviews: 203,
        phone: '+33 1 23 45 67 90',
        email: 'j.martin@enfants.fr',
        avatar: '👨‍⚕️',
        consultationFee: 65,
        availableToday: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '19:00' }
        ]
      },
      {
        id: 3,
        name: 'Dr. Sophie Bernard',
        specialty: 'Dermatologie',
        hospital: 'Centre Dermatologique',
        experience: 8,
        rating: 4.7,
        reviews: 89,
        phone: '+33 1 23 45 67 91',
        email: 's.bernard@dermato.fr',
        avatar: '👩‍⚕️',
        consultationFee: 70,
        availableToday: false,
        availableDays: ['tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeSlots: [
          { start: '10:00', end: '13:00' },
          { start: '15:00', end: '18:00' }
        ]
      }
    ];
    setDoctors(mockDoctors);
  }, []);

  // Vérifier les disponibilités d'un médecin
  const checkDoctorAvailability = (doctor, date, time) => {
    if (!date || !time) return false;
    
    const dayOfWeek = new Date(date).toLocaleLowerCase('fr-FR', { weekday: 'long' });
    const dayMap = {
      'lundi': 'monday', 'mardi': 'tuesday', 'mercredi': 'wednesday',
      'jeudi': 'thursday', 'vendredi': 'friday', 'samedi': 'saturday', 'dimanche': 'sunday'
    };
    
    const dayKey = dayMap[dayOfWeek] || dayOfWeek;
    const isDayAvailable = doctor.availableDays?.includes(dayKey);
    
    if (!isDayAvailable) return false;
    
    // Vérifier si l'heure est dans les créneaux disponibles
    return doctor.availableTimeSlots?.some(slot => 
      time >= slot.start && time <= slot.end
    );
  };

  // Gérer la réservation
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDialogOpen(true);
  };

  // Confirmer la réservation
  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    try {
      setBookingLoading(true);
      setError(null);
      
      const appointmentData = {
        doctorId: selectedDoctor.id,
        specialty: selectedDoctor.specialty,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: 'Rendez-vous médical'
      };
      
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setSuccess('Rendez-vous pris avec succès !');
      setAppointmentDialogOpen(false);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      
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

  const specialties = [
    'Cardiologie', 'Dermatologie', 'Pédiatrie', 'Gynécologie', 
    'Ophtalmologie', 'ORL', 'Psychiatrie', 'Radiologie'
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (specialty === '' || doctor.specialty === specialty)
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        animation: 'float 20s infinite ease-in-out'
      }} />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: 40,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <MedicalServices />
          </Avatar>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🩺 Trouvez votre médecin
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4
            }}
          >
            Accédez à notre réseau de médecins qualifiés
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF9800'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF9800'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#FF9800'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Spécialité"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                SelectProps={{ 
                  native: true,
                  sx: {
                    '& .MuiOutlinedInput-input': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF9800'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF9800'
                    }
                  }
                }}
              >
                <option value="">Toutes les spécialités</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterList />}
                sx={{
                  background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)',
                  height: 56
                }}
              >
                Filtrer
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Doctors Grid */}
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} md={6} lg={4} key={doctor.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      fontSize: 30,
                      background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)'
                    }}>
                      {doctor.avatar}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" fontWeight="bold" color="#FF9800">
                        {doctor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialty}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({doctor.reviews} avis)
                        </Typography>
                      </Box>
                    </Box>
                    {doctor.availableToday && (
                      <Chip 
                        label="Disponible" 
                        color="success" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🏥 {doctor.hospital}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📅 {doctor.experience} ans d'expérience
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      💰 {doctor.consultationFee}DT consultation
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Phone />}
                      sx={{ borderColor: '#FF9800', color: '#FF9800' }}
                    >
                      Appeler
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Email />}
                      sx={{ borderColor: '#FF9800', color: '#FF9800' }}
                    >
                      Contacter
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CalendarToday />}
                      onClick={() => handleBookAppointment(doctor)}
                      disabled={!doctor.availableDays || doctor.availableDays.length === 0}
                      sx={{
                        background: doctor.availableDays && doctor.availableDays.length > 0 
                          ? 'linear-gradient(45deg, #4CAF50, #45a049)' 
                          : 'linear-gradient(45deg, #9E9E9E, #757575)',
                        '&:hover': {
                          background: doctor.availableDays && doctor.availableDays.length > 0
                            ? 'linear-gradient(45deg, #45a049, #3d8b40)'
                            : 'linear-gradient(45deg, #616161, #424242)'
                        }
                      }}
                    >
                      {doctor.availableDays && doctor.availableDays.length > 0 ? 'Rendez-vous' : 'Non disponible'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="emergency"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #D32F2F 30%, #C2185B 90%)'
            }
          }}
        >
          <LocalHospital />
        </Fab>
      </Container>
      
      {/* Dialogue de réservation */}
      <Dialog open={appointmentDialogOpen} onClose={() => setAppointmentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Prendre rendez-vous</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          {selectedDoctor && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Médecin sélectionné :
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Dr. {selectedDoctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDoctor.specialty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🏥 {selectedDoctor.hospital}
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
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
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Heure souhaitée</InputLabel>
                    <Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      label="Heure souhaitée"
                    >
                      <MenuItem value="">Sélectionner une heure</MenuItem>
                      {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(time => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Créneaux disponibles :</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedDoctor.availableTimeSlots?.map((slot, index) => (
                  <Chip
                    key={index}
                    label={`${slot.start} - ${slot.end}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            disabled={bookingLoading || !selectedDate || !selectedTime}
            color="primary"
          >
            {bookingLoading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Doctors;
