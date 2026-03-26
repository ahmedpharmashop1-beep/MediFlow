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
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  AccountBalance,
  Phone,
  Email,
  Help,
  Support,
  Directions,
  LocationOn,
  Business,
  Star
} from '@mui/icons-material';
import { getCnamAgencies } from '../../services/cnamService';
import jsPDF from 'jspdf';

const CNAM = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agenciesLoaded, setAgenciesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 12 agences par page

  // Charger les agences CNAM depuis la base de données (une seule fois)
  useEffect(() => {
    const loadAgencies = async () => {
      if (agenciesLoaded) return; // Déjà chargé
      
      setLoading(true);
      setError(null);
      try {
        const data = await getCnamAgencies();
        setAgencies(data);
        setAgenciesLoaded(true);
      } catch (err) {
        setError('Erreur lors du chargement des agences CNAM');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgencies();
  }, [agenciesLoaded]);

  // Calculer les agences à afficher pour la page actuelle
  const indexOfLastAgency = currentPage * itemsPerPage;
  const indexOfFirstAgency = indexOfLastAgency - itemsPerPage;
  const currentAgencies = agencies.slice(indexOfFirstAgency, indexOfLastAgency);

  // Changer de page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll vers le haut de la liste
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

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
      id: 1,
      name: 'Carte d\'assuré social',
      description: 'Votre carte d\'identification CNAM',
      status: 'Valid',
      icon: '🆔',
      fileName: 'carte_assure_social.pdf'
    },
    {
      id: 2,
      name: 'Attestation de droits',
      description: 'Attestation de vos droits à l\'assurance maladie',
      status: 'Valid',
      icon: '📄',
      fileName: 'attestation_droits.pdf'
    },
    {
      id: 3,
      name: 'Formulaire de remboursement',
      description: 'Formulaire à remplir pour demande de remboursement',
      status: 'Required',
      icon: '📝',
      fileName: 'formulaire_remboursement.pdf'
    }
  ];

  // Fonction pour générer et télécharger un PDF
  const generatePDF = (document) => {
    const pdf = new jsPDF();
    
    // Ajouter un en-tête
    pdf.setFontSize(20);
    pdf.setTextColor(156, 39, 176);
    pdf.text('Caisse Nationale d\'Assurance Maladie', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    
    switch(document.id) {
      case 1: // Carte d'assuré social
        pdf.text('CARTE D\'ASSURÉ SOCIAL', 105, 40, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Numéro: CNAM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 20, 60);
        pdf.text('Nom: Utilisateur Test', 20, 70);
        pdf.text('Date de naissance: 01/01/1990', 20, 80);
        pdf.text('Date d\'expiration: 31/12/2025', 20, 90);
        pdf.text('Cette carte vous donne accès à tous les services de la CNAM.', 20, 110);
        break;
        
      case 2: // Attestation de droits
        pdf.text('ATTESTATION DE DROITS CNAM', 105, 40, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text('Je soussigné, Directeur de la CNAM, certifie que:', 20, 60);
        pdf.text('Monsieur/Madame Utilisateur Test', 20, 70);
        pdf.text(`N° CNAM: CNAM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 20, 80);
        pdf.text('Bénéficie des droits à l\'assurance maladie.', 20, 90);
        pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 110);
        pdf.text('Signature: ___________________', 20, 120);
        break;
        
      case 3: // Formulaire de remboursement
        pdf.text('FORMULAIRE DE DEMANDE DE REMBOURSEMENT CNAM', 105, 40, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text('Informations personnelles:', 20, 60);
        pdf.text('Nom: _________________________', 20, 70);
        pdf.text('Prénom: ______________________', 20, 80);
        pdf.text('N° CNAM: _____________________', 20, 90);
        pdf.text('Téléphone: ____________________', 20, 100);
        pdf.text('Informations médicales:', 20, 120);
        pdf.text('Médecin traitant: ____________', 20, 130);
        pdf.text('Date de consultation: _________', 20, 140);
        pdf.text('Montant: _____________________', 20, 150);
        pdf.text('Signature du patient: ___________', 20, 170);
        pdf.text('Date: ________________________', 20, 180);
        break;
    }
    
    // Télécharger le PDF
    pdf.save(document.fileName);
  };

  // Fonction pour valider un document
  const handleValidate = (documentId) => {
    console.log('Validation du document:', documentId);
    alert('Document validé avec succès!');
  };

  const offices = agencies; // Utiliser les agences de la base de données

  // Fonction pour obtenir l'icône selon le niveau d'accès
  const getAccessLevelIcon = (level) => {
    switch (level) {
      case 'admin':
        return '👑';
      case 'advanced':
        return '⭐';
      case 'intermediate':
        return '🔶';
      case 'basic':
      default:
        return '🔵';
    }
  };

  // Fonction pour obtenir la couleur selon le niveau d'accès
  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'admin':
        return '#F44336';
      case 'advanced':
        return '#FF9800';
      case 'intermediate':
        return '#2196F3';
      case 'basic':
      default:
        return '#4CAF50';
    }
  };

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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={doc.status === 'Valid' ? 'Valider' : doc.status}
                        color={doc.status === 'Valid' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {doc.fileName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<span>📥</span>}
                        onClick={() => generatePDF(doc)}
                        sx={{ 
                          background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #7B1FA2 30%, #5E35B1 90%)'
                          }
                        }}
                      >
                        Télécharger
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleValidate(doc.id)}
                        sx={{ borderColor: '#9C27B0', color: '#9C27B0' }}
                      >
                        Valider
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
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#9C27B0' }} />
                <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
                  Chargement des agences CNAM...
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              <>
                {/* Header avec statistiques */}
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    🏢 Agences CNAM de Tunisie
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {agencies.length} agences disponibles • Page {currentPage} sur {Math.ceil(agencies.length / itemsPerPage)}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {currentAgencies.length === 0 ? (
                    <Grid item xs={12}>
                      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          Aucune agence CNAM trouvée
                        </Typography>
                      </Card>
                    </Grid>
                  ) : (
                    currentAgencies.map((agency, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={agency.id || index}>
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
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                fontSize: 16,
                                background: `linear-gradient(135deg, ${getAccessLevelColor(agency.accessLevel)} 0%, ${getAccessLevelColor(agency.accessLevel)}CC 100%)`
                              }}>
                                {getAccessLevelIcon(agency.accessLevel)}
                              </Avatar>
                              <Box flexGrow={1}>
                                <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                  🏛️ {agency.name.length > 20 ? agency.name.substring(0, 20) + '...' : agency.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={agency.accessLevel}
                                  sx={{
                                    background: getAccessLevelColor(agency.accessLevel),
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                <LocationOn sx={{ fontSize: 12, mr: 0.5, color: '#9C27B0' }} />
                                {agency.address.length > 40 ? agency.address.substring(0, 40) + '...' : agency.address}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                <Phone sx={{ fontSize: 12, mr: 0.5, color: '#9C27B0' }} />
                                {agency.phone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                <Business sx={{ fontSize: 12, mr: 0.5, color: '#9C27B0' }} />
                                {agency.department.length > 25 ? agency.department.substring(0, 25) + '...' : agency.department}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Phone />}
                                sx={{ borderColor: '#9C27B0', color: '#9C27B0', fontSize: '0.7rem', minWidth: '60px' }}
                                href={`tel:${agency.phone}`}
                              >
                                Appeler
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Directions />}
                                sx={{ borderColor: '#9C27B0', color: '#9C27B0', fontSize: '0.7rem', minWidth: '70px' }}
                                href={`https://maps.google.com/?q=${encodeURIComponent(agency.address)}`}
                                target="_blank"
                              >
                                Itinéraire
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>

                {/* Pagination */}
                {agencies.length > itemsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(agencies.length / itemsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        },
                        '& .Mui-selected': {
                          backgroundColor: '#9C27B0 !important',
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Statistiques */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Affichage de {currentAgencies.length} agences sur {agencies.length} agences CNAM disponibles
                  </Typography>
                </Box>
              </>
            )}
          </Box>
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
