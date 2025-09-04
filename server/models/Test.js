const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Test title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Test description is required']
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
            'soft-skills',
            'general'
        ]
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: [true, 'Difficulty level is required']
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Duration is required']
    },
    questions: [{
        question: {
            type: String,
            required: [true, 'Question is required']
        },
        type: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'fill-blank', 'code'],
            required: [true, 'Question type is required']
        },
        options: [String], // for multiple choice
        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Correct answer is required']
        },
        explanation: String,
        points: {
            type: Number,
            default: 1
        },
        timeLimit: Number // in seconds, optional
    }],
    totalPoints: {
        type: Number,
        required: [true, 'Total points is required']
    },
    passingScore: {
        type: Number,
        required: [true, 'Passing score is required']
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [String],
    prerequisites: [String],
    skills: [String],
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
testSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Test', testSchema);
