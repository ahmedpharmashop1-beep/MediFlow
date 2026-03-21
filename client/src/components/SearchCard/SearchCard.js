import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import {
  Search,
  LocationOn,
  Medication,
  GpsFixed
} from '@mui/icons-material';

const SearchCard = ({
  medicineName,
  quantity,
  onMedicineNameChange,
  onQuantityChange,
  onSearch,
  onLocationRequest,
  searchLoading,
  locationLoading,
  hasLocation,
  error
}) => {
  return (
    <Card 
      sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          <Medication sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rechercher un médicament
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Trouvez les pharmacies disponibles près de chez vous
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom du médicament"
              variant="outlined"
              value={medicineName}
              onChange={onMedicineNameChange}
              placeholder="ex: Doliprane, Ibuprofène..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Medication sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2
                }
              }}
              sx={{
                '& .MuiInputLabel-root': { color: 'text.secondary' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Quantité"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={onQuantityChange}
              inputProps={{ min: 1, max: 10 }}
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2
                }
              }}
              sx={{
                '& .MuiInputLabel-root': { color: 'text.secondary' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<GpsFixed />}
                onClick={onLocationRequest}
                disabled={locationLoading}
                fullWidth
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {locationLoading ? 'Position...' : 'Ma position'}
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={onSearch}
                disabled={searchLoading || !medicineName.trim()}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                {searchLoading ? 'Recherche...' : 'Rechercher'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {hasLocation && (
          <Box mt={2}>
            <Chip
              icon={<LocationOn />}
              label="Géolocalisation activée"
              color="success"
              variant="filled"
              size="small"
              sx={{ 
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                color: 'white'
              }}
            />
          </Box>
        )}

        {error && (
          <Box mt={2} p={1} sx={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" color="error.light">
              {error}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchCard;
