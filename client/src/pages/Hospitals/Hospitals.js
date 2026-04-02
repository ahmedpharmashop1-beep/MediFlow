import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  InputAdornment,
  Fab
} from '@mui/material';

import {
  Phone,
  LocationOn,
  AccessTime,
  LocalHospital,
  Star,
  Emergency,
  MedicalServices,
  People,
  LocalPharmacy,
  Bed,
  MonitorHeart,
  Search,
  Queue,
  EventAvailable,
  Schedule
} from '@mui/icons-material';
import Pharmacy from '../../components/Pharmacy';

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [appointmentReason, setAppointmentReason] = useState('Consultation générale');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'all', 'emergency'
  const [pharmacyDialogOpen, setPharmacyDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:5000/api/hospital');
        const hospitalsData = response.data.hospitals.map(hospital => ({
          id: hospital._id,
          name: hospital.name,
          type: hospital.type,
          address: hospital.address,
          phone: hospital.phone,
          email: hospital.email,
          rating: hospital.rating || 4.2,
          reviews: hospital.reviews || 1250,
          distance: hospital.distance || Math.floor(Math.random() * 20) + 1,
          waitTime: hospital.waitTime || Math.floor(Math.random() * 120) + 15,
          beds: hospital.capacity?.totalBeds || 400,
          occupiedBeds: hospital.capacity?.occupiedBeds || 320,
          emergency: hospital.emergency || true,
          avatar: hospital.name.charAt(0).toUpperCase(),
          departments: hospital.specialties || [],
          surgicalDepartments: hospital.surgicalSpecialties || [],
          emergencyDepartments: hospital.emergencyServices || []
        }));
        setHospitals(hospitalsData);
      } catch (err) {
        console.error('Erreur lors du chargement des hôpitaux:', err);
        setError('Impossible de charger les hôpitaux');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const getServiceDetails = (serviceName, hospital) => {
    const serviceData = {
      name: serviceName,
      hospital: hospital.name,
      queueLength: Math.floor(Math.random() * 50) + 5,
      waitTime: Math.floor(Math.random() * 120) + 15,
      availableBeds: Math.floor(Math.random() * 20) + 5,
      totalBeds: Math.floor(Math.random() * 30) + 20,
      nextAppointments: Math.floor(Math.random() * 8) + 2,
      doctorsAvailable: Math.floor(Math.random() * 5) + 1,
      emergencyQueue: serviceName.includes('Urgence') ? Math.floor(Math.random() * 30) + 10 : null,
      lastUpdate: new Date().toLocaleTimeString('fr-TN'),
      isEmergency: serviceName.includes('Urgence') || serviceName.includes('Urgences')
    };
    return serviceData;
  };

  const handleServiceClick = (serviceName, hospital) => {
    const serviceDetails = getServiceDetails(serviceName, hospital);
    setSelectedService(serviceDetails);
    setServiceDialogOpen(true);
  };

  const handleCloseServiceDialog = () => {
    setServiceDialogOpen(false);
    setSelectedService(null);
  };

  const organizeServices = (hospital) => {
    const mainServices = {
      medical: hospital.departments.slice(0, 3), // Premier 3 services médicaux
      surgical: hospital.surgicalDepartments ? hospital.surgicalDepartments.slice(0, 2) : [], // Premier 2 services chirurgicaux
      emergency: hospital.emergencyDepartments ? hospital.emergencyDepartments.slice(0, 1) : [] // Premier service d'urgence
    };

    const allServices = {
      medical: hospital.departments,
      surgical: hospital.surgicalDepartments || [],
      emergency: hospital.emergencyDepartments || []
    };

    const emergencyOnly = {
      medical: hospital.departments.filter(d => d.toLowerCase().includes('urgence') || d.toLowerCase().includes('emergency')),
      surgical: (hospital.surgicalDepartments || []).filter(d => d.toLowerCase().includes('urgence') || d.toLowerCase().includes('emergency')),
      emergency: hospital.emergencyDepartments || []
    };

    return { mainServices, allServices, emergencyOnly };
  };

  const handleOpenPharmacy = (hospital) => {
    setSelectedHospital(hospital);
    setPharmacyDialogOpen(true);
  };

  const handleClosePharmacy = () => {
    setPharmacyDialogOpen(false);
    setSelectedHospital(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDirections = (hospital) => {
    // Ouvrir Google Maps avec l'adresse de l'hôpital
    const address = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };





  // Fonction pour générer des médecins personnalisés par spécialité et hôpital
const generateDoctorsBySpecialty = (hospitalName, specialty) => {
  // Base de données de médecins par spécialité
  const doctorsDatabase = {
    'Cardiologie': [
      { firstName: 'Mehdi', lastName: 'Ben Jemia', experience: 18, rating: 4.9, consultationFee: 120 },
      { firstName: 'Sonia', lastName: 'Trabelsi', experience: 15, rating: 4.8, consultationFee: 100 },
      { firstName: 'Karim', lastName: 'Hachicha', experience: 22, rating: 4.9, consultationFee: 150 }
    ],
    'Chirurgie Cardiaque': [
      { firstName: 'Ridha', lastName: 'Mansouri', experience: 20, rating: 4.8, consultationFee: 200 },
      { firstName: 'Leila', lastName: 'Kallel', experience: 16, rating: 4.7, consultationFee: 180 }
    ],
    'Chirurgie Générale': [
      { firstName: 'Anis', lastName: 'Ben Salem', experience: 19, rating: 4.6, consultationFee: 150 },
      { firstName: 'Mona', lastName: 'Gharbi', experience: 14, rating: 4.5, consultationFee: 120 },
      { firstName: 'Samir', lastName: 'Bouaziz', experience: 25, rating: 4.8, consultationFee: 180 }
    ],
    'Neurologie': [
      { firstName: 'Foued', lastName: 'Mansour', experience: 21, rating: 4.9, consultationFee: 140 },
      { firstName: 'Amel', lastName: 'Zouari', experience: 17, rating: 4.7, consultationFee: 120 }
    ],
    'Pédiatrie': [
      { firstName: 'Nadia', lastName: 'Ben Ahmed', experience: 16, rating: 4.8, consultationFee: 80 },
      { firstName: 'Walid', lastName: 'Krichen', experience: 12, rating: 4.6, consultationFee: 60 },
      { firstName: 'Imen', lastName: 'Saïdi', experience: 20, rating: 4.9, consultationFee: 90 }
    ],
    'Gynécologie': [
      { firstName: 'Kaouthar', lastName: 'Hammami', experience: 18, rating: 4.7, consultationFee: 100 },
      { firstName: 'Salwa', lastName: 'Baccouche', experience: 23, rating: 4.8, consultationFee: 120 },
      { firstName: 'Sami', lastName: 'Jaziri', experience: 15, rating: 4.6, consultationFee: 90 }
    ],
    'Ophtalmologie': [
      { firstName: 'Hichem', lastName: 'Brahmi', experience: 19, rating: 4.8, consultationFee: 110 },
      { firstName: 'Sarra', lastName: 'Miled', experience: 13, rating: 4.5, consultationFee: 80 }
    ],
    'ORL': [
      { firstName: 'Tarek', lastName: 'Ben Miled', experience: 17, rating: 4.6, consultationFee: 90 },
      { firstName: 'Houda', lastName: 'Gannouni', experience: 14, rating: 4.5, consultationFee: 70 }
    ],
    'Dermatologie': [
      { firstName: 'Olfa', lastName: 'Kefi', experience: 15, rating: 4.7, consultationFee: 85 },
      { firstName: 'Moez', lastName: 'Jlassi', experience: 20, rating: 4.8, consultationFee: 100 }
    ],
    'Radiologie': [
      { firstName: 'Bassem', lastName: 'Gharbi', experience: 16, rating: 4.6, consultationFee: 95 },
      { firstName: 'Rym', lastName: 'Khemakhem', experience: 18, rating: 4.7, consultationFee: 105 }
    ],
    'Médecine Interne': [
      { firstName: 'Ali', lastName: 'Ben Hassen', experience: 22, rating: 4.8, consultationFee: 100 },
      { firstName: 'Noura', lastName: 'Cherif', experience: 19, rating: 4.7, consultationFee: 90 }
    ],
    'Urgences': [
      { firstName: 'Karim', lastName: 'Baccar', experience: 15, rating: 4.5, consultationFee: 150 },
      { firstName: 'Sonia', lastName: 'Boudhina', experience: 18, rating: 4.6, consultationFee: 160 }
    ]
  };

  // Si la spécialité n'est pas dans la base, utiliser médecins généraux
  const defaultDoctors = [
    { firstName: 'Mohamed', lastName: 'Ben Ali', experience: 15, rating: 4.5, consultationFee: 80 },
    { firstName: 'Fatma', lastName: 'Sassi', experience: 12, rating: 4.4, consultationFee: 70 },
    { firstName: 'Samir', lastName: 'Khaled', experience: 20, rating: 4.6, consultationFee: 90 }
  ];

  const doctorsList = doctorsDatabase[specialty] || defaultDoctors;
  
  // Générer les médecins avec IDs uniques et emails personnalisés
  return doctorsList.map((doctor, index) => ({
    _id: `${hospitalName.replace(/\s+/g, '_')}_${specialty.replace(/\s+/g, '_')}_${Date.now()}_${index}`,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: `${doctor.firstName.toLowerCase()}.${doctor.lastName.toLowerCase()}@${hospitalName.replace(/\s+/g, '').toLowerCase()}.tn`,
    specialization: specialty,
    hospitalName: hospitalName,
    experience: doctor.experience,
    rating: doctor.rating,
    consultationFee: doctor.consultationFee
  }));
};

const fetchDoctors = async (hospitalName, specialty) => {
    try {
      setLoadingDoctors(true);
      console.log('Fetching doctors for:', { hospitalName, specialty });
      
      const response = await axios.get(`http://localhost:5000/api/appointments/doctors-by-hospital`, {
        params: { hospitalName, specialty }
      });
      
      const doctors = response.data.doctors || [];
      console.log('Doctors fetched:', doctors);
      
      // Si aucun médecin trouvé, utiliser des données personnalisées par spécialité
      if (doctors.length === 0) {
        const personalizedDoctors = generateDoctorsBySpecialty(hospitalName, specialty);
        console.log('Using personalized doctors:', personalizedDoctors);
        setAvailableDoctors(personalizedDoctors);
      } else {
        setAvailableDoctors(doctors);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des médecins:', err);
      // En cas d'erreur, utiliser des données personnalisées par spécialité
      const personalizedDoctors = generateDoctorsBySpecialty(hospitalName, specialty);
      setAvailableDoctors(personalizedDoctors);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      setLoadingSlots(true);
      console.log('Fetching slots for:', { doctorId, date });
      
      const response = await axios.get('http://localhost:5000/api/appointments/available-slots', {
        params: { doctorId, date }
      });
      
      let slots = response.data.availableSlots || [];
      console.log('Slots fetched from API:', slots);
      
      // Si aucun créneau ou si tous sont indisponibles, générer des créneaux de démonstration
      if (slots.length === 0 || slots.filter(s => s.available).length === 0) {
        // Générer des créneaux de démonstration avec 50% de disponibilité
        const mockSlots = [
          '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
          '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
          '16:00', '16:30', '17:00', '17:30'
        ].map(time => ({
          time,
          available: Math.random() > 0.5 // 50% de chance d'être disponible
        }));
        
        // S'assurer qu'il y a au moins 3 créneaux disponibles
        let availableCount = mockSlots.filter(s => s.available).length;
        if (availableCount < 3) {
          mockSlots.forEach((slot, index) => {
            if (availableCount >= 3) return;
            if (!slot.available) {
              mockSlots[index].available = true;
              availableCount++;
            }
          });
        }
        
        slots = mockSlots;
        console.log('Using mock slots:', slots);
      }
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Erreur lors du chargement des créneaux:', err);
      
      // En cas d'erreur, générer des créneaux de démonstration
      const mockSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
      ].map(time => ({
        time,
        available: Math.random() > 0.5
      }));
      
      // S'assurer qu'il y a au moins 3 créneaux disponibles
      let availableCount = mockSlots.filter(s => s.available).length;
      if (availableCount < 3) {
        mockSlots.forEach((slot, index) => {
          if (availableCount >= 3) return;
          if (!slot.available) {
            mockSlots[index].available = true;
            availableCount++;
          }
        });
      }
      
      console.log('Using fallback slots:', mockSlots);
      setAvailableSlots(mockSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const handleOpenAppointmentDialog = () => {
    if (selectedService) {
      fetchDoctors(selectedService.hospital, selectedService.name);
    }
    setAppointmentDialogOpen(true);
  };







  const handleCloseAppointmentDialog = () => {
    setAppointmentDialogOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setAppointmentReason('');
    setIsCheckingAvailability(false);
  };

  const handleBookAppointment = async () => {
    console.log('handleBookAppointment called');
    console.log('selectedDoctor:', selectedDoctor);
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    console.log('availableSlots:', availableSlots);
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Veuillez sélectionner un médecin, une date et un créneau horaire');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour prendre rendez-vous');
      return;
    }

    setIsCheckingAvailability(true);
    try {
      // Pour la démonstration, vérifier si c'est un médecin mock
      if (selectedDoctor.includes('mock_') || selectedDoctor.includes('_')) {
        // Mode démonstration - simuler une réservation réussie
        const doctor = availableDoctors.find(doc => doc._id === selectedDoctor);
        const hospital = hospitals.find(h => h.name === selectedService.hospital);
        
        console.log('Demo mode - simulating appointment booking');
        
        // Create a real notification for the demo appointment
        try {
          await axios.post('http://localhost:5000/api/appointments/notification', {
            title: '✅ Rendez-vous hospitalier confirmé (Démo)',
            message: `Votre rendez-vous en ${selectedService.name} à ${hospital?.name || selectedService.hospital} avec le Dr. ${doctor?.firstName || 'Médecin'} ${doctor?.lastName || 'Test'} est prévu le ${selectedDate} à ${selectedTime}.`,
            type: 'appointment'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Demo notification created successfully');
        } catch (notifErr) {
          console.error('Failed to create demo notification:', notifErr);
        }
        
        // Afficher un message de confirmation de démonstration
        alert(`✅ Rendez-vous confirmé (Mode Démonstration) !\n\n` +
          `🏥 ${hospital?.name || selectedService.hospital}\n` +
          `👨‍⚕️ Dr. ${doctor?.firstName || 'Médecin'} ${doctor?.lastName || 'Test'}\n` +
          `📅 ${new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
          `⏰ ${selectedTime}\n` +
          `📝 ${appointmentReason || 'Consultation générale'}\n\n` +
          `📧 Un email de confirmation vous sera envoyé.\n` +
          `📞 Veuillez vous présenter 10 minutes avant l'heure.\n\n` +
          `📝 Note: Ceci est une réservation de démonstration.`);

        handleCloseAppointmentDialog();
        handleCloseServiceDialog();
        return;
      }

      // Mode réel - essayer de réserver via l'API
      const hospital = hospitals.find(h => h.name === selectedService.hospital);
      
      const appointmentData = {
        doctorId: selectedDoctor,
        hospitalId: hospital.id,
        specialty: selectedService.name,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: appointmentReason
      };
      
      console.log('Appointment data:', appointmentData);

      await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Afficher un message de confirmation avec l'heure sélectionnée
      alert(`✅ Rendez-vous confirmé avec succès !\n\n` +
        `🏥 ${hospital.name}\n` +
        `👨‍⚕️ ${availableDoctors.find(doc => doc._id === selectedDoctor)?.firstName} ${availableDoctors.find(doc => doc._id === selectedDoctor)?.lastName}\n` +
        `📅 ${new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
        `⏰ ${selectedTime}\n` +
        `📝 ${appointmentReason || 'Consultation générale'}\n\n` +
        `📧 Un email de confirmation vous sera envoyé.\n` +
        `📞 Veuillez vous présenter 10 minutes avant l'heure.`);

      handleCloseAppointmentDialog();
      handleCloseServiceDialog();
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      
      // En cas d'erreur, proposer le mode démonstration
      const doctor = availableDoctors.find(doc => doc._id === selectedDoctor);
      const hospital = hospitals.find(h => h.name === selectedService.hospital);
      
      // Utiliser window.confirm au lieu de confirm
      const useDemoMode = window.confirm(`❌ Erreur lors de la réservation réelle.\n\n` +
        `Voulez-vous utiliser le mode démonstration pour tester ?\n\n` +
        `Le mode démonstration simulera votre rendez-vous :\n` +
        `📅 ${new Date(selectedDate).toLocaleDateString('fr-FR')}\n` +
        `⏰ ${selectedTime}\n` +
        `👨‍⚕️ Dr. ${doctor?.firstName || 'Médecin'} ${doctor?.lastName || 'Test'}`);
        
      if (useDemoMode) {
        // Create a real notification for the demo appointment
        try {
          await axios.post('http://localhost:5000/api/appointments/notification', {
            title: '✅ Rendez-vous hospitalier confirmé (Démo)',
            message: `Votre rendez-vous en ${selectedService.name} à ${hospital?.name || selectedService.hospital} avec le Dr. ${doctor?.firstName || 'Médecin'} ${doctor?.lastName || 'Test'} est prévu le ${selectedDate} à ${selectedTime}.`,
            type: 'appointment'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Demo notification created successfully');
        } catch (notifErr) {
          console.error('Failed to create demo notification:', notifErr);
        }
        
        // Afficher un message de confirmation de démonstration
        alert(`✅ Rendez-vous confirmé (Mode Démonstration) !\n\n` +
          `🏥 ${hospital?.name || selectedService.hospital}\n` +
          `👨‍⚕️ Dr. ${doctor?.firstName || 'Médecin'} ${doctor?.lastName || 'Test'}\n` +
          `📅 ${new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
          `⏰ ${selectedTime}\n` +
          `📝 ${appointmentReason || 'Consultation générale'}\n\n` +
          `📧 Un email de confirmation vous sera envoyé.\n` +
          `📞 Veuillez vous présenter 10 minutes avant l'heure.\n\n` +
          `📝 Note: Ceci est une réservation de démonstration.`);

        handleCloseAppointmentDialog();
        handleCloseServiceDialog();
      } else {
        alert(err.response?.data?.msg || 'Erreur lors de la réservation. Veuillez réessayer.');
      }
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyRate = (occupied, total) => {
    return Math.round((occupied / total) * 100);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F44336 0%, #E91E63 50%, #FF6B6B 100%)',
      pt: 4,
      pb: 10
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🏥 Hôpitaux et Centres Médicaux
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Trouvez le meilleur établissement de santé près de chez vous
          </Typography>
          
          {/* Search Bar */}
          <Paper
            elevation={10}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              margin: '0 auto',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50px'
            }}
          >
            <InputAdornment position="start">
              <Search sx={{ color: '#F44336', ml: 1 }} />
            </InputAdornment>
            <TextField
              fullWidth
              placeholder="Rechercher un hôpital, une spécialité..."
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  ml: 1,
                  fontSize: '1rem'
                }
              }}
            />
          </Paper>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#F44336' }} />
            <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
              Chargement des hôpitaux...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Hospitals Grid */}
        {!loading && !error && (
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

                  {/* Departments with Tabs */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                      <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ 
                          '& .MuiTab-root': { 
                            fontSize: '0.75rem',
                            minWidth: '80px',
                            fontWeight: 'bold',
                            textTransform: 'none'
                          },
                          '& .MuiTab-selected': {
                            color: '#F44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)'
                          },
                          '& .MuiTabs-indicator': {
                            backgroundColor: '#F44336',
                            height: '3px'
                          }
                        }}
                      >
                        <Tab 
                          label="Services Principaux" 
                          value="main"
                          icon={<Star />}
                          sx={{ 
                            color: activeTab === 'main' ? '#F44336' : '#666',
                            backgroundColor: activeTab === 'main' ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                            borderRadius: '8px 8px 0 0',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.05)'
                            }
                          }}
                        />
                        <Tab 
                          label="Tous les Services" 
                          value="all"
                          icon={<MedicalServices />}
                          sx={{ 
                            color: activeTab === 'all' ? '#F44336' : '#666',
                            backgroundColor: activeTab === 'all' ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                            borderRadius: '8px 8px 0 0',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.05)'
                            }
                          }}
                        />
                        <Tab 
                          label="Urgences" 
                          value="emergency"
                          icon={<Emergency />}
                          sx={{ 
                            color: activeTab === 'emergency' ? '#F44336' : '#666',
                            backgroundColor: activeTab === 'emergency' ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                            borderRadius: '8px 8px 0 0',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.05)'
                            }
                          }}
                        />
                      </Tabs>
                    </Box>

                    {(() => {
                      const { mainServices, allServices, emergencyOnly } = organizeServices(hospital);
                      
                      if (activeTab === 'main') {
                        return (
                          <>
                            {mainServices.medical.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#F44336', mb: 1 }}>
                                  🏥 Services Médicaux:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {mainServices.medical.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<MedicalServices />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(244, 67, 54, 0.1)', 
                                        borderColor: '#F44336',
                                        color: '#F44336',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(244, 67, 54, 0.2)',
                                          borderColor: '#d32f2f',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {mainServices.surgical.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#E91E63', mb: 1 }}>
                                  🔪 Spécialités Chirurgicales:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {mainServices.surgical.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<MonitorHeart />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(233, 30, 99, 0.1)', 
                                        borderColor: '#E91E63',
                                        color: '#E91E63',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(233, 30, 99, 0.2)',
                                          borderColor: '#c2185b',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {mainServices.emergency.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#4CAF50', mb: 1 }}>
                                  🚨 Services d'Urgence:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {mainServices.emergency.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Emergency />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                        borderColor: '#4CAF50',
                                        color: '#4CAF50',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(76, 175, 80, 0.2)',
                                          borderColor: '#388e3c',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                              <Button
                                variant="contained"
                                size="medium"
                                onClick={() => setActiveTab('all')}
                                sx={{ 
                                  background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  px: 3,
                                  py: 1,
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #d32f2f 30%, #c2185b 90%)',
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              >
                                Voir tous les services ({allServices.medical.length + allServices.surgical.length + allServices.emergency.length} services disponibles)
                              </Button>
                            </Box>
                          </>
                        );
                      }

                      if (activeTab === 'all') {
                        return (
                          <>
                            {allServices.medical.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#F44336', mb: 1 }}>
                                  🏥 Services Médicaux ({allServices.medical.length}):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {allServices.medical.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<MedicalServices />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(244, 67, 54, 0.1)', 
                                        borderColor: '#F44336',
                                        color: '#F44336',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(244, 67, 54, 0.2)',
                                          borderColor: '#d32f2f',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {allServices.surgical.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#E91E63', mb: 1 }}>
                                  🔪 Spécialités Chirurgicales ({allServices.surgical.length}):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {allServices.surgical.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<MonitorHeart />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(233, 30, 99, 0.1)', 
                                        borderColor: '#E91E63',
                                        color: '#E91E63',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(233, 30, 99, 0.2)',
                                          borderColor: '#c2185b',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {allServices.emergency.length > 0 && (
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                p: 2, 
                                borderRadius: 2, 
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#4CAF50', mb: 1 }}>
                                  🚨 Services d'Urgence et Medico-techniques ({allServices.emergency.length}):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                  {allServices.emergency.map((dept, index) => (
                                    <Button
                                      key={index}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Emergency />}
                                      onClick={() => handleServiceClick(dept, hospital)}
                                      sx={{ 
                                        fontSize: '0.7rem', 
                                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                        borderColor: '#4CAF50',
                                        color: '#4CAF50',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          bgcolor: 'rgba(76, 175, 80, 0.2)',
                                          borderColor: '#388e3c',
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    >
                                      {dept}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </>
                        );
                      }

                      if (activeTab === 'emergency') {
                        return (
                          <>
                            <Box sx={{ 
                              backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                              p: 3, 
                              borderRadius: 2, 
                              mb: 2,
                              border: '2px solid #F44336',
                              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                            }}>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: '#F44336', mb: 2, fontSize: '1.1rem' }}>
                                🚨 SERVICES D'URGENCE 24/7:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                {emergencyOnly.emergency.map((dept, index) => (
                                  <Button
                                    key={index}
                                    variant="contained"
                                    size="medium"
                                    startIcon={<Emergency />}
                                    onClick={() => handleServiceClick(dept, hospital)}
                                    sx={{ 
                                      fontSize: '0.8rem', 
                                      bgcolor: '#F44336',
                                      color: 'white',
                                      textTransform: 'none',
                                      fontWeight: 'bold',
                                      px: 2,
                                      py: 1.5,
                                      '&:hover': {
                                        bgcolor: '#d32f2f',
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    {dept}
                                  </Button>
                                ))}
                              </Box>
                              
                              <Alert 
                                severity="error" 
                                sx={{ 
                                  mt: 2,
                                  '& .MuiAlert-message': {
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                  }
                                }}
                              >
                                📞 En cas d'urgence médicale grave, appelez le <strong>112</strong> immédiatement !
                              </Alert>
                            </Box>
                          </>
                        );
                      }

                      return null;
                    })()}
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Phone />}
                      sx={{ borderColor: '#F44336', color: '#F44336', flex: 1 }}
                      onClick={() => window.open(`tel:${hospital.phone}`)}
                    >
                      Appeler
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LocationOn />}
                      sx={{ borderColor: '#F44336', color: '#F44336', flex: 1 }}
                      onClick={() => handleDirections(hospital)}
                    >
                      Itinéraire
                    </Button>
                    <Tooltip title="Pharmacie Interne Hospitalière - Réservée aux patients de l'hôpital">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LocalPharmacy />}
                      sx={{ 
                        background: 'linear-gradient(45deg, #4CAF50, #43A047)',
                        color: 'white',
                        flex: 1,
                        fontSize: '0.75rem',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c, #2e7d32)'
                        }
                      }}
                      onClick={() => handleOpenPharmacy(hospital)}
                    >
                      Pharmacie
                    </Button>
                  </Tooltip>
                  </Box>

                                  </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}

        {/* Emergency Floating Button */}
        <Fab
          color="primary"
          aria-label="emergency"
          onClick={() => {
            const emergencyHospitals = hospitals.filter(h => h.emergency);
            if (emergencyHospitals.length > 0) {
              const nearestHospital = emergencyHospitals[0];
              alert(`🚨 URGENCES\n\nHôpital le plus proche:\n${nearestHospital.name}\n📍 ${nearestHospital.address}\n📞 ${nearestHospital.phone}\n\nAppelez le 112 pour les urgences médicales!`);
            } else {
              alert('🚨 URGENCES\n\nAppelez le 112 pour les urgences médicales!\n\nService disponible 24/7');
            }
          }}
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

      {/* Service Details Dialog */}
      <Dialog 
        open={serviceDialogOpen} 
        onClose={handleCloseServiceDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            color: '#333',
            border: '2px solid #F44336'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#F44336',
          fontWeight: 'bold',
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <MedicalServices sx={{ color: '#F44336' }} />
          <Typography variant="h6" component="span" sx={{ color: '#F44336' }}>
            Détails du Service: {selectedService?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
          {selectedService && (
            <List>
              <ListItem sx={{ 
                backgroundColor: '#f8f9fa', 
                mb: 1, 
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}>
                <ListItemIcon>
                  <LocalHospital sx={{ color: '#F44336', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Hôpital" 
                  secondary={selectedService.hospital}
                  primaryTypographyProps={{ 
                    color: '#F44336', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  secondaryTypographyProps={{ 
                    color: '#666',
                    fontSize: '1rem'
                  }}
                />
              </ListItem>

              <ListItem sx={{ 
                backgroundColor: '#f8f9fa', 
                mb: 1, 
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}>
                <ListItemIcon>
                  <Queue sx={{ color: '#F44336', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Fil d'attente" 
                  secondary={`${selectedService.queueLength} personnes en attente`}
                  primaryTypographyProps={{ 
                    color: '#F44336', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  secondaryTypographyProps={{ 
                    color: '#666',
                    fontSize: '1rem'
                  }}
                />
              </ListItem>

              <ListItem sx={{ 
                backgroundColor: '#f8f9fa', 
                mb: 1, 
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}>
                <ListItemIcon>
                  <AccessTime sx={{ color: '#F44336', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Temps d'attente estimé" 
                  secondary={`${selectedService.waitTime} minutes`}
                  primaryTypographyProps={{ 
                    color: '#F44336', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  secondaryTypographyProps={{ 
                    color: '#666',
                    fontSize: '1rem'
                  }}
                />
              </ListItem>

              {!selectedService.isEmergency && (
                <>
                  <ListItem sx={{ 
                    backgroundColor: '#f8f9fa', 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid #e9ecef'
                  }}>
                    <ListItemIcon>
                      <Bed sx={{ color: '#F44336', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Lits disponibles" 
                      secondary={`${selectedService.availableBeds} / ${selectedService.totalBeds} lits`}
                      primaryTypographyProps={{ 
                        color: '#F44336', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                      secondaryTypographyProps={{ 
                        color: '#666',
                        fontSize: '1rem'
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ 
                    backgroundColor: '#f8f9fa', 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid #e9ecef'
                  }}>
                    <ListItemIcon>
                      <EventAvailable sx={{ color: '#F44336', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Prochains rendez-vous disponibles" 
                      secondary={`${selectedService.nextAppointments} créneaux aujourd'hui`}
                      primaryTypographyProps={{ 
                        color: '#F44336', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                      secondaryTypographyProps={{ 
                        color: '#666',
                        fontSize: '1rem'
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ 
                    backgroundColor: '#f8f9fa', 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid #e9ecef'
                  }}>
                    <ListItemIcon>
                      <People sx={{ color: '#F44336', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Médecins disponibles" 
                      secondary={`${selectedService.doctorsAvailable} médecins`}
                      primaryTypographyProps={{ 
                        color: '#F44336', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                      secondaryTypographyProps={{ 
                        color: '#666',
                        fontSize: '1rem'
                      }}
                    />
                  </ListItem>
                </>
              )}

              {selectedService.isEmergency && (
                <ListItem sx={{ 
                  backgroundColor: '#fff3cd', 
                  mb: 1, 
                  borderRadius: 1,
                  border: '2px solid #856404'
                }}>
                  <ListItemIcon>
                    <Emergency sx={{ color: '#856404', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="File d'attente d'urgence" 
                    secondary={`${selectedService.emergencyQueue} personnes en attente`}
                    primaryTypographyProps={{ 
                      color: '#856404', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                    secondaryTypographyProps={{ 
                      color: '#666',
                      fontSize: '1rem'
                  }}
                  />
                </ListItem>
              )}

              <ListItem sx={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}>
                <ListItemIcon>
                  <Schedule sx={{ color: '#666', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dernière mise à jour" 
                  secondary={selectedService.lastUpdate}
                  primaryTypographyProps={{ 
                    color: '#666', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  secondaryTypographyProps={{ 
                    color: '#999',
                    fontSize: '0.9rem'
                  }}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button 
            onClick={handleCloseServiceDialog}
            variant="outlined"
            sx={{ 
              color: '#666', 
              borderColor: '#666',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                background: '#f8f9fa',
                borderColor: '#F44336',
                color: '#F44336'
              }
            }}
          >
            Fermer
          </Button>
          <Button 
            variant="contained"
            onClick={handleOpenAppointmentDialog}
            sx={{ 
              background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f 30%, #c2185b 90%)'
              }
            }}
          >
            Prendre Rendez-vous
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de prise de rendez-vous en temps réel */}
      <Dialog 
        open={appointmentDialogOpen} 
        onClose={handleCloseAppointmentDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, border: '2px solid #F44336' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(233, 30, 99, 0.1))', 
          color: '#F44336', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 2
        }}>
          <Schedule /> 
          <Box>
            <Typography variant="h6">Prendre un Rendez-vous</Typography>
            <Typography variant="body2" color="#666">
              {selectedService?.name} - {selectedService?.hospital}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Section gauche: Sélection du médecin avec informations en temps réel */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#F44336' }}>
                <People sx={{ verticalAlign: 'middle', mr: 1 }} />
                Médecins Disponibles
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Choisir un médecin</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  label="Choisir un médecin"
                  disabled={loadingDoctors}
                >
                  {loadingDoctors ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                        <CircularProgress size={20} sx={{ mr: 2 }} /> 
                        <Typography>Chargement des médecins...</Typography>
                      </Box>
                    </MenuItem>
                  ) : availableDoctors.length > 0 ? (
                    availableDoctors.map(doc => (
                      <MenuItem key={doc._id} value={doc._id} sx={{ py: 1.5 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#F44336', fontSize: '0.8rem' }}>
                              {doc.firstName?.[0] || 'D'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold" color="#333">
                                Dr. {doc.firstName} {doc.lastName}
                              </Typography>
                              <Typography variant="caption" color="#666" display="block">
                                {doc.specialization || selectedService?.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: 5.5 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {doc.experience && (
                                <Chip 
                                  label={`${doc.experience} ans`} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.6rem', height: 20 }}
                                />
                              )}
                              <Chip 
                                icon={<Star sx={{ fontSize: '0.8rem' }} />} 
                                label={doc.rating || '4.5'} 
                                size="small" 
                                color="warning"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            </Box>
                            {doc.consultationFee && (
                              <Typography variant="caption" color="#4CAF50" fontWeight="bold">
                                {doc.consultationFee} TND
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <Box sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                        <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                          Aucun médecin disponible pour ce service
                        </Typography>
                        <Typography variant="caption" color="#999">
                          Veuillez essayer un autre service ou contacter l'hôpital
                        </Typography>
                      </Box>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Informations du médecin sélectionné */}
              {selectedDoctor && availableDoctors.find(doc => doc._id === selectedDoctor) && (
                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    Informations du médecin:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#F44336' }}>
                      {availableDoctors.find(doc => doc._id === selectedDoctor)?.firstName?.[0] || 'D'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Dr. {availableDoctors.find(doc => doc._id === selectedDoctor)?.firstName} {availableDoctors.find(doc => doc._id === selectedDoctor)?.lastName}
                      </Typography>
                      <Typography variant="caption" color="#666">
                        Spécialité: {availableDoctors.find(doc => doc._id === selectedDoctor)?.specialty || selectedService?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip 
                      icon={<AccessTime />} 
                      label="Disponible aujourd'hui" 
                      size="small" 
                      color="success" 
                    />
                    <Chip 
                      icon={<Star />} 
                      label="4.8 (125 avis)" 
                      size="small" 
                      color="warning" 
                    />
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Section droite: Sélection de la date et créneaux */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#F44336' }}>
                <EventAvailable sx={{ verticalAlign: 'middle', mr: 1 }} />
                Date du Rendez-vous
              </Typography>
              
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                sx={{ mb: 2 }}
              />

              {/* Statistiques en temps réel */}
              {selectedDate && (
                <Paper sx={{ p: 2, bgcolor: '#fff3cd', border: '1px solid #ffeaa7', mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    📊 Informations en temps réel:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">Personnes en attente:</Typography>
                    <Typography variant="caption" fontWeight="bold" color="#F44336">
                      {Math.floor(Math.random() * 10) + 2} patients
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">Temps d'attente estimé:</Typography>
                    <Typography variant="caption" fontWeight="bold" color="#F44336">
                      {Math.floor(Math.random() * 30) + 10} minutes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Créneaux disponibles:</Typography>
                    <Typography variant="caption" fontWeight="bold" color="#4CAF50">
                      {availableSlots.filter(s => s.available).length}/{availableSlots.length}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Créneaux horaires - Affichage des créneaux libres uniquement */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#F44336' }}>
                <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
                Créneaux Libres
                {selectedDate && (
                  <Typography variant="caption" sx={{ ml: 2, color: '#666' }}>
                    pour le {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                )}
              </Typography>
              
              {!selectedDoctor || !selectedDate ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Veuillez sélectionner un médecin et une date pour voir les créneaux libres.
                </Alert>
              ) : loadingSlots ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={30} sx={{ color: '#F44336' }} />
                  <Typography variant="body2" sx={{ ml: 2, color: '#666' }}>
                    Chargement des créneaux libres...
                  </Typography>
                </Box>
              ) : availableSlots.filter(slot => slot.available).length > 0 ? (
                <Box>
                  <Alert severity="success" sx={{ borderRadius: 2, mb: 2 }}>
                    ✅ {availableSlots.filter(slot => slot.available).length} créneaux libres disponibles
                  </Alert>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    {availableSlots
                      .filter(slot => slot.available)
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTime === slot.time ? "contained" : "outlined"}
                          onClick={() => setSelectedTime(slot.time)}
                          sx={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            borderColor: selectedTime === slot.time ? '#F44336' : '#4CAF50',
                            color: selectedTime === slot.time ? 'white' : '#4CAF50',
                            background: selectedTime === slot.time ? 'linear-gradient(45deg, #F44336, #E91E63)' : 'transparent',
                            px: 2,
                            py: 1,
                            minWidth: '80px',
                            '&:hover': {
                              backgroundColor: selectedTime === slot.time ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.1)',
                              borderColor: selectedTime === slot.time ? '#d32f2f' : '#388e3c'
                            }
                          }}
                        >
                          {slot.time}
                        </Button>
                      ))}
                  </Box>
                  
                  {selectedTime && (
                    <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                      ✅ Créneau sélectionné : {selectedTime}
                    </Alert>
                  )}
                  
                  <Typography variant="body2" color="#666" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                    📝 Choisissez votre créneau préféré parmi les horaires disponibles
                  </Typography>
                </Box>
              ) : (
                <Alert severity="warning">
                  Aucun créneau libre pour cette date. Veuillez choisir une autre date.
                </Alert>
              )}
            </Grid>

            {/* Motif du rendez-vous */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Motif du rendez-vous"
                placeholder="Décrivez brièvement le motif de votre consultation..."
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseAppointmentDialog} 
            sx={{ 
              color: '#666',
              borderColor: '#666',
              '&:hover': {
                borderColor: '#F44336',
                color: '#F44336'
              }
            }}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            disabled={!selectedDoctor || !selectedDate || !selectedTime || isCheckingAvailability}
            onClick={handleBookAppointment}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #43A047)',
              px: 4,
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            {isCheckingAvailability ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              '✅ Confirmer le Rendez-vous'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Pharmacy Dialog */}
      <Pharmacy 
        hospital={selectedHospital}
        open={pharmacyDialogOpen}
        onClose={handleClosePharmacy}
      />
    </Box>
  );
};

export default Hospitals;
