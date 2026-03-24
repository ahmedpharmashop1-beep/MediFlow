import React, { useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar
} from '@mui/material';
import {
  People,
  Assessment,
  Storage,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
      try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          return null;
        }
      }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!user || (user.role !== 'cnam_admin' && !user.isAdmin)) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'cnam_admin' && !user.isAdmin)) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}
        >
          <AccountBalance sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" sx={{ 
          color: '#1976d2',
          fontWeight: 'bold',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AccountBalance sx={{ mr: 2, fontSize: 32 }} />
          Tableau de Bord Administrateur
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Vue d'ensemble du système MediFlow
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Carte de gestion des comptes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 15px 30px rgba(102, 126, 234, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <People sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Gestion des Comptes
              </Typography>
              <Typography variant="body2">
                Gérer tous les utilisateurs
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: 'white',
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                onClick={() => navigate('/gestion-comptes')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte de supervision */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 15px 30px rgba(240, 147, 251, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Assessment sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Supervision Système
              </Typography>
              <Typography variant="body2">
                Monitoring et audit
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: 'white',
                  color: '#f093fb',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                En développement
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte de base de données */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 15px 30px rgba(79, 172, 254, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Storage sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Base de Données
              </Typography>
              <Typography variant="body2">
                Administration DB
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: 'white',
                  color: '#4facfe',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                En développement
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte de sécurité */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 15px 30px rgba(250, 112, 154, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Security sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Sécurité
              </Typography>
              <Typography variant="body2">
                Audit et permissions
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: 'white',
                  color: '#fa709a',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                En développement
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
          💡 Conseil : Utilisez le compte admin@mediflow.com pour un accès complet au système
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboard;