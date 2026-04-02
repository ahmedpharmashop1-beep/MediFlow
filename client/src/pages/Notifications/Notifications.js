import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Chip,
  Divider,
  Paper,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MedicalServices as AppointmentIcon,
  Medication as ReservationIcon,
  Info as SystemIcon,
  DoneAll,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/appointments/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      // Sequential for simplicity if no bulk API exists
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => 
        axios.put(`http://localhost:5000/api/appointments/notifications/${n._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment': return <AppointmentIcon sx={{ color: '#2196F3' }} />;
      case 'reservation': return <ReservationIcon sx={{ color: '#4CAF50' }} />;
      default: return <SystemIcon sx={{ color: '#FF9800' }} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ 
            color: 'white', 
            textTransform: 'none',
            '&:hover': { background: 'rgba(255,255,255,0.1)' }
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.5)',
            width: 56,
            height: 56
          }}>
            <NotificationsIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              Gérez vos alertes et l'historique de vos activités
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<DoneAll />}
          onClick={markAllAsRead}
          disabled={!notifications.some(n => !n.isRead)}
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: 3,
            px: 3,
            '&:hover': { 
              background: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            '&.Mui-disabled': {
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          Tout marquer comme lu
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress sx={{ 
            borderRadius: 2, 
            height: 8, 
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
            }
          }} />
        </Box>
      ) : (
        <Fade in timeout={800}>
          <Box sx={{ mt: 2 }}>
            {notifications.length === 0 ? (
              <Paper
                sx={{
                  p: 8,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 6,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <NotificationsIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Votre boîte de réception est vide
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notifications.map((notif) => (
                  <Card
                    key={notif._id}
                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                    sx={{
                      background: notif.isRead 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                      backdropFilter: 'blur(15px)',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: notif.isRead ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.01) translateY(-4px)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                      },
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    {!notif.isRead && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        left: -4, 
                        width: 8, 
                        height: 24, 
                        bgcolor: 'primary.main', 
                        borderRadius: '0 4px 4px 0',
                        boxShadow: '0 0 15px rgba(79, 172, 254, 0.8)'
                      }} />
                    )}
                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                      <Avatar sx={{ 
                        bgcolor: notif.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', 
                        border: '1px solid',
                        borderColor: 'rgba(255,255,255,0.1)',
                        width: 48,
                        height: 48
                      }}>
                        {getIcon(notif.type)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ 
                            color: 'white', 
                            fontWeight: notif.isRead ? 600 : 800,
                            letterSpacing: '0.02em',
                            fontSize: '1.1rem'
                          }}>
                            {notif.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                            {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                            })} • {new Date(notif.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(255,255,255,0.8)', 
                          lineHeight: 1.6,
                          fontSize: '0.95rem'
                        }}>
                          {notif.message}
                        </Typography>
                        {!notif.isRead && (
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Chip 
                              label="Nouveau" 
                              size="small" 
                              color="primary"
                              sx={{ 
                                fontWeight: 'bold', 
                                fontSize: '0.7rem', 
                                height: 20,
                                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
                              }} 
                            />
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default Notifications;
