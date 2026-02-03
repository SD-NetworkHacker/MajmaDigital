
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const password = process.env.DB_PASSWORD;
    const dbName = 'majma_db';
    
    let uri = process.env.MONGODB_URI;
    
    // Construction dynamique de l'URI si le mot de passe est fourni
    if (password) {
      const encodedPassword = encodeURIComponent(password);
      // Ajout de authSource=admin pour la compatibilité Atlas
      uri = `mongodb+srv://majmadigital:${encodedPassword}@cluster0.ja0grya.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`;
    }

    if (!uri) {
      console.error("❌ ERREUR CONFIG : Variable MONGODB_URI ou DB_PASSWORD manquante.");
      console.error("   -> Sur Railway, allez dans l'onglet 'Variables' et ajoutez DB_PASSWORD.");
      return; 
    }

    // Masquer le mot de passe pour les logs de sécurité
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 Tentative de connexion MongoDB vers : ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout court (5s) pour détecter vite les blocages IP
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4 (Recommandé pour Railway)
    });

    console.log(`✅ MongoDB Connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ ÉCHEC CONNEXION MONGODB : ${error.message}`);
    
    // Diagnostic automatique pour l'utilisateur
    console.error("\n💡 GUIDE DE DÉPANNAGE (RAILWAY / ATLAS) :");
    console.error("====================================================");
    console.error("1. 🌍 NETWORK ACCESS (IP Whitelist) - Cause N°1 des erreurs !");
    console.error("   Railway change d'IP à chaque déploiement.");
    console.error("   -> Allez sur MongoDB Atlas > Network Access");
    console.error("   -> Ajoutez l'IP : 0.0.0.0/0 (Allow Access from Anywhere)");
    console.error("----------------------------------------------------");
    console.error("2. 🔑 MOT DE PASSE");
    console.error("   -> Vérifiez que la variable 'DB_PASSWORD' est bien définie dans Railway.");
    console.error("   -> Le mot de passe ne doit pas contenir de caractères spéciaux non encodés.");
    console.error("====================================================\n");
    
    // On quitte le processus pour que Railway redémarre ou signale l'erreur
    process.exit(1);
  }
};

module.exports = connectDB;
