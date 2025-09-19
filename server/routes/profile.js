const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { uploadProfilePicture, uploadProjectImage } = require('../services/cloudinaryService');
const {
    saveBasicDetails,
    getBasicDetails,
    deleteProfilePicture,
    saveSkills,
    getSkills,
    saveProjects,
    getProjects,
    saveCertifications,
    getCertifications,
    saveExperience,
    getExperience,
    saveJobRoles,
    getJobRoles,
    completeProfile,
    uploadProfilePictureController,
    uploadProjectImageController,
} = require('../controllers/profileController');

const router = express.Router();

// Legacy profile routes removed - using section-based approach

// @route   POST /api/profile/upload-profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-picture', auth, uploadProfilePicture.single('profilePicture'), uploadProfilePictureController);

// @route   POST /api/profile/upload-project-image
// @desc    Upload project image
// @access  Private
router.post('/upload-project-image', auth, uploadProjectImage.single('projectImage'), uploadProjectImageController);

// Certificate image upload route removed

// @route   POST /api/profile/save-progress
// @desc    Save profile progress (checkpoint)
// @access  Private
router.post('/save-progress', auth, async (req, res) => {
    try {
        const profileData = req.body;
        profileData.user = req.user.id;

        // Check if profile already exists
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing profile with new data
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

        res.json({
            message: 'Profile progress saved successfully',
            profile: {
                completionStatus: profile.completionStatus,
                lastCompletedStep: profile.lastCompletedStep,
                completionPercentage: profile.completionPercentage
            }
        });
    } catch (error) {
        console.error('Profile progress save error:', error);
        res.status(500).json({ message: 'Server error while saving profile progress' });
    }
});

// @route   GET /api/profile/progress
// @desc    Get profile progress status
// @access  Private
router.get('/progress', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.json({
                hasProfile: false,
                completionStatus: {
                    basicDetails: false,
                    skills: false,
                    projects: false,
                    certificates: false,
                    experience: false,
                    jobRoles: false
                },
                lastCompletedStep: 0,
                completionPercentage: 0
            });
        }

        res.json({
            hasProfile: true,
            completionStatus: profile.completionStatus,
            lastCompletedStep: profile.lastCompletedStep,
            completionPercentage: profile.completionPercentage,
            profileData: profile
        });
    } catch (error) {
        console.error('Profile progress fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching profile progress' });
    }
});

// ==================== SECTION-SPECIFIC ROUTES ====================

// @route   POST /api/profile/basic-details
// @desc    Save basic details section
// @access  Private
router.post('/basic-details', auth, [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
    body('linkedin').trim().isLength({ min: 1 }).withMessage('LinkedIn profile is required'),
    body('github').trim().isLength({ min: 1 }).withMessage('GitHub profile is required')
], saveBasicDetails);

// @route   GET /api/profile/basic-details
// @desc    Get basic details section
// @access  Private
router.get('/basic-details', auth, getBasicDetails);

// @route   PUT /api/profile/basic-details
// @desc    Update basic details section
// @access  Private
router.put('/basic-details', auth, [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
    body('linkedin').trim().isLength({ min: 1 }).withMessage('LinkedIn profile is required'),
    body('github').trim().isLength({ min: 1 }).withMessage('GitHub profile is required')
], saveBasicDetails);

// @route   DELETE /api/profile/basic-details/profile-picture
// @desc    Delete profile picture
// @access  Private
router.delete('/basic-details/profile-picture', auth, deleteProfilePicture);

// @route   POST /api/profile/skills
// @desc    Save skills section
// @access  Private
router.post('/skills', auth, [
    body().custom((body) => {
        const hasSkills = body.languages?.length > 0 ||
            body.technologies?.length > 0 ||
            body.frameworks?.length > 0 ||
            body.tools?.length > 0 ||
            body.softSkills?.length > 0;
        if (!hasSkills) {
            throw new Error('At least one skill is required');
        }
        return true;
    })
], saveSkills);

// @route   GET /api/profile/skills
// @desc    Get skills section
// @access  Private
router.get('/skills', auth, getSkills);

// @route   PUT /api/profile/skills
// @desc    Update skills section
// @access  Private
router.put('/skills', auth, [
    body('languages').optional().isArray().withMessage('Languages must be an array'),
    body('technologies').optional().isArray().withMessage('Technologies must be an array'),
    body('frameworks').optional().isArray().withMessage('Frameworks must be an array'),
    body('tools').optional().isArray().withMessage('Tools must be an array'),
    body('softSkills').optional().isArray().withMessage('Soft skills must be an array')
], saveSkills);

