const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Basic Details - Required
    basicDetails: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        linkedin: {
            type: String,
            required: [true, 'LinkedIn profile is required'],
            trim: true
        },
        github: {
            type: String,
            required: [true, 'GitHub profile is required'],
            trim: true
        },
        profilePicture: {
            type: String, // Cloudinary URL
            default: null
        },
        // Optional social links
        twitter: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true
        },
        portfolio: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },
    careerInfo: {
        currentRole: String,
        desiredRole: String, // Made optional since we're using desiredJobRoles array
        experienceLevel: String, // Made optional since we're not collecting this
        industry: String,
        salaryExpectation: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            }
        }
    },
    // Skills - Required
    skills: {
        languages: [String],
        technologies: [String],
        frameworks: [String],
        tools: [String],
        softSkills: [String]
    },
    // Projects - Optional
    projects: [{
        name: {
            type: String,
            required: true
        },
        details: [String],
        githubLink: {
            type: String // Made optional since it's not always required
        },
        liveUrl: {
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        skillsUsed: [{
            type: String
        }],
        image: {
            type: String // Cloudinary URL
        }
    }],

    // Certificates - Optional
    certificates: [{
        name: {
            type: String,
            required: true
        },
        platform: {
            type: String,
            required: true
        },
        skills: [String],
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        credentialId: {
            type: String
        },
        verificationUrl: {
            type: String
        },
        certificateUrl: {
            type: String // Cloudinary URL for certificate image
        }
    }],

    // Experience - Optional
    experience: [{
        companyName: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        skills: [String],
        achievements: [String],
        description: {
            type: String
        }
    }],

    // Job Roles - Required
    desiredJobRoles: [{
        type: String,
        required: true
        // Removed enum constraint to allow custom job roles
    }],

    // Profile completion tracking
    completionStatus: {
        basicDetails: { type: Boolean, default: false },
        skills: { type: Boolean, default: false },
        projects: { type: Boolean, default: false },
        certificates: { type: Boolean, default: false },
        experience: { type: Boolean, default: false },
        jobRoles: { type: Boolean, default: false }
    },

    // Last completed step
    lastCompletedStep: { type: Number, default: 0 },

    // Profile completion percentage
    completionPercentage: { type: Number, default: 0 },

    // Legacy fields for backward compatibility
    interests: [String],
    goals: {
        shortTerm: [String],
        longTerm: [String]
    },
    education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: Number,
        description: String
    }],
    preferences: {
        workType: {
            type: [String],
            enum: ['remote', 'hybrid', 'onsite']
        },
        companySize: {
            type: [String],
            enum: ['startup', 'small', 'medium', 'large', 'enterprise']
        },
        learningStyle: {
            type: String,
            enum: ['visual', 'auditory', 'kinesthetic', 'reading']
        }
    },
    aiRecommendations: {
        suggestedSkills: [String],
        suggestedCertifications: [String],
        careerPath: [String],
        lastUpdated: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
profileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Calculate completion status
    this.completionStatus.basicDetails = Boolean(
        this.basicDetails?.firstName &&
        this.basicDetails?.lastName &&
        this.basicDetails?.email &&
        this.basicDetails?.phone &&
        this.basicDetails?.linkedin &&
        this.basicDetails?.github
    );

    this.completionStatus.skills = Boolean(
        Object.values(this.skills || {}).some(skillArray =>
            Array.isArray(skillArray) && skillArray.length > 0
        )
    );

    this.completionStatus.projects = Boolean(
        Array.isArray(this.projects) && this.projects.length > 0
    );

    this.completionStatus.certificates = Boolean(
        Array.isArray(this.certificates) && this.certificates.length > 0
    );

    this.completionStatus.experience = Boolean(
        Array.isArray(this.experience) && this.experience.length > 0
    );

    this.completionStatus.jobRoles = Boolean(
        Array.isArray(this.desiredJobRoles) && this.desiredJobRoles.length > 0
    );

    // Calculate last completed step
    const steps = ['basicDetails', 'skills', 'projects', 'certificates', 'experience', 'jobRoles'];
    let lastStep = 0;
    steps.forEach((step, index) => {
        if (this.completionStatus[step]) {
            lastStep = index + 1;
        }
    });
    this.lastCompletedStep = lastStep;

    // Calculate completion percentage
    const totalSteps = 6;
    const completedSteps = Object.values(this.completionStatus).filter(Boolean).length;
    this.completionPercentage = Math.round((completedSteps / totalSteps) * 100);

    next();
});

module.exports = mongoose.model('Profile', profileSchema);
