
const express = require('express');
const router = express.Router();
const {
  authMember,
  registerMember,
  getMembers,
  getUserProfile,
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(registerMember)
    .get(protect, getMembers); // Liste protégée

router.post('/login', authMember);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
