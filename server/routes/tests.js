const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
    getAllTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest,
    startTest,
    submitTest,
    getUserTestResults,
    getTestResults
} = require('../controllers/testsController');

const router = express.Router();

// @route   GET /api/tests
// @desc    Get all tests with optional filtering
// @access  Public
router.get('/', getAllTests);

// @route   GET /api/tests/:id
// @desc    Get single test by ID
// @access  Public
router.get('/:id', getTestById);

// @route   POST /api/tests
// @desc    Create new test (Admin only)
// @access  Private/Admin
router.post('/', auth, adminAuth, createTest);

// @route   PUT /api/tests/:id
// @desc    Update test (Admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, updateTest);

// @route   DELETE /api/tests/:id
// @desc    Delete test (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteTest);

// @route   POST /api/tests/:id/start
// @desc    Start a test
// @access  Private
router.post('/:id/start', auth, startTest);

// @route   POST /api/tests/:id/submit
// @desc    Submit test answers
// @access  Private
router.post('/:id/submit', auth, submitTest);

// @route   GET /api/tests/user/results
// @desc    Get all user's test results
// @access  Private
router.get('/user/results', auth, getUserTestResults);

// @route   GET /api/tests/:id/results
// @desc    Get user's test results for a specific test
// @access  Private
router.get('/:id/results', auth, getTestResults);

module.exports = router;
