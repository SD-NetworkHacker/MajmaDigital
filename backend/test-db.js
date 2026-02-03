
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');

// Force le chargement du .env local
dotenv.config({ path: path.resolve(__dirname, '.env') });

const testConnection = async () => {
  console.log('\n--- TEST DE CONNEXION MONGODB ATLAS ---'.cyan.bold);

  const password = process.env.DB_PASSWORD;
  let uri = process.env.MONGODB_URI;

  if (password) {
    console.log('🔑 Construction URI avec DB_PASSWORD...'.yellow);
    const encodedPassword = encodeURIComponent(password);
    // Ajout de authSource=admin
    uri = `mongodb+srv://majmadigital:${encodedPassword}@cluster0.ja0grya.mongodb.net/majma_db?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`;
  }
  
  if (!uri) {
    console.error('❌ ERREUR : Aucune configuration de connexion disponible.'.red.bold);
    process.exit(1);
  }

  // Masquage pour affichage
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`📡 URI Cible : ${maskedUri}`.gray);
  console.log('⏳ Connexion en cours...'.yellow);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    console.log(`\n✅ SUCCÈS - AUTHENTIFICATION RÉUSSIE`.green.bold);
    console.log(`🔗 Hôte : ${conn.connection.host}`.white);
    console.log(`📂 Base : ${conn.connection.name}`.white);
    console.log(`---------------------------------------\n`.cyan.bold);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ ÉCHEC DE LA CONNEXION`.red.bold);
    console.error(`Erreur : ${error.message}`.red);
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
        console.log('\n💡 CONSEIL AUTHENTIFICATION :'.yellow.bold);
        console.log('   1. Le mot de passe est peut-être incorrect.');
        console.log('   2. L\'utilisateur "majmadigital" n\'existe peut-être pas dans la base "admin".');
        console.log('   3. Vérifiez "Database Access" dans Atlas.');
    } else if (error.message.includes('querySrv')) {
        console.log('\n💡 CONSEIL RÉSEAU :'.yellow.bold);
        console.log('   Vérifiez "Network Access" dans Atlas. Ajoutez votre IP (ou 0.0.0.0/0 pour tester).');
    }
    
    console.log(`---------------------------------------\n`.cyan.bold);
    process.exit(1);
  }
};

testConnection();
