
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const password = process.env.DB_PASSWORD;
    
    // Construction de l'URI : Utilise le mot de passe sécurisé s'il existe, sinon l'URI complète du .env
    let uri = process.env.MONGODB_URI;
    if (password) {
      // On s'assure d'insérer le mot de passe dans l'URI standard
      uri = `mongodb+srv://majmadigital:${password}@cluster0.ja0grya.mongodb.net/majma_db?retryWrites=true&w=majority&appName=Cluster0`;
    }

    if (!uri) {
      throw new Error("Aucune URI MongoDB trouvée. Vérifiez DB_PASSWORD ou MONGODB_URI dans .env");
    }

    // Masquer le mot de passe pour les logs
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 Tentative de connexion à : ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4 (résout souvent les timeout/erreurs réseau sur Node récent)
    });

    console.log(`🚀 MAJMA-DATABASE CONNECTÉE : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur Linkage MongoDB : ${error.message}`);
    // Affiche un indice si c'est une erreur d'auth
    if (error.message.includes('auth') || error.message.includes('Authentication failed')) {
      console.error("💡 Vérifiez que le mot de passe dans 'backend/.env' (variable DB_PASSWORD) est correct.");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
