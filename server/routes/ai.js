const express = require('express');
const { auth } = require('../middleware/auth');
const {
    analyzeProfile,
    generateTestQuestions
} = require('../controllers/aiController');

const router = express.Router();

// @route   POST /api/ai/analyze-profile
// @desc    Analyze user profile and generate recommendations
// @access  Private
router.post('/analyze-profile', auth, analyzeProfile);

// @route   POST /api/ai/generate-test-questions
// @desc    Generate AI-powered test questions
// @access  Private
router.post('/generate-test-questions', auth, generateTestQuestions);

module.exports = router;
