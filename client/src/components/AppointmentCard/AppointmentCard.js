import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
  MedicalServices,
  Phone,
  CheckCircle,
  Cancel,
  Schedule,
  Message
} from '@mui/icons-material';

const AppointmentCard = ({
  appointment,
  onStatusUpdate,
  onAddCommunication,
  showActions = true
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'confirmed': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'confirmed': return 'Confirmé';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'no_show': return 'Absent';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'info';
      case 'normal': return 'default';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        boxShadow: 2,
        borderColor: 'primary.main'
      }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {appointment.specialty}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body1">
                {formatDate(appointment.appointmentDate)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body1">
                {formatTime(appointment.appointmentTime)} ({appointment.duration} min)
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            <Chip
              label={getStatusLabel(appointment.status)}
              color={getStatusColor(appointment.status)}
              size="small"
            />
            {appointment.priority !== 'normal' && (
              <Chip
                label={appointment.priority.toUpperCase()}
                color={getPriorityColor(appointment.priority)}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              Dr. {appointment.doctorId?.firstname} {appointment.doctorId?.lastname}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              {appointment.hospitalId?.name}
            </Typography>
          </Box>

          {appointment.hospitalId?.phone && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2">
                {appointment.hospitalId.phone}
              </Typography>
            </Box>
          )}
        </Box>

        {appointment.reason && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Motif: {appointment.reason}
            </Typography>
          </Box>
        )}

        {appointment.notes && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Notes: {appointment.notes}
            </Typography>
          </Box>
        )}

        {appointment.followUpRequired && (
          <Box mb={2}>
            <Chip
              icon={<MedicalServices />}
              label="Suivi requis"
              color="warning"
              size="small"
            />
            {appointment.followUpDate && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Prochaine consultation: {formatDate(appointment.followUpDate)}
              </Typography>
            )}
          </Box>
        )}

        {showActions && (
          <Box display="flex" gap={1} justifyContent="flex-end">
            {appointment.status === 'scheduled' && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => onStatusUpdate(appointment._id, 'confirmed')}
                  startIcon={<CheckCircle />}
                >
                  Confirmer
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                  startIcon={<Cancel />}
                >
                  Annuler
                </Button>
              </>
            )}

            {appointment.status === 'confirmed' && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                startIcon={<Cancel />}
              >
                Annuler
              </Button>
            )}

            <Button
              size="small"
              variant="outlined"
              onClick={() => onAddCommunication(appointment._id)}
              startIcon={<Message />}
            >
              Message
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;