const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        points: Number,
        timeSpent: Number // in seconds
    }],
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    timeSpent: {
        type: Number, // in seconds
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        default: 1
    },
    startedAt: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date,
        required: true
    },
    feedback: {
        strengths: [String],
        weaknesses: [String],
        recommendations: [String],
        overallComment: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique attempts per user per test
testResultSchema.index({ user: 1, test: 1, attemptNumber: 1 }, { unique: true });

module.exports = mongoose.model('TestResult', testResultSchema);
