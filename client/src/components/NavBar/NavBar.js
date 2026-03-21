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
  Chip,
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
  HealthAndSafety
} from '@mui/icons-material';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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
    { label: 'Accueil', icon: <Home />, path: '/' },
    { label: 'Recherche Médicaments', icon: <Medication />, path: '/medicine-reserve' }
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
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? 4 : 'none',
          transition: 'all 0.3s ease',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <HealthAndSafety sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'primary.main'
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
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    textTransform: 'none',
                    px: 2
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
                    <IconButton color="inherit">
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
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.main'
                        }}
                      >
                        {user?.firstname?.[0] || user?.email?.[0] || 'U'}
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

