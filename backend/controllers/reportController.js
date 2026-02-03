
const asyncHandler = require('express-async-handler');
const MeetingReport = require('../models/MeetingReport');

// @desc    Récupérer les rapports (avec filtres possibles)
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const reports = await MeetingReport.find({}).sort({ date: -1 });
  res.json({ data: reports });
});

// @desc    Créer un rapport
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { commission, title, date, startTime, type, discussions, decisions } = req.body;

  const report = new MeetingReport({
    commission,
    title,
    date,
    startTime,
    type,
    discussions,
    decisions,
    createdBy: req.user._id, // L'utilisateur connecté
    status: 'brouillon'
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
});

module.exports = {
  getReports,
  createReport
};
