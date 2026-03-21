import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Fade,
  Slide,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Login as LoginIcon,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  Security,
  HowToReg,
  Support,
  CheckCircle
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Tenter la connexion avec l'endpoint générique
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      
      // Stocker les informations d'authentification
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirection selon le rôle de l'utilisateur
      switch (data.user.role) {
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
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.msg || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  const loginFeatures = [
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Sécurisé',
      description: 'Authentification sécurisée avec chiffrement SSL'
    },
    {
      icon: <HowToReg sx={{ fontSize: 32 }} />,
      title: 'Multi-rôles',
      description: 'Accès adapté selon votre profil (Patient, Pharmacien, Médecin, Admin)'
    },
    {
      icon: <Support sx={{ fontSize: 32 }} />,
      title: 'Support 24/7',
      description: 'Assistance technique disponible à tout moment'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v-4h2v4h4v-2h-4v4h2v-4h4v4h-4v-4h2v4h4v-2h-4v4h2v-4h4v4h-4v-4h2v4h4v-2h-4v4h2v-4h4v4h-4v-4h2v4h4v-2h-4v4z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        animation: 'float 20s infinite ease-in-out'
      }} />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Slide direction="right" in={true} timeout={800}>
              <Paper 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: 32
                    }}
                  >
                    <LoginIcon />
                  </Avatar>
                  <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
                    Bienvenue sur MediFlow
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Connectez-vous pour accéder à votre espace personnel
                  </Typography>
                </Box>

                <form onSubmit={onSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      required
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Mot de passe"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={onChange}
                      required
                      InputProps={{
                        startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{ marginRight: 8 }}
                        />
                        <label htmlFor="remember" style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                          Se souvenir de moi
                        </label>
                      </Box>
                      
                      <Link 
                        to="/forgot-password" 
                        style={{ 
                          color: theme.palette.primary.main, 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                      >
                        Mot de passe oublié?
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 1.5, 
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                  </Box>
                </form>

                {error && (
                  <Fade in={true}>
                    <Alert 
                      severity="error" 
                      sx={{ mt: 3 }}
                      action={
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => setError('')}
                        >
                          ✕
                        </Button>
                      }
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Pas encore de compte?{' '}
                    <Link 
                      to="/register" 
                      style={{ 
                        color: theme.palette.primary.main, 
                        fontWeight: 'bold',
                        textDecoration: 'none'
                      }}
                    >
                      Créer un compte
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={true} timeout={1000}>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold" color="white" textAlign="center">
                    Pourquoi choisir MediFlow?
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    {loginFeatures.map((feature, index) => (
                      <Fade in={true} timeout={1200 + index * 200} key={index}>
                        <Card 
                          sx={{ 
                            mb: 2,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              background: 'rgba(255, 255, 255, 0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                            <Box sx={{ mb: 2, color: 'white' }}>
                              {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {feature.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Slide>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Floating elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        color: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite'
      }}>
        <CheckCircle sx={{ fontSize: 60 }} />
      </Box>
    </Box>
  );
};

export default Login;
