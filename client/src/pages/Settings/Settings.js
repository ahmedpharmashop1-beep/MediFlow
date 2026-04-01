import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Person,
  Phone,
  Email
} from '@mui/icons-material';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        firstName: userData.firstname || userData.firstName || '',
        lastName: userData.lastname || userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || userData.officeAddress || userData.pharmacyAddress || '',
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/comptes/update/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage
      const updatedUser = { ...user, ...response.data.compte };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setStatus('success');
      setMessage('Profil mis à jour avec succès !');
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
         navigate('/profile');
      }, 1500);

    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.msg || 'Erreur lors de la mise à jour. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ 
        p: { xs: 3, md: 5 }, 
        borderRadius: 6, 
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Decorative background element */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <IconButton 
          onClick={() => navigate('/profile')} 
          sx={{ 
            position: 'absolute', 
            top: 24, 
            left: 24, 
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            zIndex: 1
          }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 5, position: 'relative', zIndex: 1 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto', 
              mb: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: '0 12px 24px rgba(79, 172, 254, 0.4)',
              fontSize: '3rem',
              fontWeight: 'bold'
            }}
          >
            {user.firstname ? user.firstname[0].toUpperCase() : <Person />}
          </Avatar>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.5px' }}>
            Paramètres du profil
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
             Personnalisez votre espace et mettez à jour vos informations
          </Typography>
        </Box>

        {message && (
          <Fade in={true}>
            <Alert 
              severity={status} 
              variant="filled"
              sx={{ 
                mb: 4, 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {message}
            </Alert>
          </Fade>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                variant="outlined"
                placeholder="Votre prénom"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                variant="outlined"
                placeholder="Votre nom"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange('email')}
                variant="outlined"
                placeholder="votre.email@exemple.com"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, opacity: 0.5 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange('phone')}
                variant="outlined"
                placeholder="+216 -- --- ---"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, opacity: 0.5 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Adresse"
                value={formData.address}
                onChange={handleChange('address')}
                variant="outlined"
                placeholder="Votre adresse complète"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{ 
                    py: 2, 
                    borderRadius: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    boxShadow: '0 10px 30px rgba(79, 172, 254, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 40px rgba(79, 172, 254, 0.6)',
                      background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
