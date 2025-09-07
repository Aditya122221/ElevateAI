const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    languages: [{
        type: String,
        trim: true
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    frameworks: [{
        type: String,
        trim: true
    }],
    tools: [{
        type: String,
        trim: true
    }],
    softSkills: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for faster queries
skillsSchema.index({ user: 1 });

module.exports = mongoose.model('Skills', skillsSchema);
