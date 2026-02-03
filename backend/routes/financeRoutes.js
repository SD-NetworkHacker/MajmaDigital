
const express = require('express');
const router = express.Router();
const { processPayment, getContributions } = require('../controllers/financeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getContributions); // Lecture de l'historique

router.route('/pay')
  .post(protect, processPayment); // Enregistrement paiement

module.exports = router;
