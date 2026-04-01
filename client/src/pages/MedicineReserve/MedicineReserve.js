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
  Paid,
  ContactPhone,
  Map
} from '@mui/icons-material';
import { 
  searchMedicinesInPharmacies, 
  getAllPharmacies,
  getPharmacyById 
} from '../../services/pharmacyService';
import axios from 'axios';

const MedicineReserve = () => {
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reservingItemId, setReservingItemId] = useState(null);
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
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'price', 'name'
  const [filteredResults, setFilteredResults] = useState([]);
  const [priceMenuAnchor, setPriceMenuAnchor] = useState(null);
  const [distanceMenuAnchor, setDistanceMenuAnchor] = useState(null);
  const [pharmacyType, setPharmacyType] = useState('all'); // 'all', 'jour', 'nuit', 'garde'

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

  // Fetch pharmacies by type on component mount and when type changes
  useEffect(() => {
    const fetchPharmaciesByType = async () => {
      try {
        setSearchLoading(true);
        
        if (pharmacyType === 'all') {
          // Fetch all pharmacies with medicines
          const response = await axios.get('http://localhost:5000/api/pharmacy/search-medicines?limit=100');
          if (response.data.medicines && response.data.medicines.length > 0) {
            setResults(response.data.medicines);
          } else {
            setResults([]);
            setError('Aucun médicament trouvé');
          }
        } else {
          // Fetch pharmacies by specific type
          const response = await axios.get(`http://localhost:5000/api/pharmacy/type/${pharmacyType}`);
          if (response.data.pharmacies && response.data.pharmacies.length > 0) {
            // Map pharmacies to results format
            const mappedPharmacies = response.data.pharmacies.map((pharmacy, index) => ({
              id: pharmacy._id,
              medicine: {
                _id: `med_${pharmacy._id}`,
                name: pharmacy.name,
                commercialName: pharmacy.name,
                description: pharmacy.description || 'Pharmacie privée'
              },
              pharmacy: {
                _id: pharmacy._id,
                name: pharmacy.name,
                address: pharmacy.address || 'Adresse non disponible',
                phone: pharmacy.phone || 'Téléphone non disponible',
                rating: pharmacy.rating || 4.5,
                distance: Math.random() * 5 // Simulated distance
              },
              availableQty: Math.floor(Math.random() * 50) + 10,
              price: Math.floor(Math.random() * 100) + 5
            }));
            setResults(mappedPharmacies);
          } else {
            setResults([]);
            setError('Aucune pharmacie trouvée pour ce type');
          }
        }
        
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des pharmacies:', error);
        setError('Impossible de charger les pharmacies');
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchPharmaciesByType();
  }, [pharmacyType]);

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

      // Rechercher les médicaments dans les pharmacies privées
      const response = await axios.get(`http://localhost:5000/api/pharmacy/search-medicines?search=${medicineName}&limit=100`);
      
      if (response.data.medicines && response.data.medicines.length > 0) {
        setResults(response.data.medicines);
        
        // Détecter les ruptures de stock et créer des alertes
        const ruptureAlerts = [];
        response.data.medicines.forEach(result => {
          if (result.availableStock <= 0) {
            ruptureAlerts.push({
              id: `rupture-${Date.now()}-${result._id}`,
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
      } else {
        setResults([]);
        setError('Aucun médicament trouvé pour cette recherche');
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
      setReservingItemId(item._id); // Activer le chargement pour cet article spécifique
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
      setReservingItemId(null); // Réinitialiser l'état de chargement
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

  const handleContactPharmacy = (pharmacy) => {
    // Ouvrir le téléphone par défaut
    if (pharmacy.phone && pharmacy.phone !== 'Téléphone non disponible') {
      window.open(`tel:${pharmacy.phone}`);
    } else {
      setError('Numéro de téléphone non disponible pour cette pharmacie');
    }
  };

  const handleShowLocation = (pharmacy) => {
    // Ouvrir Google Maps avec les coordonnées de la pharmacie
    if (pharmacy.lat && pharmacy.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`);
    } else {
      // Si pas de coordonnées, rechercher par nom et adresse
      const query = encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          animation: 'float 20s infinite ease-in-out'
        }}
      />
      
      {/* Main Container */}
      <Container
        maxWidth="xl"
        sx={{ py: 4, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <Box
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: 40,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <LocalPharmacy />
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            💊 Médicaments et Pharmacies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4
            }}
          >
            Trouvez et réservez vos médicaments en temps réel
          </Typography>
        </Box>
        
        {/* Search Section */}
        <Box
          sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
        >
          <Paper
            sx={{
              p: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              maxWidth: '1000px',
              width: '100%'
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Rechercher un médicament..."
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </Grid>
              
              {/* Pharmacy Type Filter */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={pharmacyType}
                    onChange={(e) => setPharmacyType(e.target.value)}
                    MenuProps={{
                      onClickAway: () => {
                        // Reset focus state when menu closes
                        document.activeElement?.blur();
                      }
                    }}
                    sx={{
                      backgroundColor: pharmacyType !== 'all' 
                        ? 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)'
                        : 'rgba(255, 255, 255, 0.98)',
                      borderRadius: 2,
                      boxShadow: pharmacyType !== 'all'
                        ? '0 4px 12px rgba(238, 90, 36, 0.25)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4CAF50',
                        boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 1)'
                      },
                      '& .MuiSelect-select': {
                        padding: '8px 32px 8px 12px',
                        fontSize: '1rem',
                        color: pharmacyType !== 'all' ? 'white' : '#333'
                      },
                      '& .MuiSvgIcon-root': {
                        color: pharmacyType !== 'all' ? 'white' : '#555'
                      }
                    }}
                  >
                    <MenuItem value="all">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}>
                          🏥️
                        </Box>
                        <Typography sx={{ fontWeight: 500, color: '#333' }}>
                          Toutes les pharmacies
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="jour">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}>
                          ☀️
                        </Box>
                        <Typography sx={{ fontWeight: 500, color: '#333' }}>
                          Pharmacies de jour
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="nuit">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}>
                          🌙
                        </Box>
                        <Typography sx={{ fontWeight: 500, color: '#333' }}>
                          Pharmacies de nuit
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="garde">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}>
                          🚨
                        </Box>
                        <Typography sx={{ fontWeight: 500, color: '#333' }}>
                          Pharmacies de garde
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Search button */}
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={searchLoading || !medicineName.trim()}
                  size="small"
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                    color: 'white',
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 30%, #689f38 90%)'
                    }
                  }}
                >
                  {searchLoading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </Grid>
            </Grid>
            
            {/* Sort Options - Below search bar, aligned to left */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', mr: 1 }}>
                🔄 Trier par:
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSortBy('distance-asc')}
                sx={{
                  background: sortBy === 'distance-asc' ? '#F57C00' : '#FF9800',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                📍 Plus proche
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSortBy('price-asc')}
                sx={{
                  background: sortBy === 'price-asc' ? '#1976D2' : '#2196F3',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                💰 Moins cher
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Loading State */}
        {searchLoading && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress
              sx={{
                height: 8,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                }
              }}
            />
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Box sx={{ mb: 4 }}>
            <Paper
              sx={{
                color: '#d32f2f',
                background: '#ffebee',
                padding: 2,
                borderRadius: 1,
                border: '1px solid #ffcdd2'
              }}
            >
              <Typography>❌ Erreur: {error}</Typography>
            </Paper>
          </Box>
        )}

        {/* Stock Rupture Alerts */}
        {stockRuptureAlerts.length > 0 && (
          <Box sx={{ mb: 4 }}>
            {stockRuptureAlerts.map(alert => (
              <Box
                key={alert.id}
                sx={{
                  background: '#fff3e0',
                  border: '2px solid #ff9800',
                  borderRadius: 1,
                  padding: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography sx={{ color: '#e65100', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {alert.message}
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.8rem', ml: 'auto' }}>
                  {alert.timestamp}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Results */}
        {filteredResults.length > 0 && !reservation && (
          <Box>
            {/* Sorting Controls */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                📊 {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
              </Typography>
            </Box>

            {/* Results Grid */}
            <Grid container spacing={3}>
              {filteredResults.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      {/* Pharmacy Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 50, height: 50, mr: 2, background: '#4CAF50', color: 'white' }}>
                          <LocalPharmacy />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
                            {item.pharmacy.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.pharmacy.rating} • {item.pharmacy.distance} km
                            {(sortBy === 'distance-asc' || sortBy === 'distance-desc') && (
                              <span sx={{ 
                                color: '#4CAF50', 
                                fontSize: '0.8rem',
                                ml: 1
                              }}>
                                {sortBy === 'distance-asc' ? ' ↑' : ' ↓'}
                              </span>
                            )}
                          </Typography>
                        </Box>
                        <IconButton
                          sx={{ ml: 'auto' }}
                          onClick={() => toggleFavorite(item.pharmacy._id)}
                        >
                          <Favorite sx={{ color: favorites.includes(item.pharmacy._id) ? '#e91e63' : '#ccc' }} />
                        </IconButton>
                      </Box>
                    </CardContent>

                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="h6" sx={{ mb: 1, color: '#1976D2' }}>
                        {item.medicine.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.medicine.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Prix: {item.price.toFixed(2)}DT
                          {(sortBy === 'price-asc' || sortBy === 'price-desc') && (
                            <span sx={{ 
                              color: '#4CAF50', 
                              fontSize: '0.8rem',
                              ml: 1
                            }}>
                              {sortBy === 'price-asc' ? ' ↑' : ' ↓'}
                            </span>
                          )}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: item.availableStock > 0 ? '#2e7d32' : '#d32f2f',
                            fontWeight: item.availableStock > 0 ? 'normal' : 'bold'
                          }}
                        >
                          Stock: {item.availableStock > 0 ? `${item.availableStock} disponible` : 'Rupture'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ContactPhone />}
                          onClick={() => handleContactPharmacy(item.pharmacy)}
                          sx={{
                            background: '#2196F3',
                            color: 'white',
                            '&:hover': { background: '#1976D2' },
                            minWidth: '100px'
                          }}
                        >
                          Contacter
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Map />}
                          onClick={() => handleShowLocation(item.pharmacy)}
                          sx={{
                            background: '#FF9800',
                            color: 'white',
                            '&:hover': { background: '#F57C00' },
                            minWidth: '100px'
                          }}
                        >
                          Localisation
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleReserve(item)}
                          disabled={reservingItemId === item._id || item.availableStock <= 0}
                          sx={{
                            background: item.availableStock > 0 ? '#4CAF50' : '#ccc',
                            color: 'white',
                            '&:hover': { 
                              background: item.availableStock > 0 ? '#45a049' : '#ccc'
                            },
                            minWidth: '100px'
                          }}
                        >
                          {item.availableStock <= 0 ? 'Indisponible' : 
                           reservingItemId === item._id ? 'Réservation...' : 'Réserver'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Reservation Success */}
        {reservation && (
          <Box sx={{ mt: 4 }}>
            <Paper
              sx={{
                p: 4,
                background: '#e8f5e8',
                border: '2px solid #4CAF50',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
                🎉 Réservation Confirmée !
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Médicament:</strong> {reservation.medicine.name}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Pharmacie:</strong> {reservation.pharmacy.name}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Quantité:</strong> {reservation.quantity}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Référence:</strong> {reservation.reference}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Date:</strong> {new Date(reservation.reservedAt).toLocaleString('fr-TN')}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setReservation(null)}
                sx={{ mt: 2, background: '#4CAF50' }}
              >
                Nouvelle Recherche
              </Button>
            </Paper>
          </Box>
        )}

        {/* Empty State */}
        {!searchLoading && results.length === 0 && !reservation && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Aucun résultat trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de rechercher un médicament ou vérifiez l'orthographe
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default MedicineReserve;
