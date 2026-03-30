
const express = require('express');
const { createJob, getJobs } = require('../Controllers/JobController');
const router = express.Router();

// Get all jobs
router.get('/', getJobs);

// Create a new job
router.post('/', createJob);

module.exports = router;
