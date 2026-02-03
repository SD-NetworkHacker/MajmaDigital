
const asyncHandler = require('express-async-handler');
const AdiyaCampaign = require('../models/AdiyaCampaign');

// @desc    Récupérer les campagnes
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await AdiyaCampaign.find({}).sort({ createdAt: -1 });
  res.json({ data: campaigns });
});

// @desc    Créer une campagne
// @route   POST /api/campaigns
// @access  Private (Admin/Finance)
const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await AdiyaCampaign.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json(campaign);
});

// @desc    Mettre à jour une campagne
// @route   PUT /api/campaigns/:id
// @access  Private
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await AdiyaCampaign.findById(req.params.id);
  if (campaign) {
    const updated = await AdiyaCampaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Campagne non trouvée');
  }
});

module.exports = { getCampaigns, createCampaign, updateCampaign };
