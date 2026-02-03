
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // On attache l'utilisateur complet à la requête (sans le mot de passe)
      req.user = await Member.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware pour les rôles administratifs
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SG' || req.user.role === 'DIEUWRINE')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
