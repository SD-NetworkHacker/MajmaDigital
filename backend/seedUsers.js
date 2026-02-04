
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Member = require('./models/Member');
const { connectDB } = require('./config/database');

dotenv.config();

const seedUsers = async () => {
  await connectDB();

  try {
    // 1. Nettoyer les utilisateurs existants avec ces emails pour éviter les doublons
    const emailsToDelete = ['admin@majma.sn', 'dieuwrine@majma.sn', 'membre@majma.sn'];
    await Member.deleteMany({ email: { $in: emailsToDelete } });
    console.log('🧹 Utilisateurs de test précédents nettoyés.'.yellow);

    // 2. Création des utilisateurs
    const users = [
      {
        firstName: 'Sidy',
        lastName: 'Sow',
        email: 'admin@majma.sn',
        password: 'password123',
        role: 'ADMIN',
        matricule: 'MAJ-ADMIN-01',
        category: 'Travailleur',
        commissions: [
           { type: 'Administration', role_commission: 'Secrétaire Général' }
        ]
      },
      {
        firstName: 'Moussa',
        lastName: 'Diop',
        email: 'dieuwrine@majma.sn',
        password: 'password123',
        role: 'DIEUWRINE',
        matricule: 'MAJ-DWR-01',
        category: 'Travailleur',
        commissions: [
           { type: 'Organisation', role_commission: 'Dieuwrine' }
        ]
      },
      {
        firstName: 'Fatou',
        lastName: 'Ndiaye',
        email: 'membre@majma.sn',
        password: 'password123',
        role: 'MEMBRE',
        matricule: 'MAJ-MBR-01',
        category: 'Étudiant',
        commissions: [] // Membre simple sans commission
      }
    ];

    for (const user of users) {
      await Member.create(user);
      console.log(`✅ Utilisateur créé : ${user.firstName} (${user.role})`.green);
    }

    console.log('\n✨ Seeding terminé avec succès !'.cyan.bold);
    process.exit();

  } catch (error) {
    console.error(`❌ Erreur de seeding : ${error.message}`.red.inverse);
    process.exit(1);
  }
};

seedUsers();
