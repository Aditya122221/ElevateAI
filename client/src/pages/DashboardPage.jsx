import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Award,
    BookOpen,
    BarChart3,
    Target,
    Brain,
    ArrowRight,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
    Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [recentTests, setRecentTests] = useState([]);
    const [stats, setStats] = useState({
        testsCompleted: 0,
        certificatesEarned: 0,
        skillsLearned: 0,
        goalsAchieved: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, recommendationsRes, testsRes] = await Promise.all([
                axios.get('/api/profile'),
                axios.get('/api/profile/recommendations'),
                axios.get('/api/tests/user/results')
            ]);

            setProfile(profileRes.data.profile);
            setRecommendations(recommendationsRes.data.recommendations);
            setRecentTests(testsRes.data.results.slice(0, 3));

            // Calculate stats
            setStats({
                testsCompleted: testsRes.data.results.length,
                certificatesEarned: profileRes.data.profile?.certifications?.length || 0,
                skillsLearned: profileRes.data.profile?.skills?.technical?.length || 0,
                goalsAchieved: 0 // This would be calculated based on completed goals
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: 'Take a Test',
            description: 'Assess your skills and knowledge',
            icon: BookOpen,
            link: '/tests',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Browse Certificates',
            description: 'Find certifications to boost your career',
            icon: Award,
            link: '/certificates',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'View Results',
            description: 'Check your test scores and progress',
            icon: BarChart3,
            link: '/test-results',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Update Profile',
            description: 'Keep your information current',
            icon: Target,
            link: '/profile',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.dashboardContainer}>
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.welcomeSection}
                >
                    <div className={styles.welcomeContent}>
                        <h1 className={styles.welcomeTitle}>
                            {getGreeting()}, {user?.name}!
                        </h1>
                        <p className={styles.welcomeSubtitle}>
                            Ready to take the next step in your career journey?
                        </p>

                        <div className={styles.welcomeStats}>
                            <div className={styles.statCard}>
                                <div className={styles.statNumber}>{stats.testsCompleted}</div>
                                <div className={styles.statLabel}>Tests Completed</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statNumber}>{stats.certificatesEarned}</div>
                                <div className={styles.statLabel}>Certificates Earned</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statNumber}>{stats.skillsLearned}</div>
                                <div className={styles.statLabel}>Skills Learned</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statNumber}>{stats.avgScore}%</div>
                                <div className={styles.statLabel}>Average Score</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tests Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.testsCompleted}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Earned</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.certificatesEarned}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Learned</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.skillsLearned}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goals Achieved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.goalsAchieved}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.title}
                                        to={action.link}
                                        className="group"
                                    >
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="card p-6 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {action.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                {action.description}
                                            </p>
                                            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                                                <span className="text-sm font-medium">Get started</span>
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* AI Recommendations */}
                        {recommendations && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                        <Brain className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        AI Recommendations
                                    </h3>
                                </div>

                                {recommendations.suggestedSkills && recommendations.suggestedSkills.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Suggested Skills
                                        </h4>
                                        <div className="space-y-2">
                                            {recommendations.suggestedSkills.slice(0, 3).map((skill, index) => (
                                                <div key={index} className="flex items-center text-sm">
                                                    <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                                                    <span className="text-gray-600 dark:text-gray-400">{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recommendations.suggestedCertifications && recommendations.suggestedCertifications.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Recommended Certificates
                                        </h4>
                                        <div className="space-y-2">
                                            {recommendations.suggestedCertifications.slice(0, 2).map((cert, index) => (
                                                <div key={index} className="flex items-center text-sm">
                                                    <Award className="w-4 h-4 text-green-500 mr-2" />
                                                    <span className="text-gray-600 dark:text-gray-400">{cert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Link
                                    to="/certificates"
                                    className="btn btn-primary btn-sm w-full mt-4"
                                >
                                    View All Recommendations
                                </Link>
                            </motion.div>
                        )}

                        {/* Recent Test Results */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="card p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Recent Test Results
                            </h3>

                            {recentTests.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTests.map((test, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {test.test?.title || 'Test'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(test.completedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                {test.passed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                <span className="ml-2 text-sm font-medium">
                                                    {test.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No tests taken yet
                                    </p>
                                    <Link
                                        to="/tests"
                                        className="btn btn-primary btn-sm mt-2"
                                    >
                                        Take Your First Test
                                    </Link>
                                </div>
                            )}

                            {recentTests.length > 0 && (
                                <Link
                                    to="/test-results"
                                    className="btn btn-outline btn-sm w-full mt-4"
                                >
                                    View All Results
                                </Link>
                            )}
                        </motion.div>

                        {/* Profile Completion */}
                        {profile && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="card p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Profile Completion
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Personal Info</span>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Career Info</span>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Skills</span>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Goals</span>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>

                                <Link
                                    to="/profile"
                                    className="btn btn-outline btn-sm w-full mt-4"
                                >
                                    Update Profile
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
