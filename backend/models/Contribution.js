
const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Adiyas', 'Sass', 'Diayanté', 'Adiya Élite', 'Gott'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  date: {
    type: Date,
    default: Date.now
  },
  eventLabel: String,
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  // Audit Trail
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contribution', contributionSchema);
