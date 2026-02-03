
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Magal', 'Ziar', 'Gott', 'Thiant', 'Réunion', 'Autre'],
    default: 'Autre'
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: {
    type: String,
    required: true
  },
  // GeoJSON pour permettre des recherches de proximité futures
  coordinates: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  },
  organizingCommission: {
    type: String,
    required: true
  },
  description: String,
  
  // Gestion des participants
  participants: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    status: {
      type: String,
      enum: ['inscrit', 'present', 'absent'],
      default: 'inscrit'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  budget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  }
}, {
  timestamps: true
});

// Index pour la recherche géographique
eventSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);
