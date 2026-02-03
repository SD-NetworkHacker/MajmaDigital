
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  matricule: {
    type: String,
    unique: true,
    // Index pour recherche rapide
    index: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    select: false // Ne jamais renvoyer le mot de passe par défaut
  },
  phone: String,
  category: {
    type: String,
    enum: ['Élève', 'Étudiant', 'Travailleur'],
    default: 'Étudiant'
  },
  role: {
    type: String,
    enum: ['ADMIN', 'SG', 'ADJOINT_SG', 'DIEUWRINE', 'MEMBRE'],
    default: 'MEMBRE'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  
  // Données sensibles cryptées ou protégées
  personalInfo: {
    address: String,
    birthDate: Date,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Suivi Financier Agrégé (Mise à jour atomique lors des paiements)
  financialStats: {
    totalContributed: { type: Number, default: 0 },
    lastContributionDate: Date
  },

  // Support VECTOR SEARCH (Atlas Search)
  biography: String,
  spiritualGoals: String,
  
  biographyEmbedding: {
    type: [Number],
    index: 'vector'
  },

  commissions: [{
    type: { type: String },
    role_commission: String,
    permissions: [String]
  }],

  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// MIDDLEWARE: Pre-save pour générer le Matricule et Crypter le mot de passe
memberSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (!this.matricule) {
    const date = new Date();
    const year = date.getFullYear();
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.matricule = `MAJ-${year}-${randomSuffix}`;
  }

  next();
});

memberSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Member', memberSchema);
