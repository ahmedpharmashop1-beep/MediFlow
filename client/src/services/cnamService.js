import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Récupérer toutes les agences CNAM
export const getCnamAgencies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comptes/cnam-agencies`);
    
    // Transformer les données pour les afficher comme agences
    const agencies = response.data.map(admin => ({
      id: admin._id,
      name: admin.name,
      address: admin.officeAddress || 'Adresse non spécifiée',
      phone: admin.phone || 'Non spécifié',
      email: admin.email,
      department: admin.department || 'Agence CNAM',
      position: admin.position || 'Responsable',
      accessLevel: admin.accessLevel || 'basic',
      services: getServicesByAccessLevel(admin.accessLevel),
      hours: 'Lun-Ven: 8h-17h'
    }));
    
    return agencies;
  } catch (error) {
    console.error('Erreur lors de la récupération des agences CNAM:', error);
    return [];
  }
};

// Déterminer les services selon le niveau d'accès
const getServicesByAccessLevel = (accessLevel) => {
  const baseServices = ['Informations', 'Cartes'];
  
  switch (accessLevel) {
    case 'admin':
      return [...baseServices, 'Remboursements', 'Nouveaux assurés', 'Réclamations', 'Retraites', 'Urgences'];
    case 'advanced':
      return [...baseServices, 'Remboursements', 'Nouveaux assurés', 'Réclamations'];
    case 'intermediate':
      return [...baseServices, 'Remboursements', 'Informations'];
    case 'basic':
    default:
      return baseServices;
  }
};

export default {
  getCnamAgencies
};
