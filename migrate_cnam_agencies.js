const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Import models
const CnamAdmin = require('./Model/CnamAdmin');

// Force IPv4 for DNS resolution and use Google DNS as fallback for SRV records
if (process.env.DB_URI && process.env.DB_URI.includes('mongodb+srv')) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Connect to database using same config as server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      family: 4, // Force IPv4 to avoid DNS resolution issues on Windows
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const migrateCnamAgencies = async () => {
  try {
    console.log('🏢 MIGRATION DES AGENCES CNAM...\n');
    
    const existingAdmins = await CnamAdmin.find({});
    console.log(`👨‍💼 Admins CNAM existants: ${existingAdmins.length}`);
    
    // Afficher les admins existants
    existingAdmins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.name} - ${admin.department} - ${admin.accessLevel}`);
    });
    
    const cnamAgenciesData = [
      // Agences principales par gouvernorat
      {
        name: 'Agence CNAM Tunis',
        email: 'tunis@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 800 100',
        officeAddress: 'Avenue Habib Bourguiba, Tunis 1000',
        employeeId: 'CNAM-TN-AG-001',
        department: 'Agence Régionale Tunis',
        position: 'Directeur d\'Agence',
        accessLevel: 'admin'
      },
      {
        name: 'Agence CNAM Ariana',
        email: 'ariana@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 540 100',
        officeAddress: 'Rue de la République, Ariana',
        employeeId: 'CNAM-AR-AG-001',
        department: 'Agence Régionale Ariana',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Ben Arous',
        email: 'benarous@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 79 300 100',
        officeAddress: 'Avenue Habib Bourguiba, Ben Arous',
        employeeId: 'CNAM-BA-AG-001',
        department: 'Agence Régionale Ben Arous',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Manouba',
        email: 'manouba@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 71 730 100',
        officeAddress: 'Rue Omar Ibn El Khattab, Manouba',
        employeeId: 'CNAM-MN-AG-001',
        department: 'Agence Régionale Manouba',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Nabeul',
        email: 'nabeul@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 72 200 100',
        officeAddress: 'Rue Farhat Hached, Nabeul',
        employeeId: 'CNAM-NB-AG-001',
        department: 'Agence Régionale Nabeul',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Zaghouan',
        email: 'zaghouan@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 72 680 100',
        officeAddress: 'Avenue de la République, Zaghouan',
        employeeId: 'CNAM-ZG-AG-001',
        department: 'Agence Régionale Zaghouan',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Bizerte',
        email: 'bizerte@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 72 400 100',
        officeAddress: 'Rue 20 Mars, Bizerte',
        employeeId: 'CNAM-BZ-AG-001',
        department: 'Agence Régionale Bizerte',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Béja',
        email: 'beja@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 78 600 100',
        officeAddress: 'Avenue Habib Bourguiba, Béja',
        employeeId: 'CNAM-BJ-AG-001',
        department: 'Agence Régionale Béja',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Jendouba',
        email: 'jendouba@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 78 600 200',
        officeAddress: 'Rue de l\'Indépendance, Jendouba',
        employeeId: 'CNAM-JD-AG-001',
        department: 'Agence Régionale Jendouba',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Le Kef',
        email: 'lekef@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 78 400 100',
        officeAddress: 'Avenue de la République, Le Kef',
        employeeId: 'CNAM-LK-AG-001',
        department: 'Agence Régionale Le Kef',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Siliana',
        email: 'siliana@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 78 500 100',
        officeAddress: 'Rue du 2 Mars, Siliana',
        employeeId: 'CNAM-SL-AG-001',
        department: 'Agence Régionale Siliana',
        position: 'Directeur d\'Agence',
        accessLevel: 'basic'
      },
      {
        name: 'Agence CNAM Sousse',
        email: 'sousse@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 73 200 100',
        officeAddress: 'Rue Farhat Hached, Sousse',
        employeeId: 'CNAM-SO-AG-001',
        department: 'Agence Régionale Sousse',
        position: 'Directeur d\'Agence',
        accessLevel: 'admin'
      },
      {
        name: 'Agence CNAM Monastir',
        email: 'monastir@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 73 400 100',
        officeAddress: 'Avenue Habib Bourguiba, Monastir',
        employeeId: 'CNAM-MO-AG-001',
        department: 'Agence Régionale Monastir',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Mahdia',
        email: 'mahdia@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 73 600 100',
        officeAddress: 'Rue de l\'Indépendance, Mahdia',
        employeeId: 'CNAM-MH-AG-001',
        department: 'Agence Régionale Mahdia',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Sfax',
        email: 'sfax@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 74 200 100',
        officeAddress: 'Rue Hedi Chaker, Sfax',
        employeeId: 'CNAM-SF-AG-001',
        department: 'Agence Régionale Sfax',
        position: 'Directeur d\'Agence',
        accessLevel: 'admin'
      },
      {
        name: 'Agence CNAM Gabès',
        email: 'gabes@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 75 200 100',
        officeAddress: 'Avenue Habib Bourguiba, Gabès',
        employeeId: 'CNAM-GB-AG-001',
        department: 'Agence Régionale Gabès',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Médenine',
        email: 'medenine@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 75 400 100',
        officeAddress: 'Rue de la République, Médenine',
        employeeId: 'CNAM-MD-AG-001',
        department: 'Agence Régionale Médenine',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Tataouine',
        email: 'tataouine@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 75 600 100',
        officeAddress: 'Avenue de la Tunisie, Tataouine',
        employeeId: 'CNAM-TT-AG-001',
        department: 'Agence Régionale Tataouine',
        position: 'Directeur d\'Agence',
        accessLevel: 'basic'
      },
      {
        name: 'Agence CNAM Gafsa',
        email: 'gafsa@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 76 200 100',
        officeAddress: 'Rue de la République, Gafsa',
        employeeId: 'CNAM-GF-AG-001',
        department: 'Agence Régionale Gafsa',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Tozeur',
        email: 'tozeur@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 76 400 100',
        officeAddress: 'Avenue de la République, Tozeur',
        employeeId: 'CNAM-TZ-AG-001',
        department: 'Agence Régionale Tozeur',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Kebili',
        email: 'kebili@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 76 600 100',
        officeAddress: 'Rue du 14 Janvier, Kebili',
        employeeId: 'CNAM-KB-AG-001',
        department: 'Agence Régionale Kebili',
        position: 'Directeur d\'Agence',
        accessLevel: 'basic'
      },
      {
        name: 'Agence CNAM Kairouan',
        email: 'kairouan@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 77 200 100',
        officeAddress: 'Rue Okba Ibn Nafaa, Kairouan',
        employeeId: 'CNAM-KR-AG-001',
        department: 'Agence Régionale Kairouan',
        position: 'Directeur d\'Agence',
        accessLevel: 'advanced'
      },
      {
        name: 'Agence CNAM Kasserine',
        email: 'kasserine@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 77 400 100',
        officeAddress: 'Avenue de la République, Kasserine',
        employeeId: 'CNAM-KS-AG-001',
        department: 'Agence Régionale Kasserine',
        position: 'Directeur d\'Agence',
        accessLevel: 'intermediate'
      },
      {
        name: 'Agence CNAM Sidi Bouzid',
        email: 'sidibouzid@cnam.tn',
        password: 'password123',
        role: 'cnam_admin',
        phone: '+216 77 600 100',
        officeAddress: 'Rue de la République, Sidi Bouzid',
        employeeId: 'CNAM-SB-AG-001',
        department: 'Agence Régionale Sidi Bouzid',
        position: 'Directeur d\'Agence',
        accessLevel: 'basic'
      }
    ];

    let addedCount = 0;
    let skippedCount = 0;
    
    for (const agencyData of cnamAgenciesData) {
      const existing = await CnamAdmin.findOne({ email: agencyData.email });
      if (!existing) {
        try {
          const agency = new CnamAdmin(agencyData);
          await agency.save();
          addedCount++;
          console.log(`  ✅ Agence ajoutée: ${agencyData.name} (${agencyData.department})`);
        } catch (error) {
          console.error(`  ❌ Erreur pour ${agencyData.name}:`, error.message);
        }
      } else {
        skippedCount++;
        console.log(`  ℹ️  Existe déjà: ${agencyData.name}`);
      }
    }
    
    console.log(`\n📊 Résumé de la migration CNAM:`);
    console.log(`🆕 Agences ajoutées: ${addedCount}`);
    console.log(`📍 Agences existantes: ${skippedCount}`);
    
    // Vérification finale
    const finalAdmins = await CnamAdmin.find({});
    console.log(`\n🎯 Total final d'admins CNAM: ${finalAdmins.length}`);
    
    console.log('\n📋 Liste des agences CNAM:');
    finalAdmins.forEach((admin, index) => {
      const accessLevelIcon = admin.accessLevel === 'admin' ? '👑' : 
                            admin.accessLevel === 'advanced' ? '⭐' : 
                            admin.accessLevel === 'intermediate' ? '🔶' : '🔵';
      console.log(`  ${index + 1}. ${accessLevelIcon} ${admin.name} - ${admin.department} (${admin.accessLevel})`);
    });
    
    // Statistiques par gouvernorat
    const governorates = {};
    finalAdmins.forEach(admin => {
      const gov = admin.department.split(' ')[2] || 'Autre';
      governorates[gov] = (governorates[gov] || 0) + 1;
    });
    
    console.log('\n📈 Répartition par gouvernorat:');
    Object.entries(governorates).forEach(([gov, count]) => {
      console.log(`  ${gov}: ${count} agence(s)`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration des agences CNAM:', error);
  }
};

const main = async () => {
  await connectDB();
  await migrateCnamAgencies();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  console.log('🏁 Migration des agences CNAM terminée!');
};

main().catch(console.error);
