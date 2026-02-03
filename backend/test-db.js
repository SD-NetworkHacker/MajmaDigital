
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');

// Charge les variables d'environnement de manière robuste
dotenv.config({ path: path.resolve(__dirname, '.env') });

const testConnection = async () => {
  console.log('\n--- TEST DE CONNEXION MONGODB ATLAS ---'.cyan.bold);
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ ERREUR : Variable MONGODB_URI manquante.'.red.bold);
    console.log('Assurez-vous que le fichier .env est dans le dossier backend.'.yellow);
    process.exit(1);
  }

  // Masquer le mot de passe pour l'affichage
  const maskedUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
  console.log(`📡 URI détectée : ${maskedUri}`.gray);
  console.log('⏳ Tentative de connexion en cours...'.yellow);

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout après 5s
    });

    console.log(`\n✅ SUCCÈS !`.green.bold);
    console.log(`🔗 Hôte : ${conn.connection.host}`.white);
    console.log(`📂 Base de données : ${conn.connection.name}`.white);
    console.log(`---------------------------------------\n`.cyan.bold);
    
    // Fermeture propre
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ ÉCHEC DE LA CONNEXION`.red.bold);
    console.error(`Message d'erreur : ${error.message}`.red);
    
    if (error.message.includes('bad auth')) {
        console.log('\n💡 CONSEIL : Vérifiez votre nom d\'utilisateur et mot de passe dans le fichier .env'.yellow);
    } else if (error.message.includes('querySrv')) {
        console.log('\n💡 CONSEIL : Vérifiez votre connexion internet ou le whitelist IP sur Atlas'.yellow);
    }
    
    console.log(`---------------------------------------\n`.cyan.bold);
    process.exit(1);
  }
};

testConnection();
