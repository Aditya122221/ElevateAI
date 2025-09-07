const Profile = require('../models/Profile');
const BasicDetails = require('../models/BasicDetails');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const Certificates = require('../models/Certificates');
const Experience = require('../models/Experience');
const JobRoles = require('../models/JobRoles');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { uploadProfilePicture, uploadProjectImage, uploadCertificateImage } = require('../services/cloudinaryService');

// @desc    Create or update user profile (legacy endpoint)
// @access  Private
const createOrUpdateProfile = async (req, res) => {
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
};

// @desc    Get user profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', 'name email');

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ profile });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
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
};

// @desc    Delete user profile
// @access  Private
const deleteProfile = async (req, res) => {
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
};

// @desc    Get AI recommendations for user
// @access  Private
const getRecommendations = async (req, res) => {
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
};

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

// @desc    Save certificates
// @access  Private
const saveCertificates = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const certificatesData = req.body;
        certificatesData.user = req.user.id;

        let certificates = await Certificates.findOne({ user: req.user.id });

        if (certificates) {
            certificates = await Certificates.findOneAndUpdate(
                { user: req.user.id },
                { $set: certificatesData },
                { new: true, runValidators: true }
            );
        } else {
            certificates = new Certificates(certificatesData);
            await certificates.save();
        }

        res.json({
            message: 'Certificates saved successfully',
            data: certificates
        });
    } catch (error) {
        console.error('Certificates save error:', error);
        res.status(500).json({ message: 'Server error while saving certificates' });
    }
};

// @desc    Get certificates
// @access  Private
const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificates.findOne({ user: req.user.id });

        res.json({ data: certificates });
    } catch (error) {
        console.error('Certificates fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching certificates' });
    }
};

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

// @desc    Complete profile by combining all sections
// @access  Private
const completeProfile = async (req, res) => {
    try {
        // Get all sections data
        const [basicDetails, skills, projects, certificates, experience, jobRoles] = await Promise.allSettled([
            BasicDetails.findOne({ user: req.user.id }),
            Skills.findOne({ user: req.user.id }),
            Projects.findOne({ user: req.user.id }),
            Certificates.findOne({ user: req.user.id }),
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

        // Create or update the main Profile document
        const profileData = {
            user: req.user.id,
            basicDetails: {
                firstName: basicDetails.value.firstName,
                lastName: basicDetails.value.lastName,
                email: basicDetails.value.email,
                phone: basicDetails.value.phone,
                linkedin: basicDetails.value.linkedin,
                github: basicDetails.value.github,
                profilePicture: basicDetails.value.profilePicture || '',
                twitter: basicDetails.value.twitter || '',
                website: basicDetails.value.website || '',
                portfolio: basicDetails.value.portfolio || '',
                bio: basicDetails.value.bio || ''
            },
            skills: {
                languages: skills.value.languages || [],
                technologies: skills.value.technologies || [],
                frameworks: skills.value.frameworks || [],
                tools: skills.value.tools || [],
                softSkills: skills.value.softSkills || []
            },
            projects: projects.value?.projects || [],
            certificates: certificates.value?.certificates || [],
            experience: experience.value?.experiences || [],
            desiredJobRoles: jobRoles.value.desiredJobRoles || []
        };

        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileData },
                { new: true, runValidators: true }
            );
        } else {
            profile = new Profile(profileData);
            await profile.save();
        }

        // Update user's profile completion status
        await User.findByIdAndUpdate(req.user.id, {
            profile: profile._id,
            isProfileComplete: true
        });

        res.json({
            message: 'Profile completed successfully',
            profile
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

// @desc    Upload profile picture
// @access  Private
const uploadProfilePictureController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
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
            return res.status(400).json({ message: 'No file uploaded' });
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

// @desc    Upload certificate image
// @access  Private
const uploadCertificateImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadCertificateImage(req.file);

        res.json({
            message: 'Certificate image uploaded successfully',
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Certificate image upload error:', error);
        res.status(500).json({ message: 'Server error while uploading certificate image' });
    }
};

module.exports = {
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
};
