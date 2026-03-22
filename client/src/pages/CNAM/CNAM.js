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
  useTheme,
  useMediaQuery,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search,
  AccountBalance,
  Phone,
  Email,
  LocationOn,
  Security,
  HealthAndSafety,
  Description,
  Calculate,
  Receipt,
  Help,
  Support,
  Policy,
  Payment,
  CheckCircle,
  Warning,
  Info,
  Directions
} from '@mui/icons-material';

const CNAM = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  const services = [
    {
      title: 'Prise en charge médicaments',
      description: 'Remboursement des médicaments selon le tableau de la CNAM',
      coverage: '65-100%',
      icon: '💊',
      color: '#4CAF50'
    },
    {
      title: 'Consultations médicales',
      description: 'Prise en charge des consultations généralistes et spécialistes',
      coverage: '70%',
      icon: '👨‍⚕️',
      color: '#2196F3'
    },
    {
      title: 'Hospitalisation',
      description: 'Couverture complète des frais d\'hospitalisation',
      coverage: '80-100%',
      icon: '🏥',
      color: '#FF9800'
    },
    {
      title: 'Analyses biologiques',
      description: 'Remboursement des examens de laboratoire',
      coverage: '60-80%',
      icon: '🔬',
      color: '#9C27B0'
    }
  ];

  const documents = [
    {
      name: 'Carte d\'assuré social',
      description: 'Votre carte d\'identification CNAM',
      status: 'Valid',
      icon: '🆔'
    },
    {
      name: 'Attestation de droits',
      description: 'Attestation de vos droits à l\'assurance maladie',
      status: 'Valid',
      icon: '📄'
    },
    {
      name: 'Formulaire de remboursement',
      description: 'Formulaire à remplir pour demande de remboursement',
      status: 'Required',
      icon: '📝'
    }
  ];

  const offices = [
    {
      name: 'CNAM Centre',
      address: '15 Rue de la République, 75001 Paris',
      phone: '+33 1 42 68 53 00',
      hours: 'Lun-Ven: 8h-17h',
      services: ['Cartes', 'Remboursements', 'Informations']
    },
    {
      name: 'CNAM Sud',
      address: '45 Boulevard Auguste Blanqui, 75013 Paris',
      phone: '+33 1 44 08 75 00',
      hours: 'Lun-Ven: 8h30-16h30',
      services: ['Urgences', 'Nouveaux assurés', 'Retraites']
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
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
            <AccountBalance />
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
            🏛️ Caisse Nationale d'Assurance Maladie
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4
            }}
          >
            Votre partenaire santé pour une meilleure couverture
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Paper sx={{ mb: 4, background: 'rgba(255, 255, 255, 0.95)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            {['services', 'documents', 'offices', 'contact'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  mx: 1,
                  px: 3,
                  py: 1,
                  background: activeTab === tab ? 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#9C27B0',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                {tab === 'services' && 'Services'}
                {tab === 'documents' && 'Documents'}
                {tab === 'offices' && 'Bureaux'}
                {tab === 'contact' && 'Contact'}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
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
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      mx: 'auto', 
                      mb: 2,
                      fontSize: 30,
                      background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)`
                    }}>
                      {service.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color={service.color} gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Chip 
                      label={`${service.coverage} couverture`}
                      color="primary"
                      sx={{ 
                        background: `linear-gradient(45deg, ${service.color} 30%, ${service.color}CC 90%)`,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Grid container spacing={3}>
            {documents.map((doc, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        fontSize: 25,
                        background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
                      }}>
                        {doc.icon}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight="bold" color="#9C27B0">
                          {doc.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={doc.status}
                        color={doc.status === 'Valid' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ borderColor: '#9C27B0', color: '#9C27B0' }}
                      >
                        Télécharger
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Offices Tab */}
        {activeTab === 'offices' && (
          <Grid container spacing={3}>
            {offices.map((office, index) => (
              <Grid item xs={12} md={6} key={index}>
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
                    <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom>
                      🏛️ {office.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        📍 {office.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        📞 {office.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        🕐 {office.hours}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Services disponibles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {office.services.map((service, idx) => (
                        <Chip
                          key={idx}
                          label={service}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Phone />}
                        sx={{ borderColor: '#9C27B0', color: '#9C27B0' }}
                      >
                        Appeler
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Directions />}
                        sx={{ borderColor: '#9C27B0', color: '#9C27B0' }}
                      >
                        Itinéraire
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom>
                  📞 Contact d'urgence
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Phone sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Numéro unique" secondary="36 46" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Help sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Assistance 24/7" secondary="Disponible jour et nuit" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Email" secondary="support@cnam.fr" />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom>
                  📧 Formulaire de contact
                </Typography>
                <TextField
                  fullWidth
                  label="Nom complet"
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)'
                  }}
                >
                  Envoyer
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Help Floating Button */}
        <Fab
          color="primary"
          aria-label="help"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7B1FA2 30%, #5E35B1 90%)'
            }
          }}
        >
          <Support />
        </Fab>
      </Container>
    </Box>
  );
};

export default CNAM;
