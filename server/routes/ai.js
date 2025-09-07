const express = require('express');
const { auth } = require('../middleware/auth');
const {
    analyzeProfile,
    generateTest,
    getCareerAdvice,
    getRecommendedCertificates,
    getRecommendedTests,
    checkHealth
} = require('../controllers/aiController');

const router = express.Router();

// @route   POST /api/ai/analyze-profile
// @desc    Analyze user profile and generate recommendations
// @access  Private
router.post('/analyze-profile', auth, analyzeProfile);

// @route   POST /api/ai/generate-test
// @desc    Generate AI-powered test questions
// @access  Private
router.post('/generate-test', auth, generateTest);

// @route   POST /api/ai/career-advice
// @desc    Get personalized career advice
// @access  Private
router.post('/career-advice', auth, getCareerAdvice);

// @route   GET /api/ai/recommendations/certificates
// @desc    Get AI-recommended certificates based on user profile
// @access  Private
router.get('/recommendations/certificates', auth, getRecommendedCertificates);

// @route   GET /api/ai/recommendations/tests
// @desc    Get AI-recommended tests based on user profile
// @access  Private
router.get('/recommendations/tests', auth, getRecommendedTests);

// @route   GET /api/ai/health
// @desc    Check AI service health
// @access  Public
router.get('/health', checkHealth);

module.exports = router;
