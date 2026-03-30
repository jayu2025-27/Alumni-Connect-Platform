
const express = require('express');
const { createMentorship, getMentorships } = require('../Controllers/MentorshipController');
const router = express.Router();

// Get all mentorships
router.get('/', getMentorships);

// Create a new mentorship
router.post('/', createMentorship);

module.exports = router;
