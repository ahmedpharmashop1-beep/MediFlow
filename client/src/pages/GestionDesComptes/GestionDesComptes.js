import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Paper,
  InputAdornment,
  Fab,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  Person,
  Add,
  People,
  LocalHospital,
  MedicalServices,
  AccountBalance,
  LocalPharmacy,
  Star,
  LocationOn,
  Sort
} from '@mui/icons-material';

const GestionDesComptes = () => {
  const navigate = useNavigate();

  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCompte, setNewCompte] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'patient'
  });
  
  // États pour la navigation par tabs
  const [activeTab, setActiveTab] = useState(0);
  const [filterConnected, setFilterConnected] = useState(false);
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterLoad, setFilterLoad] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');

  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => {
      try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          return null;
        }
      }, []);

  // Mock data has been removed - data is now fetched from the API
  
  const fetchComptes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/comptes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Comptes loaded from API:", response.data.comptes);
      setComptes(response.data.comptes);
      console.log("Comptes state set");
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError(err?.response?.data?.msg || "Erreur lors du chargement des comptes");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    console.log("User role:", user?.role);
    console.log("User data:", user);
    
    if (!user) {
      console.log("No user data - redirecting to home");
      navigate("/");
      return;
    }

    // Vérifier si l'utilisateur est un administrateur
    if (user.role !== 'cnam_admin' && !user.isAdmin) {
      console.log("Access denied - user is not admin, redirecting to home");
      navigate("/");
      return;
    }

    console.log("Admin access granted - loading comptes");
    fetchComptes();
  }, [navigate, token, user, fetchComptes]);

  const handleEdit = (compte) => {
    setSelectedCompte(compte);
    setEditDialogOpen(true);
  };

  const handleDelete = (compte) => {
    setSelectedCompte(compte);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`http://localhost:5000/api/comptes/${selectedCompte._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Compte supprimé:", selectedCompte._id);
      setComptes(comptes.filter(c => c._id !== selectedCompte._id));
      setDeleteDialogOpen(false);
      setSelectedCompte(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err?.response?.data?.msg || "Erreur lors de la suppression du compte");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedCompte) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`http://localhost:5000/api/comptes/${updatedCompte._id}`, updatedCompte, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Compte mis à jour:", response.data.compte);
      setComptes(comptes.map(c => c._id === updatedCompte._id ? response.data.compte : c));
      setEditDialogOpen(false);
      setSelectedCompte(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(err?.response?.data?.msg || "Erreur lors de la sauvegarde du compte");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompte = async () => {
    try {
      if (!newCompte.firstName || !newCompte.email) {
        setError("Le prénom et l'email sont requis");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/comptes/register', newCompte, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Nouveau compte créé:", response.data);
      setComptes([...comptes, response.data.compte]);
      setAddDialogOpen(false);
      setNewCompte({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'patient'
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout du compte:", err);
      setError(err?.response?.data?.msg || "Erreur lors de l'ajout du compte");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'inactive': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  // Fonction pour obtenir les comptes par type
  const getComptesByType = (type) => {
    return comptes.filter(compte => compte.role === type);
  };

  // Fonction pour appliquer les filtres
  const applyFilters = (comptesList) => {
    let filtered = comptesList;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(compte => {
        const searchText = `${compte.firstName || ''} ${compte.lastName || ''} ${compte.name || ''} ${compte.email || ''}`.toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      });
    }

    // Filtre par connexion
    if (filterConnected) {
      filtered = filtered.filter(compte => compte.isConnected);
    }

    // Filtre par note
    if (filterTopRated) {
      filtered = filtered.filter(compte => compte.rating >= 4.5);
    }

    // Filtre par charge (pour hôpitaux et CNAM)
    if (filterLoad !== 'all') {
      filtered = filtered.filter(compte => {
        if (compte.currentLoad !== undefined) {
          if (filterLoad === 'low') return compte.currentLoad <= 70;
          if (filterLoad === 'medium') return compte.currentLoad > 70 && compte.currentLoad <= 85;
          if (filterLoad === 'high') return compte.currentLoad > 85;
        }
        return true;
      });
    }

    // Filtre par distance (pour hôpitaux et CNAM)
    if (filterDistance !== 'all') {
      filtered = filtered.filter(compte => {
        if (compte.distance !== undefined) {
          if (filterDistance === 'near') return compte.distance <= 3;
          if (filterDistance === 'medium') return compte.distance > 3 && compte.distance <= 6;
          if (filterDistance === 'far') return compte.distance > 6;
        }
        return true;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = a.name || `${a.firstName} ${a.lastName}`;
          const nameB = b.name || `${b.firstName} ${b.lastName}`;
          return nameA.localeCompare(nameB);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'load':
          return (a.currentLoad || 0) - (b.currentLoad || 0);
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Obtenir les comptes filtrés selon le tab actif
  const getFilteredComptes = () => {
    let comptesByType = [];
    
    switch (activeTab) {
      case 0: // Patients
        comptesByType = getComptesByType('patient');
        break;
      case 1: // Médecins
        comptesByType = getComptesByType('doctor');
        break;
      case 2: // Pharmaciens
        comptesByType = getComptesByType('pharmacist');
        break;
      case 3: // Hôpitaux
        comptesByType = getComptesByType('hospital');
        break;
      case 4: // CNAM
        comptesByType = getComptesByType('cnam_admin');
        break;
      default:
        comptesByType = comptes;
    }
    
    return applyFilters(comptesByType);
  };

  const filteredComptes = getFilteredComptes();

  // Fonction pour afficher les cartes spécifiques selon le type
  const renderCompteCard = (compte) => {
    const commonProps = {
      sx: {
        height: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${compte.isConnected ? '#4CAF50' : '#9E9E9E'}`,
        borderRadius: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px rgba(0,0,0,0.15), 0 0 20px ${compte.isConnected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.2)'}`
        }
      }
    };

    switch (compte.role) {
      case 'patient':
        return React.createElement(
          Card,
          commonProps,
          // Status Indicator
          React.createElement(
            Box,
            {
              sx: {
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: 12,
                border: `1px solid ${compte.isConnected ? '#4CAF50' : '#9E9E9E'}`
              }
            },
            React.createElement(
              Box,
              {
                sx: {
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: compte.isConnected 
                    ? 'radial-gradient(circle, #8BC34A 0%, #4CAF50 100%)'
                    : 'radial-gradient(circle, #757575 0%, #9E9E9E 100%)',
                  boxShadow: compte.isConnected 
                    ? '0 0 8px rgba(76, 175, 80, 0.8), inset 0 0 4px rgba(255, 255, 255, 0.5)'
                    : '0 0 8px rgba(158, 158, 158, 0.5), inset 0 0 4px rgba(255, 255, 255, 0.3)',
                  animation: compte.isConnected 
                    ? 'pulse 2s infinite'
                    : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '100%': { transform: 'scale(1)', opacity: 1 }
                  }
                }
              }
            ),
            React.createElement(
              Typography,
              {
                variant: "caption",
                sx: {
                  fontWeight: 'bold',
                  color: compte.isConnected ? '#4CAF50' : '#9E9E9E',
                  fontSize: '0.7rem'
                }
              },
              compte.isConnected ? 'EN LIGNE' : 'HORS LIGNE'
            )
          ),
          // Patient Content
          React.createElement(
            CardContent,
            { sx: { p: 3, pt: 4 } },
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
              React.createElement(
                Avatar,
                {
                  sx: {
                    width: 48,
                    height: 48,
                    mr: 2,
                    background: compte.isConnected 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
                      : 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                    border: compte.isConnected 
                      ? '2px solid rgba(76, 175, 80, 0.3)'
                      : '2px solid rgba(158, 158, 158, 0.3)'
                  }
                },
                React.createElement(Person)
              ),
              React.createElement(
                Box,
                { sx: { flexGrow: 1 } },
                React.createElement(
                  Typography,
                  { variant: "h6", sx: { color: '#00BCD4', fontWeight: 'bold' } },
                  `${compte.firstName} ${compte.lastName}`
                ),
                React.createElement(
                  Box,
                  { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 1 } },
                  React.createElement(
                    Chip,
                    {
                      label: getStatusText(compte.status),
                      size: "small",
                      sx: {
                        background: getStatusColor(compte.status) + '20',
                        color: getStatusColor(compte.status),
                        border: `1px solid ${getStatusColor(compte.status)}40`,
                        fontWeight: 'bold'
                      }
                    }
                  ),
                  React.createElement(
                    Rating,
                    {
                      value: compte.rating || 0,
                      readOnly: true,
                      size: "small",
                      precision: 0.1
                    }
                  )
                )
              )
            ),
            React.createElement(
              Box,
              {
                sx: {
                  background: compte.isConnected 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%)',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  border: `1px solid ${compte.isConnected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.3)'}`
                }
              },
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Email: "),
                compte.email
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Téléphone: "),
                compte.phone
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary" },
                React.createElement("strong", null, "N° CNAM: "),
                compte.insuranceNumber
              )
            ),
            // Actions
            React.createElement(
              Box,
              { sx: { display: 'flex', gap: 1, mt: 2 } },
              React.createElement(
                Button,
                {
                  variant: "contained",
                  size: "small",
                  onClick: () => handleEdit(compte),
                  sx: {
                    background: 'linear-gradient(45deg, #00BCD4 30%, #0097A7 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00ACC1 30%, #00838F 90%)'
                    }
                  }
                },
                "Modifier"
              ),
              React.createElement(
                Button,
                {
                  variant: "outlined",
                  size: "small",
                  onClick: () => handleDelete(compte),
                  sx: {
                    borderColor: '#F44336',
                    color: '#F44336',
                    '&:hover': {
                      borderColor: '#D32F2F',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)'
                    }
                  }
                },
                "Supprimer"
              )
            )
          )
        );

      case 'doctor':
        return React.createElement(
          Card,
          commonProps,
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
              React.createElement(
                Avatar,
                {
                  sx: {
                    width: 56,
                    height: 56,
                    mr: 2,
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                  }
                },
                React.createElement(MedicalServices)
              ),
              React.createElement(
                Box,
                { sx: { flexGrow: 1 } },
                React.createElement(
                  Typography,
                  { variant: "h6", sx: { color: '#FF9800', fontWeight: 'bold' } },
                  `${compte.firstName} ${compte.lastName}`
                ),
                React.createElement(
                  Typography,
                  { variant: "body2", color: "text.secondary", sx: { mb: 1 } },
                  compte.speciality
                ),
                React.createElement(
                  Box,
                  { sx: { display: 'flex', alignItems: 'center', gap: 1 } },
                  React.createElement(Rating, { value: compte.rating || 0, readOnly: true, size: "small" }),
                  React.createElement(
                    Chip,
                    {
                      label: `${compte.experience} ans`,
                      size: "small",
                      sx: { background: '#FFF3E0', color: '#F57C00' }
                    }
                  )
                )
              )
            ),
            React.createElement(
              Box,
              { sx: { mt: 2 } },
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Hôpital: "),
                compte.hospital
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Patients: "),
                `${compte.patientsCount} patients`
              ),
              React.createElement(
                Box,
                { sx: { display: 'flex', alignItems: 'center', gap: 1, mt: 1 } },
                React.createElement(
                  Badge,
                  {
                    badgeContent: compte.isConnected ? '•' : '',
                    color: compte.isConnected ? 'success' : 'default',
                    sx: { '& .MuiBadge-badge': { fontSize: '1rem' } }
                  },
                  React.createElement(
                    Chip,
                    {
                      label: compte.isConnected ? 'Disponible' : 'Indisponible',
                      size: "small",
                      sx: {
                        background: compte.isConnected ? '#E8F5E8' : '#FFF3E0',
                        color: compte.isConnected ? '#2E7D32' : '#F57C00'
                      }
                    }
                  )
                )
              )
            )
          )
        );

      case 'pharmacist':
        return React.createElement(
          Card,
          commonProps,
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
              React.createElement(
                Avatar,
                {
                  sx: {
                    width: 56,
                    height: 56,
                    mr: 2,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                  }
                },
                React.createElement(LocalPharmacy)
              ),
              React.createElement(
                Box,
                { sx: { flexGrow: 1 } },
                React.createElement(
                  Typography,
                  { variant: "h6", sx: { color: '#4CAF50', fontWeight: 'bold' } },
                  `${compte.firstName} ${compte.lastName}`
                ),
                React.createElement(
                  Typography,
                  { variant: "body2", color: "text.secondary", sx: { mb: 1 } },
                  compte.pharmacyName
                ),
                React.createElement(Rating, { value: compte.rating || 0, readOnly: true, size: "small" })
              )
            ),
            React.createElement(
              Box,
              { sx: { mt: 2 } },
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Commandes: "),
                `${compte.ordersCount} commandes`
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary" },
                React.createElement("strong", null, "Livraison: "),
                React.createElement(
                  Chip,
                  {
                    label: compte.deliveryTime,
                    size: "small",
                    sx: { background: '#E8F5E8', color: '#2E7D32' }
                  }
                )
              )
            )
          )
        );

      case 'hospital':
        return React.createElement(
          Card,
          commonProps,
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'flex-start', mb: 2 } },
              React.createElement(
                Avatar,
                {
                  sx: {
                    width: 56,
                    height: 56,
                    mr: 2,
                    background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)'
                  }
                },
                React.createElement(LocalHospital)
              ),
              React.createElement(
                Box,
                { sx: { flexGrow: 1 } },
                React.createElement(
                  Typography,
                  { variant: "h6", sx: { color: '#F44336', fontWeight: 'bold', mb: 1 } },
                  compte.name
                ),
                React.createElement(Rating, { value: compte.rating || 0, readOnly: true, size: "small" }),
                React.createElement(
                  Box,
                  { sx: { mt: 1 } },
                  React.createElement(
                    Chip,
                    {
                      label: `${compte.bedCount} lits`,
                      size: "small",
                      sx: { mr: 1, background: '#FFEBEE', color: '#C62828' }
                    }
                  ),
                  React.createElement(
                    Chip,
                    {
                      label: `Charge ${compte.currentLoad}%`,
                      size: "small",
                      sx: {
                        background: compte.currentLoad > 85 ? '#FFEBEE' : 
                                   compte.currentLoad > 70 ? '#FFF3E0' : '#E8F5E8',
                        color: compte.currentLoad > 85 ? '#C62828' : 
                               compte.currentLoad > 70 ? '#F57C00' : '#2E7D32'
                      }
                    }
                  )
                )
              )
            ),
            React.createElement(
              Box,
              { sx: { mt: 2 } },
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Urgences: "),
                React.createElement(
                  Chip,
                  {
                    label: compte.emergencyWaitTime,
                    size: "small",
                    sx: { 
                      background: compte.emergencyWaitTime.includes('h') ? '#FFEBEE' : '#E8F5E8',
                      color: compte.emergencyWaitTime.includes('h') ? '#C62828' : '#2E7D32'
                    }
                  }
                )
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Distance: "),
                `${compte.distance} km`
              ),
              React.createElement(
                Box,
                { sx: { mt: 1 } },
                React.createElement(
                  Typography,
                  { variant: "body2", color: "text.secondary" },
                  React.createElement("strong", null, "Services: "),
                  ...compte.departments.map((dept, index) => [
                    React.createElement(
                      Chip,
                      {
                        key: dept,
                        label: dept,
                        size: "small",
                        sx: { mr: 0.5, mb: 0.5, background: '#F3E5F5', color: '#7B1FA2' }
                      }
                    )
                  ])
                )
              )
            )
          )
        );

      case 'cnam_admin':
        return React.createElement(
          Card,
          commonProps,
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'flex-start', mb: 2 } },
              React.createElement(
                Avatar,
                {
                  sx: {
                    width: 56,
                    height: 56,
                    mr: 2,
                    background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)'
                  }
                },
                React.createElement(AccountBalance)
              ),
              React.createElement(
                Box,
                { sx: { flexGrow: 1 } },
                React.createElement(
                  Typography,
                  { variant: "h6", sx: { color: '#9C27B0', fontWeight: 'bold', mb: 1 } },
                  compte.name
                ),
                React.createElement(Rating, { value: compte.rating || 0, readOnly: true, size: "small" }),
                React.createElement(
                  Box,
                  { sx: { mt: 1 } },
                  React.createElement(
                    Chip,
                    {
                      label: `Charge ${compte.currentLoad}%`,
                      size: "small",
                      sx: {
                        background: compte.currentLoad > 80 ? '#FFEBEE' : 
                                   compte.currentLoad > 65 ? '#FFF3E0' : '#E8F5E8',
                        color: compte.currentLoad > 80 ? '#C62828' : 
                               compte.currentLoad > 65 ? '#F57C00' : '#2E7D32'
                      }
                    }
                  )
                )
              )
            ),
            React.createElement(
              Box,
              { sx: { mt: 2 } },
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Temps de traitement: "),
                compte.averageProcessingTime
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary", paragraph: true },
                React.createElement("strong", null, "Distance: "),
                `${compte.distance} km`
              ),
              React.createElement(
                Box,
                { sx: { mt: 1 } },
                React.createElement(
                  Typography,
                  { variant: "body2", color: "text.secondary" },
                  React.createElement("strong", null, "Services: "),
                  ...compte.services.map((service, index) => [
                    React.createElement(
                      Chip,
                      {
                        key: service,
                        label: service,
                        size: "small",
                        sx: { mr: 0.5, mb: 0.5, background: '#E3F2FD', color: '#1976D2' }
                      }
                    )
                  ])
                )
              )
            )
          )
        );

      default:
        return null;
    }
  };

  console.log("Filtered comptes:", filteredComptes);
  console.log("Search term:", searchTerm);

  const canManageStock = user;
  const canValidateAccounts = user;

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
        position: 'relative',
        overflow: 'hidden'
      }
    },
    // Animated background
    React.createElement(
      Box,
      {
        sx: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          animation: 'float 20s infinite ease-in-out'
        }
      }
    ),
    // Main Container
    React.createElement(
      Container,
      { maxWidth: "xl", sx: { py: 4, position: 'relative', zIndex: 1 } },
      // Header
      React.createElement(
        Box,
        { sx: { textAlign: 'center', mb: 6 } },
        React.createElement(
          Avatar,
          {
            sx: {
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: 40,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }
          },
          React.createElement(People)
        ),
        React.createElement(
          Typography,
          {
            variant: "h3",
            component: "h1",
            gutterBottom: true,
            sx: {
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }
          },
          "👥 Gestion des Comptes"
        ),
        React.createElement(
          Typography,
          {
            variant: "h6",
            sx: {
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4
            }
          },
          "Gérez les comptes utilisateurs et validez les inscriptions"
        )
      ),
      // Admin Actions
      (canManageStock || canValidateAccounts) && React.createElement(
        Grid,
        { container: true, spacing: 3, sx: { mb: 4 } },
        canManageStock && React.createElement(
          Grid,
          { item: true, xs: 12, md: 6 },
          React.createElement(
            Card,
            {
              sx: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
              },
              onClick: () => navigate('/medicine-reserve')
            },
            React.createElement(
              CardContent,
              { sx: { textAlign: 'center', p: 3 } },
              React.createElement(
                Typography,
                { variant: "h4", sx: { color: '#4CAF50', fontWeight: 'bold', mb: 1 } },
                "📦"
              ),
              React.createElement(
                Typography,
                { variant: "h6", sx: { color: '#4CAF50', fontWeight: 'bold', mb: 1 } },
                "Gérer les Stocks"
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary" },
                "Gérer le stock des médicaments"
              )
            )
          )
        ),
        canValidateAccounts && React.createElement(
          Grid,
          { item: true, xs: 12, md: 6 },
          React.createElement(
            Card,
            {
              sx: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
              },
              onClick: () => navigate('/register')
            },
            React.createElement(
              CardContent,
              { sx: { textAlign: 'center', p: 3 } },
              React.createElement(
                Typography,
                { variant: "h4", sx: { color: '#FF9800', fontWeight: 'bold', mb: 1 } },
                "✅"
              ),
              React.createElement(
                Typography,
                { variant: "h6", sx: { color: '#FF9800', fontWeight: 'bold', mb: 1 } },
                "Valider les Comptes"
              ),
              React.createElement(
                Typography,
                { variant: "body2", color: "text.secondary" },
                "Valider les nouveaux comptes"
              )
            )
          )
        )
      ),
      // Tabs Navigation
      React.createElement(
        Paper,
        {
          sx: {
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }
        },
        React.createElement(
          Tabs,
          {
            value: activeTab,
            onChange: (e, newValue) => setActiveTab(newValue),
            variant: "scrollable",
            scrollButtons: "auto",
            sx: {
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }
            }
          },
          React.createElement(Tab, { 
            icon: React.createElement(Person), 
            label: "Patients",
            iconPosition: "start"
          }),
          React.createElement(Tab, { 
            icon: React.createElement(MedicalServices), 
            label: "Médecins",
            iconPosition: "start"
          }),
          React.createElement(Tab, { 
            icon: React.createElement(LocalPharmacy), 
            label: "Pharmaciens",
            iconPosition: "start"
          }),
          React.createElement(Tab, { 
            icon: React.createElement(LocalHospital), 
            label: "Hôpitaux",
            iconPosition: "start"
          }),
          React.createElement(Tab, { 
            icon: React.createElement(AccountBalance), 
            label: "CNAM",
            iconPosition: "start"
          })
        )
      ),
      // Filters Section
      React.createElement(
        Paper,
        {
          sx: {
            p: 3,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }
        },
        React.createElement(
          Grid,
          { container: true, spacing: 3, alignItems: 'center' },
          // Search
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 4 },
            React.createElement(
              TextField,
              {
                fullWidth: true,
                placeholder: "Rechercher...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                InputProps: {
                  startAdornment: React.createElement(
                    InputAdornment,
                    { position: "start" },
                    React.createElement(Search, { sx: { color: '#00BCD4' } })
                  )
                },
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#00BCD4'
                    }
                  }
                }
              }
            )
          ),
          // Sort
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 2 },
            React.createElement(
              FormControl,
              { fullWidth: true },
              React.createElement(
                InputLabel,
                { id: "sort-label" },
                "Trier par"
              ),
              React.createElement(
                Select,
                {
                  labelId: "sort-label",
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  label: "Trier par",
                  startAdornment: React.createElement(
                    InputAdornment,
                    { position: "start" },
                    React.createElement(Sort, { sx: { color: '#00BCD4', fontSize: 20 } })
                  )
                },
                React.createElement(MenuItem, { value: "name" }, "Nom"),
                React.createElement(MenuItem, { value: "rating" }, "Note"),
                ...(activeTab === 3 || activeTab === 4 ? [
                  React.createElement(MenuItem, { value: "load" }, "Charge"),
                  React.createElement(MenuItem, { value: "distance" }, "Distance")
                ] : [])
              )
            )
          ),
          // Connected Filter
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 2 },
            React.createElement(
              FormControlLabel,
              {
                control: React.createElement(
                  Switch,
                  {
                    checked: filterConnected,
                    onChange: (e) => setFilterConnected(e.target.checked),
                    color: "primary"
                  }
                ),
                label: "Connectés seulement"
              }
            )
          ),
          // Top Rated Filter
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 2 },
            React.createElement(
              FormControlLabel,
              {
                control: React.createElement(
                  Switch,
                  {
                    checked: filterTopRated,
                    onChange: (e) => setFilterTopRated(e.target.checked),
                    color: "secondary"
                  }
                ),
                label: React.createElement(
                  Box,
                  { sx: { display: 'flex', alignItems: 'center', gap: 0.5 } },
                  "Top notés",
                  React.createElement(Star, { sx: { fontSize: 16, color: '#FFB400' } })
                )
              }
            )
          ),
          // Load Filter (for hospitals and CNAM)
          ...(activeTab === 3 || activeTab === 4 ? [
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 2 },
              React.createElement(
                FormControl,
                { fullWidth: true },
                React.createElement(
                  InputLabel,
                  { id: "load-label" },
                  "Charge"
                ),
                React.createElement(
                  Select,
                  {
                    labelId: "load-label",
                    value: filterLoad,
                    onChange: (e) => setFilterLoad(e.target.value),
                    label: "Charge"
                  },
                  React.createElement(MenuItem, { value: "all" }, "Toutes"),
                  React.createElement(MenuItem, { value: "low" }, "Faible (≤70%)"),
                  React.createElement(MenuItem, { value: "medium" }, "Moyenne (71-85%)"),
                  React.createElement(MenuItem, { value: "high" }, "Élevée (>85%)")
                )
              )
            ),
            // Distance Filter (for hospitals and CNAM)
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 2 },
              React.createElement(
                FormControl,
                { fullWidth: true },
                React.createElement(
                  InputLabel,
                  { id: "distance-label" },
                  "Distance"
                ),
                React.createElement(
                  Select,
                  {
                    labelId: "distance-label",
                    value: filterDistance,
                    onChange: (e) => setFilterDistance(e.target.value),
                    label: "Distance",
                    startAdornment: React.createElement(
                      InputAdornment,
                      { position: "start" },
                      React.createElement(LocationOn, { sx: { color: '#00BCD4', fontSize: 20 } })
                    )
                  },
                  React.createElement(MenuItem, { value: "all" }, "Toutes"),
                  React.createElement(MenuItem, { value: "near" }, "Proches (≤3km)"),
                  React.createElement(MenuItem, { value: "medium" }, "Moyenne (3-6km)"),
                  React.createElement(MenuItem, { value: "far" }, "Lointaines (>6km)")
                )
              )
            )
          ] : [])
        )
      ),
      // Loading State
      loading && React.createElement(
        Box,
        { sx: { mb: 4 } },
        React.createElement(LinearProgress, {
          sx: {
            height: 8,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00BCD4, #0097A7)'
            }
          }
        })
      ),
      // Error Alert
      error && React.createElement(
        Box,
        { sx: { mb: 4 } },
        React.createElement(
          Typography,
          {
            sx: {
              p: 2,
              background: 'rgba(244, 67, 54, 0.1)',
              color: '#F44336',
              borderRadius: 2,
              border: '1px solid rgba(244, 67, 54, 0.3)'
            }
          },
          "⚠️ ",
          error
        )
      ),
      // Comptes Grid
      React.createElement(
        Grid,
        { container: true, spacing: 3 },
        ...filteredComptes.map((compte) =>
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 6, lg: 4, key: compte._id },
            renderCompteCard(compte)
          )
        )
      ),
      // Edit Dialog
      React.createElement(
        Dialog,
        {
          open: editDialogOpen,
          onClose: () => setEditDialogOpen(false),
          maxWidth: "md",
          fullWidth: true
        },
        React.createElement(
          DialogTitle,
          { sx: { color: '#00BCD4', fontWeight: 'bold' } },
          "Modifier le Compte"
        ),
        React.createElement(
          DialogContent,
          null,
          selectedCompte && React.createElement(
            Grid,
            { container: true, spacing: 2 },
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Prénom",
                  value: selectedCompte.firstName,
                  onChange: (e) => setSelectedCompte({...selectedCompte, firstName: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Nom",
                  value: selectedCompte.lastName,
                  onChange: (e) => setSelectedCompte({...selectedCompte, lastName: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Email",
                  value: selectedCompte.email,
                  onChange: (e) => setSelectedCompte({...selectedCompte, email: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Téléphone",
                  value: selectedCompte.phone,
                  onChange: (e) => setSelectedCompte({...selectedCompte, phone: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "N° CNAM",
                  value: selectedCompte.insuranceNumber,
                  onChange: (e) => setSelectedCompte({...selectedCompte, insuranceNumber: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Adresse",
                  value: selectedCompte.address,
                  onChange: (e) => setSelectedCompte({...selectedCompte, address: e.target.value}),
                  margin: "normal"
                }
              )
            )
          )
        ),
        React.createElement(
          DialogActions,
          null,
          React.createElement(
            Button,
            {
              onClick: () => setEditDialogOpen(false),
              sx: { color: '#666' }
            },
            "Annuler"
          ),
          React.createElement(
            Button,
            {
              onClick: () => handleSave(selectedCompte),
              variant: "contained",
              sx: {
                background: 'linear-gradient(45deg, #00BCD4 30%, #0097A7 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00ACC1 30%, #00838F 90%)'
                }
              }
            },
            "Sauvegarder"
          )
        )
      ),
      // Delete Confirmation Dialog
      React.createElement(
        Dialog,
        {
          open: deleteDialogOpen,
          onClose: () => setDeleteDialogOpen(false),
          maxWidth: "sm",
          fullWidth: true
        },
        React.createElement(
          DialogTitle,
          { sx: { color: '#F44336', fontWeight: 'bold' } },
          "Confirmer la Suppression"
        ),
        React.createElement(
          DialogContent,
          null,
          React.createElement(
            Typography,
            null,
            `Êtes-vous sûr de vouloir supprimer le compte ${selectedCompte?.firstName} ${selectedCompte?.lastName} ?`
          )
        ),
        React.createElement(
          DialogActions,
          null,
          React.createElement(
            Button,
            {
              onClick: () => setDeleteDialogOpen(false),
              sx: { color: '#666' }
            },
            "Annuler"
          ),
          React.createElement(
            Button,
            {
              onClick: confirmDelete,
              variant: "contained",
              color: "error",
              sx: {
                background: '#F44336',
                color: 'white',
                '&:hover': {
                  background: '#D32F2F'
                }
              }
            },
            "Supprimer"
          )
        )
      ),
      // Add Dialog
      React.createElement(
        Dialog,
        {
          open: addDialogOpen,
          onClose: () => setAddDialogOpen(false),
          maxWidth: "md",
          fullWidth: true
        },
        React.createElement(
          DialogTitle,
          { sx: { color: '#4CAF50', fontWeight: 'bold' } },
          "Ajouter un Nouveau Compte"
        ),
        React.createElement(
          DialogContent,
          null,
          React.createElement(
            Grid,
            { container: true, spacing: 2 },
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Prénom",
                  value: newCompte.firstName,
                  onChange: (e) => setNewCompte({...newCompte, firstName: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Nom",
                  value: newCompte.lastName,
                  onChange: (e) => setNewCompte({...newCompte, lastName: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Email",
                  type: "email",
                  value: newCompte.email,
                  onChange: (e) => setNewCompte({...newCompte, email: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  label: "Téléphone",
                  value: newCompte.phone,
                  onChange: (e) => setNewCompte({...newCompte, phone: e.target.value}),
                  margin: "normal"
                }
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                FormControl,
                { fullWidth: true, margin: "normal" },
                React.createElement(
                  InputLabel,
                  { id: "role-label" },
                  "Type de Compte"
                ),
                React.createElement(
                  Select,
                  {
                    labelId: "role-label",
                    value: newCompte.role,
                    onChange: (e) => setNewCompte({...newCompte, role: e.target.value}),
                    label: "Type de Compte"
                  },
                  React.createElement(MenuItem, { value: "patient" }, "Patient"),
                  React.createElement(MenuItem, { value: "doctor" }, "Médecin"),
                  React.createElement(MenuItem, { value: "pharmacist" }, "Pharmacien"),
                  React.createElement(MenuItem, { value: "hospital" }, "Hôpital"),
                  React.createElement(MenuItem, { value: "cnam_admin" }, "CNAM")
                )
              )
            )
          )
        ),
        React.createElement(
          DialogActions,
          null,
          React.createElement(
            Button,
            {
              onClick: () => setAddDialogOpen(false),
              sx: { color: '#666' }
            },
            "Annuler"
          ),
          React.createElement(
            Button,
            {
              onClick: handleAddCompte,
              variant: "contained",
              sx: {
                background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45A049 30%, #1B5E20 90%)'
                }
              }
            },
            "Ajouter"
          )
        )
      ),
      // Floating Action Button
      React.createElement(
        Fab,
        {
          color: "primary",
          "aria-label": "add",
          onClick: () => setAddDialogOpen(true),
          sx: {
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #45A049 30%, #1B5E20 90%)',
              transform: 'scale(1.1)'
            }
          }
        },
        React.createElement(Add)
      )
    )
  );
};

export default GestionDesComptes;