// @route   POST /api/profile/projects
// @desc    Save projects section
// @access  Private
router.post('/projects', auth, [
    body('projects').custom((projects) => {
        if (!Array.isArray(projects)) {
            throw new Error('Projects must be an array');
        }

        // If projects exist, validate each project
        projects.forEach((project, index) => {
            if (!project.name || !project.name.trim()) {
                throw new Error(`Project ${index + 1}: Name is required`);
            }
            if (!project.startDate) {
                throw new Error(`Project ${index + 1}: Start date is required`);
            }
            if (!project.details || !Array.isArray(project.details) || project.details.length === 0) {
                throw new Error(`Project ${index + 1}: At least one detail point is required`);
            }
            if (!project.details.some(detail => detail && detail.trim())) {
                throw new Error(`Project ${index + 1}: At least one detail point must have content`);
            }
        });

        return true;
    })
], saveProjects);

// @route   GET /api/profile/projects
// @desc    Get projects section
// @access  Private
router.get('/projects', auth, getProjects);

// @route   PUT /api/profile/projects
// @desc    Update projects section
// @access  Private
router.put('/projects', auth, [
    body('projects').custom((projects) => {
        if (!Array.isArray(projects)) {
            throw new Error('Projects must be an array');
        }

        // If projects exist, validate each project
        projects.forEach((project, index) => {
            if (!project.name || !project.name.trim()) {
                throw new Error(`Project ${index + 1}: Name is required`);
            }
            if (!project.startDate) {
                throw new Error(`Project ${index + 1}: Start date is required`);
            }
            if (!project.details || !Array.isArray(project.details) || project.details.length === 0) {
                throw new Error(`Project ${index + 1}: At least one detail point is required`);
            }
            if (!project.details.some(detail => detail && detail.trim())) {
                throw new Error(`Project ${index + 1}: At least one detail point must have content`);
            }
        });

        return true;
    })
], saveProjects);

// @route   POST /api/profile/certifications
// @desc    Save certifications section
// @access  Private
router.post('/certifications', auth, [
    body('certifications').isArray().withMessage('Certifications must be an array'),
    body('certifications.*.name').notEmpty().withMessage('Certification name is required'),
    body('certifications.*.platform').notEmpty().withMessage('Platform is required'),
    body('certifications.*.startDate').isISO8601().withMessage('Valid start date is required')
], saveCertifications);

// @route   GET /api/profile/certifications
// @desc    Get certifications section
// @access  Private
router.get('/certifications', auth, getCertifications);

// @route   PUT /api/profile/certifications
// @desc    Update certifications section
// @access  Private
router.put('/certifications', auth, [
    body('certifications').custom((certifications) => {
        if (!Array.isArray(certifications)) {
            throw new Error('Certifications must be an array');
        }

        // If certifications exist, validate each certification
        certifications.forEach((cert, index) => {
            if (!cert.name || !cert.name.trim()) {
                throw new Error(`Certification ${index + 1}: Name is required`);
            }
            if (!cert.platform || !cert.platform.trim()) {
                throw new Error(`Certification ${index + 1}: Platform is required`);
            }
            if (!cert.startDate) {
                throw new Error(`Certification ${index + 1}: Start date is required`);
            }
        });

        return true;
    })
], saveCertifications);

// @route   POST /api/profile/experience
// @desc    Save experience section
// @access  Private
router.post('/experience', auth, saveExperience);

// @route   GET /api/profile/experience
// @desc    Get experience section
// @access  Private
router.get('/experience', auth, getExperience);

// @route   PUT /api/profile/experience
// @desc    Update experience section
// @access  Private
router.put('/experience', auth, saveExperience);

// @route   POST /api/profile/job-roles
// @desc    Save job roles section
// @access  Private
router.post('/job-roles', auth, [
    body('desiredJobRoles').isArray({ min: 1 }).withMessage('At least one job role is required')
], saveJobRoles);

// @route   GET /api/profile/job-roles
// @desc    Get job roles section
// @access  Private
router.get('/job-roles', auth, getJobRoles);

// @route   PUT /api/profile/job-roles
// @desc    Update job roles section
// @access  Private
router.put('/job-roles', auth, [
    body('desiredJobRoles').isArray({ min: 1 }).withMessage('At least one job role is required'),
    body('desiredJobRoles.*').notEmpty().withMessage('Job role cannot be empty')
], saveJobRoles);


// @route   POST /api/profile/complete
// @desc    Complete profile by combining all sections
// @access  Private
router.post('/complete', auth, completeProfile);

module.exports = router;
