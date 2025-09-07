const mongoose = require('mongoose');

const basicDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    linkedin: {
        type: String,
        required: true,
        trim: true
    },
    github: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: '',
        trim: true
    },
    website: {
        type: String,
        default: '',
        trim: true
    },
    portfolio: {
        type: String,
        default: '',
        trim: true
    },
    bio: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
basicDetailsSchema.index({ user: 1 });

module.exports = mongoose.model('BasicDetails', basicDetailsSchema);
