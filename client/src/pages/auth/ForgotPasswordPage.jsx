import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './LoginPage.module.css';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await forgotPassword(data.email);
      if (result.success) {
        setMessage(result.message);
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
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Forgot Password?</h1>
            <p className={styles.loginSubtitle}>
              No worries! Enter your email address and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
            {/* Email Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <span className={styles.errorText}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Success Message */}
            {message && (
              <div className={styles.successMessage}>
                <p>{message}</p>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className={styles.errorMessage}>
                <p>{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className={styles.buttonIcon} />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className={styles.loginFooter}>
            <p className={styles.switchAuth}>
              Remember your password?{' '}
              <Link to="/login" className={styles.switchLink}>
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
