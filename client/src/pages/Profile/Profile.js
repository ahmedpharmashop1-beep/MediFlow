import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import {
  Person,
  Email,
  LocalPharmacy,
  MedicalServices,
  AccountBalance,
  Edit,
  Logout
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const user = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error parsing user data in Profile:', error);
      return null;
    }
  })();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Aucun utilisateur connecté
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            startIcon={<Person />}
          >
            Se connecter
          </Button>
        </Paper>
      </Container>
    );
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'patient':
        return <Person />;
      case 'pharmacist':
        return <LocalPharmacy />;
      case 'doctor':
        return <MedicalServices />;
      case 'cnam_admin':
        return <AccountBalance />;
      default:
        return <Person />;
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'patient':
        return 'Patient';
      case 'pharmacist':
        return 'Pharmacien';
      case 'doctor':
        return 'Médecin';
      case 'cnam_admin':
        return 'Administrateur CNAM';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'patient':
        return 'primary';
      case 'pharmacist':
        return 'success';
      case 'doctor':
        return 'info';
      case 'cnam_admin':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleLogout = () => {
    // Nettoyer toutes les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('compte');
    localStorage.removeItem('rememberMe');
    
    // Forcer la rechargement de la page pour éviter les caches
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: `${getRoleColor()}.main`,
              fontSize: 32
            }}
          >
            {getRoleIcon()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.firstname} {user.lastname}
            </Typography>
            <Chip
              label={getRoleLabel()}
              color={getRoleColor()}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Informations personnelles
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Box>
                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography>
                      <strong>Téléphone:</strong> {user.phone}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Informations professionnelles
                </Typography>
                
                {user.role === 'pharmacist' && (
                  <>
                    <Typography paragraph>
                      <strong>Pharmacie:</strong> {user.pharmacyName}
                    </Typography>
                    <Typography paragraph>
                      <strong>Adresse:</strong> {user.pharmacyAddress}
                    </Typography>
                    <Typography paragraph>
                      <strong>Téléphone:</strong> {user.pharmacyPhone}
                    </Typography>
                    <Typography>
                      <strong>Licence:</strong> {user.licenseNumber}
                    </Typography>
                  </>
                )}

                {user.role === 'doctor' && (
                  <>
                    <Typography paragraph>
                      <strong>Spécialité:</strong> {user.speciality}
                    </Typography>
                    <Typography paragraph>
                      <strong>Hôpital/Cabinet:</strong> {user.hospitalName}
                    </Typography>
                    <Typography paragraph>
                      <strong>Adresse:</strong> {user.officeAddress}
                    </Typography>
                    <Typography>
                      <strong>Honoraires:</strong> {user.consultationFee}€
                    </Typography>
                  </>
                )}

                {user.role === 'cnam_admin' && (
                  <>
                    <Typography paragraph>
                      <strong>Département:</strong> {user.department}
                    </Typography>
                    <Typography>
                      <strong>ID Employé:</strong> {user.employeeId}
                    </Typography>
                  </>
                )}

                {user.role === 'patient' && (
                  <Typography>
                    <strong>Type:</strong> Patient
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate('/settings')}
          >
            Modifier le profil
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
