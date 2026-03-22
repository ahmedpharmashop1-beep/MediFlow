const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Compte = require('./Model/compte');

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connecté à MongoDB');

    // Supprimer les utilisateurs existants
    await Compte.deleteMany({});
    console.log('Anciens utilisateurs supprimés');

    // Créer des utilisateurs de test
    const testUsers = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'patient@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'patient',
        phone: '0123456789',
        address: '123 Rue de la Santé, Paris',
        insuranceNumber: 'CNAM123456',
        status: 'active'
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'medecin@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '0123456790',
        address: '456 Avenue des Médecins, Paris',
        speciality: 'Cardiologie',
        hospital: 'Hôpital Saint-Joseph',
        status: 'active'
      },
      {
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pharmacien@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'pharmacist',
        phone: '0123456791',
        address: '789 Boulevard des Pharmacies, Paris',
        pharmacyName: 'Pharmacie du Centre',
        status: 'active'
      },
      {
        name: 'Hôpital Central',
        email: 'hopital@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'hospital',
        phone: '0123456792',
        address: '321 Rue des Hôpitaux, Paris',
        bedCount: 500,
        departments: ['Urgences', 'Cardiologie', 'Pédiatrie'],
        status: 'active'
      },
      {
        name: 'CNAM Paris',
        email: 'cnam@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'cnam_admin',
        phone: '0123456793',
        address: '654 Avenue de la Sécurité Sociale, Paris',
        averageProcessingTime: '15 jours',
        services: ['Carte vitale', 'Remboursements', 'AME'],
        status: 'active'
      }
    ];

    const insertedUsers = await Compte.insertMany(testUsers);
    console.log('Utilisateurs de test créés:');
    insertedUsers.forEach(user => {
      console.log(`- ${user.role}: ${user.email}`);
    });

    console.log('\nIdentifiants de test:');
    console.log('Patient: patient@test.com / password123');
    console.log('Médecin: medecin@test.com / password123');
    console.log('Pharmacien: pharmacien@test.com / password123');
    console.log('Hôpital: hopital@test.com / password123');
    console.log('CNAM Admin: cnam@test.com / password123');

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestUsers();
