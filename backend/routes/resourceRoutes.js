
const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getResources) // Public lecture possible
  .post(protect, createResource);

router.route('/:id')
  .delete(protect, deleteResource);

module.exports = router;
