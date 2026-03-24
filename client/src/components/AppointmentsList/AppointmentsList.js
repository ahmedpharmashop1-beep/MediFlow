import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Add,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';
import AppointmentCard from '../AppointmentCard/AppointmentCard';

const AppointmentsList = ({ userRole = 'patient' }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [communicationDialog, setCommunicationDialog] = useState({
    open: false,
    appointmentId: null,
    message: '',
    type: 'email'
  });

  const token = localStorage.getItem('token');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'doctor'
        ? '/api/appointments/doctor-appointments'
        : '/api/appointments/my-appointments';

      const params = activeTab === 0 ? { upcoming: 'true' } : {};

      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setAppointments(response.data.appointments);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  }, [userRole, activeTab, token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError('Erreur lors de la mise à jour du rendez-vous');
    }
  };

  const handleAddCommunication = (appointmentId) => {
    setCommunicationDialog({
      open: true,
      appointmentId,
      message: '',
      type: 'email'
    });
  };

  const handleSendCommunication = async () => {
    try {
      await axios.post(`http://localhost:5000/api/appointments/${communicationDialog.appointmentId}/communication`,
        {
          type: communicationDialog.type,
          message: communicationDialog.message
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommunicationDialog({ open: false, appointmentId: null, message: '', type: 'email' });
      setError('');
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
    }
  };

  const tabs = [
    { label: 'À venir', filter: 'upcoming' },
    { label: 'Tous', filter: 'all' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Mes rendez-vous
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAppointments}
            size="small"
          >
            Actualiser
          </Button>
          {userRole === 'patient' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              size="small"
            >
              Nouveau RDV
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {appointments.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun rendez-vous trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0
              ? 'Vous n\'avez pas de rendez-vous à venir.'
              : 'Vous n\'avez aucun rendez-vous.'}
          </Typography>
        </Box>
      ) : (
        <Box>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onStatusUpdate={handleStatusUpdate}
              onAddCommunication={handleAddCommunication}
              showActions={userRole === 'patient' || userRole === 'doctor'}
            />
          ))}
        </Box>
      )}

      {/* Communication Dialog */}
      <Dialog
        open={communicationDialog.open}
        onClose={() => setCommunicationDialog({ ...communicationDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Envoyer un message</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Type de communication"
            value={communicationDialog.type}
            onChange={(e) => setCommunicationDialog({
              ...communicationDialog,
              type: e.target.value
            })}
            sx={{ mb: 2, mt: 1 }}
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="call">Appel téléphonique</MenuItem>
            <MenuItem value="in_person">En personne</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={communicationDialog.message}
            onChange={(e) => setCommunicationDialog({
              ...communicationDialog,
              message: e.target.value
            })}
            placeholder="Tapez votre message..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommunicationDialog({ ...communicationDialog, open: false })}>
            Annuler
          </Button>
          <Button
            onClick={handleSendCommunication}
            variant="contained"
            disabled={!communicationDialog.message.trim()}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Appointment Dialog - Placeholder for now */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prendre un rendez-vous</DialogTitle>
        <DialogContent>
          <Typography>
            Fonctionnalité de prise de rendez-vous en développement.
            Cette fonctionnalité sera bientôt disponible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsList;