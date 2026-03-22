import React, { useState, useEffect } from 'react';
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
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Search,
  MedicalServices,
  Phone,
  Email,
  LocationOn,
  Star,
  AccessTime,
  FilterList,
  Science,
  LocalHospital
} from '@mui/icons-material';

const Doctors = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);

  const specialties = [
    'Cardiologie', 'Dermatologie', 'Pédiatrie', 'Gynécologie', 
    'Ophtalmologie', 'ORL', 'Psychiatrie', 'Radiologie'
  ];

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
      availableToday: true
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
      availableToday: true
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
      availableToday: false
    }
  ];

  useEffect(() => {
    setDoctors(mockDoctors);
  }, []);

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
                placeholder="Rechercher un médecin..."
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
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Spécialité"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                SelectProps={{ native: true }}
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
                      💰 {doctor.consultationFee}€ consultation
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
                      sx={{
                        background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)'
                      }}
                    >
                      Rendez-vous
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
    </Box>
  );
};

export default Doctors;
