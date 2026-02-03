
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Configuration
dotenv.config();
connectDB();

const app = express();

// Middleware de sécurité et parsing
app.use(cors()); // Autorise toutes les origines pour faciliter le dev
app.use(express.json()); // Parsing du JSON

// --- ROUTES API ---
// Membres & Auth
app.use('/api/members', require('./routes/memberRoutes'));

// Finance (Transactions & Campagnes)
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));

// Événements & Rapports
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Opérations (Tâches)
app.use('/api/tasks', require('./routes/taskRoutes'));

// Culture (Médiathèque)
app.use('/api/resources', require('./routes/resourceRoutes'));

// Route de santé (Health Check)
app.get('/', (req, res) => {
  res.send('API MajmaDigital is running... Linkage OK.');
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
