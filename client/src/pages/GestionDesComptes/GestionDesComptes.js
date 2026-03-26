import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateUniqueMedicineDatabase } from "../../services/pharmacyService";
import {
  Container,
  Typography,
  Box,
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
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Sort,
  Phone,
  Email,
  CalendarToday,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore,
  Medication,
  Inventory,
  AttachMoney
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
  const [selectedListColor, setSelectedListColor] = useState('#00BCD4');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [expandedPharmacy, setExpandedPharmacy] = useState(null);
  const [pharmacyMedicines, setPharmacyMedicines] = useState({});
  const [pharmacySearchTerms, setPharmacySearchTerms] = useState({});

  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => {
      try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          return null;
        }
      }, []);

  // Fonction pour obtenir les comptes par type
  const getComptesByType = (type) => {
    return comptes.filter(compte => compte.role === type);
  };

  // Fonction pour gérer la base de données des médicaments
  const togglePharmacyDatabase = (pharmacyId) => {
    if (expandedPharmacy === pharmacyId) {
      setExpandedPharmacy(null);
    } else {
      setExpandedPharmacy(pharmacyId);
      // Utiliser les vraies données de notre service
      if (!pharmacyMedicines[pharmacyId]) {
        // Trouver les informations de la pharmacie
        const pharmacy = comptes.find(compte => compte._id === pharmacyId);
        const pharmacyName = pharmacy?.pharmacyName || 'Pharmacie';
        
        console.log(`🔍 Debug - Pharmacy ID: ${pharmacyId}, Name: ${pharmacyName}`);
        
        // Mapper l'ID de la base de données vers notre format
        let mappedId = pharmacyId;
        if (pharmacyName?.includes('Centre')) mappedId = 'pharm1';
        else if (pharmacyName?.includes('Menzah')) mappedId = 'pharm2';
        else if (pharmacyName?.includes('Marsa')) mappedId = 'pharm3';
        else if (pharmacyName?.includes('Sousse')) mappedId = 'pharm4';
        else if (pharmacyName?.includes('Sfax')) mappedId = 'pharm5';
        else if (pharmacyName?.includes('Bizerte')) mappedId = 'pharm6';
        else if (pharmacyName?.includes('Gabès')) mappedId = 'pharm7';
        else if (pharmacyName?.includes('Nabeul')) mappedId = 'pharm8';
        
        console.log(`🔍 Debug - Mapped ID: ${mappedId}`);
        
        // Générer la base de données unique pour cette pharmacie
        const realMedicines = generateUniqueMedicineDatabase(mappedId, pharmacyName);
        
        console.log(`🔍 Debug - Medicines found: ${realMedicines.length}`);
        
        // Convertir au format attendu par l'interface
        const formattedMedicines = realMedicines.map((medicine, index) => ({
          id: index + 1,
          name: medicine.name,
          quantity: medicine.stock,
          publicPrice: medicine.price,
          stock: medicine.status === 'rupture' ? 'rupture' : medicine.status === 'stock_faible' ? 'limité' : 'disponible'
        }));
        
        setPharmacyMedicines(prev => ({
          ...prev,
          [pharmacyId]: formattedMedicines
        }));
      }
      // Initialiser le terme de recherche pour cette pharmacie
      if (!pharmacySearchTerms[pharmacyId]) {
        setPharmacySearchTerms(prev => ({
          ...prev,
          [pharmacyId]: ''
        }));
      }
    }
  };

  // Fonction pour filtrer les médicaments par recherche
  const filterMedicines = (medicines, searchTerm) => {
    if (!searchTerm) return medicines;
    return medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Fonction pour mettre à jour le terme de recherche d'une pharmacie
  const handlePharmacySearch = (pharmacyId, searchTerm) => {
    setPharmacySearchTerms(prev => ({
      ...prev,
      [pharmacyId]: searchTerm
    }));
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

    // Filtre par secteur (patients, medecins, pharmaciens, hopitaux, cnam)
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(compte => compte.role === sectorFilter);
    }

    // Filtre par connexion (désactivé par défaut)
    if (false) { // filterConnected
      filtered = filtered.filter(compte => compte.isConnected === true);
    }

    // Filtre par note (désactivé par défaut)
    if (false) { // filterTopRated
      filtered = filtered.filter(compte => compte.rating && compte.rating >= 4.5);
    }

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

  // Fonction pour afficher le contenu sous forme de liste unique
  const renderTabbedContent = () => {
    const filteredComptes = getFilteredComptes();
    
    return (
      <Paper sx={{ background: 'rgba(255, 255, 255, 0.98)', borderRadius: 2, overflow: 'hidden' }}>
        {/* Tabs principaux pour les types de comptes */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            // Changer la couleur de la liste selon l'onglet sélectionné
            const colors = ['#00BCD4', '#FF9800', '#4CAF50', '#F44336', '#9C27B0'];
            setSelectedListColor(colors[newValue]);
          }}
          variant="fullWidth"
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 'bold',
              textTransform: 'none',
              minHeight: 48,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              filter: 'none',
              '&:not(.Mui-selected)': {
                opacity: 0.8
              },
              '&:hover:not(.Mui-selected)': {
                color: 'rgba(255, 255, 255, 1)',
                opacity: 1
              }
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 1,
              filter: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffffff',
              height: 3
            }
          }}
        >
          <Tab 
            icon={<Person />} 
            label={`Patients (${getComptesByType('patient').length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<MedicalServices />} 
            label={`Médecins (${getComptesByType('doctor').length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<LocalPharmacy />} 
            label={`Pharmaciens (${getComptesByType('pharmacist').length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<LocalHospital />} 
            label={`Hôpitaux (${getComptesByType('hospital').length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<AccountBalance />} 
            label={`CNAM (${getComptesByType('cnam_admin').length})`} 
            iconPosition="start"
          />
        </Tabs>

        {/* Contenu unique - liste dynamique */}
        <Box sx={{ p: 3, minHeight: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {filteredComptes.length} résultat(s) trouvé(s)
            </Typography>
            {(searchTerm || sectorFilter !== 'all') && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setSectorFilter('all');
                }}
                sx={{ textTransform: 'none' }}
              >
                Effacer les filtres
              </Button>
            )}
          </Box>
          {renderDynamicList(filteredComptes)}
        </Box>
      </Paper>
    );
  };

  // Fonction unique pour afficher la liste selon le type sélectionné
  const renderDynamicList = (comptes) => {
    const getTabInfo = () => {
      switch (activeTab) {
        case 0: return { 
          type: 'patient', 
          title: 'Liste des Patients', 
          color: selectedListColor,
          icon: <People />
        };
        case 1: return { 
          type: 'doctor', 
          title: 'Liste des Médecins', 
          color: selectedListColor,
          icon: <MedicalServices />
        };
        case 2: return { 
          type: 'pharmacist', 
          title: 'Liste des Pharmaciens', 
          color: selectedListColor,
          icon: <LocalPharmacy />
        };
        case 3: return { 
          type: 'hospital', 
          title: 'Liste des Hôpitaux', 
          color: selectedListColor,
          icon: <LocalHospital />
        };
        case 4: return { 
          type: 'cnam_admin', 
          title: 'Liste des Administrateurs CNAM', 
          color: selectedListColor,
          icon: <AccountBalance />
        };
        default: return { 
          type: 'patient', 
          title: 'Liste des Patients', 
          color: selectedListColor,
          icon: <People />
        };
      }
    };

    const tabInfo = getTabInfo();
    const filteredByType = comptes.filter(compte => compte.role === tabInfo.type);

    return (
      <Box>
        <List sx={{ background: 'transparent' }}>
          {filteredByType.map((compte) => (
            <Paper
              key={compte._id}
              sx={{
                mb: 2,
                p: 2,
                background: compte.isConnected === true 
                  ? `linear-gradient(135deg, ${tabInfo.color}20 0%, ${tabInfo.color}15 100%)`
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${compte.isConnected === true ? tabInfo.color : '#E0E0E0'}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  background: `linear-gradient(135deg, ${tabInfo.color}25 0%, ${tabInfo.color}20 100%)`
                }
              }}
              onClick={() => {
                // Changer la couleur au clic sur la liste
                const colors = ['#00BCD4', '#FF9800', '#4CAF50', '#F44336', '#9C27B0', '#E91E63', '#673AB7', '#3F51B5', '#2196F3', '#009688'];
                const currentColorIndex = colors.indexOf(selectedListColor);
                const nextColorIndex = (currentColorIndex + 1) % colors.length;
                setSelectedListColor(colors[nextColorIndex]);
              }}
            >
              <ListItem sx={{ p: 0, alignItems: 'flex-start' }}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: `linear-gradient(135deg, ${tabInfo.color} 0%, ${tabInfo.color}CC 100%)`
                    }}
                  >
                    {tabInfo.type === 'patient' && <Person />}
                    {tabInfo.type === 'doctor' && <MedicalServices />}
                    {tabInfo.type === 'pharmacist' && <LocalPharmacy />}
                    {tabInfo.type === 'hospital' && <LocalHospital />}
                    {tabInfo.type === 'cnam_admin' && <AccountBalance />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                        {tabInfo.type === 'patient' && `${compte.firstName} ${compte.lastName}`}
                        {tabInfo.type === 'doctor' && `Dr. ${compte.firstName} ${compte.lastName}`}
                        {tabInfo.type === 'pharmacist' && compte.pharmacyName}
                        {tabInfo.type === 'hospital' && compte.name}
                        {tabInfo.type === 'cnam_admin' && compte.name}
                      </Typography>
                      {tabInfo.type === 'patient' && (
                        <Chip
                          label={getStatusText(compte.status)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            background: getStatusColor(compte.status) + '20',
                            color: getStatusColor(compte.status),
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {tabInfo.type === 'doctor' && (
                        <Chip
                          label={compte.isConnected ? "Disponible" : "Non disponible"}
                          color={compte.isConnected ? "success" : "default"}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
                        />
                      )}
                      {compte.isConnected && (
                        <Chip
                          label="En ligne"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            background: `${tabInfo.color}20`,
                            color: tabInfo.color,
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {tabInfo.type === 'patient' && (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Email:</strong> {compte.email} | <strong>Téléphone:</strong> {compte.phone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>N° Assurance:</strong> {compte.insuranceCode || compte.insuranceNumber}
                          </Typography>
                        </>
                      )}
                      {tabInfo.type === 'doctor' && (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Spécialité:</strong> {compte.specialization || compte.specialty}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>🏥 Hôpital:</strong> {compte.hospitalName || compte.hospital}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>📅 Expérience:</strong> {compte.experience || 0} ans • <strong>💰 Consultation:</strong> {compte.consultationFee || 0}DT
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Rating value={compte.rating || 4.5} precision={0.1} size="small" readOnly />
                            <Typography variant="caption">
                              ({compte.reviews || 0} avis)
                            </Typography>
                          </Box>
                        </>
                      )}
                      {tabInfo.type === 'pharmacist' && (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Commandes:</strong> {compte.ordersCount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Livraison:</strong>
                            <Chip
                              label={compte.deliveryTime}
                              size="small"
                              sx={{ ml: 0.5, height: 18, fontSize: '0.6rem', background: '#E8F5E8', color: '#2E7D32' }}
                            />
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Medication />}
                            onClick={() => togglePharmacyDatabase(compte._id)}
                            sx={{
                              mt: 1,
                              borderColor: tabInfo.color,
                              color: tabInfo.color,
                              '&:hover': {
                                background: `${tabInfo.color}10`
                              }
                            }}
                          >
                            {expandedPharmacy === compte._id ? 'Masquer' : 'Voir'} la base de données
                          </Button>
                        </>
                      )}
                      <Rating value={compte.rating || 0} readOnly size="small" />
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 'auto' }}>
                  {tabInfo.type === 'doctor' && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: tabInfo.color,
                          background: `${tabInfo.color}20`,
                          '&:hover': { background: `${tabInfo.color}30` }
                        }}
                      >
                        <Phone fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: tabInfo.color,
                          background: `${tabInfo.color}20`,
                          '&:hover': { background: `${tabInfo.color}30` }
                        }}
                      >
                        <Email fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const doctorData = {
                            id: compte._id,
                            name: `Dr. ${compte.firstName} ${compte.lastName}`,
                            specialty: compte.specialization || compte.specialty,
                            hospital: compte.hospitalName || compte.hospital,
                            experience: compte.experience,
                            rating: compte.rating || 4.5,
                            reviews: compte.reviews || 0,
                            phone: compte.phone,
                            email: compte.email,
                            consultationFee: compte.consultationFee || 0,
                            availableDays: compte.availableDays || [],
                            availableTimeSlots: compte.availableTimeSlots || []
                          };
                          localStorage.setItem('selectedDoctor', JSON.stringify(doctorData));
                          navigate('/appointment-booking');
                        }}
                        sx={{
                          color: '#4CAF50',
                          background: 'rgba(76, 175, 80, 0.1)',
                          '&:hover': { background: 'rgba(76, 175, 80, 0.2)' }
                        }}
                      >
                        <CalendarToday fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      onClick={() => handleEdit(compte)}
                      sx={{
                        color: '#00BCD4',
                        background: 'rgba(0, 188, 212, 0.1)',
                        '&:hover': { background: 'rgba(0, 188, 212, 0.2)' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(compte)}
                      sx={{
                        color: '#F44336',
                        background: 'rgba(244, 67, 54, 0.1)',
                        '&:hover': { background: 'rgba(244, 67, 54, 0.2)' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
        
        {/* Base de données des médicaments pour les pharmaciens */}
        {tabInfo.type === 'pharmacist' && expandedPharmacy && (
          <Box sx={{ mt: 2 }}>
            {filteredByType.filter(compte => compte._id === expandedPharmacy).map(compte => (
              <Accordion 
                key={compte._id}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: `1px solid ${tabInfo.color}30`,
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    background: `${tabInfo.color}10`,
                    '&:hover': { background: `${tabInfo.color}20` }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Inventory sx={{ color: tabInfo.color }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                      Base de données de {compte.pharmacyName}
                    </Typography>
                    <Chip 
                      label={`${pharmacyMedicines[compte._id]?.length || 0} médicaments`}
                      size="small"
                      sx={{ 
                        background: `${tabInfo.color}20`, 
                        color: tabInfo.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Rechercher un médicament..."
                      value={pharmacySearchTerms[compte._id] || ''}
                      onChange={(e) => handlePharmacySearch(compte._id, e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: tabInfo.color }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: `${tabInfo.color}40`,
                          },
                          '&:hover fieldset': {
                            borderColor: tabInfo.color,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: tabInfo.color,
                            boxShadow: `0 0 0 2px ${tabInfo.color}30`,
                          },
                        },
                      }}
                    />
                  </Box>
                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: `${tabInfo.color}10` }}>
                          <TableCell sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                            Médicament
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                            Quantité
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                            Prix Public (DT)
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: tabInfo.color }}>
                            Stock
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filterMedicines(pharmacyMedicines[compte._id] || [], pharmacySearchTerms[compte._id] || '').map((medicine) => (
                          <TableRow 
                            key={medicine.id}
                            sx={{ 
                              '&:hover': { background: `${tabInfo.color}5` },
                              borderBottom: `1px solid ${tabInfo.color}20`
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {medicine.name}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={medicine.quantity}
                                size="small"
                                sx={{
                                  background: medicine.quantity > 100 ? '#E8F5E8' : 
                                             medicine.quantity > 50 ? '#FFF3E0' : '#FFEBEE',
                                  color: medicine.quantity > 100 ? '#2E7D32' : 
                                         medicine.quantity > 50 ? '#F57C00' : '#C62828',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                {medicine.publicPrice.toFixed(2)}DT
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={medicine.stock}
                                size="small"
                                sx={{
                                  background: medicine.stock === 'disponible' ? '#E8F5E8' : 
                                             medicine.stock === 'limité' ? '#FFF3E0' : '#FFEBEE',
                                  color: medicine.stock === 'disponible' ? '#2E7D32' : 
                                         medicine.stock === 'limité' ? '#F57C00' : '#C62828',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'pending': 'En attente',
      'suspended': 'Suspendu'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'active': '#4CAF50',
      'inactive': '#9E9E9E',
      'pending': '#FF9800',
      'suspended': '#F44336'
    };
    return colorMap[status] || '#9E9E9E';
  };

  const handleEdit = (compte) => {
    setSelectedCompte(compte);
    setEditDialogOpen(true);
  };

  const handleDelete = (compte) => {
    setSelectedCompte(compte);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (updatedCompte) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`http://localhost:5000/api/comptes/${updatedCompte._id}`, updatedCompte, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Compte mis à jour:", response.data.compte);
      setComptes(Array.isArray(comptes) ? comptes.map(c => c._id === updatedCompte._id ? response.data.compte : c) : []);
      setEditDialogOpen(false);
      setSelectedCompte(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(err?.response?.data?.msg || "Erreur lors de la sauvegarde du compte");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`http://localhost:5000/api/comptes/${selectedCompte._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComptes(Array.isArray(comptes) ? comptes.filter(c => c._id !== selectedCompte._id) : []);
      setDeleteDialogOpen(false);
      setSelectedCompte(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err?.response?.data?.msg || "Erreur lors de la suppression du compte");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/comptes', newCompte, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComptes(Array.isArray(comptes) ? [...comptes, response.data.compte] : []);
      setAddDialogOpen(false);
      setNewCompte({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'patient'
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      setError(err?.response?.data?.msg || "Erreur lors de l'ajout du compte");
    } finally {
      setLoading(false);
    }
  };

  const fetchComptes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/comptes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("✅ Comptes loaded from API:", response.data.comptes);
      setComptes(response.data.comptes || []);
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
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
    
    if (!user) {
      navigate("/");
      return;
    }

    // Vérifier si l'utilisateur est un administrateur
    if (user.role !== 'cnam_admin' && !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchComptes();
  }, [navigate, token, user, fetchComptes]);

  const filteredComptes = getFilteredComptes();

  // Protection contre les erreurs de données
  if (!filteredComptes || !Array.isArray(filteredComptes)) {
    console.log("❌ filteredComptes is not an array:", filteredComptes);
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          Erreur lors du chargement des comptes
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        <People sx={{ mr: 2, verticalAlign: 'middle' }} />
        Gestion des Comptes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#00BCD4' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  '&:hover fieldset': {
                    borderColor: '#00BCD4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BCD4',
                    boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.2)',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#00BCD4', '&.Mui-focused': { color: '#00BCD4' } }}>
                Secteur
              </InputLabel>
              <Select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                label="Secteur"
                sx={{
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00BCD4',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00BCD4',
                    boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.2)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                }}
              >
                <MenuItem value="all">Tous les secteurs</MenuItem>
                <MenuItem value="patient">Patients</MenuItem>
                <MenuItem value="doctor">Médecins</MenuItem>
                <MenuItem value="pharmacist">Pharmaciens</MenuItem>
                <MenuItem value="hospital">Hôpitaux</MenuItem>
                <MenuItem value="cnam_admin">CNAM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)',
                height: 56
              }}
            >
              Ajouter un compte
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabbed Content */}
      {renderTabbedContent()}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#00BCD4', fontWeight: 'bold' }}>
          Modifier le Compte
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={selectedCompte?.firstName || ''}
                onChange={(e) => setSelectedCompte({ ...selectedCompte, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom"
                value={selectedCompte?.lastName || ''}
                onChange={(e) => setSelectedCompte({ ...selectedCompte, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedCompte?.email || ''}
                onChange={(e) => setSelectedCompte({ ...selectedCompte, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={selectedCompte?.phone || ''}
                onChange={(e) => setSelectedCompte({ ...selectedCompte, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#F44336', fontWeight: 'bold' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le compte de {selectedCompte?.firstName} {selectedCompte?.lastName} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#FF9800', fontWeight: 'bold' }}>
          Ajouter un compte
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={newCompte.firstName}
                onChange={(e) => setNewCompte({ ...newCompte, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom"
                value={newCompte.lastName}
                onChange={(e) => setNewCompte({ ...newCompte, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newCompte.email}
                onChange={(e) => setNewCompte({ ...newCompte, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newCompte.phone}
                onChange={(e) => setNewCompte({ ...newCompte, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={newCompte.role}
                  onChange={(e) => setNewCompte({ ...newCompte, role: e.target.value })}
                  label="Rôle"
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Médecin</MenuItem>
                  <MenuItem value="pharmacist">Pharmacien</MenuItem>
                  <MenuItem value="hospital">Hôpital</MenuItem>
                  <MenuItem value="cnam_admin">Admin CNAM</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAdd} variant="contained" disabled={loading}>
            {loading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={fetchComptes}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF5722 30%, #E64A19 90%)'
          }
        }}
      >
        {loading ? <LinearProgress size={24} /> : <Sort />}
      </Fab>
    </Container>
  );
};

export default GestionDesComptes;
