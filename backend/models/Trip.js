
const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  location: String,
  time: String,
  expectedPassengers: Number
});

const tripSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: String,
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [stopSchema],
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  status: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  seatsFilled: { type: Number, default: 0 },
  totalCapacity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
