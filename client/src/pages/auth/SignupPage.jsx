import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './SignupPage.module.css';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await registerUser(data.name, data.email, data.password);
            if (result.success) {
                navigate('/profile-creation');
            } else {
                setError('root', { message: result.error });
            }
        } catch (error) {
            setError('root', { message: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRequirements = [
        { text: 'At least 6 characters', met: password && password.length >= 6 },
        { text: 'Contains uppercase letter', met: password && /[A-Z]/.test(password) },
        { text: 'Contains lowercase letter', met: password && /[a-z]/.test(password) },
        { text: 'Contains number', met: password && /\d/.test(password) }
    ];

    return (
        <div className={styles.signupPage}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.signupContainer}
            >
                {/* Header */}
                <div className={styles.signupHeader}>
                    <Link to="/" className={styles.signupLogo}>
                        <div className={styles.logoIcon}>
                            <span>E</span>
                        </div>
                        <span className={styles.logoText}>
                            ElevateAI
                        </span>
                    </Link>
                    <h2 className={styles.signupTitle}>
                        Create your account
                    </h2>
                    <p className={styles.signupSubtitle}>
                        Start your journey to career success today
                    </p>
                </div>

                {/* Signup Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={styles.signupCard}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
                        {/* Name Field */}
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>
                                Full Name
                            </label>
                            <div className={styles.inputContainer}>
                                <User className={`${styles.inputIcon} h-5 w-5`} />
                                <input
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    type="text"
                                    className={`${styles.formInput} ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && (
                                <p className={styles.formError}>{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>
                                Email Address
                            </label>
                            <div className={styles.inputContainer}>
                                <Mail className={`${styles.inputIcon} h-5 w-5`} />
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className={`${styles.formInput} ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className={styles.formError}>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        {password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password requirements:
                                </p>
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle
                                            size={16}
                                            className={req.met ? 'text-green-500' : 'text-gray-400'}
                                        />
                                        <span
                                            className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'
                                                }`}
                                        >
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value =>
                                            value === password || 'Passwords do not match'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                {...register('terms', {
                                    required: 'You must accept the terms and conditions'
                                })}
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                            />
                            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary hover:text-primary-dark">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary hover:text-primary-dark">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-sm text-red-600">{errors.terms.message}</p>
                        )}

                        {/* Error Message */}
                        {errors.root && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.root.message}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full btn-lg group"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="btn btn-outline w-full">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>
                        <button className="btn btn-outline w-full">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>
                </motion.div>

                {/* Sign In Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary-dark font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
