
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Vérification de la variable d'environnement
    if (!process.env.MONGODB_URI) {
      throw new Error("La variable MONGODB_URI est introuvable. Vérifiez le fichier .env (local) ou les Variables de Configuration (Railway/Heroku).");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`🚀 MAJMA-DATABASE CONNECTÉE : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur Linkage MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
