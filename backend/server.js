
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Configuration
dotenv.config();

// Logs de démarrage pour le débogage sur Railway
console.log("🚀 Démarrage du serveur MajmaDigital...");
console.log(`ℹ️  Environnement : ${process.env.NODE_ENV || 'production'}`);
console.log(`ℹ️  Vérification Variables :`);
console.log(`   - PORT: ${process.env.PORT || 5000}`);
console.log(`   - DB_PASSWORD: ${process.env.DB_PASSWORD ? 'Défini ✅' : 'MANQUANT ❌'}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'Défini ✅' : 'MANQUANT ❌'}`);

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors()); // Autorise toutes les origines
app.use(express.json());

// --- ROUTES API ---
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Route de santé (Health Check) - Importante pour Railway
app.get('/', (req, res) => {
  res.status(200).send('API MajmaDigital is operational 🟢');
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('🔥 Erreur Serveur :', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  ################################################
  `);
});
