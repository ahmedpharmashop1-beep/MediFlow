import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  LocalPharmacy,
  MedicalInformation,
  Search,
  Medication,
  Warning,
  CheckCircle,
  Add,
  Remove,
  ShoppingCart,
  Person,
  HealthAndSafety,
  Security,
  FreeBreakfast,
  PriorityHigh,
  Refresh,
  Assignment,
  CalendarToday,
  VerifiedUser
} from '@mui/icons-material';

const Pharmacy = ({ hospital, open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAPCIMode, setShowAPCIMode] = useState(false);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientVerification, setPatientVerification] = useState(false);

  // Catégories de médicaments
  const categories = [
    { id: 'all', name: 'Tous', icon: <Medication /> },
    { id: 'antibiotiques', name: 'Antibiotiques', icon: <HealthAndSafety /> },
    { id: 'antalgiques', name: 'Antalgiques', icon: <MedicalInformation /> },
    { id: 'chroniques', name: 'Maladies Chroniques', icon: <PriorityHigh /> },
    { id: 'vaccins', name: 'Vaccins', icon: <Security /> },
    { id: 'divers', name: 'Divers', icon: <LocalPharmacy /> }
  ];

  // Générer des médicaments de démonstration pour la pharmacie
  const generateMockMedications = () => {
    const baseMedications = [
      // Antibiotiques
      { name: 'Amoxicilline 500mg', category: 'antibiotiques', price: 12.5, stock: 45, apci: true, description: 'Antibiotique large spectre' },
      { name: 'Augmentin 1g', category: 'antibiotiques', price: 28.0, stock: 23, apci: true, description: 'Amoxicilline + acide clavulanique' },
      { name: 'Ciprofloxacine 500mg', category: 'antibiotiques', price: 15.8, stock: 0, apci: true, description: 'Fluoroquinolone' },
      { name: 'Azithromycine 250mg', category: 'antibiotiques', price: 22.0, stock: 18, apci: true, description: 'Macrolide' },
      
      // Antalgiques
      { name: 'Paracétamol 500mg', category: 'antalgiques', price: 2.5, stock: 120, apci: true, description: 'Antalgique et antipyrétique' },
      { name: 'Ibuprofène 400mg', category: 'antalgiques', price: 4.2, stock: 67, apci: true, description: 'Anti-inflammatoire' },
      { name: 'Tramadol 50mg', category: 'antalgiques', price: 18.5, stock: 34, apci: true, description: 'Antalgique opioïde faible' },
      { name: 'Morphine 10mg', category: 'antalgiques', price: 45.0, stock: 8, apci: true, description: 'Antalgique opioïde fort' },
      
      // Maladies chroniques
      { name: 'Metformine 850mg', category: 'chroniques', price: 8.5, stock: 56, apci: true, description: 'Antidiabétique oral' },
      { name: 'Insuline Glargine', category: 'chroniques', price: 85.0, stock: 23, apci: true, description: 'Insuline à action prolongée' },
      { name: 'Lisinopril 10mg', category: 'chroniques', price: 12.0, stock: 41, apci: true, description: 'IEC pour hypertension' },
      { name: 'Atorvastatine 20mg', category: 'chroniques', price: 25.5, stock: 38, apci: true, description: 'Hypolipémiant' },
      { name: 'Levothyroxine 100ug', category: 'chroniques', price: 15.0, stock: 0, apci: true, description: 'Hormone thyroïdienne' },
      
      // Vaccins
      { name: 'Vaccin COVID-19', category: 'vaccins', price: 0, stock: 89, apci: true, description: 'Vaccin ARNm' },
      { name: 'Vaccin Grippe', category: 'vaccins', price: 0, stock: 156, apci: true, description: 'Vaccin saisonnier' },
      { name: 'Vaccin Hépatite B', category: 'vaccins', price: 0, stock: 45, apci: true, description: 'Vaccin hépatite B' },
      
      // Divers
      { name: 'Vitamine D', category: 'divers', price: 6.5, stock: 78, apci: false, description: 'Supplément vitaminique' },
      { name: 'Fer 80mg', category: 'divers', price: 9.0, stock: 0, apci: true, description: 'Supplément en fer' },
      { name: 'Oméprazole 20mg', category: 'divers', price: 11.5, stock: 92, apci: true, description: 'IPP pour reflux' },
      { name: 'Salbutamol 100ug', category: 'divers', price: 16.0, stock: 28, apci: true, description: 'Bronchodilatateur' }
    ];

    // Ajouter des IDs et adapter pour l'hôpital
    return baseMedications.map((med, index) => ({
      ...med,
      id: `${hospital.id}_med_${index}`,
      hospitalId: hospital.id,
      lastUpdate: new Date().toISOString(),
      lowStock: med.stock < 10,
      outOfStock: med.stock === 0,
      prescriptionRequired: ['antibiotiques', 'chroniques'].includes(med.category)
    }));
  };

  useEffect(() => {
    if (open && hospital) {
      setLoading(true);
      // Simuler le chargement des médicaments depuis l'API
      setTimeout(() => {
        setMedications(generateMockMedications());
        setLoading(false);
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hospital]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableMedications = filteredMedications.filter(med => !med.outOfStock);
  const outOfStockMedications = filteredMedications.filter(med => med.outOfStock);

  const getStockStatus = (medication) => {
    if (medication.outOfStock) {
      return { color: 'error', icon: <Warning />, text: 'Rupture de stock' };
    } else if (medication.lowStock) {
      return { color: 'warning', icon: <PriorityHigh />, text: 'Stock faible' };
    } else {
      return { color: 'success', icon: <CheckCircle />, text: 'Disponible' };
    }
  };

  const renderMedicationCard = (medication) => {
    const stockStatus = getStockStatus(medication);
    const isInCart = cart.find(item => item.id === medication.id);
    const cartItem = cart.find(item => item.id === medication.id);
    const finalPrice = showAPCIMode && medication.apci ? 0 : medication.price;

    return (
      <Card sx={{ mb: 2, border: medication.outOfStock ? '2px solid #f44336' : '1px solid #e0e0e0' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: stockStatus.color === 'success' ? '#4CAF50' : stockStatus.color === 'warning' ? '#FF9800' : '#F44336', mr: 2 }}>
                  <Medication />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {medication.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {medication.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={categories.find(cat => cat.id === medication.category)?.name || medication.category}
                      size="small"
                      variant="outlined"
                    />
                    {medication.apci && (
                      <Chip 
                        label="APCI"
                        size="small"
                        color="primary"
                        icon={<FreeBreakfast />}
                      />
                    )}
                    {medication.prescriptionRequired && (
                      <Chip 
                        label="Ordonnance requise"
                        size="small"
                        color="warning"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {finalPrice === 0 ? 'GRATUIT' : `${finalPrice.toFixed(2)} TND`}
                </Typography>
                <Chip 
                  label={stockStatus.text}
                  color={stockStatus.color}
                  variant="outlined"
                  size="small"
                  icon={stockStatus.icon}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Stock: {medication.stock} unités
                </Typography>
                
                {!medication.outOfStock && (
                  <Box sx={{ mt: 1 }}>
                    {isInCart ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(medication.id, cartItem.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold" sx={{ minWidth: '30px', textAlign: 'center' }}>
                          {cartItem.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(medication.id, cartItem.quantity + 1)}
                          disabled={cartItem.quantity >= medication.stock}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(medication)}
                        disabled={medication.stock === 0}
                      >
                        Ajouter
                      </Button>
                    )}
                  </Box>
                )}
                
                {medication.outOfStock && (
                  <Button 
                    variant="outlined" 
                    size="small"
                    disabled
                    sx={{ mt: 1 }}
                  >
                    Indisponible
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (!hospital) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalPharmacy sx={{ mr: 2, color: '#4CAF50', fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                🏥 Service Vérification Patients - {hospital.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                ⚠️ Service exclusif : Vérification et distribution traitements chroniques
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ouverture 24h/24 - Retrait mensuel/trimestriel/semestriel des médicaments APCI sur présentation ordonnance hospitalière
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <VerifiedUser sx={{ mr: 1 }} />
          <strong>Service de Vérification et Distribution</strong><br/>
          Cette pharmacie interne sert à vérifier l'éligibilité des patients et distribuer les traitements 
          chroniques prescrits par les médecins de l'hôpital (mensuel/trimestriel/semestriel).
        </Alert>

        {showAPCIMode && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Security sx={{ mr: 1 }} />
            <strong>Mode APCI activé</strong> - Distribution gratuite des médicaments chroniques 
            pour patients assurés présentant leur carte APCI et ordonnance hospitalière valide.
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Vérification Patient" />
            <Tab label="Traitements Disponibles" />
            <Tab label="Historique Distribution" />
          </Tabs>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher un médicament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Chargement...</Typography>
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              // Onglet Vérification Patient
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Person sx={{ mr: 1 }} />
                  <strong>Vérification du Patient</strong><br/>
                  Veuillez scanner ou entrer le numéro de dossier du patient pour vérifier l'éligibilité 
                  aux traitements chroniques et consulter les ordonnances valides.
                </Alert>
                
                <Paper sx={{ p: 3, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Numéro de dossier patient"
                    placeholder="Entrez le numéro de dossier du patient..."
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<VerifiedUser />}
                        sx={{ 
                          background: 'linear-gradient(45deg, #4CAF50, #43A047)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #388e3c, #2e7d32)'
                          }
                        }}
                      >
                        Vérifier Patient
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<History />}
                        onClick={() => setPatientVerification(true)}
                      >
                        Historique Patient
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {patientVerification && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    <strong>Patient Éligible</strong><br/>
                    Nom: BEN ALI Mohamed<br/>
                    Carte APCI: ✅ Valide jusqu'au 31/12/2025<br/>
                    Traitements actifs: 3 (Diabète, Hypertension, Cholestérol)
                  </Alert>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              // Onglet Traitements Disponibles
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Medication sx={{ mr: 1 }} />
                  <strong>Traitements Chroniques Disponibles</strong><br/>
                  Liste des médicaments disponibles pour les traitements chroniques mensuels/trimestriels/semestriels.
                </Alert>
                
                <Grid container spacing={2}>
                  {medications
                    .filter(med => med.category === 'chroniques')
                    .map((medication) => (
                      <Grid item xs={12} md={6} key={medication.id}>
                        <Card sx={{ border: medication.stock > 0 ? '2px solid #4CAF50' : '2px solid #f44336' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ bgcolor: medication.stock > 0 ? '#4CAF50' : '#f44336', mr: 2 }}>
                                <Medication />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                  {medication.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {medication.description}
                                </Typography>
                              </Box>
                              <Chip 
                                label={medication.stock > 0 ? 'Disponible' : 'Rupture'} 
                                color={medication.stock > 0 ? 'success' : 'error'}
                                size="small"
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                Stock: {medication.stock} unités
                              </Typography>
                              {medication.apci && (
                                <Chip 
                                  label="APCI" 
                                  color="primary" 
                                  size="small"
                                  icon={<FreeBreakfast />}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Période: Mensuel | Fréquence: 1x/jour
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              // Onglet Historique Distribution
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <History sx={{ mr: 1 }} />
                  <strong>Historique des Distributions</strong><br/>
                  Historique des retraits de médicaments chroniques par les patients.
                </Alert>
                
                <Paper sx={{ p: 2 }}>
                  <List>
                    <ListItem sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="BEN ALI Mohamed - Diabète Type 2"
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Metformine 850mg - 3 mois distribués le 15/03/2025
                            </Typography>
                            <Typography variant="caption" color="primary">
                              ✅ Retrait effectué - Prochain: 15/06/2025
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    
                    <ListItem sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="SALAH Fatma - Hypertension"
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Lisinopril 10mg - 1 mois distribué le 10/03/2025
                            </Typography>
                            <Typography variant="caption" color="warning">
                              ⏰ Prochain retrait: 10/04/2025
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    
                    <ListItem sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="TOUNSI Karim - Cholestérol"
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Atorvastatine 20mg - 3 mois distribués le 05/03/2025
                            </Typography>
                            <Typography variant="caption" color="success">
                              ✅ Retrait effectué - Prochain: 05/06/2025
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setMedications(generateMockMedications());
              setLoading(false);
            }, 1000);
          }}
        >
          Actualiser
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pharmacy;
