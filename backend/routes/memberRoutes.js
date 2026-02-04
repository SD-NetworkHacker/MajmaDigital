
const express = require('express');
const router = express.Router();
const {
  authMember,
  registerMember,
  getMembers,
  getUserProfile,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(registerMember)
    .get(protect, getMembers);

router.post('/login', authMember);
router.route('/profile').get(protect, getUserProfile);

router.route('/:id')
    .patch(protect, updateMember)
    .delete(protect, admin, deleteMember);

module.exports = router;
