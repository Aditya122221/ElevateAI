const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const EmailVerification = require('../models/EmailVerification');
const emailService = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @desc    Register user (send verification email)
// @access  Public
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Check if there's already a pending verification for this email
        const existingVerification = await EmailVerification.findOne({ email, isVerified: false });
        if (existingVerification) {
            return res.status(400).json({
                message: 'A verification email has already been sent to this address. Please check your email or wait before requesting another.'
            });
        }

        // Create verification record
        const verification = await EmailVerification.createVerification(email, { name, password });

        // Send verification email
        await emailService.sendVerificationEmail(email, name, verification.token);

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
            email: email,
            requiresVerification: true
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Login user
// @access  Public
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get current user
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('profile');

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email and create user account
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token } = req.body;

        // Verify token and get user data
        const verification = await EmailVerification.verifyToken(token);
        const { email, userData } = verification;

        // Check if user already exists (in case of double verification)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already verified and account exists' });
        }

        // Create user account
        const user = new User({
            name: userData.name,
            email: email,
            password: userData.password
        });
        await user.save();

        // Generate token
        const authToken = generateToken(user._id);

        res.status(201).json({
            message: 'Email verified successfully! Your account has been created.',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        if (error.message === 'Invalid or expired verification token') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error during email verification' });
    }
};

// @desc    Resend verification email
// @access  Public
const resendVerification = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already verified and account exists' });
        }

        // Check if there's a pending verification
        const existingVerification = await EmailVerification.findOne({ email, isVerified: false });
        if (!existingVerification) {
            return res.status(400).json({ message: 'No pending verification found for this email' });
        }

        // Send verification email again
        await emailService.sendVerificationEmail(email, existingVerification.userData.name, existingVerification.token);

        res.json({
            message: 'Verification email sent successfully! Please check your email.'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Server error during resend verification' });
    }
};

// @desc    Request password reset
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist.' });
        }

        // Generate password reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error during password reset request' });
    }
};

// @desc    Reset user password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token } = req.params;
        const { password } = req.body;

        // Hash the token to compare with the stored hashed token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
};

// @desc    Logout user (client-side token removal)
// @access  Private
const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    getCurrentUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    logout
};
