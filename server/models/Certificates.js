const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        trim: true
    },
    skills: [{
        type: String,
        trim: true
    }],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    credentialId: {
        type: String,
        trim: true
    },
    verificationUrl: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    }
});

const certificatesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    certificates: [certificateSchema]
}, {
    timestamps: true
});

// Index for faster queries
certificatesSchema.index({ user: 1 });

module.exports = mongoose.model('Certificates', certificatesSchema);
