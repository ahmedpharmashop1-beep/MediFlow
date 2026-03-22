import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Slide
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalPharmacy,
  TrendingUp,
  People,
  Assignment,
  EventAvailable
} from '@mui/icons-material';

const PharmacyDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'pharmacist') {
      navigate('/login');
      return;
    }
    fetchPharmacyData();
  }, [navigate]);

  const fetchPharmacyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { authorization: token } };

      // Récupérer les médicaments de la pharmacie
      const medicinesRes = await axios.get('http://localhost:5000/api/pharmacy/medicines', config);
      setMedicines(medicinesRes.data.medicines || []);

      // Récupérer les réservations
      const reservationsRes = await axios.get('http://localhost:5000/api/pharmacy/reservations', config);
      setReservations(reservationsRes.data.reservations || []);
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: ''
    });
    setDialogOpen(true);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      stock: medicine.stock,
      category: medicine.category
    });
    setDialogOpen(true);
  };

  const handleSaveMedicine = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { authorization: token } };

      if (editingMedicine) {
        await axios.put(
          `http://localhost:5000/api/pharmacy/medicines/${editingMedicine._id}`,
          formData,
          config
        );
      } else {
        await axios.post('http://localhost:5000/api/pharmacy/medicines', formData, config);
      }

      setDialogOpen(false);
      fetchPharmacyData();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { authorization: token } };

        await axios.delete(`http://localhost:5000/api/pharmacy/medicines/${medicineId}`, config);
        fetchPharmacyData();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleReservationStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { authorization: token } };

      await axios.put(
        `http://localhost:5000/api/pharmacy/reservations/${reservationId}`,
        { status },
        config
      );

      fetchPharmacyData();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const stats = {
    totalMedicines: medicines.length,
    lowStock: medicines.filter(m => m.stock < 10).length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    todayReservations: reservations.filter(r => {
      const today = new Date().toDateString();
      return new Date(r.createdAt).toDateString() === today;
    }).length
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Chargement...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={600}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Tableau de bord - {user?.pharmacyName || 'Pharmacie'}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Gérez votre stock et vos réservations
          </Typography>
        </Box>
      </Fade>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Slide direction="up" in={true} timeout={700}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Médicaments
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stats.totalMedicines}
                    </Typography>
                  </Box>
                  <LocalPharmacy color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Slide direction="up" in={true} timeout={800}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Stock Faible
                    </Typography>
                    <Typography variant="h4" component="div" color="error">
                      {stats.lowStock}
                    </Typography>
                  </Box>
                  <TrendingUp color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Slide direction="up" in={true} timeout={900}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Réservations en attente
                    </Typography>
                    <Typography variant="h4" component="div" color="warning">
                      {stats.pendingReservations}
                    </Typography>
                  </Box>
                  <Assignment color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Slide direction="up" in={true} timeout={1000}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Réservations du jour
                    </Typography>
                    <Typography variant="h4" component="div" color="success">
                      {stats.todayReservations}
                    </Typography>
                  </Box>
                  <People color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Gestion des médicaments */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Gestion des médicaments
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddMedicine}
            >
              Ajouter un médicament
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine._id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.description}</TableCell>
                    <TableCell>{medicine.price} €</TableCell>
                    <TableCell>
                      <Chip
                        label={medicine.stock}
                        color={medicine.stock < 10 ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditMedicine(medicine)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteMedicine(medicine._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Réservations récentes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Réservations récentes
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Médicament</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.slice(0, 10).map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>{reservation.patient?.name}</TableCell>
                    <TableCell>{reservation.medicine?.name}</TableCell>
                    <TableCell>{reservation.quantity}</TableCell>
                    <TableCell>
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={reservation.status}
                        color={
                          reservation.status === 'confirmed' ? 'success' :
                          reservation.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {reservation.status === 'pending' && (
                        <Box>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleReservationStatus(reservation._id, 'confirmed')}
                          >
                            Confirmer
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleReservationStatus(reservation._id, 'cancelled')}
                            sx={{ ml: 1 }}
                          >
                            Annuler
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogue pour ajouter/modifier un médicament */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMedicine ? 'Modifier le médicament' : 'Ajouter un médicament'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Prix"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveMedicine} variant="contained">
            {editingMedicine ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PharmacyDashboard;
