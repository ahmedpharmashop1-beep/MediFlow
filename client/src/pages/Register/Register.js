import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Fade,
  Slide
} from '@mui/material';
import {
  Person,
  LocalPharmacy,
  MedicalServices,
  AccountBalance,
  LocationOn,
  Phone,
  Email,
  Lock,
  Schedule
} from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      value: 'patient',
      label: 'Patient',
      icon: <Person />,
      description: 'Rechercher et réserver des médicaments',
      color: 'primary'
    },
    {
      value: 'pharmacist',
      label: 'Pharmacien',
      icon: <LocalPharmacy />,
      description: 'Gérer les stocks et les réservations',
      color: 'success'
    },
    {
      value: 'doctor',
      label: 'Médecin',
      icon: <MedicalServices />,
      description: 'Gérer les rendez-vous et ordonnances',
      color: 'info'
    },
    {
      value: 'cnam_admin',
      label: 'Administrateur CNAM',
      icon: <AccountBalance />,
      description: 'Gérer le système de santé',
      color: 'warning'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: role,
      ...(role === 'pharmacist' && { pharmacyName: '', phone: '' }),
      ...(role === 'doctor' && { speciality: '', hospital: '', phone: '' }),
      ...(role === 'cnam_admin' && { name: '', phone: '', services: [] }),
      ...(role === 'patient' && { insuranceNumber: '', phone: '', address: '' })
    });
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Utiliser l'endpoint unifié pour tous les rôles
      const endpoint = 'http://localhost:5000/api/comptes/register';
      const { data } = await axios.post(endpoint, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.compte));
      
      // Redirection selon le rôle
      switch (form.role) {
        case 'patient':
          navigate('/medicine-reserve');
          break;
        case 'pharmacist':
          navigate('/pharmacy-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'cnam_admin':
          navigate('/gestion-comptes');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.msg || 'Inscription échouée');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <Fade in={true} timeout={600}>
      <Box>
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
          Rejoignez MediFlow
        </Typography>
        <Typography variant="body1" paragraph textAlign="center" color="text.secondary">
          Choisissez votre type de compte pour commencer
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={3} key={role.value}>
              <Slide 
                direction="up" 
                in={true} 
                timeout={800 + index * 100}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedRole === role.value ? '2px solid' : '2px solid transparent',
                    borderColor: `${role.color}.main`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleRoleSelect(role.value)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: `${role.color}.main`, mb: 2 }}>
                      {React.cloneElement(role.icon, { sx: { fontSize: 48 } })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {role.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );

  const renderRegistrationForm = () => (
    <Fade in={true} timeout={400}>
      <Container maxWidth="md">
        <Slide direction="down" in={true} timeout={500}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Button
                onClick={() => setSelectedRole('')}
                sx={{ mr: 2 }}
              >
                ← Retour
              </Button>
              <Typography variant="h5" fontWeight="bold">
                Inscription - {roles.find(r => r.value === selectedRole)?.label}
              </Typography>
            </Box>

            <form onSubmit={onSubmit}>
              <Grid container spacing={3}>
                {/* Champs communs */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={form.firstName || ''}
                    onChange={onChange}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={form.lastName || ''}
                    onChange={onChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email || ''}
                    onChange={onChange}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={form.password || ''}
                    onChange={onChange}
                    required
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                {/* Champs spécifiques pharmacien */}
                {selectedRole === 'pharmacist' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom de la pharmacie"
                        name="pharmacyName"
                        value={form.pharmacyName || ''}
                        onChange={onChange}
                        required
                        InputProps={{
                          startAdornment: <LocalPharmacy sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Adresse de la pharmacie"
                        name="pharmacyAddress"
                        value={form.pharmacyAddress || ''}
                        onChange={onChange}
                        required
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        name="pharmacyPhone"
                        value={form.pharmacyPhone || ''}
                        onChange={onChange}
                        required
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Numéro de licence"
                        name="licenseNumber"
                        value={form.licenseNumber || ''}
                        onChange={onChange}
                        required
                      />
                    </Grid>
                  </>
                )}

                {/* Champs spécifiques médecin */}
                {selectedRole === 'doctor' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Spécialité</InputLabel>
                        <Select
                          name="speciality"
                          value={form.speciality || ''}
                          onChange={onChange}
                          label="Spécialité"
                        >
                          <MenuItem value="generalist">Médecin généraliste</MenuItem>
                          <MenuItem value="cardiologist">Cardiologue</MenuItem>
                          <MenuItem value="dermatologist">Dermatologue</MenuItem>
                          <MenuItem value="pediatrician">Pédiatre</MenuItem>
                          <MenuItem value="gynecologist">Gynécologue</MenuItem>
                          <MenuItem value="ophthalmologist">Ophtalmologue</MenuItem>
                          <MenuItem value="psychiatrist">Psychiatre</MenuItem>
                          <MenuItem value="radiologist">Radiologue</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hôpital/Cabinet"
                        name="hospitalName"
                        value={form.hospitalName || ''}
                        onChange={onChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Adresse du cabinet"
                        name="officeAddress"
                        value={form.officeAddress || ''}
                        onChange={onChange}
                        required
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Frais de consultation (€)"
                        name="consultationFee"
                        type="number"
                        value={form.consultationFee || ''}
                        onChange={onChange}
                        InputProps={{
                          startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Champs spécifiques CNAM */}
                {selectedRole === 'cnam_admin' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Département</InputLabel>
                        <Select
                          name="department"
                          value={form.department || ''}
                          onChange={onChange}
                          label="Département"
                        >
                          <MenuItem value="reimbursement">Remboursements</MenuItem>
                          <MenuItem value="validation">Validation des ordonnances</MenuItem>
                          <MenuItem value="statistics">Statistiques</MenuItem>
                          <MenuItem value="management">Gestion système</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ID Employé"
                        name="employeeId"
                        value={form.employeeId || ''}
                        onChange={onChange}
                        required
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Slide>
      </Container>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!selectedRole ? renderRoleSelection() : renderRegistrationForm()}
    </Container>
  );
};

export default Register;
