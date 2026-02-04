
const mongoose = require('mongoose');

const socialProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  theme: { 
    type: String, 
    enum: ['Éducation', 'Santé', 'Social', 'Infrastructure'],
    required: true 
  },
  description: String,
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['actif', 'termine', 'pause'],
    default: 'actif'
  },
  color: { type: String, default: 'emerald' }, // UI helper (emerald, blue, rose)
  deadline: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialProject', socialProjectSchema);
