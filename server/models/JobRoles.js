const mongoose = require('mongoose');

const jobRolesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    desiredJobRoles: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for faster queries
jobRolesSchema.index({ user: 1 });

module.exports = mongoose.model('JobRoles', jobRolesSchema);
