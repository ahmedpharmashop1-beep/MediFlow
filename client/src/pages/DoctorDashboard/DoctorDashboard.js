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

  Paper,

  Chip,

  IconButton,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

  List,

  ListItem,

  ListItemText,

  Avatar,

  Divider,

  Fade,

  Slide

} from '@mui/material';

import {

  Add,

  Edit,

  Delete,

  MedicalServices,

  CalendarToday,

  People,

  Assignment,

  EventAvailable,

  EventBusy,

  Person

} from '@mui/icons-material';



const DoctorDashboard = ({ user }) => {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [prescriptions, setPrescriptions] = useState([]);

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');

  const [selectedTime, setSelectedTime] = useState('');

  const [selectedPatient, setSelectedPatient] = useState('');

  const [prescriptionForm, setPrescriptionForm] = useState({

    patientId: '',

    medicines: '',

    instructions: '',

    duration: ''

  });



  const timeSlots = [

    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',

    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',

    '16:00', '16:30', '17:00', '17:30'

  ];



  useEffect(() => {

    const role = localStorage.getItem('role');

    if (role !== 'doctor') {

      navigate('/login');

      return;

    }

    fetchDoctorData();

  }, [navigate]);



  const fetchDoctorData = async () => {

    try {

      const token = localStorage.getItem('token');

      const config = { headers: { authorization: token } };



      // Récupérer les rendez-vous

      const appointmentsRes = await axios.get('http://localhost:5000/api/doctor/appointments', config);

      setAppointments(appointmentsRes.data.appointments || []);



      // Récupérer les ordonnances

      const prescriptionsRes = await axios.get('http://localhost:5000/api/doctor/prescriptions', config);

      setPrescriptions(prescriptionsRes.data.prescriptions || []);



      // Récupérer les patients

      const patientsRes = await axios.get('http://localhost:5000/api/doctor/patients', config);

      setPatients(patientsRes.data.patients || []);

    } catch (error) {

      console.error('Error fetching doctor data:', error);

    } finally {

      setLoading(false);

    }

  };



  const handleAddAppointment = () => {

    setSelectedDate('');

    setSelectedTime('');

    setSelectedPatient('');

    setAppointmentDialogOpen(true);

  };



  const handleSaveAppointment = async () => {

    try {

      const token = localStorage.getItem('token');

      const config = { headers: { authorization: token } };



      await axios.post('http://localhost:5000/api/doctor/appointments', {

        patientId: selectedPatient,

        date: selectedDate,

        time: selectedTime

      }, config);



      setAppointmentDialogOpen(false);

      fetchDoctorData();

    } catch (error) {

      console.error('Error saving appointment:', error);

    }

  };



  const handleAddPrescription = () => {

    setPrescriptionForm({

      patientId: '',

      medicines: '',

      instructions: '',

      duration: ''

    });

    setPrescriptionDialogOpen(true);

  };



  const handleSavePrescription = async () => {

    try {

      const token = localStorage.getItem('token');

      const config = { headers: { authorization: token } };



      await axios.post('http://localhost:5000/api/doctor/prescriptions', prescriptionForm, config);



      setPrescriptionDialogOpen(false);

      fetchDoctorData();

    } catch (error) {

      console.error('Error saving prescription:', error);

    }

  };



  const handleAppointmentStatus = async (appointmentId, status) => {

    try {

      const token = localStorage.getItem('token');

      const config = { headers: { authorization: token } };



      await axios.put(

        `http://localhost:5000/api/doctor/appointments/${appointmentId}`,

        { status },

        config

      );



      fetchDoctorData();

    } catch (error) {

      console.error('Error updating appointment:', error);

    }

  };



  const stats = {

    totalAppointments: appointments.length,

    todayAppointments: appointments.filter(a => {

      const today = new Date().toDateString();

      return new Date(a.date).toDateString() === today;

    }).length,

    totalPrescriptions: prescriptions.length,

    totalPatients: patients.length

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

        <Box sx={{ textAlign: 'center', mb: 4 }}>

          <MedicalServices sx={{ 

            fontSize: 60, 

            color: '#2196F3', 

            mb: 2,

            filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))'

          }} />

          <Typography variant="h4" gutterBottom fontWeight="bold">

            <MedicalServices sx={{ mr: 2, fontSize: 32 }} />

            Tableau de bord - Dr {user?.firstname} {user?.lastname}

          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>

            {user?.speciality} - {user?.hospitalName}

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

                      Total Rendez-vous

                    </Typography>

                    <Typography variant="h4" component="div">

                      {stats.totalAppointments}

                    </Typography>

                  </Box>

                  <CalendarToday color="primary" sx={{ fontSize: 40 }} />

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

                      Rendez-vous du jour

                    </Typography>

                    <Typography variant="h4" component="div" color="success">

                      {stats.todayAppointments}

                    </Typography>

                  </Box>

                  <EventAvailable color="success" sx={{ fontSize: 40 }} />

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

                      Ordonnances

                    </Typography>

                    <Typography variant="h4" component="div" color="info">

                      {stats.totalPrescriptions}

                    </Typography>

                  </Box>

                  <Assignment color="info" sx={{ fontSize: 40 }} />

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

                      Patients

                    </Typography>

                    <Typography variant="h4" component="div" color="warning">

                      {stats.totalPatients}

                    </Typography>

                  </Box>

                  <People color="warning" sx={{ fontSize: 40 }} />

                </Box>

              </CardContent>

            </Card>

          </Slide>

        </Grid>

      </Grid>



      <Grid container spacing={4}>

        {/* Rendez-vous du jour */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

                <Typography variant="h6" fontWeight="bold">

                  Rendez-vous du jour

                </Typography>

                <Button

                  variant="contained"

                  startIcon={<Add />}

                  onClick={handleAddAppointment}

                >

                  Nouveau

                </Button>

              </Box>



              <List>

                {appointments

                  .filter(a => new Date(a.date).toDateString() === new Date().toDateString())

                  .map((appointment) => (

                    <ListItem key={appointment._id} divider>

                      <Avatar sx={{ mr: 2 }}>

                        <Person />

                      </Avatar>

                      <ListItemText

                        primary={`${appointment.patient?.firstname} ${appointment.patient?.lastname}`}

                        secondary={`${appointment.time} - ${appointment.status}`}

                      />

                      <Chip

                        label={appointment.status}

                        color={

                          appointment.status === 'confirmed' ? 'success' :

                          appointment.status === 'pending' ? 'warning' : 'error'

                        }

                        size="small"

                        sx={{ mr: 1 }}

                      />

                      {appointment.status === 'pending' && (

                        <Box>

                          <IconButton

                            size="small"

                            color="success"

                            onClick={() => handleAppointmentStatus(appointment._id, 'confirmed')}

                          >

                            <EventAvailable />

                          </IconButton>

                          <IconButton

                            size="small"

                            color="error"

                            onClick={() => handleAppointmentStatus(appointment._id, 'cancelled')}

                          >

                            <EventBusy />

                          </IconButton>

                        </Box>

                      )}

                    </ListItem>

                  ))}

              </List>

            </CardContent>

          </Card>

        </Grid>



        {/* Ordonnances récentes */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

                <Typography variant="h6" fontWeight="bold">

                  Ordonnances récentes

                </Typography>

                <Button

                  variant="contained"

                  startIcon={<Add />}

                  onClick={handleAddPrescription}

                >

                  Nouvelle

                </Button>

              </Box>



              <List>

                {prescriptions.slice(0, 5).map((prescription) => (

                  <ListItem key={prescription._id} divider>

                    <Avatar sx={{ mr: 2 }}>

                      <MedicalServices />

                    </Avatar>

                    <ListItemText

                      primary={`${prescription.patient?.firstname} ${prescription.patient?.lastname}`}

                      secondary={`${prescription.medicines?.split(',').slice(0, 2).join(', ')}...`}

                    />

                    <Typography variant="caption" color="text.secondary">

                      {new Date(prescription.createdAt).toLocaleDateString()}

                    </Typography>

                  </ListItem>

                ))}

              </List>

            </CardContent>

          </Card>

        </Grid>

      </Grid>



      {/* Dialogue pour ajouter un rendez-vous */}

      <Dialog open={appointmentDialogOpen} onClose={() => setAppointmentDialogOpen(false)} maxWidth="sm" fullWidth>

        <DialogTitle>Nouveau rendez-vous</DialogTitle>

        <DialogContent>

          <Box sx={{ pt: 2 }}>

            <TextField

              fullWidth

              label="Date"

              type="date"

              value={selectedDate}

              onChange={(e) => setSelectedDate(e.target.value)}

              margin="normal"

              InputLabelProps={{ shrink: true }}

            />

            <TextField

              fullWidth

              select

              label="Heure"

              value={selectedTime}

              onChange={(e) => setSelectedTime(e.target.value)}

              margin="normal"

            >

              {timeSlots.map((time) => (

                <option key={time} value={time}>

                  {time}

                </option>

              ))}

            </TextField>

            <TextField

              fullWidth

              select

              label="Patient"

              value={selectedPatient}

              onChange={(e) => setSelectedPatient(e.target.value)}

              margin="normal"

            >

              {patients.map((patient) => (

                <option key={patient._id} value={patient._id}>

                  {patient.firstname} {patient.lastname}

                </option>

              ))}

            </TextField>

          </Box>

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setAppointmentDialogOpen(false)}>Annuler</Button>

          <Button onClick={handleSaveAppointment} variant="contained">

            Enregistrer

          </Button>

        </DialogActions>

      </Dialog>



      {/* Dialogue pour ajouter une ordonnance */}

      <Dialog open={prescriptionDialogOpen} onClose={() => setPrescriptionDialogOpen(false)} maxWidth="sm" fullWidth>

        <DialogTitle>Nouvelle ordonnance</DialogTitle>

        <DialogContent>

          <Box sx={{ pt: 2 }}>

            <TextField

              fullWidth

              select

              label="Patient"

              value={prescriptionForm.patientId}

              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientId: e.target.value })}

              margin="normal"

            >

              {patients.map((patient) => (

                <option key={patient._id} value={patient._id}>

                  {patient.firstname} {patient.lastname}

                </option>

              ))}

            </TextField>

            <TextField

              fullWidth

              label="Médicaments (séparés par des virgules)"

              value={prescriptionForm.medicines}

              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })}

              margin="normal"

              multiline

              rows={3}

            />

            <TextField

              fullWidth

              label="Instructions"

              value={prescriptionForm.instructions}

              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}

              margin="normal"

              multiline

              rows={3}

            />

            <TextField

              fullWidth

              label="Durée du traitement"

              value={prescriptionForm.duration}

              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })}

              margin="normal"

              placeholder="ex: 7 jours, 1 mois..."

            />

          </Box>

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setPrescriptionDialogOpen(false)}>Annuler</Button>

          <Button onClick={handleSavePrescription} variant="contained">

            Prescrire

          </Button>

        </DialogActions>

      </Dialog>

    </Container>

  );

};



export default DoctorDashboard;

