import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Fade,
  Slide,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Medication,
  LocalPharmacy,
  MedicalServices,
  HealthAndSafety,
  ArrowForward,
  Search,
  Star,
  TrendingUp,
  AccessTime,
  LocationOn,
  Phone,
  Security,
  Speed,
  Verified,
  CheckCircle,
  EmojiEvents,
  CalendarToday,
  Assignment,
  Schedule,
  ExpandMore,
  Group,
  Support,
  Campaign,
  Assessment,
  Lightbulb,
  RocketLaunch,
  Target,
  Handshake,
  Favorite,
  NotificationsActive
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const roadmap = [
    {
      title: 'Phase 1: Foundation',
      date: 'Q1 2026',
      status: 'completed',
      description: 'Infrastructure de base et authentification multi-rôles',
      features: ['Authentification sécurisée', 'Base de données médicaments', 'Recherche géolocalisée']
    },
    {
      title: 'Phase 2: Expansion',
      date: 'Q2 2026',
      status: 'in-progress',
      description: 'Intégration des services de santé et IA',
      features: ['Médecins et hôpitaux', 'CNAM intégré', 'Alertes intelligentes']
    },
    {
      title: 'Phase 3: Innovation',
      date: 'Q3 2026',
      status: 'upcoming',
      description: 'Téléconsultation et prescriptions électroniques',
      features: ['Téléconsultation', 'Prescriptions digitales', 'Suivi patients']
    },
    {
      title: 'Phase 4: Excellence',
      date: 'Q4 2026',
      status: 'planned',
      description: 'Analytics avancés et prédictions',
      features: ['Analytics santé', 'Prédictions', 'Optimisation réseau']
    }
  ];

  const coreFeatures = [
    {
      icon: <Medication sx={{ fontSize: 48 }} />,
      title: 'Gestion Médicaments',
      description: 'Recherche, réservation et suivi en temps réel',
      progress: 100,
      color: '#4CAF50'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 48 }} />,
      title: 'Réseau Médecins',
      description: 'Annuaire complet et prise de rendez-vous',
      progress: 85,
      color: '#2196F3'
    },
    {
      icon: <LocalPharmacy sx={{ fontSize: 48 }} />,
      title: 'Hôpitaux Connectés',
      description: 'Informations et disponibilités en temps réel',
      progress: 75,
      color: '#FF9800'
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
      title: 'CNAM Intégrée',
      description: 'Remboursements et couverture santé',
      progress: 90,
      color: '#9C27B0'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Utilisateurs actifs', icon: <Group />, color: '#4CAF50' },
    { number: '200+', label: 'Pharmacies partenaires', icon: <LocalPharmacy />, color: '#2196F3' },
    { number: '10K+', label: 'Médicaments référencés', icon: <Medication />, color: '#FF9800' },
    { number: '99.9%', label: 'Satisfaction', icon: <Star />, color: '#9C27B0' }
  ];

  const quickActions = [
    {
      title: 'Rechercher un médicament',
      description: 'Trouvez votre médicament en quelques secondes',
      icon: <Search />,
      color: '#4CAF50',
      action: () => navigate('/medicine-reserve')
    },
    {
      title: 'Consulter un médecin',
      description: 'Prendre rendez-vous avec un professionnel',
      icon: <MedicalServices />,
      color: '#2196F3',
      action: () => navigate('/doctors')
    },
    {
      title: 'Trouver un hôpital',
      description: 'Localisez les services hospitaliers',
      icon: <LocalPharmacy />,
      color: '#FF9800',
      action: () => navigate('/hospitals')
    },
    {
      title: 'Services CNAM',
      description: 'Gérez votre couverture santé',
      icon: <HealthAndSafety />,
      color: '#9C27B0',
      action: () => navigate('/cnam')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'upcoming': return '#2196F3';
      case 'planned': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        animation: 'float 20s infinite ease-in-out'
      }} />

      {/* Floating elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        color: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite'
      }}>
        <Medication sx={{ fontSize: 60 }} />
      </Box>
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '3%',
        color: 'rgba(255,255,255,0.1)',
        animation: 'float 8s ease-in-out infinite'
      }}>
        <LocalPharmacy sx={{ fontSize: 45 }} />
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Slide direction="down" in={true} timeout={800}>
            <Box>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto', 
                  mb: 3,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  fontSize: 48,
                  boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                  border: '4px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <HealthAndSafety />
              </Avatar>
              
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  mb: 2
                }}
              >
                MediFlow
              </Typography>
              
              <Typography 
                variant="h4" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 300,
                  fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                  textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                  mb: 4
                }}
              >
                La révolution de la santé connectée
              </Typography>
              
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Plateforme patient-pharmacie-hôpital-CNAM pour une gestion simplifiée de votre santé
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                <Chip
                  icon={<Verified />}
                  label="MVP Actif"
                  color="success"
                  variant="filled"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
                <Chip
                  icon={<Security />}
                  label="Sécurisé"
                  color="info"
                  variant="filled"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
                <Chip
                  icon={<Speed />}
                  label="Temps Réel"
                  color="warning"
                  variant="filled"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
                <Chip
                  icon={<RocketLaunch />}
                  label="En Développement"
                  color="primary"
                  variant="filled"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/medicine-reserve')}
                  sx={{
                    background: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 50,
                    textTransform: 'none',
                    minWidth: 200,
                    '&:hover': {
                      background: 'grey.100',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 35px rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  Commencer maintenant
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 50,
                    textTransform: 'none',
                    minWidth: 200,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  S'inscrire
                </Button>
              </Box>
            </Box>
          </Slide>
        </Box>

        {/* Stats Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Slide direction="up" in={true} timeout={1000}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 2,
                        bgcolor: stat.color,
                        fontSize: 24
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Slide>
        </Box>

        {/* Roadmap Section */}
        <Box sx={{ mb: { xs: 6, md: 8 }, display: 'flex', justifyContent: 'center' }}>
          <Slide direction="up" in={true} timeout={1200}>
            <Box sx={{ maxWidth: '1000px', width: '100%' }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  mb: 4
                }}
              >
                🚅 Feuille de Route 2026
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                {roadmap.map((phase, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${getStatusColor(phase.status)}33`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1, fontSize: '1rem' }}>
                        {phase.title.split(':')[0]}
                      </Typography>
                      <Chip 
                        label={phase.date}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(phase.status),
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      />
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontSize: '0.85rem' }}>
                        {phase.description}
                      </Typography>
                      
                      <Box sx={{ textAlign: 'left' }}>
                        {phase.features.slice(0, 2).map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <CheckCircle sx={{ fontSize: 14, color: getStatusColor(phase.status), mr: 1 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                        {phase.features.length > 2 && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                            +{phase.features.length - 2} autres...
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* Core Features */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Slide direction="up" in={true} timeout={1400}>
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  mb: 6
                }}
              >
                ⚡ Fonctionnalités Principales
              </Typography>
              
              <Grid container spacing={4}>
                {coreFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4,
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          border: '1px solid rgba(255, 255, 255, 0.4)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: feature.gradient
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ mb: 2, color: feature.color }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                          {feature.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                            Développement: {feature.progress}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={feature.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: feature.color
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Slide direction="up" in={true} timeout={1600}>
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  mb: 4
                }}
              >
                🎯 Actions Rapides
              </Typography>
              
              <Grid container spacing={3}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.05)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: `linear-gradient(45deg, ${action.color} 30%, ${action.color}CC 100%)`
                        }
                      }}
                      onClick={action.action}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            mx: 'auto', 
                            mb: 2,
                            bgcolor: action.color,
                            fontSize: 24
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* CTA Section */}
        <Slide direction="up" in={true} timeout={1800}>
          <Box sx={{ textAlign: 'center' }}>
            <Paper 
              sx={{ 
                p: 6, 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 4,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              <EmojiEvents sx={{ fontSize: 48, color: 'white', mb: 2 }} />
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                🚀 Prêt à révolutionner votre expérience santé ?
              </Typography>
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  mb: 4
                }}
              >
                Rejoignez des milliers d'utilisateurs qui simplifient leur gestion de santé avec MediFlow
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  startIcon={<CheckCircle />}
                  sx={{
                    background: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 50,
                    textTransform: 'none',
                    minWidth: 200,
                    '&:hover': {
                      background: 'grey.100',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 35px rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  S'inscrire gratuitement
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/medicine-reserve')}
                  startIcon={<ArrowForward />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 50,
                    textTransform: 'none',
                    minWidth: 200,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  Voir la démo
                </Button>
              </Box>
            </Paper>
          </Box>
        </Slide>
      </Container>
    </Box>
  );
};

export default Home;
