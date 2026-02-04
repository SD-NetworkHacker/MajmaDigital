
const express = require('express');
const router = express.Router();
const {
  getFleet, createVehicle, updateVehicle, deleteVehicle,
  getDrivers, createDriver, updateDriver, deleteDriver,
  getTrips, createTrip
} = require('../controllers/transportController');
const { protect, admin } = require('../middleware/authMiddleware');

// Routes Flotte
router.route('/fleet')
  .get(protect, getFleet)
  .post(protect, createVehicle);

router.route('/fleet/:id')
  .put(protect, updateVehicle)
  .delete(protect, admin, deleteVehicle);

// Routes Chauffeurs
router.route('/drivers')
  .get(protect, getDrivers)
  .post(protect, createDriver);

router.route('/drivers/:id')
  .put(protect, updateDriver)
  .delete(protect, admin, deleteDriver);

// Routes Convois
router.route('/trips')
  .get(protect, getTrips)
  .post(protect, createTrip);

module.exports = router;
