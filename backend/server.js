
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

// Route de santé améliorée pour le débogage Railway
app.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  if (dbStatus.isConnected) {
    res.status(200).json({
      status: 'operational',
      database: 'connected',
      message: 'API MajmaDigital is running 🟢'
    });
  } else {
    // Renvoie 200 OK pour que Railway considère le service comme "En ligne"
    // mais affiche l'erreur critique à l'utilisateur
    res.status(200).json({
      status: 'degraded',
      database: 'disconnected',
      error: dbStatus.error,
      tip: "Vérifiez vos variables d'environnement (DB_USER, DB_PASSWORD) sur Railway."
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
});
