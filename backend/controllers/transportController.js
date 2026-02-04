
const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// --- VEHICLES ---
const getFleet = asyncHandler(async (req, res) => {
  const fleet = await Vehicle.find({});
  res.json({ data: fleet });
});

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!vehicle) {
      res.status(404);
      throw new Error('Véhicule non trouvé');
  }
  res.json(vehicle);
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (vehicle) {
      await vehicle.deleteOne();
      res.json({ message: 'Véhicule supprimé' });
  } else {
      res.status(404);
      throw new Error('Véhicule non trouvé');
  }
});

// --- DRIVERS ---
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({});
  res.json({ data: drivers });
});

const createDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.create(req.body);
  res.status(201).json(driver);
});

// --- TRIPS ---
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({}).populate('vehicle').sort({ departureDate: 1 });
  res.json({ data: trips });
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create(req.body);
  res.status(201).json(trip);
});

module.exports = {
  getFleet, createVehicle, updateVehicle, deleteVehicle,
  getDrivers, createDriver,
  getTrips, createTrip
};
