const express = require('express');
const Certificate = require('../models/Certificate');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/certificates
// @desc    Get all certificates with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            category,
            difficulty,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const certificates = await Certificate.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-reviews'); // Exclude reviews for list view

        const total = await Certificate.countDocuments(filter);

        res.json({
            certificates,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
                hasNext: skip + certificates.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Certificates fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching certificates' });
    }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate || !certificate.isActive) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({ certificate });
    } catch (error) {
        console.error('Certificate fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching certificate' });
    }
});

// @route   POST /api/certificates
// @desc    Create new certificate (Admin only)
// @access  Private/Admin
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();

        res.status(201).json({
            message: 'Certificate created successfully',
            certificate
        });
    } catch (error) {
        console.error('Certificate creation error:', error);
        res.status(500).json({ message: 'Server error while creating certificate' });
    }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate (Admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({
            message: 'Certificate updated successfully',
            certificate
        });
    } catch (error) {
        console.error('Certificate update error:', error);
        res.status(500).json({ message: 'Server error while updating certificate' });
    }
});

// @route   DELETE /api/certificates/:id
// @desc    Delete certificate (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        console.error('Certificate delete error:', error);
        res.status(500).json({ message: 'Server error while deleting certificate' });
    }
});

// @route   POST /api/certificates/:id/reviews
// @desc    Add review to certificate
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const certificate = await Certificate.findById(req.params.id);

        if (!certificate || !certificate.isActive) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Check if user already reviewed this certificate
        const existingReview = certificate.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this certificate' });
        }

        // Add review
        certificate.reviews.push({
            user: req.user.id,
            rating,
            comment
        });

        // Update average rating
        const totalRating = certificate.reviews.reduce((sum, review) => sum + review.rating, 0);
        certificate.rating.average = totalRating / certificate.reviews.length;
        certificate.rating.count = certificate.reviews.length;

        await certificate.save();

        res.json({
            message: 'Review added successfully',
            review: certificate.reviews[certificate.reviews.length - 1]
        });
    } catch (error) {
        console.error('Review creation error:', error);
        res.status(500).json({ message: 'Server error while adding review' });
    }
});

// @route   GET /api/certificates/categories/list
// @desc    Get list of all certificate categories
// @access  Public
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Certificate.distinct('category', { isActive: true });
        res.json({ categories });
    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
});

module.exports = router;
