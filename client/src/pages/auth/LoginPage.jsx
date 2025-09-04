import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                // Check if user needs to complete profile
                if (!result.user?.isProfileComplete) {
                    navigate('/profile-creation');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('root', { message: result.error });
            }
        } catch (error) {
            setError('root', { message: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.loginContainer}
            >
                {/* Header */}
                <div className={styles.loginHeader}>
                    <Link to="/" className={styles.loginLogo}>
                        <div className={styles.logoIcon}>
                            <span>E</span>
                        </div>
                        <span className={styles.logoText}>
                            ElevateAI
                        </span>
                    </Link>
                    <h2 className={styles.loginTitle}>
                        Welcome back
                    </h2>
                    <p className={styles.loginSubtitle}>
                        Sign in to your account to continue your journey
                    </p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={styles.loginCard}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
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
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.formLabel}>
                                Password
                            </label>
                            <div className={styles.inputContainer}>
                                <Lock className={`${styles.inputIcon} h-5 w-5`} />
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${styles.formInput} ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className={styles.formError}>{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-primary-dark transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {errors.root && (
                            <div className={styles.errorMessage}>
                                <p>
                                    {errors.root.message}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
                        >
                            {isLoading ? (
                                <div className={styles.loadingSpinner} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className={styles.divider}>
                        <div className={styles.dividerLine} />
                        <span className={styles.dividerText}>Or continue with</span>
                        <div className={styles.dividerLine} />
                    </div>

                    {/* Social Login Buttons */}
                    <div className={styles.socialButtons}>
                        <button className={styles.socialButton}>
                            <svg className={styles.socialIcon} viewBox="0 0 24 24">
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
                        <button className={styles.socialButton}>
                            <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>
                </motion.div>

                {/* Sign Up Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={styles.loginFooter}
                >
                    <p className={styles.loginFooterText}>
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className={styles.loginFooterLink}
                        >
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
