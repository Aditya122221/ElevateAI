const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Certificate name is required'],
        trim: true
    },
    provider: {
        type: String,
        required: [true, 'Provider is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'programming',
            'data-science',
            'cloud-computing',
            'cybersecurity',
            'project-management',
            'design',
            'marketing',
            'business',
            'other'
        ]
    },
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced']
        }
    }],
    topics: [String],
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: [true, 'Difficulty level is required']
    },
    prerequisites: [String],
    cost: {
        amount: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        free: {
            type: Boolean,
            default: false
        }
    },
    format: {
        type: [String],
        enum: ['online', 'in-person', 'hybrid'],
        default: ['online']
    },
    language: {
        type: String,
        default: 'English'
    },
    validity: {
        type: String,
        required: [true, 'Validity period is required']
    },
    examDetails: {
        format: {
            type: String,
            enum: ['multiple-choice', 'practical', 'essay', 'mixed']
        },
        duration: String,
        passingScore: Number,
        attempts: Number
    },
    benefits: [String],
    targetAudience: [String],
    industryRecognition: {
        type: String,
        enum: ['high', 'medium', 'low']
    },
    jobRoles: [String],
    averageSalary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    enrollmentUrl: String,
    officialWebsite: String,
    imageUrl: String,
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
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
certificateSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for search functionality
certificateSchema.index({ name: 'text', description: 'text', provider: 'text' });

module.exports = mongoose.model('Certificate', certificateSchema);
