
const asyncHandler = require('express-async-handler');
const SocialCase = require('../models/SocialCase');
const SocialProject = require('../models/SocialProject');

// --- CASES (DEMANDES) ---

// @desc    Créer une demande d'aide
// @route   POST /api/social/cases
// @access  Private
const createCase = asyncHandler(async (req, res) => {
  const { type, description } = req.body;
  const newCase = await SocialCase.create({
    member: req.user._id,
    type,
    description,
    status: 'nouveau'
  });
  res.status(201).json(newCase);
});

// @desc    Récupérer les demandes (Admin: toutes, User: les siennes)
// @route   GET /api/social/cases
// @access  Private
const getCases = asyncHandler(async (req, res) => {
  // Si membre commission sociale ou admin -> tout voir, sinon seulement les siennes
  const isSocialStaff = req.user.role === 'ADMIN' || req.user.role === 'SG' || 
    req.user.commissions.some(c => c.type === 'Social');

  const filter = isSocialStaff ? {} : { member: req.user._id };
  
  const cases = await SocialCase.find(filter)
    .populate('member', 'firstName lastName matricule phone')
    .sort({ createdAt: -1 });
    
  res.json({ data: cases });
});

// --- PROJECTS (PROJETS) ---

// @desc    Récupérer les projets actifs
// @route   GET /api/social/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await SocialProject.find({}).sort({ createdAt: -1 });
  res.json({ data: projects });
});

// @desc    Créer un projet
// @route   POST /api/social/projects
// @access  Private (Admin/Social)
const createProject = asyncHandler(async (req, res) => {
  const project = await SocialProject.create(req.body);
  res.status(201).json(project);
});

module.exports = { createCase, getCases, getProjects, createProject };
