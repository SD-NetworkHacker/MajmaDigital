
const mongoose = require('mongoose');

const meetingReportSchema = new mongoose.Schema({
  commission: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  location: String,
  type: {
    type: String,
    enum: ['ordinaire', 'extraordinaire', 'urgence', 'planification'],
    default: 'ordinaire'
  },
  
  // Suivi précis des présences
  attendees: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    name: String, // Snapshot du nom au moment de la réunion
    role: String,
    status: {
      type: String,
      enum: ['present', 'absent_excuse', 'absent'],
      default: 'absent'
    },
    arrivalTime: String // Pour gérer les retards
  }],

  agenda: [{
    title: String,
    duration: Number,
    presenter: String,
    notes: String
  }],

  discussions: String, // Rich text content

  decisions: [{
    description: String,
    votes: {
      for: { type: Number, default: 0 },
      against: { type: Number, default: 0 },
      abstain: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['adopted', 'rejected', 'pending']
    }
  }],

  actionItems: [{
    description: String,
    assignedTo: String, // Nom ou ID
    dueDate: Date,
    status: {
      type: String,
      enum: ['a_faire', 'en_cours', 'termine', 'retard'],
      default: 'a_faire'
    }
  }],

  status: {
    type: String,
    enum: ['brouillon', 'soumis_admin', 'valide_admin', 'soumis_bureau', 'approuve_bureau', 'archive'],
    default: 'brouillon'
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  
  confidentiality: {
    type: String,
    enum: ['interne', 'confidentiel', 'public'],
    default: 'interne'
  },
  
  meetingQrCode: String // Pour l'émargement digital
}, {
  timestamps: true
});

module.exports = mongoose.model('MeetingReport', meetingReportSchema);
