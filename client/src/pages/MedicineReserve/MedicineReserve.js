import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  Person,
  Add,
  People,
  LocalHospital,
  MedicalServices,
  LocationOn,
  Phone,
  Star,
  ShoppingCart,
  Edit,
  Delete,
  Directions,
  LocalPharmacy,
  Favorite,
  ArrowDropDown,
  MonetizationOn,
  CheckCircle,
  Paid
} from '@mui/icons-material';
import { 
  searchMedicinesInPharmacies, 
  getAllPharmacies,
  getPharmacyById 
} from '../../services/pharmacyService';

const MedicineReserve = () => {
  const navigate = useNavigate();

  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    commercialName: '',
    description: '',
    price: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [pharmacyDialogOpen, setPharmacyDialogOpen] = useState(false);
  const [stockRuptureAlerts, setStockRuptureAlerts] = useState([]);
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'price-desc', 'distance-asc', 'distance-desc'
  const [filteredResults, setFilteredResults] = useState([]);
  const [priceMenuAnchor, setPriceMenuAnchor] = useState(null);
  const [distanceMenuAnchor, setDistanceMenuAnchor] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  
  // Décoder le token pour obtenir le rôle et l'ID de l'utilisateur
  const getUserInfo = () => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return {
        role: tokenData.user?.role,
        userId: tokenData.user?.id
      };
    } catch (error) {
      return { role: null, userId: null };
    }
  };
  
  const { role: userRole, userId: currentUserId } = getUserInfo();
  const isAdmin = userRole === 'cnam_admin';

  // Fonction pour trier les résultats
  const sortResults = (resultsToSort, sortType) => {
    const sorted = [...resultsToSort];
    
    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'distance-asc':
        return sorted.sort((a, b) => a.pharmacy.distance - b.pharmacy.distance);
      case 'distance-desc':
        return sorted.sort((a, b) => b.pharmacy.distance - a.pharmacy.distance);
      default:
        // Par défaut, tri par prix croissant
        return sorted.sort((a, b) => a.price - b.price);
    }
  };

  const popularSearches = [
    'Doliprane', 'Ibuprofène', 'Amoxicilline', 'Paracétamol', 'Aspirine',
    'Vitamine C', 'Oméprazole', 'Spironolactone', 'Metformine', 'Lisinopril'
  ];

  const mockResults = [
    {
      id: 1,
      medicine: {
        _id: 'med1',
        name: 'Doliprane 1000mg',
        commercialName: 'Doliprane',
        description: 'Antalgique et antipyrétique'
      },
      pharmacy: {
        _id: 'pharm1',
        name: 'Pharmacie du Centre',
        address: '123 Rue de la Paix, Tunis',
        phone: '+216 71 123 456',
        rating: 4.5,
        distance: 0.8
      },
      availableQty: 15,
      price: 3.200
    },
    {
      id: 2,
      medicine: {
        _id: 'med2',
        name: 'Ibuprofène 400mg',
        commercialName: 'Advil',
        description: 'Anti-inflammatoire non stéroïdien'
      },
      pharmacy: {
        _id: 'pharm2',
        name: 'Pharmacie El Menzah',
        address: '45 Avenue Habib Bourguiba, Tunis',
        phone: '+216 71 789 012',
        rating: 4.7,
        distance: 1.2
      },
      availableQty: 8,
      price: 4.500
    },
    {
      id: 3,
      medicine: {
        _id: 'med3',
        name: 'Amoxicilline 500mg',
        commercialName: 'Amoxicilline',
        description: 'Antibiotique de la famille des pénicillines'
      },
      pharmacy: {
        _id: 'pharm3',
        name: 'Pharmacie La Marsa',
        address: '78 Rue de la Marsa, Tunis',
        phone: '+216 71 345 678',
        rating: 4.3,
        distance: 2.1
      },
      availableQty: 12,
      price: 6.800
    }
  ];

  useEffect(() => {
    if (!token) navigate("/login");
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setSearchHistory(savedHistory);
    setFavorites(savedFavorites);
  }, [navigate, token]);

  // Mettre à jour les résultats filtrés quand les résultats ou le tri changent
  useEffect(() => {
    const sorted = sortResults(results, sortBy);
    setFilteredResults(sorted);
  }, [results, sortBy]);

  const handleSearch = async () => {
    try {
      setError(null);
      setReservation(null);
      setSearchLoading(true);
      setResults([]);

      // Rechercher dans les bases de données des pharmaciens (API réelle)
      const searchResults = await searchMedicinesInPharmacies(medicineName);
      setResults(searchResults);
      
      // Détecter les ruptures de stock et créer des alertes
      const ruptureAlerts = [];
      searchResults.forEach(result => {
        if (result.stock === 'rupture') {
          ruptureAlerts.push({
            id: `rupture-${Date.now()}-${result.id}`,
            medicineName: result.medicine.name,
            pharmacyName: result.pharmacy.name,
            pharmacyId: result.pharmacy._id,
            timestamp: new Date().toLocaleString('fr-TN'),
            message: `🚨 RUPTURE DE STOCK: ${result.medicine.name} chez ${result.pharmacy.name}`
          });
        }
      });
      
      // Afficher les alertes seulement pour l'admin ou la pharmacie concernée
      const shouldShowAlerts = (isAdmin || 
        (userRole === 'pharmacist' && ruptureAlerts.some(alert => alert.pharmacyId === currentUserId))
      ) && ruptureAlerts.length > 0;
      
      if (shouldShowAlerts) {
        setStockRuptureAlerts(ruptureAlerts);
        console.log('🚨 Alertes de rupture:', ruptureAlerts);
        console.log('👤 Utilisateur:', { role: userRole, userId: currentUserId, isAdmin });
      }
      
      // Ajouter à l'historique
      if (medicineName.trim() && !searchHistory.includes(medicineName)) {
        const newHistory = [medicineName, ...searchHistory.slice(0, 4)];
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "La recherche a échoué.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReserve = async (item) => {
    try {
      setReserveLoading(true);
      setError(null);

      // Simuler une réservation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setReservation({
        ...item,
        quantity: quantity,
        reservedAt: new Date().toISOString(),
        reference: `RES${Date.now()}`
      });

      // Ajouter la pharmacie aux favoris
      const pharmacyId = item.pharmacy._id;
      if (!favorites.includes(pharmacyId)) {
        const newFavorites = [...favorites, pharmacyId];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "La réservation a échoué.");
    } finally {
      setReserveLoading(false);
    }
  };

  const handleShowPharmacyDetails = async (pharmacyId) => {
    try {
      const pharmacy = await getPharmacyById(pharmacyId);
      if (pharmacy) {
        setSelectedPharmacy(pharmacy);
        setPharmacyDialogOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la pharmacie:', error);
      setError("Impossible de charger les détails de la pharmacie");
    }
  };

  const toggleFavorite = (pharmacyId) => {
    let newFavorites;
    if (favorites.includes(pharmacyId)) {
      newFavorites = favorites.filter(id => id !== pharmacyId);
    } else {
      newFavorites = [...favorites, pharmacyId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setMedicineForm({ name: '', commercialName: '', description: '', price: '' });
    setIsAddingMedicine(true);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.medicine.name || '',
      commercialName: medicine.medicine.commercialName || '',
      description: medicine.medicine.description || '',
      price: medicine.price ? medicine.price.toString() : ''
    });
    setIsAddingMedicine(true);
  };

  const handleDeleteMedicine = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMedicine = () => {
    // Simuler la suppression du médicament
    setResults(results.filter(med => med.id !== medicineToDelete.id));
    setDeleteDialogOpen(false);
    setMedicineToDelete(null);
  };

  const cancelDeleteMedicine = () => {
    setDeleteDialogOpen(false);
    setMedicineToDelete(null);
  };

  const saveMedicine = (updatedMedicine) => {
    // Simuler la sauvegarde du médicament
    setResults(results.map(med => 
      med.id === updatedMedicine.id ? updatedMedicine : med
    ));
    setEditingMedicine(null);
    setIsAddingMedicine(false);
    setMedicineForm({ name: '', commercialName: '', description: '', price: '' });
  };

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
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
      {
        maxWidth: "xl",
        sx: { py: 4, position: 'relative', zIndex: 1 }
      },
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
          React.createElement(LocalPharmacy)
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
          "💊 Médicaments et Pharmacies"
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
          "Trouvez et réservez vos médicaments en temps réel"
        )
      ),
      // Search Section
      React.createElement(
        Box,
        { sx: { display: 'flex', justifyContent: 'center', mb: 4 } },
        React.createElement(
          Paper,
          {
            sx: {
              p: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              maxWidth: '800px',
              width: '100%'
            }
          },
          React.createElement(
            Grid,
            { container: true, spacing: 2, alignItems: "center" },
            // Search field
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  placeholder: "Rechercher un médicament...",
                  value: medicineName,
                  onChange: (e) => setMedicineName(e.target.value),
                  size: "small",
                  InputProps: {
                    startAdornment: React.createElement(
                      InputAdornment,
                      { position: "start" },
                      React.createElement(Search, { sx: { color: '#4CAF50' } })
                    )
                  },
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#4CAF50'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50'
                      }
                    }
                  }
                }
              )
            ),
            // Quantity field
            React.createElement(
              Grid,
              { item: true, xs: 6, md: 2 },
              React.createElement(
                TextField,
                {
                  fullWidth: true,
                  type: "number",
                  label: "Qté",
                  value: quantity,
                  onChange: (e) => setQuantity(e.target.value),
                  inputProps: { min: 1, max: 10 },
                  size: "small",
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#4CAF50'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50'
                      }
                    }
                  }
                }
              )
            ),
            // Search button
            React.createElement(
              Grid,
              { item: true, xs: 6, md: 4 },
              React.createElement(
                Button,
                {
                  fullWidth: true,
                  variant: "contained",
                  startIcon: React.createElement(Search),
                  onClick: handleSearch,
                  disabled: searchLoading || !medicineName.trim(),
                  size: "small",
                  sx: {
                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                    color: 'white',
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 30%, #689f38 90%)'
                    }
                  }
                },
                searchLoading ? 'Recherche...' : 'Rechercher'
              )
            )
          ),
          // Popular Searches
          React.createElement(
            Box,
            { sx: { mt: 2, textAlign: 'center' } },
            React.createElement(
              Typography,
              { variant: "caption", sx: { color: '#666', mb: 1, display: 'block' } },
              "Populaires: "
            ),
            React.createElement(
              Box,
              { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' } },
              ...popularSearches.slice(0, 6).map((search, index) =>
                React.createElement(
                  Chip,
                  {
                    key: index,
                    label: search,
                    onClick: () => setMedicineName(search),
                    size: "small",
                    sx: {
                      background: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      fontSize: '0.75rem',
                      '&:hover': {
                        background: 'rgba(76, 175, 80, 0.2)'
                      }
                    }
                  }
                )
              )
            )
          )
        )
      ),
      // Loading State
      searchLoading && React.createElement(
        Box,
        { sx: { mb: 4 } },
        React.createElement(LinearProgress, {
          sx: {
            height: 8,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
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
              color: '#d32f2f',
              background: '#ffebee',
              padding: 2,
              borderRadius: 1,
              border: '1px solid #ffcdd2'
            }
          },
          `❌ Erreur: ${error}`
        )
      ),
      // Stock Rupture Alerts
      stockRuptureAlerts.length > 0 && React.createElement(
        Box,
        { sx: { mb: 4 } },
        ...stockRuptureAlerts.map(alert =>
          React.createElement(
            Box,
            {
              key: alert.id,
              sx: {
                background: '#fff3e0',
                border: '2px solid #ff9800',
                borderRadius: 1,
                padding: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            },
            React.createElement(
              Typography,
              {
                sx: {
                  color: '#e65100',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }
              },
              alert.message
            ),
            React.createElement(
              Typography,
              {
                sx: {
                  color: '#666',
                  fontSize: '0.8rem',
                  ml: 'auto'
                }
              },
              alert.timestamp
            )
          )
        )
      ),
      // Sorting Controls
      filteredResults.length > 0 && !reservation && React.createElement(
        Box,
        { sx: { mb: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' } },
        React.createElement(
          Typography,
          { sx: { fontWeight: 'bold', color: 'white', fontSize: '1.1rem' } },
          "Trier par :"
        ),
        
        // Prix Dropdown - Couleur plus vive et claire
        React.createElement(
          Button,
          {
            variant: 'contained',
            size: 'large',
            startIcon: React.createElement(Paid),
            endIcon: React.createElement(ArrowDropDown),
            onClick: (e) => setPriceMenuAnchor(e.currentTarget),
            sx: {
              background: sortBy.includes('price') ? '#1976D2' : '#2196F3',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              boxShadow: sortBy.includes('price') ? '0 4px 12px rgba(25, 118, 210, 0.4)' : '0 2px 8px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                background: '#1565C0',
                boxShadow: '0 6px 16px rgba(21, 101, 192, 0.4)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }
          },
          sortBy.includes('price') ? 
            (sortBy === 'price-asc' ? 'Prix' : 'Prix') : 
            'Prix'
        ),
        React.createElement(
          Menu,
          {
            anchorEl: priceMenuAnchor,
            open: Boolean(priceMenuAnchor),
            onClose: () => setPriceMenuAnchor(null),
            PaperProps: {
              sx: {
                mt: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: 2
              }
            }
          },
          React.createElement(
            MenuItem,
            {
              onClick: () => {
                setSortBy('price-asc');
                setPriceMenuAnchor(null);
              },
              selected: sortBy === 'price-asc',
              sx: {
                py: 2,
                px: 2.5,
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&:hover': { 
                  background: 'rgba(33, 150, 243, 0.08)',
                  transform: 'translateX(4px)'
                },
                '&.Mui-selected': { 
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.08) 100%)',
                  color: '#1976D2',
                  fontWeight: 'bold',
                  borderLeft: '3px solid #1976D2'
                },
                transition: 'all 0.2s ease'
              }
            },
            React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, width: '100%' } }),
            React.createElement(Paid, { sx: { fontSize: 22, color: '#4CAF50' } }),
            React.createElement(Box, { sx: { flex: 1, textAlign: 'left' } }),
            React.createElement(Typography, { variant: 'subtitle2', sx: { fontWeight: 600, mb: 0.5 } }, 'Du moins cher au plus cher'),
            React.createElement(Typography, { variant: 'caption', sx: { color: '#666', fontSize: '0.75rem' } }, 'Afficher les médicaments en ordre de prix croissant')
          ),
          React.createElement(
            MenuItem,
            {
              onClick: () => {
                setSortBy('price-desc');
                setPriceMenuAnchor(null);
              },
              selected: sortBy === 'price-desc',
              sx: {
                py: 2,
                px: 2.5,
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&:hover': { 
                  background: 'rgba(33, 150, 243, 0.08)',
                  transform: 'translateX(4px)'
                },
                '&.Mui-selected': { 
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.08) 100%)',
                  color: '#1976D2',
                  fontWeight: 'bold',
                  borderLeft: '3px solid #1976D2'
                },
                transition: 'all 0.2s ease'
              }
            },
            React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, width: '100%' } }),
            React.createElement(Paid, { sx: { fontSize: 22, color: '#F44336' } }),
            React.createElement(Box, { sx: { flex: 1, textAlign: 'left' } }),
            React.createElement(Typography, { variant: 'subtitle2', sx: { fontWeight: 600, mb: 0.5 } }, 'Du plus cher au moins cher'),
            React.createElement(Typography, { variant: 'caption', sx: { color: '#666', fontSize: '0.75rem' } }, 'Afficher les médicaments en ordre de prix décroissant')
          )
        ),
        
        // Distance Dropdown - Couleur plus vive et claire
        React.createElement(
          Button,
          {
            variant: 'contained',
            size: 'large',
            startIcon: React.createElement(LocationOn),
            endIcon: React.createElement(ArrowDropDown),
            onClick: (e) => setDistanceMenuAnchor(e.currentTarget),
            sx: {
              background: sortBy.includes('distance') ? '#F57C00' : '#FF9800',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              boxShadow: sortBy.includes('distance') ? '0 4px 12px rgba(245, 124, 0, 0.4)' : '0 2px 8px rgba(255, 152, 0, 0.3)',
              '&:hover': {
                background: '#E65100',
                boxShadow: '0 6px 16px rgba(230, 81, 0, 0.4)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }
          },
          sortBy.includes('distance') ? 
            (sortBy === 'distance-asc' ? 'Distance croissante' : 'Distance décroissante') : 
            'Distance'
        ),
        React.createElement(
          Menu,
          {
            anchorEl: distanceMenuAnchor,
            open: Boolean(distanceMenuAnchor),
            onClose: () => setDistanceMenuAnchor(null),
            PaperProps: {
              sx: {
                mt: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: 2
              }
            }
          },
          React.createElement(
            MenuItem,
            {
              onClick: () => {
                setSortBy('distance-asc');
                setDistanceMenuAnchor(null);
              },
              selected: sortBy === 'distance-asc',
              sx: {
                py: 2,
                px: 2.5,
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&:hover': { 
                  background: 'rgba(255, 152, 0, 0.08)',
                  transform: 'translateX(4px)'
                },
                '&.Mui-selected': { 
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.08) 100%)',
                  color: '#F57C00',
                  fontWeight: 'bold',
                  borderLeft: '3px solid #F57C00'
                },
                transition: 'all 0.2s ease'
              }
            },
            React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, width: '100%' } }),
            React.createElement(LocationOn, { sx: { fontSize: 22, color: '#4CAF50' } }),
            React.createElement(Box, { sx: { flex: 1, textAlign: 'left' } }),
            React.createElement(Typography, { variant: 'subtitle2', sx: { fontWeight: 600, mb: 0.5 } }, 'Du plus proche au plus loin'),
            React.createElement(Typography, { variant: 'caption', sx: { color: '#666', fontSize: '0.75rem' } }, 'Afficher les pharmacies par distance croissante')
          ),
          React.createElement(
            MenuItem,
            {
              onClick: () => {
                setSortBy('distance-desc');
                setDistanceMenuAnchor(null);
              },
              selected: sortBy === 'distance-desc',
              sx: {
                py: 2,
                px: 2.5,
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&:hover': { 
                  background: 'rgba(255, 152, 0, 0.08)',
                  transform: 'translateX(4px)'
                },
                '&.Mui-selected': { 
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.08) 100%)',
                  color: '#F57C00',
                  fontWeight: 'bold',
                  borderLeft: '3px solid #F57C00'
                },
                transition: 'all 0.2s ease'
              }
            },
            React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, width: '100%' } }),
            React.createElement(LocationOn, { sx: { fontSize: 22, color: '#F44336' } }),
            React.createElement(Box, { sx: { flex: 1, textAlign: 'left' } }),
            React.createElement(Typography, { variant: 'subtitle2', sx: { fontWeight: 600, mb: 0.5 } }, 'Du plus loin au plus proche'),
            React.createElement(Typography, { variant: 'caption', sx: { color: '#666', fontSize: '0.75rem' } }, 'Afficher les pharmacies par distance décroissante')
          )
        ),
        
        React.createElement(
          Typography,
          { 
            sx: { 
              ml: 'auto', 
              fontSize: '1rem', 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold',
              background: 'rgba(255, 255, 255, 0.1)',
              px: 2,
              py: 1,
              borderRadius: 1
            } 
          },
          `${filteredResults.length} résultat${filteredResults.length > 1 ? 's' : ''}`
        )
      ),
      // Results Grid
      filteredResults.length > 0 && !reservation && React.createElement(
        Grid,
        { container: true, spacing: 3 },
        ...filteredResults.map((item) =>
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 6, lg: 4, key: item.id },
            React.createElement(
              Card,
              {
                sx: {
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }
              },
              React.createElement(
                CardContent,
                { sx: { p: 3 } },
                // Pharmacy Header
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
                        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
                      }
                    },
                    React.createElement(LocalPharmacy)
                  ),
                  React.createElement(
                    Box,
                    { sx: { flexGrow: 1 } },
                    React.createElement(
                      Typography,
                      {
                        variant: "h6",
                        sx: { color: '#4CAF50', fontWeight: 'bold' }
                      },
                      item.pharmacy.name
                    ),
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 1 } },
                      React.createElement(Star, { sx: { fontSize: 16, color: '#FFC107' } }),
                      React.createElement(
                        Typography,
                        { variant: "body2", color: "text.secondary" },
                        `${item.pharmacy.rating} • ${item.pharmacy.distance} km`,
                        (sortBy === 'distance-asc' || sortBy === 'distance-desc') && React.createElement(
                          'span',
                          { 
                            sx: { 
                              ml: 1, 
                              color: '#FF9800', 
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            } 
                          },
                          sortBy === 'distance-asc' ? ' ↑' : ' ↓'
                        )
                      )
                    ),
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 1 } },
                      React.createElement(
                        Chip,
                        {
                          label: "Base de données",
                          size: "small",
                          sx: {
                            background: 'rgba(33, 150, 243, 0.1)',
                            color: '#2196F3',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }
                        }
                      ),
                      React.createElement(
                        Chip,
                        {
                          label: `${item.availableQty} en stock`,
                          size: "small",
                          sx: {
                            background: item.stock === 'disponible' ? '#E8F5E8' : '#FFF3E0',
                            color: item.stock === 'disponible' ? '#2E7D32' : '#F57C00',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }
                        }
                      )
                    ),
                    React.createElement(
                      Typography,
                      { variant: "body2", color: "text.secondary", gutterBottom: true },
                      item.pharmacy.address
                    )
                  ),
                  React.createElement(
                    Tooltip,
                    { title: "Ajouter aux favoris" },
                    React.createElement(
                      IconButton,
                      {
                        onClick: () => toggleFavorite(item.pharmacy._id),
                        color: favorites.includes(item.pharmacy._id) ? 'warning' : 'default'
                      },
                      React.createElement(Favorite)
                    )
                  )
                ),
                // Medicine Info
                React.createElement(
                  Box,
                  {
                    sx: {
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
                      p: 2,
                      borderRadius: 2,
                      mb: 2
                    }
                  },
                  React.createElement(
                    Typography,
                    {
                      variant: "subtitle1",
                      sx: { color: '#4CAF50', fontWeight: 'bold', mb: 1 }
                    },
                    "💊 ",
                    item.medicine.commercialName || item.medicine.name
                  ),
                  React.createElement(
                    Typography,
                    { variant: "body2", color: "text.secondary", paragraph: true },
                    item.medicine.description || 'Disponibilité immédiate'
                  ),
                  React.createElement(
                    Box,
                    { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    React.createElement(
                      Typography,
                      { variant: "body2", fontWeight: "bold" },
                      "Stock: ",
                      React.createElement(
                        "span",
                        {
                          style: {
                            color: item.availableQty >= quantity ? '#4caf50' : '#f44336',
                            marginLeft: 4
                          }
                        },
                        `${item.availableQty} unités`
                      )
                    ),
                    React.createElement(
                      Typography,
                      { variant: "body2", color: "text.secondary" },
                      `Prix: ${item.price}DT`,
                      (sortBy === 'price-asc' || sortBy === 'price-desc') && React.createElement(
                        'span',
                        { 
                          sx: { 
                            ml: 1, 
                            color: '#2196F3', 
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          } 
                        },
                        sortBy === 'price-asc' ? ' ↑' : ' ↓'
                      )
                    )
                  )
                ),
                // Actions
                React.createElement(
                  Box,
                  { sx: { display: 'flex', gap: 1 } },
                  React.createElement(
                    Button,
                    {
                      variant: "outlined",
                      size: "small",
                      startIcon: React.createElement(Phone),
                      onClick: () => window.open(`tel:${item.pharmacy.phone}`),
                      sx: {
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)'
                        }
                      }
                    },
                    "Appeler"
                  ),
                  React.createElement(
                    Button,
                    {
                      variant: "outlined",
                      size: "small",
                      startIcon: React.createElement(Directions),
                      onClick: () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.pharmacy.address)}`, '_blank'),
                      sx: {
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)'
                        }
                      }
                    },
                    "Itinéraire"
                  ),
                  // Show Edit and Delete buttons only for admin
                  isAdmin && React.createElement(
                    Button,
                    {
                      variant: "outlined",
                      size: "small",
                      startIcon: React.createElement(Edit),
                      onClick: () => handleEditMedicine(item),
                      sx: {
                        borderColor: '#FF9800',
                        color: '#FF9800',
                        '&:hover': {
                          borderColor: '#F57C00',
                          backgroundColor: 'rgba(255, 152, 0, 0.04)'
                        }
                      }
                    },
                    "Modifier"
                  ),
                  isAdmin && React.createElement(
                    Button,
                    {
                      variant: "outlined",
                      size: "small",
                      startIcon: React.createElement(Delete),
                      onClick: () => handleDeleteMedicine(item),
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
                  ),
                  React.createElement(
                    Button,
                    {
                      variant: "contained",
                      size: "small",
                      startIcon: React.createElement(ShoppingCart),
                      onClick: () => handleReserve(item),
                      disabled: reserveLoading || item.availableQty < quantity,
                      sx: {
                        background: item.availableQty >= quantity
                          ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)'
                          : 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)',
                        color: 'white',
                        '&:hover': {
                          background: item.availableQty >= quantity
                            ? 'linear-gradient(45deg, #45a049 30%, #689f38 90%)'
                            : 'linear-gradient(45deg, #616161 30%, #424242 90%)',
                          transform: 'translateY(-2px)'
                        }
                      }
                    },
                    reserveLoading ? "Réservation..." : "Réserver"
                  )
                )
              )
            )
          )
        )
      ),
      // Reservation Success
      reservation && React.createElement(
        Paper,
        {
          sx: {
            p: 4,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            textAlign: 'center'
          }
        },
        React.createElement(
          Avatar,
          {
            sx: {
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
            }
          },
          React.createElement(CheckCircle)
        ),
        React.createElement(
          Typography,
          { variant: "h5", sx: { color: '#4CAF50', fontWeight: 'bold', mb: 2 } },
          "✅ Réservation confirmée !"
        ),
        React.createElement(
          Typography,
          { variant: "body1", sx: { mb: 1 } },
          React.createElement("strong", null, "Référence: "),
          reservation.reference
        ),
        React.createElement(
          Typography,
          { variant: "body1", sx: { mb: 1 } },
          React.createElement("strong", null, "Médicament: "),
          reservation.medicine.commercialName
        ),
        React.createElement(
          Typography,
          { variant: "body1", sx: { mb: 1 } },
          React.createElement("strong", null, "Quantité: "),
          reservation.quantity
        ),
        React.createElement(
          Typography,
          { variant: "body1", sx: { mb: 1 } },
          React.createElement("strong", null, "Pharmacie: "),
          reservation.pharmacy.name
        ),
        React.createElement(
          Typography,
          { variant: "body1", sx: { mb: 3 } },
          React.createElement("strong", null, "Total: "),
          `${(reservation.price * reservation.quantity).toFixed(2)}DT`
        ),
        React.createElement(
          Button,
          {
            variant: "contained",
            onClick: () => {
              setReservation(null);
              setResults([]);
              setMedicineName('');
            },
            sx: {
              background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049 30%, #689f38 90%)'
              }
            }
          },
          "Nouvelle recherche"
        )
      ),
      // Empty State
      !searchLoading && results.length === 0 && !reservation && medicineName && React.createElement(
        Paper,
        {
          sx: {
            p: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }
        },
        React.createElement(
          Avatar,
          {
            sx: {
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              background: 'rgba(158, 158, 158, 0.1)'
            }
          },
          React.createElement(Search, { sx: { fontSize: 40, color: '#9E9E9E' } })
        ),
        React.createElement(
          Typography,
          { variant: "h6", sx: { color: '#666', mb: 2 } },
          "Aucun résultat trouvé"
        ),
        React.createElement(
          Typography,
          { variant: "body2", sx: { color: '#999', mb: 3 } },
          "Essayez de modifier votre recherche ou vos critères"
        )
      ),
      // Search History
      searchHistory.length > 0 && !reservation && React.createElement(
        Paper,
        {
          sx: {
            p: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }
        },
        React.createElement(
          Typography,
          { variant: "h6", sx: { color: '#4CAF50', fontWeight: 'bold', mb: 2 } },
          "🕐 Recherches récentes"
        ),
        React.createElement(
          Box,
          { sx: { display: 'flex', flexWrap: 'wrap', gap: 1 } },
          ...searchHistory.map((item, index) =>
            React.createElement(
              Chip,
              {
                key: index,
                label: item,
                onClick: () => setMedicineName(item),
                onDelete: () => {
                  const newHistory = searchHistory.filter((_, i) => i !== index);
                  setSearchHistory(newHistory);
                  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                },
                sx: {
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#4CAF50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 0.2)'
                  }
                }
              }
            )
          )
        )
      )
    ),
    // Add/Edit Medicine Dialog - Show only for admin
    isAdmin && React.createElement(
      Dialog,
      {
        open: isAddingMedicine || editingMedicine !== null,
        onClose: () => {
          setIsAddingMedicine(false);
          setEditingMedicine(null);
        },
        maxWidth: "md",
        fullWidth: true,
        PaperProps: {
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }
        }
      },
      React.createElement(
        DialogTitle,
        { sx: { color: '#4CAF50', fontWeight: 'bold' } },
        editingMedicine ? 'Modifier le médicament' : 'Ajouter un médicament'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          Box,
          { sx: { display: 'flex', flexDirection: 'column', gap: 2 } },
          React.createElement(TextField, {
            fullWidth: true,
            label: "Nom du médicament",
            value: medicineForm.name,
            onChange: (e) => setMedicineForm({ ...medicineForm, name: e.target.value }),
            sx: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
              }
            }
          }),
          React.createElement(TextField, {
            fullWidth: true,
            label: "Nom commercial",
            value: medicineForm.commercialName,
            onChange: (e) => setMedicineForm({ ...medicineForm, commercialName: e.target.value }),
            sx: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
              }
            }
          }),
          React.createElement(TextField, {
            fullWidth: true,
            label: "Description",
            multiline: true,
            rows: 3,
            value: medicineForm.description,
            onChange: (e) => setMedicineForm({ ...medicineForm, description: e.target.value }),
            sx: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
              }
            }
          }),
          React.createElement(TextField, {
            fullWidth: true,
            label: "Prix",
            type: "number",
            value: medicineForm.price,
            onChange: (e) => setMedicineForm({ ...medicineForm, price: e.target.value }),
            InputProps: { startAdornment: React.createElement(InputAdornment, { position: "start" }, "DT") },
            sx: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
              }
            }
          })
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          {
            onClick: () => {
              setIsAddingMedicine(false);
              setEditingMedicine(null);
            },
            sx: { color: '#666' }
          },
          "Annuler"
        ),
        React.createElement(
          Button,
          {
            onClick: () => {
              const updatedMedicine = {
                id: editingMedicine ? editingMedicine.id : Date.now(),
                medicine: {
                  _id: editingMedicine ? editingMedicine.medicine._id : `med${Date.now()}`,
                  name: medicineForm.name.trim() || 'Nouveau médicament',
                  commercialName: medicineForm.commercialName.trim() || '',
                  description: medicineForm.description.trim() || ''
                },
                pharmacy: editingMedicine ? editingMedicine.pharmacy : mockResults[0]?.pharmacy,
                availableQty: editingMedicine ? editingMedicine.availableQty : 10,
                price: parseFloat(medicineForm.price) || 0
              };

              if (editingMedicine) {
                saveMedicine(updatedMedicine);
              } else {
                setResults((prev) => [...prev, updatedMedicine]);
                setIsAddingMedicine(false);
                setMedicineForm({ name: '', commercialName: '', description: '', price: '' });
              }
            },
            variant: "contained",
            sx: {
              background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049 30%, #689f38 90%)'
              }
            }
          },
          editingMedicine ? 'Sauvegarder' : 'Ajouter'
        )
      )
    ),
    // Delete Confirmation Dialog - Show only for admin
    isAdmin && React.createElement(
      Dialog,
      {
        open: deleteDialogOpen,
        onClose: cancelDeleteMedicine,
        maxWidth: "sm",
        fullWidth: true,
        PaperProps: {
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }
        }
      },
      React.createElement(
        DialogTitle,
        { sx: { color: '#F44336', fontWeight: 'bold' } },
        "Confirmer la suppression"
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          Typography,
          null,
          `Êtes-vous sûr de vouloir supprimer le médicament "${medicineToDelete?.medicine?.name}" ?`
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          {
            onClick: cancelDeleteMedicine,
            sx: { color: '#666' }
          },
          "Annuler"
        ),
        React.createElement(
          Button,
          {
            onClick: confirmDeleteMedicine,
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
    // Floating Action Button - Show only for admin
    isAdmin && React.createElement(
      Fab,
      {
        color: "primary",
        "aria-label": "add",
        onClick: handleAddMedicine,
        sx: {
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
            transform: 'scale(1.1)'
          }
        }
      },
      React.createElement(Add)
    )
  );
};

export default MedicineReserve;
