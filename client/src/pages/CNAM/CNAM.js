import React, { useState, useEffect } from 'react';
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
  Avatar,
  Paper,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AccountBalance,
  Phone,
  Email,
  Help,
  Support,
  LocationOn,
  Business
} from '@mui/icons-material';
import { getCnamAgencies } from '../../services/cnamService';
import jsPDF from 'jspdf';

const CNAM = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agenciesLoaded, setAgenciesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16); // 16 agences par page (4 colonnes x 4 lignes)
  const [uploadedFiles, setUploadedFiles] = useState({}); // État pour stocker les fichiers uploadés
  const [selectedCategory, setSelectedCategory] = useState('Tous'); // Filtre par catégorie
  const [dialogOpen, setDialogOpen] = useState(false); // État pour le dialogue
  const [selectedDocument, setSelectedDocument] = useState(null); // Document sélectionné
  const [queueData, setQueueData] = useState({}); // État pour les données de files d'attente
  const [lastQueueUpdate, setLastQueueUpdate] = useState(new Date()); // Dernière mise à jour des files

  // Charger les agences CNAM depuis la base de données (une seule fois)
  useEffect(() => {
    const loadAgencies = async () => {
      if (agenciesLoaded) return; // Déjà chargé
      
      setLoading(true);
      setError(null);
      try {
        const data = await getCnamAgencies();
        setAgencies(data);
        setAgenciesLoaded(true);
        
        // Initialiser les données de files d'attente simulées
        initializeQueueData(data);
      } catch (err) {
        console.error('Erreur lors du chargement des agences:', err);
        setError('Impossible de charger les agences CNAM');
      } finally {
        setLoading(false);
      }
    };

    loadAgencies();
  }, [agenciesLoaded]);

  // Initialiser les données de files d'attente
  const initializeQueueData = (agenciesList) => {
    const initialQueueData = {};
    agenciesList.forEach(agency => {
      initialQueueData[agency.id || agency.name] = {
        currentQueue: Math.floor(Math.random() * 20) + 1, // 1-20 personnes en attente
        averageWaitTime: Math.floor(Math.random() * 45) + 5, // 5-45 minutes d'attente
        lastUpdate: new Date(),
        peakHours: false,
        serviceStatus: 'normal' // normal, busy, very_busy
      };
    });
    setQueueData(initialQueueData);
  };

  // Simuler les mises à jour des files d'attente en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      updateQueueData();
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, [agencies]);

  // Mettre à jour les données de files d'attente
  const updateQueueData = () => {
    setQueueData(prevData => {
      const updatedData = { ...prevData };
      Object.keys(updatedData).forEach(agencyId => {
        // Simuler les changements de file d'attente
        const change = Math.floor(Math.random() * 5) - 2; // -2 à +2 personnes
        updatedData[agencyId].currentQueue = Math.max(0, Math.min(30, updatedData[agencyId].currentQueue + change));
        updatedData[agencyId].averageWaitTime = Math.max(5, Math.min(60, updatedData[agencyId].currentQueue * 2 + Math.random() * 10));
        updatedData[agencyId].lastUpdate = new Date();
        
        // Déterminer le statut du service
        if (updatedData[agencyId].currentQueue < 5) {
          updatedData[agencyId].serviceStatus = 'normal';
        } else if (updatedData[agencyId].currentQueue < 15) {
          updatedData[agencyId].serviceStatus = 'busy';
        } else {
          updatedData[agencyId].serviceStatus = 'very_busy';
        }
      });
      return updatedData;
    });
    setLastQueueUpdate(new Date());
  };

  // Obtenir la couleur du statut de file d'attente
  const getQueueStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'busy': return 'warning';
      case 'very_busy': return 'error';
      default: return 'default';
    }
  };

  // Obtenir le texte du statut de file d'attente
  const getQueueStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Fluide';
      case 'busy': return 'Chargé';
      case 'very_busy': return 'Très chargé';
      default: return 'Inconnu';
    }
  };

  // Calculer les agences à afficher pour la page actuelle
  const indexOfLastAgency = currentPage * itemsPerPage;
  const indexOfFirstAgency = indexOfLastAgency - itemsPerPage;
  const currentAgencies = agencies.slice(indexOfFirstAgency, indexOfLastAgency);

  // Changer de page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll vers le haut de la liste
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const services = [
    {
      title: 'Prise en charge médicaments',
      description: 'Remboursement des médicaments selon le tableau de la CNAM',
      coverage: '65-100%',
      icon: '💊',
      color: '#4CAF50'
    },
    {
      title: 'Consultations médicales',
      description: 'Prise en charge des consultations généralistes et spécialistes',
      coverage: '70%',
      icon: '👨‍⚕️',
      color: '#2196F3'
    },
    {
      title: 'Hospitalisation',
      description: 'Couverture complète des frais d\'hospitalisation',
      coverage: '80-100%',
      icon: '🏥',
      color: '#FF9800'
    },
    {
      title: 'Analyses biologiques',
      description: 'Remboursement des examens de laboratoire',
      coverage: '60-80%',
      icon: '🔬',
      color: '#9C27B0'
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'Ordonnance médicale',
      description: 'Téléchargez votre ordonnance scannée ou photo',
      status: 'Pending',
      icon: '📋',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Médical'
    },
    {
      id: 2,
      name: 'Factures pharmaceutiques',
      description: 'Téléchargez vos factures de médicaments',
      status: 'Pending',
      icon: '🧾',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Médical'
    },
    {
      id: 3,
      name: 'Certificat médical',
      description: 'Téléchargez votre certificat du médecin',
      status: 'Required',
      icon: '📄',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Médical'
    },
    {
      id: 4,
      name: 'Formulaire AP1',
      description: 'Demande de prise en charge des soins curatifs',
      status: 'Required',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 5,
      name: 'Formulaire AP2',
      description: 'Demande de prise en charge des soins chroniques',
      status: 'Required',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 6,
      name: 'Formulaire AP3',
      description: 'Demande de prise en charge des urgences',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 7,
      name: 'Formulaire AP4',
      description: 'Demande de prise en charge des soins dentaires',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 8,
      name: 'Formulaire AP5',
      description: 'Demande de prise en charge des soins optiques',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 9,
      name: 'Formulaire AP6',
      description: 'Demande de prise en charge des soins de rééducation',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 10,
      name: 'Formulaire AP7',
      description: 'Demande de prise en charge des appareillages médicaux',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 11,
      name: 'Formulaire AP8',
      description: 'Demande de prise en charge des transports sanitaires',
      status: 'Pending',
      icon: '�',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 12,
      name: 'Formulaire AP9',
      description: 'Demande de prise en charge des soins à l\'étranger',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 13,
      name: 'Formulaire AP10',
      description: 'Demande de prise en charge des analyses de laboratoire',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 14,
      name: 'Formulaire AP11',
      description: 'Demande de prise en charge de l\'imagerie médicale',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 15,
      name: 'Formulaire AP12',
      description: 'Demande de prise en charge des hospitalisations',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 16,
      name: 'Formulaire AP13',
      description: 'Demande de prise en charge des actes chirurgicaux',
      status: 'Pending',
      icon: '📝',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Formulaire CNAM'
    },
    {
      id: 17,
      name: 'Bulletin des soins',
      description: 'Suivi des traitements et consultations médicales',
      status: 'Required',
      icon: '📕',
      acceptedFormats: 'PDF, JPG, PNG',
      maxSize: '5MB',
      category: 'Médical'
    }
  ];

  // Fonction pour gérer l'upload de fichier
  const handleFileUpload = (event, documentId) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Le fichier est trop volumineux. Taille maximale: 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non supporté. Formats acceptés: PDF, JPG, PNG');
        return;
      }
      
      // Stocker le fichier
      setUploadedFiles(prev => ({
        ...prev,
        [documentId]: file
      }));
      
      alert(`Fichier "${file.name}" téléchargé avec succès!`);
    }
  };

  // Fonction pour simuler l'envoi à la CNAM
  const sendToCNAM = (documentId) => {
    const file = uploadedFiles[documentId];
    
    if (!file) {
      alert('Veuillez d\'abord télécharger un fichier avant de l\'envoyer à la CNAM.');
      return;
    }
    
    // Simuler l'envoi
    alert(`Document "${file.name}" envoyé à la CNAM avec succès!\nRéférence: CNAM-${Date.now()}\nTaille: ${(file.size / 1024).toFixed(2)} KB`);
    
    // Mettre à jour le statut du document
    console.log('Document envoyé à la CNAM:', { documentId, fileName: file.name, fileSize: file.size });
  };

  // Fonction pour télécharger des documents CNAM officiels
  const downloadTemplate = (document) => {
    // Définir le document sélectionné et ouvrir le dialogue
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  // Fonction pour générer l'URL du document CNAM
  const generateCnamUrl = (document) => {
    // Vérifier si le document est null ou undefined
    if (!document || !document.name) {
      return 'https://www.cnam.nat.tn/doc/upload';
    }
    
    // Extraire le numéro AP du nom du document
    const apMatch = document.name.match(/AP(\d+)/);
    if (apMatch) {
      const apNumber = apMatch[1];
      return `https://www.cnam.nat.tn/doc/upload/AP${apNumber}.pdf`;
    }
    
    // Pour les documents non-AP, utiliser l'URL de base
    return 'https://www.cnam.nat.tn/doc/upload';
  };

  // Fonction pour ouvrir le site CNAM
  const openCnamWebsite = () => {
    if (!selectedDocument) {
      console.error('Aucun document sélectionné');
      setDialogOpen(false);
      return;
    }
    
    const cnamUrl = generateCnamUrl(selectedDocument);
    window.open(cnamUrl, '_blank');
    setDialogOpen(false);
    
    // Message de suivi
    setTimeout(() => {
      alert(`🌐 Document CNAM ouvert!\n\n` +
            `📄 Document: ${selectedDocument.name}\n` +
            `🔗 Lien direct: ${cnamUrl}\n\n` +
            `✅ Le document officiel devrait s'ouvrir directement\n` +
            `📞 Si problème, appelez le 36 46 pour assistance\n\n` +
            `🏢 Alternative: Agences CNAM (formulaires gratuits)`);
    }, 1000);
  };

  // Fonction pour générer le modèle de référence
  const generateReferenceModel = () => {
    if (selectedDocument) {
      generateBasicTemplate(selectedDocument);
    }
    setDialogOpen(false);
  };

  // Fonction pour générer un modèle de base (backup)
  const generateBasicTemplate = (document) => {
    const pdf = new jsPDF();
    
    // Configuration des couleurs
    const purpleColor = [156, 39, 176];
    const blackColor = [0, 0, 0];
    const grayColor = [128, 128, 128];
    
    // En-tête CNAM
    pdf.setFontSize(20);
    pdf.setTextColor(...purpleColor);
    pdf.text('Caisse Nationale d\'Assurance Maladie', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(...blackColor);
    pdf.text(document.name.toUpperCase(), 105, 40, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('MODÈLE DE RÉFÉRENCE', 105, 50, { align: 'center' });
    
    // Contenu de base
    pdf.text('Informations patient:', 20, 70);
    pdf.text('Nom: _________________________', 20, 85);
    pdf.text('Prénom: ______________________', 20, 95);
    pdf.text('N° CNAM: _____________________', 20, 105);
    pdf.text('Date de naissance: ____________', 20, 115);
    
    pdf.text('Remarque:', 20, 135);
    pdf.text('Ce modèle est une référence. Pour le document officiel,', 20, 150);
    pdf.text('veuillez vous rendre dans une agence CNAM ou contacter:', 20, 160);
    pdf.text('Téléphone: 36 46', 20, 170);
    pdf.text('Site web: www.cnam.tn', 20, 180);
    
    // Pied de page
    pdf.setFontSize(8);
    pdf.setTextColor(...grayColor);
    pdf.text('Pour obtenir le formulaire officiel, consultez votre agence CNAM', 105, 285, { align: 'center' });
    pdf.text('Caisse Nationale d\'Assurance Maladie - Tunisie', 105, 290, { align: 'center' });
    
    // Télécharger le modèle de référence
    pdf.save(`reference_${document.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  // Fonction pour valider l'envoi
  const handleValidate = (documentId) => {
    const file = uploadedFiles[documentId];
    
    if (!file) {
      alert('Veuillez d\'abord télécharger un fichier.');
      return;
    }
    
    if (window.confirm(`Confirmer l'envoi de "${file.name}" à la CNAM?`)) {
      sendToCNAM(documentId);
    }
  };

  // Filtrer les documents par catégorie
  const filteredDocuments = selectedCategory === 'Tous' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  // Obtenir les catégories uniques
  const categories = ['Tous', ...new Set(documents.map(doc => doc.category))];

  // Fonction pour obtenir l'icône selon le niveau d'accès
  const getAccessLevelIcon = (level) => {
    switch (level) {
      case 'admin':
        return '👑';
      case 'advanced':
        return '⭐';
      case 'intermediate':
        return '🔶';
      case 'basic':
      default:
        return '🔵';
    }
  };

  // Fonction pour obtenir la couleur selon le niveau d'accès
  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'admin':
        return '#F44336';
      case 'advanced':
        return '#FF9800';
      case 'intermediate':
        return '#2196F3';
      case 'basic':
      default:
        return '#4CAF50';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        animation: 'float 20s infinite ease-in-out'
      }} />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            <AccountBalance />
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
            🏛️ Caisse Nationale d'Assurance Maladie
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4
            }}
          >
            Votre partenaire santé pour une meilleure couverture
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Paper sx={{ mb: 4, background: 'rgba(255, 255, 255, 0.95)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            {['services', 'documents', 'offices', 'contact'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  mx: 1,
                  px: 3,
                  py: 1,
                  background: activeTab === tab ? 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#9C27B0',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                {tab === 'services' && 'Services'}
                {tab === 'documents' && 'Documents'}
                {tab === 'offices' && 'Bureaux'}
                {tab === 'contact' && 'Contact'}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      mx: 'auto', 
                      mb: 2,
                      fontSize: 30,
                      background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)`
                    }}>
                      {service.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color={service.color} gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Chip 
                      label={`${service.coverage} couverture`}
                      color="primary"
                      sx={{ 
                        background: `linear-gradient(45deg, ${service.color} 30%, ${service.color}CC 90%)`,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Box>
            {/* Filtre par catégorie */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                📋 Documents CNAM
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      background: selectedCategory === category ? 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)' : 'transparent',
                      color: selectedCategory === category ? 'white' : '#9C27B0',
                      borderColor: '#9C27B0',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {filteredDocuments.map((doc, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex' }}>
                  <Card 
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      minHeight: 380,
                      maxHeight: 380,
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      border: '1px solid rgba(156, 39, 176, 0.1)',
                      boxSizing: 'border-box',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                        borderColor: 'rgba(156, 39, 176, 0.3)'
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      p: 2,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2,
                          fontSize: 24,
                          background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
                          flexShrink: 0
                        }}>
                          {doc.icon}
                        </Avatar>
                        <Box flexGrow={1} sx={{ minWidth: 0 }}>
                          <Typography variant="h6" fontWeight="bold" color="#9C27B0" sx={{ 
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {doc.category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2, 
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {doc.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={doc.status === 'Pending' ? 'En attente' : doc.status === 'Required' ? 'Obligatoire' : doc.status}
                          color={doc.status === 'Required' ? 'error' : doc.status === 'Pending' ? 'warning' : 'success'}
                          size="small"
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.65rem',
                            height: 24
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                          {doc.acceptedFormats}
                        </Typography>
                      </Box>
                      
                      {/* Zone d'upload de fichier */}
                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<span>📥</span>}
                            onClick={() => downloadTemplate(doc)}
                            sx={{ 
                              borderColor: '#9C27B0', 
                              color: '#9C27B0',
                              fontSize: '0.6rem',
                              flex: 1,
                              minWidth: 0,
                              py: 0.5
                            }}
                          >
                            Télécharger
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            component="label"
                            htmlFor={`file-upload-${doc.id}`}
                            startIcon={<span>📁</span>}
                            sx={{ 
                              borderColor: '#9C27B0', 
                              color: '#9C27B0',
                              fontSize: '0.6rem',
                              flex: 1,
                              minWidth: 0,
                              py: 0.5
                            }}
                          >
                            Choisir
                          </Button>
                        </Box>
                        
                        <input
                          type="file"
                          id={`file-upload-${doc.id}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, doc.id)}
                          style={{ display: 'none' }}
                        />
                        
                        {uploadedFiles[doc.id] && (
                          <Box sx={{ 
                            p: 0.5, 
                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                            borderRadius: 1,
                            mt: 0.5
                          }}>
                            <Typography variant="caption" color="success.main" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              fontSize: '0.6rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              ✅ {uploadedFiles[doc.id].name.length > 15 ? uploadedFiles[doc.id].name.substring(0, 15) + '...' : uploadedFiles[doc.id].name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<span>📤</span>}
                        onClick={() => handleValidate(doc.id)}
                        disabled={!uploadedFiles[doc.id]}
                        sx={{ 
                          background: uploadedFiles[doc.id] ? 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)' : 'grey',
                          '&:hover': {
                            background: uploadedFiles[doc.id] ? 'linear-gradient(45deg, #7B1FA2 30%, #5E35B1 90%)' : 'darkgrey'
                          },
                          width: '100%',
                          fontSize: '0.6rem',
                          py: 0.5,
                          mt: 1
                        }}
                      >
                        Envoyer à la CNAM
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Statistiques */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {filteredDocuments.length} documents trouvés • {Object.keys(uploadedFiles).length} fichiers uploadés
              </Typography>
            </Box>
          </Box>
        )}

        {/* Offices Tab */}
        {activeTab === 'offices' && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#9C27B0' }} />
                <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
                  Chargement des agences CNAM...
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              <>
                {/* Header avec statistiques */}
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    🏢 Agences CNAM de Tunisie
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {agencies.length} agences disponibles • {currentAgencies.length} affichées • Page {currentPage} sur {Math.ceil(agencies.length / itemsPerPage)} (16 par page)
                  </Typography>
                  
                  {/* Statut des files d'attente */}
                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontSize: '0.8rem',
                      mb: 1,
                      fontWeight: 'bold'
                    }}>
                      🕐 Files d'attente en temps réel
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.7rem'
                    }}>
                      🔄 Dernière mise àjour: {lastQueueUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • 
                      📊 Mise à jour automatique toutes les 30 secondes
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                {currentAgencies.map((agency, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={agency.id || index} sx={{ display: 'flex' }}>
                    <Card 
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        minHeight: 380,
                        maxHeight: 380,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        border: '1px solid rgba(156, 39, 176, 0.1)',
                        boxSizing: 'border-box',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                          borderColor: 'rgba(156, 39, 176, 0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ 
                        p: 2,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            width: 48, 
                            height: 48, 
                            mr: 2,
                            fontSize: 24,
                            background: `linear-gradient(135deg, ${getAccessLevelColor(agency.accessLevel)} 0%, ${getAccessLevelColor(agency.accessLevel)} 100%)`,
                            flexShrink: 0
                          }}>
                            {getAccessLevelIcon(agency.accessLevel)}
                          </Avatar>
                          <Box flexGrow={1} sx={{ minWidth: 0 }}>
                            <Typography variant="h6" fontWeight="bold" color="#9C27B0" sx={{ 
                              fontSize: '0.9rem',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {agency.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {agency.department}
                            </Typography>
                          </Box>
                          <Chip 
                            label={agency.accessLevel}
                            color={getAccessLevelColor(agency.accessLevel)}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.6rem',
                              height: 24,
                              flexShrink: 0
                            }}
                          />
                        </Box>
                        
                        {/* Section File d'attente */}
                        <Box sx={{ 
                          mb: 2, 
                          p: 1.5, 
                          bgcolor: 'rgba(156, 39, 176, 0.05)', 
                          borderRadius: 1,
                          border: '1px solid rgba(156, 39, 176, 0.1)'
                        }}>
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: '#9C27B0',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            🕐 File d'attente
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                              {queueData[agency.id || agency.name]?.currentQueue || 0} personnes
                            </Typography>
                            <Chip 
                              label={getQueueStatusText(queueData[agency.id || agency.name]?.serviceStatus)}
                              color={getQueueStatusColor(queueData[agency.id || agency.name]?.serviceStatus)}
                              size="small"
                              sx={{ 
                                fontSize: '0.6rem',
                                height: 20
                              }}
                            />
                          </Box>
                          
                          <Typography variant="caption" sx={{ 
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            display: 'block'
                          }}>
                            ⏱️ {queueData[agency.id || agency.name]?.averageWaitTime || 0} min d'attente
                          </Typography>
                          
                          <Typography variant="caption" sx={{ 
                            fontSize: '0.6rem',
                            color: 'rgba(0,0,0,0.5)',
                            display: 'block',
                            mt: 0.5
                          }}>
                            🔄 Mis à jour: {new Date(queueData[agency.id || agency.name]?.lastUpdate || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 2, 
                          fontSize: '0.8rem',
                          lineHeight: 1.3,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {agency.address}
                        </Typography>
                        
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9C27B0',
                            fontWeight: 'bold'
                          }}>
                            <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                            {agency.department}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9C27B0'
                          }}>
                            <Phone sx={{ mr: 1, fontSize: 16 }} />
                            {agency.phone}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9C27B0'
                          }}>
                            <Email sx={{ mr: 1, fontSize: 16 }} />
                            <Typography 
                              component="span" 
                              sx={{ 
                                fontSize: '0.8rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '150px'
                              }}
                            >
                              {agency.email}
                            </Typography>
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9C27B0'
                          }}>
                            <Business sx={{ mr: 1, fontSize: 16 }} />
                            {agency.services?.join(', ') || 'Services CNAM'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

                {/* Pagination */}
                {agencies.length > itemsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(agencies.length / itemsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        },
                        '& .Mui-selected': {
                          backgroundColor: '#9C27B0 !important',
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Statistiques */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Affichage de {currentAgencies.length} agences sur {agencies.length} agences CNAM disponibles (16 par page)
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom>
                  📞 Contact d'urgence
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Phone sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Numéro unique" secondary="36 46" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Help sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Assistance 24/7" secondary="Disponible jour et nuit" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email sx={{ color: '#9C27B0' }} /></ListItemIcon>
                    <ListItemText primary="Email" secondary="support@cnam.fr" />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#9C27B0" gutterBottom>
                  📧 Formulaire de contact
                </Typography>
                <TextField
                  fullWidth
                  label="Nom complet"
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#9C27B0'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0'
                      }
                    }
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)'
                  }}
                >
                  Envoyer
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Help Floating Button */}
        <Fab
          color="primary"
          aria-label="help"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7B1FA2 30%, #5E35B1 90%)'
            }
          }}
        >
          <Support />
        </Fab>

        {/* Dialog for CNAM document access */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', color: '#9C27B0' }}>
            📋 ACCÈS AU FORMULAIRE CNAM OFFICIEL
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              Document demandé: <strong>{selectedDocument?.name}</strong>
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              🌐 Accès direct au document:
            </Typography>
            
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                📄 <strong>Lien direct:</strong> {generateCnamUrl(selectedDocument)}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                → Accès direct au document officiel CNAM
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                → Téléchargement immédiat du formulaire
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📋 <strong>Comment utiliser:</strong>
              </Typography>
              <Typography variant="caption" sx={{ ml: 2, display: 'block' }}>
                1. Cliquez sur "Ouvrir le document CNAM"
              </Typography>
              <Typography variant="caption" sx={{ ml: 2, display: 'block' }}>
                2. Le PDF {selectedDocument?.name} s'ouvrira directement
              </Typography>
              <Typography variant="caption" sx={{ ml: 2, display: 'block' }}>
                3. Téléchargez et remplissez le formulaire
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📞 <strong>Assistance:</strong> 36 46
              </Typography>
              <Typography variant="caption" sx={{ ml: 2, display: 'block' }}>
                → Support téléphonique CNAM
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(156, 39, 176, 0.1)', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🏢 <strong>Alternative:</strong> Agences CNAM
              </Typography>
              <Typography variant="caption">
                Les formulaires sont disponibles gratuitement dans toutes les agences CNAM
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
            <Button
              onClick={openCnamWebsite}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
                mr: 1
              }}
            >
              📄 Ouvrir le document CNAM
            </Button>
            <Button
              onClick={generateReferenceModel}
              variant="outlined"
              sx={{ borderColor: '#9C27B0', color: '#9C27B0' }}
            >
              � Modèle de référence
            </Button>
            <Button
              onClick={() => setDialogOpen(false)}
              color="secondary"
            >
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CNAM;
