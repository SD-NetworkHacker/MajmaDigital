
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Member = require('./models/Member');
const Event = require('./models/Event');
const Contribution = require('./models/Contribution');
const MeetingReport = require('./models/MeetingReport');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Nettoyage complet
    await Member.deleteMany();
    await Event.deleteMany();
    await Contribution.deleteMany();
    await MeetingReport.deleteMany();

    console.log('Données existantes supprimées...'.red.inverse);

    // 2. Création de l'Admin Sidy Sow
    const adminUser = await Member.create({
      firstName: 'Sidy',
      lastName: 'Sow',
      email: 'sidysow.admin@gmail.com',
      password: 'password123', // Sera crypté automatiquement par le modèle
      phone: '770000000',
      role: 'ADMIN', // Super Admin
      category: 'Travailleur',
      matricule: 'MAJ-ADMIN-001',
      status: 'active',
      commissions: [
        { type: 'Administration', role_commission: 'Secrétaire Général' },
        { type: 'Finance', role_commission: 'Superviseur' }
      ],
      personalInfo: {
        address: 'Siège Dahira',
        coordinates: { lat: 14.7167, lng: -17.4677 }
      }
    });

    console.log(`Admin créé: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`.green.inverse);
    console.log('Base de données initialisée avec succès !'.green.inverse);
    
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Member.deleteMany();
    await Event.deleteMany();
    await Contribution.deleteMany();
    await MeetingReport.deleteMany();

    console.log('Données détruites !'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
