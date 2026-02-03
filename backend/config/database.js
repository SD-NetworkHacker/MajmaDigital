
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const password = process.env.DB_PASSWORD;
    const dbName = 'majma_db';
    
    // Construction de l'URI : Utilise le mot de passe sécurisé s'il existe
    let uri = process.env.MONGODB_URI;
    
    if (password) {
      // Encodage du mot de passe pour gérer les caractères spéciaux (@, :, etc.)
      const encodedPassword = encodeURIComponent(password);
      
      // Construction de l'URI standard Atlas avec authSource=admin pour garantir l'authentification
      uri = `mongodb+srv://majmadigital:${encodedPassword}@cluster0.ja0grya.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`;
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
      family: 4 // Force IPv4
    });

    console.log(`🚀 MAJMA-DATABASE CONNECTÉE : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur Linkage MongoDB : ${error.message}`);
    
    if (error.message.includes('auth') || error.message.includes('Authentication failed')) {
      console.error("\n💡 DIAGNOSTIC AUTHENTIFICATION :");
      console.error("1. Vérifiez que le mot de passe dans '.env' (DB_PASSWORD) est strictement identique à celui dans Atlas.");
      console.error("2. Vérifiez que l'utilisateur 'majmadigital' a bien les droits 'readWrite' sur 'majma_db'.");
      console.error("3. L'option '&authSource=admin' a été ajoutée automatiquement pour cibler la base admin.");
    }
    
    // On ne quitte pas le processus brutalement en dev pour permettre le debug, mais en prod oui
    if (process.env.NODE_ENV === 'production') {
       process.exit(1);
    }
  }
};

module.exports = connectDB;
