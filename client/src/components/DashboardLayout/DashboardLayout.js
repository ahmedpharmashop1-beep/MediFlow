import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Tooltip,
  Badge,
  Divider,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Medication as MedicineIcon,
  EventNote as AppointmentsIcon,
  LocalPharmacy as PharmacyIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  HealthAndSafety as CnamIcon,
  LocalHospital as DoctorIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const dashboardTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4facfe' },
    secondary: { main: '#FF6B6B' },
    background: { paper: 'rgba(255, 255, 255, 0.05)' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          color: '#fff',
          borderRadius: 16
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          borderRadius: 16
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff'
        },
        colorTextSecondary: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        },
        head: {
          fontWeight: 'bold',
          color: '#4facfe'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }
      }
    }
  }
});

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Global State to pass via Props
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');
    
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUser({
          ...userData,
          name: userData.firstname ? `${userData.firstname} ${userData.lastname}` : userData.pharmacyName || userData.name || 'Utilisateur',
          avatar: userData.role === 'doctor' ? '👨‍⚕️' : userData.role === 'pharmacist' ? '⚕️' : '👨‍💼',
        });
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Menu items based on role (could be dynamic or filtered)
  const menuItems = [
    { text: 'Accueil & Recherche', icon: <DashboardIcon />, path: '/medicine-reserve', roles: ['patient', 'doctor', 'pharmacist'] },
    { text: 'Mes Rendez-vous', icon: <AppointmentsIcon />, path: '/appointments', roles: ['patient', 'doctor'] },
    { text: 'Dossier CNAM', icon: <CnamIcon />, path: '/cnam-tracking', roles: ['patient', 'doctor', 'pharmacist'] },
    { text: 'Dashboard Pharmacie', icon: <PharmacyIcon />, path: '/pharmacy-dashboard', roles: ['pharmacist'] },
    { text: 'Espace Médecin', icon: <DoctorIcon />, path: '/doctor-dashboard', roles: ['doctor'] },
    { text: 'Mon Profil', icon: <ProfileIcon />, path: '/profile', roles: ['patient', 'doctor', 'pharmacist'] },
  ];

  const filteredMenu = user ? menuItems.filter(item => item.roles.includes(user.role)) : [];

  const drawerContent = (
    <Box sx={{
      height: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' }}>
          <CnamIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ background: 'linear-gradient(to right, #fff, #e0e0e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          MediFlow
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography variant="overline" sx={{ px: 3, mb: 1, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>
          Menu Principal
        </Typography>
        <List>
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  mb: 1,
                  mx: 2,
                  borderRadius: 3,
                  width: 'calc(100% - 32px)',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                  boxShadow: isActive ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateX(5px)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#FF8E53' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.9)'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Profile Summary in Sidebar */}
      {user && (
        <Box sx={{ p: 2, m: 2, borderRadius: 4, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#4ECDC4' }}>{user.avatar}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold" color="white">{user.name}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{user.role}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  // Extend children with props (user, notifications) for inter-module communication
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { user, notifications, setNotifications });
    }
    return child;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      {/* App Bar for Mobile / Top controls */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(30, 60, 114, 0.4)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Paramètres">
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <IconButton onClick={handleMenuClick} sx={{ p: 0, ml: 1, border: '2px solid rgba(255,255,255,0.2)' }}>
              <Avatar sx={{ bgcolor: '#FF6B6B', width: 35, height: 35 }}>{user ? user.avatar : '?'}</Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 150,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                Profil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'transparent', border: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'transparent', border: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
        <ThemeProvider theme={dashboardTheme}>
          {/* Pass down global properties and context to children */}
          {childrenWithProps}
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
