const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CnamAdmin = require('./Model/CnamAdmin');
require('dotenv').config();

// Connexion à la base de données
mongoose.connect(process.env.DB_URI)
.then(() => {
  console.log('✅ Connecté à MongoDB');
  createAdminAccount();
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  process.exit(1);
});

// Création du compte administrateur
async function createAdminAccount() {
  try {
    // Vérifier si le compte admin existe déjà
    const existingAdmin = await CnamAdmin.findOne({ email: 'admin@mediflow.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Le compte admin existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      await mongoose.connection.close();
      return;
    }

    // Créer le compte administrateur
    const adminAccount = new CnamAdmin({
      name: 'Super Administrateur MediFlow',
      email: 'admin@mediflow.com',
      password: 'Admin2024!',
      role: 'cnam_admin',
      phone: '+33 1 23 45 67 89',
      officeAddress: '123 Rue de la Santé, 75001 Paris',
      employeeId: 'ADMIN-001',
      department: 'Direction Générale',
      position: 'Super Administrateur',
      accessLevel: 'admin'
    });

    await adminAccount.save();
    
    console.log('✅ Compte administrateur créé avec succès!');
    console.log('📧 Email: admin@mediflow.com');
    console.log('🔑 Mot de passe: Admin2024!');
    console.log('👤 Nom: Super Administrateur MediFlow');
    console.log('🏢 Rôle: cnam_admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
  } finally {
    await mongoose.connection.close();
  }
}
