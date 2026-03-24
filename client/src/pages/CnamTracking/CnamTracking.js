import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assignment,
  Add,
  TrackChanges
} from '@mui/icons-material';
import axios from 'axios';

// Receives props from DashboardLayout
const CnamTracking = ({ user }) => {
  const [dossiers, setDossiers] = useState([]);
  const [newDossierDialog, setNewDossierDialog] = useState(false);
  const [newDossierTitle, setNewDossierTitle] = useState('');
  const [newDossierNote, setNewDossierNote] = useState('');

  useEffect(() => {
    loadDossiers();
  }, []);

  const loadDossiers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/api/cnam/dossiers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDossiers(response.data.dossiers || response.data || []);
    } catch (error) {
      console.error('Error loading dossiers:', error);
    }
  };

  const handleCreateDossier = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter pour créer un dossier');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/cnam/dossiers', {
        title: newDossierTitle,
        note: newDossierNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDossiers([...dossiers, response.data.dossier]);
      setNewDossierDialog(false);
      setNewDossierTitle('');
      setNewDossierNote('');
    } catch (error) {
      console.error('Error creating dossier:', error);
      alert('Erreur lors de la création du dossier');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'warning';
      case 'en_examen': return 'info';
      case 'approuve': return 'success';
      case 'rejete': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_examen': return 'En examen';
      case 'approuve': return 'Approuvé';
      case 'rejete': return 'Rejeté';
      default: return status;
    }
  };

  const steps = ['Reçu', 'En examen', 'Décision'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Assignment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Suivi des Dossiers CNAM - {user?.name || ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suivez l'état de vos demandes et remboursements
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        Gérez vos dossiers CNAM et suivez leur progression en temps réel.
      </Alert>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Mes dossiers ({dossiers.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setNewDossierDialog(true)}
        >
          Nouveau dossier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dossiers.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <TrackChanges sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucun dossier trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Créez votre premier dossier CNAM pour commencer le suivi.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          dossiers.map((dossier) => (
            <Grid item xs={12} md={6} key={dossier.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {dossier.title}
                    </Typography>
                    <Chip
                      label={getStatusLabel(dossier.status)}
                      color={getStatusColor(dossier.status)}
                      size="small"
                    />
                  </Box>

                  {dossier.note && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {dossier.note}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Créé le {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Stepper activeStep={steps.indexOf(dossier.status === 'en_examen' ? 'En examen' : 'Reçu')} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog for new dossier */}
      <Dialog open={newDossierDialog} onClose={() => setNewDossierDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouveau dossier CNAM</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Titre du dossier"
            value={newDossierTitle}
            onChange={(e) => setNewDossierTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description (optionnel)"
            multiline
            rows={3}
            value={newDossierNote}
            onChange={(e) => setNewDossierNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDossierDialog(false)}>Annuler</Button>
          <Button
            onClick={handleCreateDossier}
            variant="contained"
            disabled={!newDossierTitle.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CnamTracking;