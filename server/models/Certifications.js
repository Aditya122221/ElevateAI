const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
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
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    }
});

const certificationsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    certifications: [certificationSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Certifications', certificationsSchema);
