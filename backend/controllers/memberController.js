
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
      category: member.category,
      commissions: member.commissions,
      token: generateToken(member._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe invalide');
  }
});

// @desc    Register a new member
// @route   POST /api/members
// @access  Public (ou Admin)
const registerMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, category, address, role, commissions } = req.body;

  const memberExists = await Member.findOne({ email });

  if (memberExists) {
    res.status(400);
    throw new Error('Un membre avec cet email existe déjà');
  }

  // Création avec tous les champs, y compris les commissions et le rôle si fournis (Admin)
  const member = await Member.create({
    firstName,
    lastName,
    email,
    password, // Sera hashé par le middleware pre-save
    phone,
    category,
    role: role || 'MEMBRE',
    personalInfo: { address },
    commissions: commissions || []
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
      matricule: member.matricule,
      category: member.category,
      commissions: member.commissions
    });
  } else {
    res.status(404);
    throw new Error('Membre introuvable');
  }
});

// @desc    Update member
// @route   PATCH /api/members/:id
// @access  Private (Admin or Self)
const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    // Vérification droits : Admin ou le membre lui-même
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== member._id.toString()) {
       res.status(403);
       throw new Error('Non autorisé à modifier ce profil');
    }

    member.firstName = req.body.firstName || member.firstName;
    member.lastName = req.body.lastName || member.lastName;
    member.email = req.body.email || member.email;
    member.phone = req.body.phone || member.phone;
    member.category = req.body.category || member.category;
    
    if (req.body.address) {
        member.personalInfo = { ...member.personalInfo, address: req.body.address };
    }

    // Seul un admin peut changer le rôle ou les commissions
    if (req.user.role === 'ADMIN' || req.user.role === 'SG') {
        if (req.body.role) member.role = req.body.role;
        if (req.body.commissions) member.commissions = req.body.commissions;
        if (req.body.status) member.status = req.body.status;
    }

    if (req.body.password) {
      member.password = req.body.password; // Le pre-save hook gérera le hashage
    }

    const updatedMember = await member.save();

    res.json({
      _id: updatedMember._id,
      firstName: updatedMember.firstName,
      lastName: updatedMember.lastName,
      email: updatedMember.email,
      role: updatedMember.role,
      matricule: updatedMember.matricule,
      category: updatedMember.category,
      commissions: updatedMember.commissions
    });
  } else {
    res.status(404);
    throw new Error('Membre non trouvé');
  }
});

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    await member.deleteOne();
    res.json({ message: 'Membre supprimé' });
  } else {
    res.status(404);
    throw new Error('Membre non trouvé');
  }
});

module.exports = {
  authMember,
  registerMember,
  getMembers,
  getUserProfile,
  updateMember,
  deleteMember
};
