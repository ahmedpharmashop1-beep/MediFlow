import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
  InputAdornment,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Search,
  LocationOn,
  Medication,
  Phone,
  AccessTime,
  Star,
  FilterList,
  Favorite,
  History,
  TrendingUp,
  CheckCircle,
  LocalPharmacy,
  Directions,
  ShoppingCart,
  Speed,
  Close,
  Refresh
} from '@mui/icons-material';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";

const MedicineReserve = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [coords, setCoords] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    if (!token) navigate("/login");
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setSearchHistory(savedHistory);
    setFavorites(savedFavorites);
  }, [navigate]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée sur cet appareil.");
      return;
    }
    setError(null);
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setError("Impossible d'obtenir votre position. Recherche sans distance.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = async () => {
    try {
      setError(null);
      setReservation(null);
      setSearchLoading(true);
      setResults([]);

      if (!medicineName.trim()) {
        setError("Veuillez entrer un nom de médicament.");
        setSearchLoading(false);
        return;
      }

      const newHistory = [medicineName.trim(), ...searchHistory.filter(h => h !== medicineName.trim())].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      const params = {
        medicineName: medicineName.trim(),
        quantity: Number(quantity),
      };
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }

      const response = await axios.get("http://localhost:5000/api/medicine/search", { params });
      let searchResults = response.data.results || [];
      
      if (sortBy === 'distance') {
        searchResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
      } else if (sortBy === 'stock') {
        searchResults.sort((a, b) => b.availableQty - a.availableQty);
      } else if (sortBy === 'rating') {
        searchResults.sort((a, b) => (b.pharmacy.rating || 0) - (a.pharmacy.rating || 0));
      }
      
      setResults(searchResults);
    } catch (e) {
      setError(e?.response?.data?.msg || "La recherche a échoué.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReserve = async (item) => {
    try {
      setError(null);
      setReserveLoading(true);

      const config = {
        headers: { authorization: token },
      };

      const response = await axios.post(
        "http://localhost:5000/api/medicine/reserve",
        {
          medicineId: item.medicine._id,
          pharmacyId: item.pharmacy._id,
          quantity: Number(quantity),
        },
        config
      );

      setReservation({ ...response.data });

      const pharmacyId = item.pharmacy._id;
      if (!favorites.includes(pharmacyId)) {
        const newFavorites = [...favorites, pharmacyId];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    } catch (e) {
      setError(e?.response?.data?.msg || "La réservation a échoué.");
    } finally {
      setReserveLoading(false);
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

  const popularSearches = ['Doliprane', 'Ibuprofène', 'Amoxicilline', 'Paracétamol', 'Aspirine'];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2-2-.9-2-2zm1 1.46c0 .91-.62 1.66-1.46 1.66-.84 0-1.46-.75-1.46-1.66 0-.91.62-1.66 1.46-1.66.84 0 1.46.75 1.46 1.66zm-1 4.19c0 .84-.69 1.52-1.54 1.52s-1.54-.68-1.54-1.52.69-1.52 1.54-1.52 1.54.68 1.54 1.52zm-2.5 0c0 .84-.69 1.52-1.54 1.52s-1.54-.68-1.54-1.52.69-1.52 1.54-1.52 1.54.68 1.54 1.52z' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
        animation: 'float 20s infinite ease-in-out'
      }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with floating search */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(33, 150, 243, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Medication sx={{ fontSize: 32, color: '#2193b0' }} />
                  <Box flexGrow={1}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#2193b0', fontWeight: 'bold' }}>
                      🏥 Recherche de médicaments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trouvez vos médicaments en temps réel dans les pharmacies à proximité
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Badge badgeContent={favorites.length} color="warning">
                    <Tooltip title="Favoris">
                      <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                        <Favorite />
                      </IconButton>
                    </Tooltip>
                  </Badge>
                  <Badge badgeContent={searchHistory.length} color="info">
                    <Tooltip title="Historique">
                      <IconButton>
                        <History />
                      </IconButton>
                    </Tooltip>
                  </Badge>
                  <Tooltip title="Rafraîchir">
                    <IconButton onClick={() => window.location.reload()}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Main Search Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 4, background: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2193b0', mb: 3 }}>
                🔍 Recherche rapide
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="large"
                    placeholder="Nom du médicament..."
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#2193b0' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2193b0'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#2193b0'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2193b0'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    size="large"
                    type="number"
                    label="Qté"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputProps={{ min: 1, max: 10 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#2193b0'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2193b0'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={requestLocation}
                    disabled={locationLoading}
                    startIcon={<LocationOn />}
                    sx={{
                      height: 56,
                      borderColor: '#2193b0',
                      color: '#2193b0',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)'
                      }
                    }}
                  >
                    {locationLoading ? "..." : "Position"}
                  </Button>
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={handleSearch}
                    disabled={searchLoading || !medicineName.trim()}
                    startIcon={<Speed />}
                    sx={{
                      height: 56,
                      background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976d2 30%, #4fc3f7 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)'
                      }
                    }}
                  >
                    {searchLoading ? "Recherche..." : "Chercher"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Stats Panel */}
            <Paper sx={{ p: 3, borderRadius: 4, background: 'rgba(255, 255, 255, 0.9)', height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2193b0' }}>
                📊 Statistiques
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalPharmacy sx={{ color: '#2193b0', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="bold">Pharmacies</Typography>
                  </Box>
                  <Chip label={results.length} color="primary" size="small" />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite sx={{ color: '#2193b0', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="bold">Favoris</Typography>
                  </Box>
                  <Chip label={favorites.length} color="warning" size="small" />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History sx={{ color: '#2193b0', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="bold">Historique</Typography>
                  </Box>
                  <Chip label={searchHistory.length} color="info" size="small" />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Popular Searches */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
            🔥 Recherches populaires
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {popularSearches.map((search, index) => (
              <Chip
                key={search}
                label={search}
                onClick={() => setMedicineName(search)}
                clickable
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Paper sx={{ 
            p: 2, 
            mt: 3, 
            backgroundColor: 'rgba(244, 67, 54, 0.9)', 
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography color="white" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Close sx={{ fontSize: 20 }} />
                {error}
              </Typography>
              <IconButton size="small" onClick={() => setError('')} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </Paper>
        )}

        {/* Loading State */}
        {searchLoading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <LoadingSpinner message="Recherche des pharmacies disponibles..." size={80} />
          </Box>
        )}

        {/* Results Grid */}
        {!searchLoading && results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
              🏥 {results.length} pharmacie(s) trouvée(s)
            </Typography>
            
            <Grid container spacing={3}>
              {results.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={`${item.medicine._id}_${item.pharmacy._id}`}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: favorites.includes(item.pharmacy._id) ? '2px solid #ffd700' : '1px solid rgba(33, 150, 243, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)',
                        border: favorites.includes(item.pharmacy._id) ? '2px solid #ffd700' : '2px solid #2193b0'
                      }
                    }}
                  >
                    {favorites.includes(item.pharmacy._id) && (
                      <Chip
                        icon={<Favorite />}
                        label="Favori"
                        color="warning"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          right: 10, 
                          zIndex: 1,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#2193b0', fontWeight: 'bold', mb: 1 }}>
                            {item.pharmacy.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              icon={<Star />}
                              label={item.pharmacy.rating || '4.5'}
                              size="small"
                              color="warning"
                            />
                            {item.distanceKm !== null && item.distanceKm !== undefined && (
                              <Chip
                                icon={<LocationOn />}
                                label={`${item.distanceKm.toFixed(1)} km`}
                                size="small"
                                color="info"
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {item.pharmacy.address}
                          </Typography>
                        </Box>
                        
                        <IconButton
                          onClick={() => toggleFavorite(item.pharmacy._id)}
                          color={favorites.includes(item.pharmacy._id) ? 'warning' : 'default'}
                          size="small"
                        >
                          <Favorite />
                        </IconButton>
                      </Box>

                      <Box sx={{ 
                        backgroundColor: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(109, 213, 237, 0.1) 100%)',
                        p: 2, 
                        borderRadius: 2, 
                        mb: 2 
                      }}>
                        <Typography variant="subtitle1" sx={{ color: '#2193b0', fontWeight: 'bold', mb: 1 }}>
                          💊 {item.medicine.commercialName || item.medicine.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.medicine.description || `Disponibilité immédiate`}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">
                            Stock: 
                            <span style={{ 
                              color: item.availableQty >= quantity ? '#4caf50' : '#f44336',
                              marginLeft: 4
                            }}>
                              {item.availableQty} unités
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Demandé: {quantity}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Phone />}
                          onClick={() => window.open(`tel:${item.pharmacy.phone}`)}
                          sx={{
                            borderColor: '#2193b0',
                            color: '#2193b0',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)'
                            }
                          }}
                        >
                          Appeler
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Directions />}
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.pharmacy.address)}`, '_blank')}
                          sx={{
                            borderColor: '#2193b0',
                            color: '#2193b0',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)'
                            }
                          }}
                        >
                          Itinéraire
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleReserve(item)}
                          disabled={reserveLoading || item.availableQty < quantity}
                          sx={{
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
                          }}
                        >
                          {reserveLoading ? "Réservation..." : "Réserver"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Empty State */}
        {!searchLoading && results.length === 0 && medicineName && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Paper sx={{ 
              p: 4, 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: 4,
              textAlign: 'center'
            }}>
              <Medication sx={{ fontSize: 64, color: '#2193b0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#2193b0', mb: 2 }}>
                Aucun résultat trouvé
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Essayez avec un autre nom de médicament ou vérifiez l'orthographe
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setMedicineName("");
                  setError(null);
                }}
                startIcon={<Refresh />}
                sx={{
                  borderColor: '#2193b0',
                  color: '#2193b0'
                }}
              >
                Nouvelle recherche
              </Button>
            </Paper>
          </Box>
        )}

        {/* Reservation Success */}
        {reservation?.reservation && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(139, 195, 74, 0.9) 100%)',
              borderRadius: 4,
              color: 'white',
              textAlign: 'center'
            }}>
              <CheckCircle sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                🎉 Réservation confirmée !
              </Typography>
              <Typography variant="h6" gutterBottom>
                Code de réservation: {reservation.qrPayload || reservation.reservation?.reservationCode}
              </Typography>
              <Typography variant="body2" paragraph>
                Présentez ce code à la pharmacie avant {new Date(reservation.expiresAt).toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setReservation(null)}
                sx={{
                  backgroundColor: 'white',
                  color: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Nouvelle recherche
              </Button>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="search"
        onClick={handleSearch}
        disabled={searchLoading || !medicineName.trim()}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976d2 30%, #4fc3f7 90%)',
            transform: 'scale(1.1)'
          }
        }}
      >
        <Search />
      </Fab>
    </Box>
  );
};

export default MedicineReserve;

