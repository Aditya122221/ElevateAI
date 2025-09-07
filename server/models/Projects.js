const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    details: [{
        type: String,
        trim: true
    }],
    githubLink: {
        type: String,
        trim: true
    },
    liveUrl: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    skillsUsed: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: ''
    }
});

const projectsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    projects: [projectSchema]
}, {
    timestamps: true
});

// Index for faster queries
projectsSchema.index({ user: 1 });

module.exports = mongoose.model('Projects', projectsSchema);
