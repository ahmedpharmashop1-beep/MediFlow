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

  Paper,

  InputAdornment,

  Fab,

  LinearProgress,

  Divider,

  Rating

} from '@mui/material';

import {

  Search,

  LocalHospital,

  Phone,

  LocationOn,

  AccessTime,

  Emergency,

  People,

  Star,

  Directions,

  MedicalServices,

  MonitorHeart

} from '@mui/icons-material';



const Hospitals = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [hospitals, setHospitals] = useState([]);



  useEffect(() => {

    const mockHospitals = [

      {

        id: 1,

        name: 'Hôpital Saint-Louis',

        type: 'Hôpital général',

        address: '1 Avenue Claude Vellefaux, 75010 Paris',

        phone: '+33 1 42 49 99 99',

        emergency: true,

        beds: 650,

        occupiedBeds: 512,

        rating: 4.5,

        reviews: 342,

        departments: ['Urgences', 'Cardiologie', 'Médecine interne', 'Chirurgie'],

        waitTime: 45,

        distance: 2.3,

        coordinates: { lat: 48.8566, lng: 2.3522 },

        avatar: '🏥'

      },

      {

        id: 2,

        name: 'Hôpital Pitié-Salpêtrière',

        type: 'CHU',

        address: '47-83 Boulevard de l\'Hôpital, 75013 Paris',

        phone: '+33 1 42 16 00 00',

        emergency: true,

        beds: 1200,

        occupiedBeds: 890,

        rating: 4.7,

        reviews: 567,

        departments: ['Urgences', 'Neurologie', 'Cardiologie', 'Chirurgie', 'Oncologie'],

        waitTime: 30,

        distance: 4.1,

        coordinates: { lat: 48.8566, lng: 2.3522 },

        avatar: '🏥'

      },

      {

        id: 3,

        name: 'Hôpital Européen Georges Pompidou',

        type: 'Centre spécialisé',

        address: '45 Boulevard du Montparnasse, 75006 Paris',

        phone: '+33 1 53 63 24 68',

        emergency: true,

        beds: 150,

        occupiedBeds: 98,

        rating: 4.6,

        reviews: 267,

        departments: ['Cardiologie', 'Chirurgie cardiaque', 'Réanimation'],

        waitTime: 30,

        distance: 3.7,

        coordinates: { lat: 48.8566, lng: 2.3522 },

        avatar: '🏥'

      }

    ];

    setHospitals(mockHospitals);

  }, []);



  const filteredHospitals = hospitals.filter(hospital => 

    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

    hospital.type.toLowerCase().includes(searchTerm.toLowerCase())

  );



  const getOccupancyRate = (occupied, total) => ((occupied / total) * 100).toFixed(0);



  return (

    <Box sx={{ 

      minHeight: '100vh',

      background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',

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

            <LocalHospital />

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

            🏥 Hôpitaux et Cliniques

          </Typography>

          <Typography 

            variant="h6" 

            sx={{ 

              color: 'rgba(255, 255, 255, 0.9)',

              mb: 4

            }}

          >

            Trouvez l'établissement de santé adapté à vos besoins

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

            <Grid item xs={12} md={8}>

              <TextField

                fullWidth

                placeholder="Rechercher un hôpital ou une clinique..."

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                InputProps={{

                  startAdornment: (

                    <InputAdornment position="start">

                      <Search sx={{ color: '#F44336' }} />

                    </InputAdornment>

                  )

                }}

                sx={{

                  '& .MuiOutlinedInput-root': {

                    '&:hover fieldset': {

                      borderColor: '#F44336'

                    },

                    '&.Mui-focused fieldset': {

                      borderColor: '#F44336'

                    }

                  }

                }}

              />

            </Grid>

            <Grid item xs={12} md={4}>

              <Button

                fullWidth

                variant="contained"

                startIcon={<Emergency />}

                sx={{

                  background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)',

                  height: 56

                }}

              >

                Urgences 24/7

              </Button>

            </Grid>

          </Grid>

        </Paper>



        {/* Hospitals Grid */}

        <Grid container spacing={3}>

          {filteredHospitals.map((hospital) => (

            <Grid item xs={12} md={6} lg={4} key={hospital.id}>

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

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>

                    <Avatar sx={{ 

                      width: 50, 

                      height: 50, 

                      mr: 2,

                      fontSize: 25,

                      background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)'

                    }}>

                      {hospital.avatar}

                    </Avatar>

                    <Box flexGrow={1}>

                      <Typography variant="h6" fontWeight="bold" color="#F44336">

                        {hospital.name}

                      </Typography>

                      <Typography variant="body2" color="text.secondary">

                        {hospital.type}

                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>

                        <Rating value={hospital.rating} precision={0.1} size="small" readOnly />

                        <Typography variant="caption" sx={{ ml: 1 }}>

                          ({hospital.reviews} avis)

                        </Typography>

                      </Box>

                    </Box>

                    {hospital.emergency && (

                      <Chip 

                        icon={<Emergency />}

                        label="Urgences" 

                        color="error" 

                        size="small"

                        sx={{ fontWeight: 'bold' }}

                      />

                    )}

                  </Box>



                  <Box sx={{ mb: 2 }}>

                    <Typography variant="body2" color="text.secondary" gutterBottom>

                      📍 {hospital.address}

                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>

                      📞 {hospital.phone}

                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>

                      🚗 {hospital.distance} km

                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>

                      ⏱️ Temps d'attente: {hospital.waitTime} min

                    </Typography>

                  </Box>



                  {/* Bed Occupancy */}

                  <Box sx={{ mb: 2 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>

                      <Typography variant="body2" fontWeight="bold">

                        Taux d'occupation

                      </Typography>

                      <Typography variant="body2" fontWeight="bold">

                        {getOccupancyRate(hospital.occupiedBeds, hospital.beds)}%

                      </Typography>

                    </Box>

                    <LinearProgress 

                      variant="determinate" 

                      value={getOccupancyRate(hospital.occupiedBeds, hospital.beds)}

                      sx={{

                        height: 8,

                        borderRadius: 4,

                        backgroundColor: 'rgba(244, 67, 54, 0.1)',

                        '& .MuiLinearProgress-bar': {

                          backgroundColor: getOccupancyRate(hospital.occupiedBeds, hospital.beds) > 80 ? '#F44336' : '#4CAF50'

                        }

                      }}

                    />

                    <Typography variant="caption" color="text.secondary">

                      {hospital.occupiedBeds}/{hospital.beds} lits occupés

                    </Typography>

                  </Box>



                  {/* Departments */}

                  <Box sx={{ mb: 2 }}>

                    <Typography variant="body2" fontWeight="bold" gutterBottom>

                      Services disponibles:

                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

                      {hospital.departments.map((dept, index) => (

                        <Chip

                          key={index}

                          label={dept}

                          size="small"

                          variant="outlined"

                          sx={{ fontSize: '0.7rem' }}

                        />

                      ))}

                    </Box>

                  </Box>



                  <Divider sx={{ mb: 2 }} />



                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Button

                      variant="outlined"

                      size="small"

                      startIcon={<Phone />}

                      sx={{ borderColor: '#F44336', color: '#F44336' }}

                    >

                      Appeler

                    </Button>

                    <Button

                      variant="outlined"

                      size="small"

                      startIcon={<Directions />}

                      sx={{ borderColor: '#F44336', color: '#F44336' }}

                    >

                      Itinéraire

                    </Button>

                    <Button

                      variant="contained"

                      size="small"

                      sx={{

                        background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)'

                      }}

                    >

                      Prendre RDV

                    </Button>

                  </Box>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>



        {/* Emergency Floating Button */}

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

          <Emergency />

        </Fab>

      </Container>

    </Box>

  );

};



export default Hospitals;

