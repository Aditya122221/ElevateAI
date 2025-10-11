import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

// Configure axios base URL
axios.defaults.baseURL = API_BASE_URL + '/';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set up axios defaults
    useEffect(() => {
        if (token) {
            console.log('Setting axios authorization header with token:', token.substring(0, 20) + '...');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Removing axios authorization header');
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    console.log('Checking auth with token:', token.substring(0, 20) + '...');
                    const response = await axios.get('/api/auth/me');
                    console.log('User data from server:', response.data.user);
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } else {
                console.log('No token found, user not authenticated');
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login/', { email, password });
            const { token: newToken, user: userData } = response.data;

            console.log('Login response user data:', userData);

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            // Set axios headers immediately
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            toast.success('Login successful!');
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/register/', { name, email, password });
            const { token: newToken, user: userData, requiresVerification, email: responseEmail } = response.data;

            // If email verification is required, don't set user as logged in yet
            if (requiresVerification) {
                return {
                    success: true,
                    requiresVerification: true,
                    email: responseEmail,
                    message: response.data.message
                };
            }

            // If no verification required (shouldn't happen with new flow), proceed as before
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            toast.success('Registration successful!');
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('/api/auth/forgot-password/', { email });
            toast.success(response.data.message);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send password reset email.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await axios.post(`/api/auth/reset-password/${token}/`, { password });
            toast.success(response.data.message);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
