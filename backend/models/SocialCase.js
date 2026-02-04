
const mongoose = require('mongoose');

const socialCaseSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  type: {
    type: String,
    enum: ['Soutien Médical', 'Appui Scolaire / Universitaire', 'Urgence Sociale', 'Autre'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['nouveau', 'en_cours', 'valide', 'rejete', 'cloture'],
    default: 'nouveau'
  },
  amountRequested: Number,
  amountGranted: { type: Number, default: 0 },
  priority: {
    type: String,
    enum: ['basse', 'moyenne', 'haute', 'critique'],
    default: 'moyenne'
  },
  notes: [{
    author: String,
    text: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialCase', socialCaseSchema);
