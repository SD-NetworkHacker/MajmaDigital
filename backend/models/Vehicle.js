
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bus_grand', 'bus_moyen', 'minibus', 'voiture'],
    required: true
  },
  capacity: { type: Number, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: {
    type: String,
    enum: ['disponible', 'en_mission', 'maintenance', 'hors_service'],
    default: 'disponible'
  },
  features: [String],
  maintenance: {
    lastDate: Date,
    nextDate: Date,
    status: { type: String, enum: ['ok', 'warning', 'critical'], default: 'ok' }
  },
  ownership: {
    type: String,
    enum: ['internal', 'external'],
    default: 'internal'
  },
  externalDetails: {
    companyName: String,
    contactPhone: String,
    dailyCost: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
