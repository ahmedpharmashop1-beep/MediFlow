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
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Person,
  Phone,
  Email,
  Settings as SettingsIcon
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
        p: 4, 
        borderRadius: 4, 
        position: 'relative',
        background: '#f0f7ff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <IconButton 
          onClick={() => navigate('/profile')} 
          sx={{ position: 'absolute', top: 16, left: 16, color: '#1e3c72' }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              margin: '0 auto', 
              mb: 2,
              bgcolor: 'primary.main',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}
          >
            {user.firstname ? user.firstname[0] : <Person />}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="#1e3c72">
            Paramètres du profil
          </Typography>
          <Typography variant="body2" color="textSecondary">
             Modifiez vos informations personnelles
          </Typography>
        </Box>

        {message && (
          <Alert severity={status} sx={{ mb: 3, borderRadius: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                variant="outlined"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                variant="outlined"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange('email')}
                variant="outlined"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange('phone')}
                variant="outlined"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Adresse"
                value={formData.address}
                onChange={handleChange('address')}
                variant="outlined"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 30,
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)'
                }}
              >
                Enregistrer les modifications
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Settings;
