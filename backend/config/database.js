
const mongoose = require('mongoose');

// Variable globale pour suivre l'état de la connexion (utile pour le health check)
let connectionStatus = {
  isConnected: false,
  error: null
};

const connectDB = async () => {
  try {
    const password = process.env.DB_PASSWORD;
    const username = process.env.DB_USER || 'majmadigital'; // Utilisateur configurable
    const dbName = 'majma_db';
    
    let uri = process.env.MONGODB_URI;
    
    // Construction dynamique si mot de passe fourni
    if (password) {
      const encodedPassword = encodeURIComponent(password);
      uri = `mongodb+srv://${username}:${encodedPassword}@cluster0.ja0grya.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`;
    }

    if (!uri) {
      const msg = "❌ ERREUR CONFIG : MONGODB_URI ou DB_PASSWORD manquant dans Railway.";
      console.error(msg);
      connectionStatus.error = msg;
      return; 
    }

    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 Tentative de connexion MongoDB (User: ${username})...`);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log(`✅ MongoDB Connecté : ${conn.connection.host}`);
    connectionStatus.isConnected = true;
    connectionStatus.error = null;

  } catch (error) {
    console.error(`❌ ÉCHEC CONNEXION MONGODB : ${error.message}`);
    connectionStatus.isConnected = false;
    connectionStatus.error = error.message;
    
    // IMPORTANT : On ne fait PLUS process.exit(1) ici.
    // On laisse le serveur tourner pour afficher l'erreur via l'API.
  }
};

const getConnectionStatus = () => connectionStatus;

module.exports = { connectDB, getConnectionStatus };
