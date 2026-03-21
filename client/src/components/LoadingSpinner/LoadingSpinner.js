import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Fade
} from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Chargement...', 
  fullScreen = false,
  color = 'primary'
}) => {
  const content = (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      gap={2}
    >
      <CircularProgress 
        size={size} 
        color={color}
        sx={{
          animation: 'pulse 2s infinite ease-in-out'
        }}
      />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ opacity: 0.7 }}
      >
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
      >
        <Fade in={true}>
          {content}
        </Fade>
      </Box>
    );
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Fade in={true}>
        {content}
      </Fade>
    </Box>
  );
};

export default LoadingSpinner;
