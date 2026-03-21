import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  SearchOff,
  Medication,
  Refresh
} from '@mui/icons-material';

const EmptyState = ({
  type = 'search',
  message,
  onAction,
  actionLabel
}) => {
  const getConfig = () => {
    switch (type) {
      case 'search':
        return {
          icon: <SearchOff sx={{ fontSize: 64, color: 'text.secondary' }} />,
          title: 'Aucun résultat trouvé',
          message: message || 'Essayez de modifier votre recherche ou utilisez votre position pour trouver des pharmacies à proximité.',
          actionLabel: actionLabel || 'Nouvelle recherche',
          actionIcon: <Refresh />
        };
      case 'medicine':
        return {
          icon: <Medication sx={{ fontSize: 64, color: 'text.secondary' }} />,
          title: 'Aucun médicament trouvé',
          message: message || 'Ce médicament n\'est pas disponible dans les pharmacies à proximité.',
          actionLabel: actionLabel || 'Chercher un autre médicament',
          actionIcon: <SearchOff />
        };
      default:
        return {
          icon: <SearchOff sx={{ fontSize: 64, color: 'text.secondary' }} />,
          title: 'Aucune donnée',
          message: message || 'Commencez une recherche pour voir les résultats.',
          actionLabel: actionLabel || 'Commencer',
          actionIcon: <Refresh />
        };
    }
  };

  const config = getConfig();

  return (
    <Paper 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        backgroundColor: 'grey.50',
        border: '2px dashed',
        borderColor: 'grey.300'
      }}
    >
      <Box mb={2}>
        {config.icon}
      </Box>
      
      <Typography variant="h6" gutterBottom color="text.primary">
        {config.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {config.message}
      </Typography>
      
      {onAction && (
        <Button
          variant="outlined"
          startIcon={config.actionIcon}
          onClick={onAction}
          sx={{
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          {config.actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
