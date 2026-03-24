import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
  Paper,
  Divider,
  Fade,
  Slide
} from '@mui/material';
import {
  CalendarToday,
  EventNote,
  LocalHospital,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import AppointmentsList from '../../components/AppointmentsList/AppointmentsList';
import HospitalStatus from '../../components/HospitalStatus/HospitalStatus';

// Receives props from DashboardLayout
const Appointments = ({ user, notifications, setNotifications }) => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'book', or 'status'

  const specialties = [
    'Médecine générale',
    'Cardiologie',
    'Dermatologie',
    'Ophtalmologie',
    'Pédiatrie',
    'Gynécologie',
    'Neurologie',
    'Orthopédie',
    'Psychiatrie',
    'Radiologie'
  ];

  const hospitals = [
    { id: '1', name: 'Hôpital Central', address: '123 Rue de la Santé' },
    { id: '2', name: 'Hôpital Régional', address: '456 Avenue des Soins' },
    { id: '3', name: 'Clinique Saint-Joseph', address: '789 Boulevard Médical' }
  ];

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              🏥 Gestion des Rendez-vous
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Bonjour {user?.name || 'Utilisateur'}, consultez vos rendez-vous médicaux ou prenez un nouveau rendez-vous.
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ 
          p: 1, 
          mb: 4, 
          display: 'inline-flex', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Button
            variant={activeView === 'list' ? 'contained' : 'text'}
            onClick={() => setActiveView('list')}
            sx={{ 
              mr: 1, 
              borderRadius: 2, 
              color: activeView === 'list' ? 'primary.main' : 'white',
              background: activeView === 'list' ? 'white' : 'transparent',
              '&:hover': { background: activeView === 'list' ? 'white' : 'rgba(255,255,255,0.1)' }
            }}
            startIcon={<EventNote />}
          >
            Mes rendez-vous
          </Button>
          <Button
            variant={activeView === 'book' ? 'contained' : 'text'}
            onClick={() => setActiveView('book')}
            sx={{ 
              mr: 1, 
              borderRadius: 2,
              color: activeView === 'book' ? 'primary.main' : 'white',
              background: activeView === 'book' ? 'white' : 'transparent',
              '&:hover': { background: activeView === 'book' ? 'white' : 'rgba(255,255,255,0.1)' }
            }}
            startIcon={<CalendarToday />}
          >
            Prendre RDV
          </Button>
          <Button
            variant={activeView === 'status' ? 'contained' : 'text'}
            onClick={() => setActiveView('status')}
            sx={{
              borderRadius: 2,
              color: activeView === 'status' ? 'primary.main' : 'white',
              background: activeView === 'status' ? 'white' : 'transparent',
              '&:hover': { background: activeView === 'status' ? 'white' : 'rgba(255,255,255,0.1)' }
            }}
            startIcon={<LocalHospital />}
          >
            État Hôpitaux
          </Button>
        </Paper>

        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box>
            {activeView === 'list' ? (
              <AppointmentsList />
            ) : activeView === 'book' ? (
              <BookAppointment 
                specialties={specialties} 
                hospitals={hospitals} 
                setNotifications={setNotifications} 
                notifications={notifications} 
              />
            ) : (
              <HospitalStatus />
            )}
          </Box>
        </Slide>
      </Container>
    </Fade>
  );
};

const BookAppointment = ({ specialties, hospitals, setNotifications, notifications }) => {
  const [formData, setFormData] = useState({
    specialty: '',
    hospitalId: '',
    preferredDate: '',
    preferredTime: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setStatus('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { authorization: token } };
      
      // API call to backend
      await axios.post(
        'http://localhost:5000/api/appointment',
        {
          hospitalId: formData.hospitalId,
          doctorId: '65f1a2b3c4d5e6f7a8b9c0d1', // Mock doctor ID since UI currently only selects hospital
          specialty: formData.specialty,
          appointmentDate: formData.preferredDate,
          appointmentTime: formData.preferredTime,
          reason: formData.reason
        },
        config
      );

      setStatus('success');
      setMessage('Demande de rendez-vous confirmée avec succès !');
      
      // Update global context via props to simulate inter-module communication
      if (typeof setNotifications === 'function') {
        setNotifications(notifications + 1);
      }

      setFormData({
        specialty: '',
        hospitalId: '',
        preferredDate: '',
        preferredTime: '',
        reason: ''
      });
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.msg || 'Erreur lors de la prise de rendez-vous. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 4, 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.4)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#1e3c72', fontWeight: 'bold', mb: 3 }}>
            <CalendarToday sx={{ verticalAlign: 'middle', mr: 1, color: '#FF6B6B' }} />
            Prendre un rendez-vous
          </Typography>

          {message && (
            <Alert 
              icon={status === 'success' ? <CheckCircle fontSize="inherit" /> : <Warning fontSize="inherit" />}
              severity={status === 'success' ? 'success' : 'error'} 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Spécialité"
                  value={formData.specialty}
                  onChange={handleChange('specialty')}
                  required
                  variant="outlined"
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Hôpital / Clinique"
                  value={formData.hospitalId}
                  onChange={handleChange('hospitalId')}
                  required
                >
                  {hospitals.map((hospital) => (
                    <MenuItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date souhaitée"
                  value={formData.preferredDate}
                  onChange={handleChange('preferredDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Heure souhaitée"
                  value={formData.preferredTime}
                  onChange={handleChange('preferredTime')}
                  required
                >
                  {availableTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Motif de la consultation"
                  value={formData.reason}
                  onChange={handleChange('reason')}
                  placeholder="Décrivez brièvement le motif de votre consultation..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !formData.specialty || !formData.hospitalId || !formData.preferredDate}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 30,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
                    boxShadow: '0 4px 15px rgba(30, 60, 114, 0.4)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2a5298 30%, #1e3c72 90%)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {loading ? 'Enregistrement en cours...' : 'Confirmer le rendez-vous'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          height: '100%'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            ℹ️ Comment ça marche ?
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="body2" sx={{ background: '#FF6B6B', px: 1.5, py: 0.5, borderRadius: 2, mr: 2, fontWeight: 'bold' }}>1</Typography>
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>Sélectionnez la spécialité médicale désirée</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="body2" sx={{ background: '#4ECDC4', px: 1.5, py: 0.5, borderRadius: 2, mr: 2, fontWeight: 'bold' }}>2</Typography>
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>Choisissez l'hôpital ou le médecin le plus proche</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="body2" sx={{ background: '#45B7D1', px: 1.5, py: 0.5, borderRadius: 2, mr: 2, fontWeight: 'bold' }}>3</Typography>
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>Confirmez vos horaires préférés et patientez</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

          <Box sx={{ 
            background: 'linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(255,142,83,0.2) 100%)',
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(255,107,107,0.3)'
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#FF8E53', display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ mr: 1 }} /> Urgences
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              En cas d'urgence médicale grave, veuillez ne pas utiliser ce formulaire. Contactez immédiatement le <strong>SAMU au 15</strong> ou rendez-vous aux urgences médicales les plus proches. 
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Appointments;