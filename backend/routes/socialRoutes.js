
const express = require('express');
const router = express.Router();
const { createCase, getCases, getProjects, createProject } = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

router.route('/cases')
  .get(protect, getCases)
  .post(protect, createCase);

router.route('/projects')
  .get(protect, getProjects)
  .post(protect, createProject);

module.exports = router;
