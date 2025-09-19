import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    User,
    LogOut,
    Settings,
    Sun,
    Moon,
    Home,
    Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navbarContent}>
                {/* Logo */}
                <Link to="/" className={styles.navbarBrand}>
                    <img
                        src={logo}
                        alt="ElevateAI Logo"
                        className={styles.navbarLogo}
                    />
                    <span className="hidden sm:block">ElevateAI</span>
                </Link>

                {/* Desktop Navigation */}
                {isAuthenticated && (
                    <div className={styles.navbarNav}>
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`${styles.navbarLink} ${isActive ? styles.active : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className={styles.navbarActions}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* User Menu */}
                            <div className={styles.userMenu}>
                                <button
                                    className={styles.userMenuButton}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <User size={20} />
                                    <span className="hidden sm:block">{user?.name}</span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={styles.userMenuDropdown}
                                        >
                                            <Link
                                                to="/profile"
                                                className={styles.userMenuLink}
                                            >
                                                <User size={16} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className={styles.userMenuLink}
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </Link>
                                            <div className={styles.userMenuDivider} />
                                            <button
                                                onClick={handleLogout}
                                                className={`${styles.userMenuButton} ${styles.logout}`}
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link to="/login" className="btn btn-outline btn-sm">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={styles.mobileMenuButton}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}
                    >
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`${styles.mobileMenuLink} ${isActive ? styles.active : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;