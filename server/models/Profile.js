const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalInfo: {
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
        age: {
            type: Number,
            min: [16, 'Age must be at least 16'],
            max: [100, 'Age must be less than 100']
        },
        location: {
            country: String,
            city: String
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },
    careerInfo: {
        currentRole: String,
        desiredRole: {
            type: String,
            required: [true, 'Desired role is required']
        },
        experienceLevel: {
            type: String,
            enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
            required: [true, 'Experience level is required']
        },
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
    skills: {
        technical: [{
            name: String,
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            },
            yearsOfExperience: Number
        }],
        soft: [{
            name: String,
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            }
        }],
        languages: [{
            name: String,
            proficiency: {
                type: String,
                enum: ['basic', 'conversational', 'professional', 'native']
            }
        }]
    },
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
    certifications: [{
        name: String,
        provider: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        verificationUrl: String
    }],
    workExperience: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
        achievements: [String]
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
    next();
});

module.exports = mongoose.model('Profile', profileSchema);
