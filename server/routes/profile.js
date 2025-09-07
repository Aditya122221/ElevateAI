const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { uploadProfilePicture, uploadProjectImage, uploadCertificateImage } = require('../services/cloudinaryService');
const {
    createOrUpdateProfile,
    getUserProfile,
    updateProfile,
    deleteProfile,
    getRecommendations,
    saveBasicDetails,
    getBasicDetails,
    saveSkills,
    getSkills,
    saveProjects,
    getProjects,
    saveCertificates,
    getCertificates,
    saveExperience,
    getExperience,
    saveJobRoles,
    getJobRoles,
    completeProfile,
    uploadProfilePictureController,
    uploadProjectImageController,
    uploadCertificateImageController
} = require('../controllers/profileController');

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, [
    // Basic Details validation
    body('basicDetails.firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('basicDetails.lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('basicDetails.email').isEmail().withMessage('Valid email is required'),
    body('basicDetails.phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
    body('basicDetails.linkedin').trim().isLength({ min: 1 }).withMessage('LinkedIn profile is required'),
    body('basicDetails.github').trim().isLength({ min: 1 }).withMessage('GitHub profile is required'),

    // Skills validation - at least one skill category must have skills
    body('skills').custom((skills) => {
        const hasSkills = skills.languages?.length > 0 ||
            skills.technologies?.length > 0 ||
            skills.frameworks?.length > 0 ||
            skills.tools?.length > 0 ||
            skills.softSkills?.length > 0;
        if (!hasSkills) {
            throw new Error('At least one skill is required');
        }
        return true;
    }),

    // Job Roles validation
    body('desiredJobRoles').isArray({ min: 1 }).withMessage('At least one job role is required')
], createOrUpdateProfile);

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, getUserProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, updateProfile);

// @route   DELETE /api/profile
// @desc    Delete user profile
// @access  Private
router.delete('/', auth, deleteProfile);

// @route   GET /api/profile/recommendations
// @desc    Get AI recommendations for user
// @access  Private
router.get('/recommendations', auth, getRecommendations);

// @route   POST /api/profile/upload-profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-picture', auth, uploadProfilePicture.single('profilePicture'), uploadProfilePictureController);

// @route   POST /api/profile/upload-project-image
// @desc    Upload project image
// @access  Private
router.post('/upload-project-image', auth, uploadProjectImage.single('projectImage'), uploadProjectImageController);

// @route   POST /api/profile/upload-certificate-image
// @desc    Upload certificate image
// @access  Private
router.post('/upload-certificate-image', auth, uploadCertificateImage.single('certificateImage'), uploadCertificateImageController);

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

// @route   POST /api/profile/certificates
// @desc    Save certificates section
// @access  Private
router.post('/certificates', auth, saveCertificates);

// @route   GET /api/profile/certificates
// @desc    Get certificates section
// @access  Private
router.get('/certificates', auth, getCertificates);

// @route   POST /api/profile/experience
// @desc    Save experience section
// @access  Private
router.post('/experience', auth, saveExperience);

// @route   GET /api/profile/experience
// @desc    Get experience section
// @access  Private
router.get('/experience', auth, getExperience);

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

// @route   POST /api/profile/complete
// @desc    Complete profile by combining all sections
// @access  Private
router.post('/complete', auth, completeProfile);

module.exports = router;
