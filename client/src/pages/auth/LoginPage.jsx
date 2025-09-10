import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';
import LP from './LoginPage.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return undefined;
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        return undefined;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setGeneralError(''); // Clear general error when user types

        // Real-time validation
        if (name === 'email') {
            const emailError = validateEmail(value);
            setErrors(prev => ({ ...prev, email: emailError }));
        } else if (name === 'password') {
            const passwordError = validatePassword(value);
            setErrors(prev => ({ ...prev, password: passwordError }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setIsSubmitting(true);
        setGeneralError('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Navigate to dashboard on successful login
                navigate('/dashboard');
            } else {
                setGeneralError(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={LP.container}>
            <div className={LP.loginCard}>
                <div className={LP.logoContainer}>
                    <Link to="/" className={LP.logoLink}>
                        <img
                            src={logo}
                            alt="ElevateAI Logo"
                            className={LP.logo}
                        />
                        <span className={LP.logoText}>ElevateAI</span>
                    </Link>
                </div>

                <div className={LP.header}>
                    <h1 className={LP.title}>Welcome Back</h1>
                    <p className={LP.subtitle}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className={LP.form}>
                    {generalError && (
                        <div className={LP.errorMessage}>
                            {generalError}
                        </div>
                    )}

                    <div className={LP.inputGroup}>
                        <label htmlFor="email" className={LP.label}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`${LP.input} ${errors.email ? LP.inputError : ''}`}
                            placeholder="Enter your email"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <span className={LP.errorMessage}>{errors.email}</span>
                        )}
                    </div>

                    <div className={LP.inputGroup}>
                        <label htmlFor="password" className={LP.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`${LP.input} ${errors.password ? LP.inputError : ''}`}
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <span className={LP.errorMessage}>{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${LP.submitButton} ${isSubmitting ? LP.submitButtonLoading : ''}`}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className={LP.footer}>
                    <Link to="/forgot-password" className={LP.forgotPassword}>
                        Forgot your password?
                    </Link>
                    <div className={LP.signupLink}>
                        Don't have an account? <Link to="/signup" className={LP.signupText}>Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;