
const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const jwt = require('jsonwebtoken');

// Helper Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/members/login
// @access  Public
const authMember = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const member = await Member.findOne({ email }).select('+password');

  if (member && (await member.matchPassword(password))) {
    res.json({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      matricule: member.matricule,
      token: generateToken(member._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe invalide');
  }
});

// @desc    Register a new member
// @route   POST /api/members
// @access  Public (ou Admin selon config)
const registerMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, category, address } = req.body;

  const memberExists = await Member.findOne({ email });

  if (memberExists) {
    res.status(400);
    throw new Error('Un membre avec cet email existe déjà');
  }

  const member = await Member.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    category,
    personalInfo: { address }
  });

  if (member) {
    res.status(201).json({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      matricule: member.matricule,
      token: generateToken(member._id),
    });
  } else {
    res.status(400);
    throw new Error('Données membres invalides');
  }
});

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find({});
  res.json({ data: members });
});

// @desc    Get member profile
// @route   GET /api/members/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.user._id);

  if (member) {
    res.json({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      commissions: member.commissions
    });
  } else {
    res.status(404);
    throw new Error('Membre introuvable');
  }
});

module.exports = {
  authMember,
  registerMember,
  getMembers,
  getUserProfile,
};
