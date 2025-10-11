import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { API_URL } from '../../config/api';
import SP from './SignupPage.module.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password
            };

            console.log('📤 Sending registration data:', requestData);
            console.log('📤 API URL:', `${API_URL}/auth/register/`);

            const response = await fetch(`${API_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📥 Response data:', data);

            if (response.ok) {
                // Registration successful, redirect to email verification page
                console.log('✅ Registration successful!');
                navigate('/verify-email', {
                    state: {
                        email: formData.email,
                        message: data.message
                    }
                });
            } else {
                // Handle registration errors
                console.log('❌ Registration failed:', data);
                if (data.errors) {
                    console.log('📝 Setting form errors:', data.errors);
                    setErrors(data.errors);
                } else if (data.message) {
                    console.log('📝 Showing error message:', data.message);
                    setErrors({ general: data.message });
                } else {
                    console.log('📝 Showing generic error');
                    setErrors({ general: 'Registration failed. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = SP.input;
        if (errors[fieldName]) {
            return `${baseClass} ${SP.inputError}`;
        }
        if (formData[fieldName] && !errors[fieldName]) {
            return `${baseClass} ${SP.inputSuccess}`;
        }
        return baseClass;
    };

    return (
        <div className={SP.container}>
            <div className={SP.card}>
                <div className={SP.logoContainer}>
                    <Link to="/" className={SP.logoLink}>
                        <img
                            src={logo}
                            alt="ElevateAI Logo"
                            className={SP.logo}
                        />
                        <span className={SP.logoText}>ElevateAI</span>
                    </Link>
                </div>

                <div className={SP.header}>
                    <h1 className={SP.title}>Create Account</h1>
                    <p className={SP.subtitle}>Join us today and get started</p>
                </div>

                <form onSubmit={handleSubmit} className={SP.form}>
                    {/* General Error Message */}
                    {errors.general && (
                        <div className={SP.errorMessage}>
                            <AlertCircle className={SP.errorIcon} />
                            {errors.general}
                        </div>
                    )}

                    {/* Full Name Field */}
                    <div className={SP.inputGroup}>
                        <label htmlFor="fullName" className={SP.label}>
                            <User className={SP.labelIcon} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={getInputClassName('fullName')}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                            <div className={SP.errorMessage}>
                                <AlertCircle className={SP.errorIcon} />
                                {errors.fullName}
                            </div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className={SP.inputGroup}>
                        <label htmlFor="email" className={SP.label}>
                            <Mail className={SP.labelIcon} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={getInputClassName('email')}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <div className={SP.errorMessage}>
                                <AlertCircle className={SP.errorIcon} />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className={SP.inputGroup}>
                        <label htmlFor="password" className={SP.label}>
                            <Lock className={SP.labelIcon} />
                            Password
                        </label>
                        <div className={SP.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={getInputClassName('password')}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={SP.passwordToggle}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className={SP.errorMessage}>
                                <AlertCircle className={SP.errorIcon} />
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className={SP.inputGroup}>
                        <label htmlFor="confirmPassword" className={SP.label}>
                            <CheckCircle className={SP.labelIcon} />
                            Confirm Password
                        </label>
                        <div className={SP.passwordContainer}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={getInputClassName('confirmPassword')}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={SP.passwordToggle}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <div className={SP.errorMessage}>
                                <AlertCircle className={SP.errorIcon} />
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${SP.submitButton} ${isSubmitting ? SP.submitting : ''}`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className={SP.footer}>
                    <p>Already have an account? <a href="/login" className={SP.link}>Sign in</a></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;