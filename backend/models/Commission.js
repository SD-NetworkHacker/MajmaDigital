
const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  totalRaised: {
    type: Number,
    default: 0
  },
  lastActivity: Date
});

module.exports = mongoose.model('Commission', commissionSchema);
