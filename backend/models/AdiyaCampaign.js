
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  pledgedAmount: Number, // Montant promis
  paidAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pledged', 'partial', 'completed'],
    default: 'pledged'
  },
  joinedAt: { type: Date, default: Date.now }
});

const adiyaCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  unitAmount: {
    type: Number,
    required: true
  },
  targetAmount: Number,
  deadline: Date,
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open'
  },
  participants: [participantSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdiyaCampaign', adiyaCampaignSchema);
