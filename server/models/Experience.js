const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    skills: [{
        type: String,
        trim: true
    }],
    achievements: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        trim: true
    }
});

const experiencesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    experiences: [experienceSchema]
}, {
    timestamps: true
});

// Index for faster queries
experiencesSchema.index({ user: 1 });

module.exports = mongoose.model('Experience', experiencesSchema);
