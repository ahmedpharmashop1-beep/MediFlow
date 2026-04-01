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
  CircularProgress,
  Snackbar
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Charger les médecins depuis la base de données
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching doctors from API...');
        const response = await axios.get('http://localhost:5000/api/appointments/doctors-by-hospital');
        
        console.log('📥 Raw doctors data:', response.data.doctors);
        
        // Mapper les données de la BD au format attendu par le frontend
        const formattedDoctors = response.data.doctors.map(doc => ({
          id: doc._id,
          hospitalId: doc.hospitalId,
          name: `${doc.firstName} ${doc.lastName}`,
          specialty: doc.specialization || 'Généraliste',
          hospital: doc.hospitalName || 'Cabinet privé',
          experience: doc.experience || 5,
          rating: doc.rating || 4.5,
          reviews: doc.reviewCount || 0,
          phone: doc.phone || '',
          email: doc.email || '',
          avatar: doc.firstName?.charAt(0).toUpperCase() || 'D',
          consultationFee: doc.consultationFee || 50,
          availableToday: true,
          availableDays: doc.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          availableTimeSlots: doc.availableTimeSlots || [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' }
          ]
        }));
        
        console.log('✅ Formatted doctors:', formattedDoctors);
        setDoctors(formattedDoctors);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des médecins:', err);
        setError('Impossible de charger la liste des médecins');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Générer les créneaux horaires basés sur ceux disponibles du médecin
  const generateTimeSlots = (doctor) => {
    if (!doctor || !doctor.availableTimeSlots) {
      return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
              '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    }
    
    const slots = [];
    doctor.availableTimeSlots.forEach(slot => {
      const [startHour, startMin] = slot.start.split(':');
      const [endHour, endMin] = slot.end.split(':');
      
      let currentHour = parseInt(startHour);
      let currentMin = parseInt(startMin);
      const endHourInt = parseInt(endHour);
      const endMinInt = parseInt(endMin);
      
      while (currentHour < endHourInt || (currentHour === endHourInt && currentMin <= endMinInt)) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push(timeStr);
        
        currentMin += 30;
        if (currentMin >= 60) {
          currentMin = 0;
          currentHour += 1;
        }
      }
    });
    
    return [...new Set(slots)].sort();
  };

  // Vérifier les disponibilités d'un médecin
  const checkDoctorAvailability = (doctor, date, time) => {
    if (!date || !time || !doctor) {
      console.warn('Paramètres manquants:', { date, time, doctor: doctor?.name });
      return false;
    }
    
    try {
      // Récupérer le jour de la semaine (en anglais)
      const dateObj = new Date(date);
      const dayNumber = dateObj.getDay(); // 0=Dimanche, 1=Lundi, etc.
      
      // Mapper les numéros de jours vers les clés anglaises
      const dayMap = {
        1: 'monday',    // Lundi
        2: 'tuesday',   // Mardi
        3: 'wednesday', // Mercredi
        4: 'thursday',  // Jeudi
        5: 'friday',    // Vendredi
        6: 'saturday',  // Samedi
        0: 'sunday'     // Dimanche
      };
      
      const dayKey = dayMap[dayNumber];
      const availableDays = doctor.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      
      // Vérifier si le jour est disponible
      const isDayAvailable = availableDays.includes(dayKey);
      console.log(`Vérification jour: ${dayKey} - Disponible:`, isDayAvailable, 'Jours disponibles:', availableDays);
      
      if (!isDayAvailable) {
        console.warn(`Dr. ${doctor.name} n'est pas disponible le ${dayKey}`);
        return false;
      }
      
      // Vérifier si l'heure est dans les créneaux disponibles
      const timeSlots = doctor.availableTimeSlots || [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '18:00' }
      ];
      
      // Convertir les heures en minutes pour une comparaison numérique
      const [timeHour, timeMin] = time.split(':');
      const timeInMinutes = parseInt(timeHour) * 60 + parseInt(timeMin);
      
      const isTimeAvailable = timeSlots.some(slot => {
        const [startHour, startMin] = slot.start.split(':');
        const [endHour, endMin] = slot.end.split(':');
        const startInMinutes = parseInt(startHour) * 60 + parseInt(startMin);
        const endInMinutes = parseInt(endHour) * 60 + parseInt(endMin);
        
        return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
      });
      
      console.log(`Vérification heure: ${time} - Disponible:`, isTimeAvailable, 'Créneaux:', timeSlots);
      
      return isTimeAvailable;
      
    } catch (error) {
      console.error('Erreur dans checkDoctorAvailability:', error);
      return false;
    }
  };

  // Gérer la réservation
  const handleBookAppointment = (doctor) => {
    console.log('📍 Selected doctor:', doctor);
    setSelectedDoctor(doctor);
    setAppointmentDialogOpen(true);
  };

  // Appeler le médecin
  const handleCall = (doctor) => {
    if (!doctor.phone) {
      alert('Numéro de téléphone non disponible');
      return;
    }
    window.open(`tel:${doctor.phone}`);
  };

  // Contacter le médecin par email
  const handleContact = (doctor) => {
    if (!doctor.email) {
      alert('Adresse email non disponible');
      return;
    }
    
    // Display success alert without opening email client
    alert(`✉️ Email envoyé avec succès à Dr. ${doctor.name}\n\nAdresse: ${doctor.email}`);
  };

  // Confirmer la réservation
  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('❌ Veuillez remplir tous les champs (date et heure)');
      return;
    }

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      setError(`❌ Session expirée\n\nVous devez être connecté pour prendre un rendez-vous.\n\nVeuillez vous reconnecter.`);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }
    
    try {
      setBookingLoading(true);
      setError(null);
      
      // Vérifier d'abord si le créneau est disponible
      const isAvailable = checkDoctorAvailability(selectedDoctor, selectedDate, selectedTime);
      
      if (!isAvailable) {
        // Format the appointment date nicely
        const appointmentDateObj = new Date(selectedDate);
        const formattedDate = appointmentDateObj.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Traduire les jours disponibles
        const dayTranslation = {
          'monday': 'Lundi',
          'tuesday': 'Mardi',
          'wednesday': 'Mercredi',
          'thursday': 'Jeudi',
          'friday': 'Vendredi',
          'saturday': 'Samedi',
          'sunday': 'Dimanche'
        };
        
        const availableDays = (selectedDoctor.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
          .map(day => dayTranslation[day] || day)
          .join(', ');
        
        const availableHours = (selectedDoctor.availableTimeSlots || [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' }
        ])
          .map(slot => `${slot.start} - ${slot.end}`)
          .join(', ');
        
        setError(
          `❌ Rendez-vous indisponible !\n\n` +
          `Le Dr. ${selectedDoctor.name} n'est pas disponible à cette date et cette heure.\n\n` +
          `📅 Date demandée: ${formattedDate}\n` +
          `🕐 Heure demandée: ${selectedTime}\n\n` +
          `⏰ Créneaux disponibles: ${availableHours}\n` +
          `📍 Jours de consultation: ${availableDays}\n\n` +
          `✨ Veuillez sélectionner un créneau disponible.`
        );
        setBookingLoading(false);
        return;
      }
      
      const appointmentData = {
        doctorId: selectedDoctor.id,
        hospitalId: selectedDoctor.hospitalId || 'private',
        specialty: selectedDoctor.specialty,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: 'Rendez-vous médical'
      };
      
      console.log('📤 Sending appointment data:', appointmentData);
      console.log('🎫 Token:', localStorage.getItem('token')?.substring(0, 20) + '...');
      
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      console.log('✅ Success response:', response.data);
      
      // Format the appointment date nicely
      const appointmentDateObj = new Date(selectedDate);
      const formattedDate = appointmentDateObj.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Detailed success message
      const successMsg = `✅ Rendez-vous confirmé avec succès !\n\n` +
        `👨‍⚕️ Médecin: Dr. ${selectedDoctor.name}\n` +
        `🔬 Spécialité: ${selectedDoctor.specialty}\n` +
        `🏥 Cabinet: ${selectedDoctor.hospital}\n` +
        `📅 Date: ${formattedDate}\n` +
        `🕐 Heure: ${selectedTime}\n` +
        `💰 Tarif consultation: ${selectedDoctor.consultationFee} DT\n\n` +
        `📧 Email: ${selectedDoctor.email}\n` +
        `📱 Téléphone: ${selectedDoctor.phone}\n\n` +
        `✨ Rappelez-vous de vous présenter 10 minutes avant l'heure du rendez-vous.`;
      
      setSuccessMessage(successMsg);
      setShowSuccess(true);
      setAppointmentDialogOpen(false);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setError(null);
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/appointments');
      }, 5000);
      
    } catch (err) {
      console.error('❌ Error lors de la réservation:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      
      let errorMsg = 'Erreur lors de la prise de rendez-vous';
      
      if (err.response?.status === 401) {
        errorMsg = '❌ Session expirée\n\nVous devez être connecté pour prendre un rendez-vous.\n\nRedirection vers la connexion...';
        setError(errorMsg);
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }, 3000);
        setBookingLoading(false);
        return;
      } else if (err.response?.status === 404) {
        errorMsg = err.response.data?.msg || 'Médecin non trouvé';
      } else if (err.response?.status === 409) {
        errorMsg = 'Ce créneau est déjà réservé. Veuillez sélectionner un autre.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Erreur serveur. ' + (err.response.data?.msg || 'Veuillez réessayer');
      } else if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(`❌ ${errorMsg}\n\nVeuillez réessayer ou contacter le support.`);
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
                      onClick={() => handleCall(doctor)}
                      sx={{ borderColor: '#FF9800', color: '#FF9800' }}
                      title={doctor.phone || 'Numéro non disponible'}
                    >
                      Appeler
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Email />}
                      onClick={() => handleContact(doctor)}
                      sx={{ borderColor: '#FF9800', color: '#FF9800' }}
                      title={doctor.email || 'Email non disponible'}
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
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
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
                      {selectedDoctor && generateTimeSlots(selectedDoctor).map(time => (
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
      
      {/* Snackbar pour le message de succès */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            fontSize: '0.95rem'
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Doctors;
