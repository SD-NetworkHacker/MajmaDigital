
const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign, updateCampaign } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .put(protect, updateCampaign);

module.exports = router;
