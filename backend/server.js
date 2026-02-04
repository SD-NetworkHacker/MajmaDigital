
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, getConnectionStatus } = require('./config/database');

// Configuration
dotenv.config();

console.log("🚀 Démarrage du serveur MajmaDigital...");

// Connexion à la base de données (Non bloquant)
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES API ---
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/social', require('./routes/socialRoutes')); // Ajouté

// Route de santé API dédiée
app.get('/api/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  if (dbStatus.isConnected) {
    res.status(200).json({
      status: 'operational',
      database: 'connected',
      message: 'API MajmaDigital is running 🟢'
    });
  } else {
    res.status(200).json({
      status: 'degraded',
      database: 'disconnected',
      error: dbStatus.error,
      tip: "Vérifiez vos variables d'environnement (DB_USER, DB_PASSWORD) sur Railway."
    });
  }
});

// --- SERVIR LE FRONTEND (VITE BUILD) ---
const distPath = path.join(__dirname, '../dist');

// Servir les fichiers statiques
app.use(express.static(distPath));

// Catch-all : Rediriger toutes les autres requêtes vers l'index.html du Frontend (SPA)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
     return res.status(404).json({ message: `Route API non trouvée: ${req.path}` });
  }

  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    const dbStatus = getConnectionStatus();
    res.status(200).json({
      title: "MajmaDigital API",
      ui_status: "Introuvable (Dossier /dist manquant)",
      api_status: dbStatus.isConnected ? '🟢 Connecté' : '🔴 Déconnecté',
      db_error: dbStatus.error,
      message: "L'application est en ligne. Pour voir l'interface, assurez-vous d'avoir exécuté 'npm run build' avant le déploiement.",
      routes: {
         health: "/api/health",
         docs: "Utilisez le frontend local pour interagir avec cette API."
      }
    });
  }
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('🔥 Erreur Serveur :', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🛡️  Server listening on port: ${PORT}`);
  console.log(`🌍 Frontend path: ${distPath}`);
});
