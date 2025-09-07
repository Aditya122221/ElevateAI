const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
    getAllCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    addReview,
    getCategories
} = require('../controllers/certificatesController');

const router = express.Router();

// @route   GET /api/certificates
// @desc    Get all certificates with optional filtering
// @access  Public
router.get('/', getAllCertificates);

// @route   GET /api/certificates/:id
// @desc    Get single certificate by ID
// @access  Public
router.get('/:id', getCertificateById);

// @route   POST /api/certificates
// @desc    Create new certificate (Admin only)
// @access  Private/Admin
router.post('/', auth, adminAuth, createCertificate);

// @route   PUT /api/certificates/:id
// @desc    Update certificate (Admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, updateCertificate);

// @route   DELETE /api/certificates/:id
// @desc    Delete certificate (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteCertificate);

// @route   POST /api/certificates/:id/reviews
// @desc    Add review to certificate
// @access  Private
router.post('/:id/reviews', auth, addReview);

// @route   GET /api/certificates/categories/list
// @desc    Get list of all certificate categories
// @access  Public
router.get('/categories/list', getCategories);

module.exports = router;
