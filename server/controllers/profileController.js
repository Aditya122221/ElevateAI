// Profile model removed - using section-based approach
const BasicDetails = require('../models/BasicDetails');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const Certifications = require('../models/Certifications');
const Experience = require('../models/Experience');
const JobRoles = require('../models/JobRoles');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { uploadProfilePicture, uploadProjectImage } = require('../services/cloudinaryService');

// ==================== BASIC DETAILS ====================

// @desc    Save basic details
// @access  Private
const saveBasicDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const basicDetailsData = req.body;
        basicDetailsData.user = req.user.id;

        let basicDetails = await BasicDetails.findOne({ user: req.user.id });

        if (basicDetails) {
            basicDetails = await BasicDetails.findOneAndUpdate(
                { user: req.user.id },
                { $set: basicDetailsData },
                { new: true, runValidators: true }
            );
        } else {
            basicDetails = new BasicDetails(basicDetailsData);
            await basicDetails.save();
        }

        res.json({
            message: 'Basic details saved successfully',
            data: basicDetails
        });
    } catch (error) {
        console.error('Basic details save error:', error);
        res.status(500).json({ message: 'Server error while saving basic details' });
    }
};

// @desc    Get basic details
// @access  Private
const getBasicDetails = async (req, res) => {
    try {
        const basicDetails = await BasicDetails.findOne({ user: req.user.id });

        res.json({ data: basicDetails });
    } catch (error) {
        console.error('Basic details fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching basic details' });
    }
};

// ==================== SKILLS ====================

// @desc    Save skills
// @access  Private
const saveSkills = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const skillsData = req.body;
        skillsData.user = req.user.id;

        let skills = await Skills.findOne({ user: req.user.id });

        if (skills) {
            skills = await Skills.findOneAndUpdate(
                { user: req.user.id },
                { $set: skillsData },
                { new: true, runValidators: true }
            );
        } else {
            skills = new Skills(skillsData);
            await skills.save();
        }

        res.json({
            message: 'Skills saved successfully',
            data: skills
        });
    } catch (error) {
        console.error('Skills save error:', error);
        res.status(500).json({ message: 'Server error while saving skills' });
    }
};

// @desc    Get skills
// @access  Private
const getSkills = async (req, res) => {
    try {
        const skills = await Skills.findOne({ user: req.user.id });

        res.json({ data: skills });
    } catch (error) {
        console.error('Skills fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching skills' });
    }
};

// ==================== PROJECTS ====================

// @desc    Save projects
// @access  Private
const saveProjects = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const projectsData = req.body;
        projectsData.user = req.user.id;

        let projects = await Projects.findOne({ user: req.user.id });

        if (projects) {
            projects = await Projects.findOneAndUpdate(
                { user: req.user.id },
                { $set: projectsData },
                { new: true, runValidators: true }
            );
        } else {
            projects = new Projects(projectsData);
            await projects.save();
        }

        res.json({
            message: 'Projects saved successfully',
            data: projects
        });
    } catch (error) {
        console.error('Projects save error:', error);
        res.status(500).json({ message: 'Server error while saving projects' });
    }
};

// @desc    Get projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Projects.findOne({ user: req.user.id });

        res.json({ data: projects });
    } catch (error) {
        console.error('Projects fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching projects' });
    }
};

// ==================== CERTIFICATIONS ====================

// @desc    Save certifications
// @access  Private
const saveCertifications = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const certificationsData = req.body;
        certificationsData.user = req.user.id;

        let certifications = await Certifications.findOne({ user: req.user.id });

        if (certifications) {
            certifications = await Certifications.findOneAndUpdate(
                { user: req.user.id },
                { $set: certificationsData },
                { new: true, runValidators: true }
            );
        } else {
            certifications = new Certifications(certificationsData);
            await certifications.save();
        }

        res.json({
            message: 'Certifications saved successfully',
            data: certifications
        });
    } catch (error) {
        console.error('Certifications save error:', error);
        res.status(500).json({ message: 'Server error while saving certifications' });
    }
};

// @desc    Get certifications
// @access  Private
const getCertifications = async (req, res) => {
    try {
        const certifications = await Certifications.findOne({ user: req.user.id });

        res.json({ data: certifications });
    } catch (error) {
        console.error('Certifications fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching certifications' });
    }
};

// ==================== EXPERIENCE ====================

