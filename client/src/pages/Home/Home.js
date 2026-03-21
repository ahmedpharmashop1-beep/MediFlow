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
  useMediaQuery
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
  EmojiEvents
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'Recherche Intelligente',
      description: 'Trouvez rapidement vos médicaments dans les pharmacies à proximité',
      color: '#FF6B6B',
      stats: '5000+',
      statsLabel: 'Recherches/jour',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    {
      icon: <LocalPharmacy sx={{ fontSize: 40 }} />,
      title: 'Pharmacies Connectées',
      description: 'Accédez à un réseau de pharmacies de confiance en temps réel',
      color: '#4ECDC4',
      stats: '200+',
      statsLabel: 'Pharmacies partenaires',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    {
      icon: <Medication sx={{ fontSize: 40 }} />,
      title: 'Disponibilité Instantanée',
      description: 'Vérifiez la disponibilité des médicaments avant de vous déplacer',
      color: '#45B7D1',
      stats: '10,000+',
      statsLabel: 'Produits référencés',
      gradient: 'linear-gradient(135deg, #45B7D1 0%, #2196F3 100%)'
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      title: 'Réservation Sécurisée',
      description: 'Réservez vos médicaments et récupérez-les facilement en pharmacie',
      color: '#96CEB4',
      stats: '1000+',
      statsLabel: 'Réservations/jour',
      gradient: 'linear-gradient(135deg, #96CEB4 0%, #88D8B0 100%)'
    }
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Patient',
      content: 'MediFlow a transformé ma façon de trouver mes médicaments. Plus de pertes de temps !',
      rating: 5,
      avatar: '👩‍⚕️',
      color: '#FF6B6B'
    },
    {
      name: 'Dr. Bernard Dubois',
      role: 'Médecin',
      content: 'Excellent outil pour suivre les ordonnances et la disponibilité des traitements.',
      rating: 5,
      avatar: '👨‍⚕️',
      color: '#4ECDC4'
    },
    {
      name: 'Pharmacie Santé+',
      role: 'Pharmacien',
      content: 'Notre stock est mieux géré et les patients sont plus satisfaits.',
      rating: 5,
      avatar: '🏥',
      color: '#45B7D1'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Utilisateurs actifs', icon: <TrendingUp />, color: '#FF6B6B' },
    { number: '200+', label: 'Pharmacies partenaires', icon: <LocalPharmacy />, color: '#4ECDC4' },
    { number: '10K+', label: 'Médicaments référencés', icon: <Medication />, color: '#45B7D1' },
    { number: '99.9%', label: 'Satisfaction', icon: <Star />, color: '#96CEB4' }
  ];

  const quickActions = [
    {
      title: 'Rechercher un médicament',
      description: 'Trouvez votre médicament en quelques secondes',
      icon: <Search />,
      color: '#FF6B6B',
      action: () => navigate('/medicine-reserve')
    },
    {
      title: 'Réserver en ligne',
      description: 'Réservez et récupérez sans attente',
      icon: <AccessTime />,
      color: '#4ECDC4',
      action: () => navigate('/medicine-reserve')
    },
    {
      title: 'Pharmacies proches',
      description: 'Localisez les pharmacies autour de vous',
      icon: <LocationOn />,
      color: '#45B7D1',
      action: () => navigate('/medicine-reserve')
    },
    {
      title: 'Contacter une pharmacie',
      description: 'Appelez directement votre pharmacie',
      icon: <Phone />,
      color: '#96CEB4',
      action: () => navigate('/medicine-reserve')
    }
  ];

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
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v-4h2v4h4v-2h-4v4h2v-4h4v4h4v-2h-4v4h2v-4h4v4h4v-2h-4v4z'/%3E%3C/g%3E%3C/svg%3E")`,
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

        {/* Quick Actions */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Slide direction="up" in={true} timeout={1200}>
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
                Actions Rapides
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
                          background: action.gradient
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

        {/* Features Section */}
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
                  mb: 4
                }}
              >
                Fonctionnalités Innovantes
              </Typography>
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  textAlign: 'center',
                  mb: 6
                }}
              >
                Une solution complète pour la gestion de votre santé
              </Typography>
              
              <Grid container spacing={4}>
                {features.map((feature, index) => (
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
                        <Box sx={{ mb: 2, color: 'white' }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                          {feature.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                            {feature.stats}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {feature.statsLabel}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Box>

        {/* Testimonials Section */}
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
                Ils nous font confiance
              </Typography>
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  textAlign: 'center',
                  mb: 6
                }}
              >
                Découvrez les témoignages de nos utilisateurs
              </Typography>
              
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, fontSize: 24, bgcolor: testimonial.color }}>
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ fontSize: 16, color: '#FFD700' }} />
                        ))}
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                        "{testimonial.content}"
                      </Typography>
                    </Paper>
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
                maxWidth: 600,
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
                Prêt à révolutionner votre expérience santé ?
              </Typography>
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  mb: 4
                }}
              >
                Rejoignez des milliers d'utilisateurs qui simplifient leur gestion de santé
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
