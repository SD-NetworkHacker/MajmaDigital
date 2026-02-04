
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // Lien optionnel vers un membre
  name: { type: String, required: true },
  licenseType: { type: String, required: true },
  status: {
    type: String,
    enum: ['disponible', 'en_mission', 'repos'],
    default: 'disponible'
  },
  phone: { type: String, required: true },
  tripsCompleted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