// @desc    Save experience
// @access  Private
const saveExperience = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const experienceData = req.body;
        experienceData.user = req.user.id;

        let experience = await Experience.findOne({ user: req.user.id });

        if (experience) {
            experience = await Experience.findOneAndUpdate(
                { user: req.user.id },
                { $set: experienceData },
                { new: true, runValidators: true }
            );
        } else {
            experience = new Experience(experienceData);
            await experience.save();
        }

        res.json({
            message: 'Experience saved successfully',
            data: experience
        });
    } catch (error) {
        console.error('Experience save error:', error);
        res.status(500).json({ message: 'Server error while saving experience' });
    }
};

// @desc    Get experience
// @access  Private
const getExperience = async (req, res) => {
    try {
        const experience = await Experience.findOne({ user: req.user.id });

        res.json({ data: experience });
    } catch (error) {
        console.error('Experience fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching experience' });
    }
};

// ==================== JOB ROLES ====================

// @desc    Save job roles
// @access  Private
const saveJobRoles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const jobRolesData = req.body;
        jobRolesData.user = req.user.id;

        let jobRoles = await JobRoles.findOne({ user: req.user.id });

        if (jobRoles) {
            jobRoles = await JobRoles.findOneAndUpdate(
                { user: req.user.id },
                { $set: jobRolesData },
                { new: true, runValidators: true }
            );
        } else {
            jobRoles = new JobRoles(jobRolesData);
            await jobRoles.save();
        }

        res.json({
            message: 'Job roles saved successfully',
            data: jobRoles
        });
    } catch (error) {
        console.error('Job roles save error:', error);
        res.status(500).json({ message: 'Server error while saving job roles' });
    }
};

// @desc    Get job roles
// @access  Private
const getJobRoles = async (req, res) => {
    try {
        const jobRoles = await JobRoles.findOne({ user: req.user.id });

        res.json({ data: jobRoles });
    } catch (error) {
        console.error('Job roles fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching job roles' });
    }
};

// ==================== PROFILE COMPLETION ====================

// @desc    Complete profile by combining all sections
// @access  Private
const completeProfile = async (req, res) => {
    try {
        // Get all sections data
        const [basicDetails, skills, projects, certifications, experience, jobRoles] = await Promise.allSettled([
            BasicDetails.findOne({ user: req.user.id }),
            Skills.findOne({ user: req.user.id }),
            Projects.findOne({ user: req.user.id }),
            Certifications.findOne({ user: req.user.id }),
            Experience.findOne({ user: req.user.id }),
            JobRoles.findOne({ user: req.user.id })
        ]);

        // Only validate the absolutely required sections
        if (!basicDetails.value) {
            return res.status(400).json({
                message: 'Basic details are required to complete profile',
                missingSection: 'basicDetails'
            });
        }

        if (!skills.value) {
            return res.status(400).json({
                message: 'Skills are required to complete profile',
                missingSection: 'skills'
            });
        }

        if (!jobRoles.value || !jobRoles.value.desiredJobRoles || jobRoles.value.desiredJobRoles.length === 0) {
            return res.status(400).json({
                message: 'At least one job role is required to complete profile',
                missingSection: 'jobRoles'
            });
        }

        // All section data is already saved in individual collections
        // Just update user's profile completion status
        await User.findByIdAndUpdate(req.user.id, {
            isProfileComplete: true
        });

        res.json({
            message: 'Profile completed successfully',
            sections: {
                basicDetails: !!basicDetails.value,
                skills: !!skills.value,
                projects: !!projects.value,
                certifications: !!certifications.value,
                experience: !!experience.value,
                jobRoles: !!jobRoles.value
            }
        });
    } catch (error) {
        console.error('Profile completion error:', error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        }

        res.status(500).json({ message: 'Server error while completing profile' });
    }
};

// ==================== IMAGE UPLOADS ====================

// @desc    Upload profile picture
// @access  Private
const uploadProfilePictureController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const result = await uploadProfilePicture(req.file);

        res.json({
            message: 'Profile picture uploaded successfully',
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({ message: 'Server error while uploading profile picture' });
    }
};

// @desc    Upload project image
// @access  Private
const uploadProjectImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const result = await uploadProjectImage(req.file);

        res.json({
            message: 'Project image uploaded successfully',
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Project image upload error:', error);
        res.status(500).json({ message: 'Server error while uploading project image' });
    }
};

// Certificate image upload removed

module.exports = {
    // Basic Details
    saveBasicDetails,
    getBasicDetails,

    // Skills
    saveSkills,
    getSkills,

    // Projects
    saveProjects,
    getProjects,

    // Certifications
    saveCertifications,
    getCertifications,

    // Experience
    saveExperience,
    getExperience,

    // Job Roles
    saveJobRoles,
    getJobRoles,

    // Profile Completion
    completeProfile,

    // Image Uploads
    uploadProfilePictureController,
    uploadProjectImageController
};