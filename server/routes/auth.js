const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const EmailVerification = require('../models/EmailVerification');
const emailService = require('../services/emailService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @route   POST /api/auth/register
// @desc    Register user (send verification email)
// @access  Public
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
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
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
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
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('profile');

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email and create user account
// @access  Public
router.post('/verify-email', [
    body('token').notEmpty().withMessage('Verification token is required')
], async (req, res) => {
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
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
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
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.json({ message: 'Logout successful' });
});

module.exports = router;
