const express = require('express');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, [
    body('personalInfo.firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('personalInfo.lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('careerInfo.desiredRole').trim().isLength({ min: 1 }).withMessage('Desired role is required'),
    body('careerInfo.experienceLevel').isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']).withMessage('Valid experience level is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profileData = req.body;
        profileData.user = req.user.id;

        // Check if profile already exists
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            profile = new Profile(profileData);
            await profile.save();
        }

        // Update user's profile reference and completion status
        await User.findByIdAndUpdate(req.user.id, {
            profile: profile._id,
            isProfileComplete: true
        });

        res.json({
            message: 'Profile saved successfully',
            profile
        });
    } catch (error) {
        console.error('Profile save error:', error);
        res.status(500).json({ message: 'Server error while saving profile' });
    }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ profile });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// @route   DELETE /api/profile
// @desc    Delete user profile
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update user's profile completion status
        await User.findByIdAndUpdate(req.user.id, {
            $unset: { profile: 1 },
            isProfileComplete: false
        });

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Profile delete error:', error);
        res.status(500).json({ message: 'Server error while deleting profile' });
    }
});

// @route   GET /api/profile/recommendations
// @desc    Get AI recommendations for user
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        // Return existing recommendations or empty array
        const recommendations = profile.aiRecommendations || {
            suggestedSkills: [],
            suggestedCertifications: [],
            careerPath: [],
            lastUpdated: null
        };

        res.json({ recommendations });
    } catch (error) {
        console.error('Recommendations fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching recommendations' });
    }
});

module.exports = router;
