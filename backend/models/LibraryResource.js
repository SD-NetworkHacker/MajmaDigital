
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  type: {
    type: String,
    enum: ['livre', 'audio', 'video', 'document'],
    required: true
  },
  category: String, // Khassaide, Coran, Histoire...
  accessLevel: {
    type: String,
    enum: ['public', 'membres', 'avance'],
    default: 'public'
  },
  url: String, // Lien vers le fichier (Cloudinary/S3)
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 5 }
}, {
  timestamps: true
});

module.exports = mongoose.model('LibraryResource', resourceSchema);
