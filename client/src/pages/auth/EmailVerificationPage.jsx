import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/api';
import styles from './EmailVerificationPage.module.css';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [status, setStatus] = useState('pending'); // pending, success, error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        console.log('🔍 EmailVerificationPage useEffect triggered');
        console.log('📧 Token:', token);
        console.log('📍 Location state:', location.state);

        // Check if user was redirected from registration (has state data)
        if (location.state?.email) {
            console.log('✅ User redirected from registration');
            setEmail(location.state.email);
            setStatus('pending');
            setMessage(location.state.message || 'Please check your email and click the verification link.');
            return;
        }

        // Check if there's a token in URL (user clicked email link)
        if (token) {
            console.log('🔗 Token found, verifying email...');
            verifyEmail(token);
        } else {
            console.log('❌ No token and no state - invalid access');
            // No token and no state - invalid access
            setStatus('error');
            setMessage('Invalid verification link. Please check your email for the correct link.');
        }
    }, [token, location.state]);

    const verifyEmail = async (verificationToken) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/verify-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: verificationToken }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);

                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Update AuthContext with user data
                updateUser(data.user);

                // Redirect to profile creation after 2 seconds
                setTimeout(() => {
                    navigate('/profile-creation');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setResendLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/resend-verification/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setShowResendForm(false);
            } else {
                toast.error(data.message || 'Failed to resend verification email');
            }
        } catch (error) {
            console.error('Resend error:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className={styles.successIcon} />;
            case 'error':
                return <AlertCircle className={styles.errorIcon} />;
            default:
                return <Mail className={styles.pendingIcon} />;
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'success':
                return styles.success;
            case 'error':
                return styles.error;
            default:
                return styles.pending;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.verificationCard}>
                <div className={`${styles.statusSection} ${getStatusClass()}`}>
                    {getStatusIcon()}
                    <h1 className={styles.title}>
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                        {status === 'pending' && (token ? 'Verifying Email...' : 'Check Your Email')}
                    </h1>
                </div>

                <div className={styles.content}>
                    {loading && (
                        <div className={styles.loading}>
                            <RefreshCw className={styles.spinner} />
                            <p>Verifying your email address...</p>
                        </div>
                    )}

                    {!loading && (
                        <>
                            <p className={styles.message}>{message}</p>

                            {status === 'success' && (
                                <div className={styles.successActions}>
                                    <p className={styles.redirectMessage}>
                                        Redirecting you to complete your profile...
                                    </p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className={styles.errorActions}>
                                    {!showResendForm ? (
                                        <button
                                            onClick={() => setShowResendForm(true)}
                                            className={styles.resendButton}
                                        >
                                            Resend Verification Email
                                        </button>
                                    ) : (
                                        <form onSubmit={resendVerification} className={styles.resendForm}>
                                            <div className={styles.inputGroup}>
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formActions}>
                                                <button
                                                    type="submit"
                                                    disabled={resendLoading}
                                                    className={styles.submitButton}
                                                >
                                                    {resendLoading ? (
                                                        <>
                                                            <RefreshCw className={styles.spinner} />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        'Send Verification Email'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowResendForm(false)}
                                                    className={styles.cancelButton}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className={styles.helpText}>
                                        <p>If you continue to have issues:</p>
                                        <ul>
                                            <li>Check your spam/junk folder</li>
                                            <li>Make sure you're using the correct email address</li>
                                            <li>Contact support if the problem persists</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={() => navigate('/login')}
                        className={styles.backToLogin}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
