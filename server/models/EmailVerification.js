const mongoose = require('mongoose');
const crypto = require('crypto');

const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userData: {
        name: String,
        password: String
    }
}, {
    timestamps: true
});

// Index for automatic cleanup of expired tokens
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate verification token
emailVerificationSchema.statics.generateToken = function () {
    return crypto.randomBytes(32).toString('hex');
};

// Create verification record
emailVerificationSchema.statics.createVerification = async function (email, userData) {
    // Remove any existing verification for this email
    await this.deleteMany({ email });

    const token = this.generateToken();
    const verification = new this({
        email,
        token,
        userData
    });

    return await verification.save();
};

// Verify token and get user data
emailVerificationSchema.statics.verifyToken = async function (token) {
    const verification = await this.findOne({
        token,
        expiresAt: { $gt: new Date() },
        isVerified: false
    });

    if (!verification) {
        throw new Error('Invalid or expired verification token');
    }

    // Mark as verified
    verification.isVerified = true;
    await verification.save();

    return verification;
};

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
