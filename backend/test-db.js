
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
    console.log('🔑 Utilisation de DB_PASSWORD détectée'.yellow);
    uri = `mongodb+srv://majmadigital:${password}@cluster0.ja0grya.mongodb.net/majma_db?retryWrites=true&w=majority&appName=Cluster0`;
  } else {
    console.log('⚠️ DB_PASSWORD manquant, utilisation de MONGODB_URI brute'.yellow);
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
      family: 4 // Force IPv4
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
        console.log('\n💡 DIAGNOSTIC : Mot de passe incorrect.'.yellow.bold);
        console.log('   Le mot de passe "majmadigital" semble rejeté par Atlas.'.yellow);
        console.log('   Vérifiez vos accès dans l\'onglet "Database Access" sur cloud.mongodb.com'.yellow);
    }
    
    console.log(`---------------------------------------\n`.cyan.bold);
    process.exit(1);
  }
};

testConnection();
