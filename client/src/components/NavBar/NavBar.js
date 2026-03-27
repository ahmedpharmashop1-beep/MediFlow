import React, { useState, useEffect } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import {

  AppBar,

  Toolbar,

  Typography,

  Button,

  IconButton,

  Menu,

  MenuItem,

  Box,

  Avatar,

  useTheme,

  useMediaQuery,

  Drawer,

  List,

  ListItem,

  ListItemIcon,

  ListItemText,

  Divider,

  Badge,

  Tooltip,

  Fade

} from '@mui/material';

import {

  Menu as MenuIcon,

  AccountCircle,

  LocalHospital,

  LocalPharmacy,

  Medication,

  MedicalServices,

  Home,

  Login,

  Logout,

  Person,

  Dashboard,

  Notifications,

  Settings,

  HealthAndSafety,

  AccountBalance,

  People,

} from '@mui/icons-material';



const NavBar = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  

  const [anchorEl, setAnchorEl] = useState(null);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  

  const token = localStorage.getItem('token');

  const user = token ? (() => {

    try {

      const userData = localStorage.getItem('user');

      return userData ? JSON.parse(userData) : null;

    } catch (error) {

      console.error('Error parsing user data:', error);

      return null;

    }

  })() : null;



  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 20);

    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const handleMenuOpen = (event) => {

    setAnchorEl(event.currentTarget);

  };



  const handleMenuClose = () => {

    setAnchorEl(null);

  };



  const handleNotificationsOpen = (event) => {

    setNotificationsAnchorEl(event.currentTarget);

  };



  const handleNotificationsClose = () => {

    setNotificationsAnchorEl(null);

  };



  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    localStorage.removeItem('patient');

    handleMenuClose();

    navigate('/login');

  };



  const handleNavigation = (path) => {

    navigate(path);

    setMobileDrawerOpen(false);

  };



  const menuItems = [

    { label: 'Accueil', icon: <Home />, path: '/', color: '#2196F3' },

    { label: 'Pharmacies Privées', icon: <Medication />, path: '/medicine-reserve', color: '#4CAF50' },

    { label: 'Médecins', icon: <MedicalServices />, path: '/doctors', color: '#FF9800' },

    { label: 'Hôpitaux', icon: <LocalHospital />, path: '/hospitals', color: '#F44336' },

    { label: 'CNAM', icon: <AccountBalance />, path: '/cnam', color: '#9C27B0' },

    ...(user?.role === 'cnam_admin' || user?.isAdmin ? [

      { label: 'Gestion des comptes', icon: <People />, path: '/gestion-comptes', color: '#00BCD4' }

    ] : [])

  ];



  const getDashboardPath = () => {

    if (!user) return null;

    switch (user.role) {

      case 'pharmacist':

        return '/pharmacy-dashboard';

      case 'doctor':

        return '/doctor-dashboard';

      case 'cnam_admin':

        return '/admin-dashboard';

      default:

        return null;

    }

  };



  const dashboardPath = getDashboardPath();



  const drawerContent = (

    <Box sx={{ width: 250, pt: 2 }}>

      <Box sx={{ px: 2, pb: 2 }}>

        <Typography variant="h6" fontWeight="bold" color="primary.main">

          MediFlow

        </Typography>

      </Box>

      

      <List>

        {menuItems.map((item) => (

          <ListItem 

            button 

            key={item.path}

            onClick={() => handleNavigation(item.path)}

            selected={location.pathname === item.path}

            sx={{

              '&.Mui-selected': {

                backgroundColor: 'primary.main',

                color: 'white',

                '&:hover': {

                  backgroundColor: 'primary.dark',

                }

              }

            }}

          >

            <ListItemIcon sx={{ color: 'inherit' }}>

              {item.icon}

            </ListItemIcon>

            <ListItemText primary={item.label} />

          </ListItem>

        ))}

        

        {dashboardPath && (

          <>

            <Divider sx={{ my: 1 }} />

            <ListItem 

              button 

              onClick={() => handleNavigation(dashboardPath)}

              selected={location.pathname === dashboardPath}

              sx={{

                '&.Mui-selected': {

                  backgroundColor: 'primary.main',

                  color: 'white',

                  '&:hover': {

                    backgroundColor: 'primary.dark',

                  }

                }

              }}

            >

              <ListItemIcon sx={{ color: 'inherit' }}>

                <Dashboard />

              </ListItemIcon>

              <ListItemText primary="Tableau de bord" />

            </ListItem>

          </>

        )}

      </List>



      <Divider sx={{ my: 2 }} />

      

      {!token ? (

        <List>

          <ListItem button onClick={() => handleNavigation('/login')}>

            <ListItemIcon>

              <Login />

            </ListItemIcon>

            <ListItemText primary="Connexion" />

          </ListItem>

          <ListItem button onClick={() => handleNavigation('/register')}>

            <ListItemIcon>

              <Person />

            </ListItemIcon>

            <ListItemText primary="Inscription" />

          </ListItem>

        </List>

      ) : (

        <List>

          <ListItem button onClick={() => handleNavigation('/profile')}>

            <ListItemIcon>

              <AccountCircle />

            </ListItemIcon>

            <ListItemText primary="Profil" />

          </ListItem>

          <ListItem button onClick={handleLogout}>

            <ListItemIcon>

              <Logout />

            </ListItemIcon>

            <ListItemText primary="Déconnexion" />

          </ListItem>

        </List>

      )}

    </Box>

  );



  return (

    <>

      <AppBar 

        position="fixed"

        sx={{

          background: scrolled 

            ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(156, 39, 176, 0.95) 100%)' 

            : 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(156, 39, 176, 0.9) 100%)',

          backdropFilter: 'blur(20px)',

          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.1)' : 'none',

          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

          color: 'white',

          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.2)' : 'none'

        }}

      >

        <Toolbar>

          {/* Logo */}

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>

            <HealthAndSafety sx={{ mr: 1, color: 'white', fontSize: 28 }} />

            <Typography 

              variant="h6" 

              component={Link} 

              to="/"

              sx={{ 

                textDecoration: 'none', 

                color: 'white',

                fontWeight: 'bold',

                '&:hover': {

                  color: 'rgba(255,255,255,0.8)'

                }

              }}

            >

              MediFlow

            </Typography>

          </Box>



          {/* Desktop Navigation */}

          {!isMobile && (

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

              {menuItems.map((item) => (

                <Button

                  key={item.path}

                  component={Link}

                  to={item.path}

                  startIcon={item.icon}

                  sx={{

                    color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.8)',

                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',

                    background: location.pathname === item.path ? `linear-gradient(45deg, ${item.color} 30%, ${item.color}CC 100%)` : 'transparent',

                    borderRadius: 2,

                    textTransform: 'none',

                    px: 2,

                    py: 1,

                    transition: 'all 0.3s ease',

                    '&:hover': {

                      background: `linear-gradient(45deg, ${item.color} 30%, ${item.color}CC 100%)`,

                      color: 'white',

                      transform: 'translateY(-2px)'

                    }

                  }}

                >

                  {item.label}

                </Button>

              ))}



              {dashboardPath && (

                <Button

                  component={Link}

                  to={dashboardPath}

                  startIcon={<Dashboard />}

                  sx={{

                    color: location.pathname === dashboardPath ? 'primary.main' : 'inherit',

                    fontWeight: location.pathname === dashboardPath ? 'bold' : 'normal',

                    borderBottom: location.pathname === dashboardPath ? '2px solid' : 'none',

                    borderColor: 'primary.main',

                    borderRadius: 0,

                    textTransform: 'none',

                    px: 2

                  }}

                >

                  Tableau de bord

                </Button>

              )}



              {!token ? (

                <>

                  <Button

                    component={Link}

                    to="/login"

                    startIcon={<Login />}

                    sx={{ textTransform: 'none' }}

                  >

                    Connexion

                  </Button>

                  <Button

                    component={Link}

                    to="/register"

                    variant="contained"

                    sx={{ textTransform: 'none', ml: 1 }}

                  >

                    S'inscrire

                  </Button>

                </>

              ) : (

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                  <Tooltip title="Notifications">

                    <IconButton color="inherit" onClick={handleNotificationsOpen}>

                      <Badge badgeContent={3} color="error">

                        <Notifications />

                      </Badge>

                    </IconButton>

                  </Tooltip>

                  

                  <Tooltip title="Mon compte">

                    <IconButton

                      color="inherit"

                      onClick={handleMenuOpen}

                      sx={{ ml: 1 }}

                    >

                      <Avatar 

                        sx={{ 

                          width: 36, 

                          height: 36,

                          bgcolor: 'primary.main',

                          border: '2px solid white',

                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',

                          transition: 'all 0.2s ease',

                          '&:hover': {

                            transform: 'scale(1.05)',

                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'

                          }

                        }}

                      >

                        {user?.firstname ? (

                          `${user.firstname[0]}${user.lastname ? user.lastname[0] : ''}`.toUpperCase()

                        ) : (

                          <Person sx={{ fontSize: 20 }} />

                        )}

                      </Avatar>

                    </IconButton>

                  </Tooltip>

                </Box>

              )}

            </Box>

          )}



          {/* Mobile Menu */}

          {isMobile && (

            <IconButton

              color="inherit"

              onClick={() => setMobileDrawerOpen(true)}

              sx={{ ml: 1 }}

            >

              <MenuIcon />

            </IconButton>

          )}

        </Toolbar>

      </AppBar>



      {/* User Menu */}

      <Menu

        anchorEl={anchorEl}

        open={Boolean(anchorEl)}

        onClose={handleMenuClose}

        TransitionComponent={Fade}

        PaperProps={{

          elevation: 8,

          sx: {

            mt: 1,

            minWidth: 200,

            borderRadius: 2

          }

        }}

      >

        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>

          <ListItemIcon>

            <AccountCircle fontSize="small" />

          </ListItemIcon>

          Mon profil

        </MenuItem>

        

        {user?.role === 'pharmacist' && (

          <MenuItem onClick={() => { handleMenuClose(); navigate('/pharmacy-dashboard'); }}>

            <ListItemIcon>

              <LocalPharmacy fontSize="small" />

            </ListItemIcon>

            Tableau de bord

          </MenuItem>

        )}

        

        {user?.role === 'doctor' && (

          <MenuItem onClick={() => { handleMenuClose(); navigate('/doctor-dashboard'); }}>

            <ListItemIcon>

              <MedicalServices fontSize="small" />

            </ListItemIcon>

            Tableau de bord

          </MenuItem>

        )}

        

        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>

          <ListItemIcon>

            <Settings fontSize="small" />

          </ListItemIcon>

          Paramètres

        </MenuItem>

        

        <Divider />

        

        <MenuItem onClick={handleLogout}>

          <ListItemIcon>

            <Logout fontSize="small" />

          </ListItemIcon>

          Déconnexion

        </MenuItem>

      </Menu>



      {/* Notifications Menu */}

      <Menu

        anchorEl={notificationsAnchorEl}

        open={Boolean(notificationsAnchorEl)}

        onClose={handleNotificationsClose}

        TransitionComponent={Fade}

        PaperProps={{

          elevation: 8,

          sx: {

            mt: 1,

            minWidth: 300,

            maxWidth: 400,

            borderRadius: 2

          }

        }}

      >

        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>

          <Typography variant="h6" fontWeight="bold">

            Notifications

          </Typography>

        </Box>

        

        <MenuItem sx={{ py: 2 }}>

          <ListItemIcon>

            <Medication sx={{ color: 'primary.main' }} />

          </ListItemIcon>

          <Box>

            <Typography variant="body2" fontWeight="bold">

              Médicament disponible

            </Typography>

            <Typography variant="caption" color="text.secondary">

              Votre réservation pour Aspirine est prête

            </Typography>

          </Box>

        </MenuItem>

        

        <MenuItem sx={{ py: 2 }}>

          <ListItemIcon>

            <LocalPharmacy sx={{ color: 'success.main' }} />

          </ListItemIcon>

          <Box>

            <Typography variant="body2" fontWeight="bold">

              Pharmacie Privée partenaire

            </Typography>

            <Typography variant="caption" color="text.secondary">

              Nouvelle pharmacie privée ajoutée près de chez vous

            </Typography>

          </Box>

        </MenuItem>

        

        <MenuItem sx={{ py: 2 }}>

          <ListItemIcon>

            <MedicalServices sx={{ color: 'warning.main' }} />

          </ListItemIcon>

          <Box>

            <Typography variant="body2" fontWeight="bold">

              Rendez-vous confirmé

            </Typography>

            <Typography variant="caption" color="text.secondary">

              Votre rendez-vous médical est confirmé

            </Typography>

          </Box>

        </MenuItem>

        

        <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>

          <Button size="small" onClick={handleNotificationsClose}>

            Voir toutes les notifications

          </Button>

        </Box>

      </Menu>



      {/* Mobile Drawer */}

      <Drawer

        anchor="left"

        open={mobileDrawerOpen}

        onClose={() => setMobileDrawerOpen(false)}

        sx={{

          '& .MuiDrawer-paper': {

            backgroundColor: 'background.paper'

          }

        }}

      >

        {drawerContent}

      </Drawer>



      {/* Spacer for fixed AppBar */}

      <Toolbar />

    </>

  );

};



export default NavBar;



