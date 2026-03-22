import React, { useEffect, useMemo, useState } from 'react';
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
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
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
  Email,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  CalendarToday,
  Assignment,
  Schedule,
  ExpandMore,
  Group,
  Support,
  Campaign,
  Lightbulb,
  RocketLaunch,
  Target,
  Handshake,
  Favorite,
  NotificationsActive,
  Edit,
  Save,
  Cancel,
  AccountBalance,
  Storage
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = useMemo(() => {
      try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          return null;
        }
      }, []);

  const isAdmin = user?.role === 'isAdmin';

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
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Slide direction="down" in={true} timeout={800}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
                  mb: 2,
                  textAlign: 'center'
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
                  mb: 4,
                  textAlign: 'center'
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
                  lineHeight: 1.6,
                  textAlign: 'center'
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
        <Box sx={{ mb: { xs: 8, md: 12 }, display: 'flex', justifyContent: 'center' }}>
          <Slide direction="up" in={true} timeout={1000}>
            <Grid container spacing={3} justifyContent="center">
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
        <Box sx={{ mb: { xs: 8, md: 12 }, display: 'flex', justifyContent: 'center' }}>
          <Slide direction="up" in={true} timeout={1200}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 2 }}>
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
                Feuille de Route 2026
              </Typography>
              
              <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {roadmap.map((phase, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        height: '100%',
                        minHeight: '320px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${getStatusColor(phase.status)}33`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                          border: `2px solid ${getStatusColor(phase.status)}66`
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: getStatusColor(phase.status)
                        }
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1.1rem', lineHeight: 1.2 }}>
                        {phase.title}
                      </Typography>
                      <Chip 
                        label={phase.date}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(phase.status),
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 2,
                          alignSelf: 'center'
                        }}
                      />
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontSize: '0.9rem', lineHeight: 1.4 }}>
                        {phase.description}
                      </Typography>
                      
                      <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                        {phase.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                            <CheckCircle sx={{ fontSize: 16, color: getStatusColor(phase.status), mr: 1, flexShrink: 0, mt: 0.2 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', lineHeight: 1.3 }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* Core Features */}
        <Box sx={{ mb: { xs: 10, md: 16 }, display: 'flex', justifyContent: 'center' }}>
          <Slide direction="up" in={true} timeout={1400}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mb: 6
                }}
              >
                ⚡ Fonctionnalités Principales
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
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
        <Box sx={{ mb: { xs: 8, md: 12 }, display: 'flex', justifyContent: 'center' }}>
          <Slide direction="up" in={true} timeout={1600}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mb: 6
                }}
              >
                ⚡ Actions Rapides
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 4,
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                          border: `2px solid ${action.color}66`,
                          '& .action-icon': {
                            transform: 'scale(1.1) rotate(5deg)',
                            background: action.color,
                            color: 'white'
                          },
                          '& .action-overlay': {
                            opacity: 1
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${action.color}22 0%, transparent 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover::before': {
                          opacity: 1
                        }
                      }}
                      onClick={action.action}
                    >
                      {/* Action Overlay */}
                      <Box 
                        className="action-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}08 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: 1
                        }}
                      />
                      
                      <CardContent sx={{ p: 4, position: 'relative', zIndex: 2, textAlign: 'center' }}>
                        {/* Icon Container */}
                        <Box 
                          className="action-icon"
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${action.color}15`,
                            borderRadius: '50%',
                            border: `3px solid ${action.color}33`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: -3,
                              left: -3,
                              right: -3,
                              bottom: -3,
                              borderRadius: '50%',
                              border: `1px solid ${action.color}22`,
                              animation: 'pulse 2s infinite'
                            }
                          }}
                        >
                          <Box sx={{ fontSize: 36, color: action.color }}>
                            {action.icon}
                          </Box>
                        </Box>
                        
                        {/* Title */}
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ 
                            color: action.color,
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: '1.2rem',
                            lineHeight: 1.2
                          }}
                        >
                          {action.title}
                        </Typography>
                        
                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(0, 0, 0, 0.7)',
                            mb: 3,
                            fontSize: '0.95rem',
                            lineHeight: 1.4
                          }}
                        >
                          {action.description}
                        </Typography>
                        
                        {/* Action Button */}
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForward />}
                          sx={{
                            background: action.color,
                            color: 'white',
                            fontWeight: 'bold',
                            px: 3,
                            py: 1,
                            borderRadius: 25,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            border: 'none',
                            '&:hover': {
                              background: `${action.color}dd`,
                              transform: 'translateX(4px)',
                              boxShadow: `0 8px 16px ${action.color}44`
                            }
                          }}
                        >
                          Accéder
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* CTA Section */}
        <Box sx={{ mb: { xs: 8, md: 12 }, display: 'flex', justifyContent: 'center' }}>
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
      </Box>

      {/* Footer */}
      </Container>
      <Container maxWidth="xl">
        <Box 
          component="footer"
          sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            py: 6,
            mt: 8,
            position: 'relative',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00BCD4' }}>
                MediFlow
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                La révolution de la santé connectée au service de tous les Tunisiens.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <IconButton 
                  href="https://facebook.com" 
                  target="_blank"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#1877F2' }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  href="https://twitter.com" 
                  target="_blank"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#1DA1F2' }
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  href="https://linkedin.com" 
                  target="_blank"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#0077B5' }
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton 
                  href="https://instagram.com" 
                  target="_blank"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#E4405F' }
                  }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00BCD4' }}>
                Liens Rapides
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/medicine-reserve" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Médicaments
                  </Link>
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/doctors" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Médecins
                  </Link>
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/hospitals" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Hôpitaux
                  </Link>
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/cnam" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    CNAM
                  </Link>
                </ListItem>
              </List>
            </Grid>

            {/* Services */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00BCD4' }}>
                Services
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/register" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Inscription
                  </Link>
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/login" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Connexion
                  </Link>
                </ListItem>
                {(user?.role === 'cnam_admin' || user?.isAdmin) && (
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/gestion-comptes" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Gestion des comptes
                  </Link>
                </ListItem>
                )}
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <Link 
                    href="/support" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      textDecoration: 'none',
                      '&:hover': { color: '#00BCD4' }
                    }}
                  >
                    Support
                  </Link>
                </ListItem>
              </List>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00BCD4' }}>
                Contact
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 20, color: '#00BCD4' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    contact@mediflow.tn
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 20, color: '#00BCD4' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    +216 71 123 456
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 20, color: '#00BCD4' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Tunis, Tunisie
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2026 MediFlow. Tous droits réservés. | 
              <Link 
                href="/privacy" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  ml: 1,
                  textDecoration: 'none',
                  '&:hover': { color: '#00BCD4' }
                }}
              >
                Politique de confidentialité
              </Link>
              {' | '}
              <Link 
                href="/terms" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  ml: 1,
                  textDecoration: 'none',
                  '&:hover': { color: '#00BCD4' }
                }}
              >
                Conditions d'utilisation
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Container>
    </Box>
  );
};

export default Home;
