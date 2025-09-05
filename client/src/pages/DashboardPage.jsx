import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Lightbulb,
    Map,
    Zap,
    Users,
    DollarSign,
    Calendar,
    ChevronRight,
    Play,
    Eye,
    Filter,
    Search,
    Plus,
    TrendingDown,
    Activity,
    PieChart,
    LineChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [profile, setProfile] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [recentTests, setRecentTests] = useState([]);
    const [careerPaths, setCareerPaths] = useState([]);
    const [skillGaps, setSkillGaps] = useState([]);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState('');
    const [stats, setStats] = useState({
        testsCompleted: 0,
        certificatesEarned: 0,
        skillsLearned: 0,
        goalsAchieved: 0,
        avgScore: 0,
        learningStreak: 0,
        careerLevel: 'Beginner',
        marketValue: 0
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

            // Calculate enhanced stats
            const testResults = testsRes.data.results;
            const avgScore = testResults.length > 0
                ? Math.round(testResults.reduce((sum, test) => sum + test.percentage, 0) / testResults.length)
                : 0;

            setStats({
                testsCompleted: testResults.length,
                certificatesEarned: profileRes.data.profile?.certifications?.length || 0,
                skillsLearned: profileRes.data.profile?.skills?.technical?.length || 0,
                goalsAchieved: 0,
                avgScore,
                learningStreak: Math.floor(Math.random() * 30) + 1, // Mock data
                careerLevel: 'Intermediate',
                marketValue: 75000 + (avgScore * 500) // Mock calculation
            });

            // Mock data for career paths and skill gaps
            setCareerPaths([
                {
                    id: 1,
                    title: 'Full Stack Developer',
                    level: 'Current',
                    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                    progress: 60,
                    timeline: '6 months',
                    salary: { min: 70000, max: 120000 }
                },
                {
                    id: 2,
                    title: 'Senior Developer',
                    level: 'Next',
                    skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
                    progress: 0,
                    timeline: '12 months',
                    salary: { min: 90000, max: 150000 }
                },
                {
                    id: 3,
                    title: 'Tech Lead',
                    level: 'Future',
                    skills: ['Leadership', 'Architecture', 'DevOps', 'Team Management'],
                    progress: 0,
                    timeline: '24 months',
                    salary: { min: 120000, max: 200000 }
                }
            ]);

            setSkillGaps([
                { skill: 'JavaScript', current: 80, target: 90, gap: 10, priority: 'high' },
                { skill: 'React', current: 70, target: 85, gap: 15, priority: 'high' },
                { skill: 'Node.js', current: 60, target: 80, gap: 20, priority: 'medium' },
                { skill: 'AWS', current: 30, target: 70, gap: 40, priority: 'high' },
                { skill: 'Docker', current: 20, target: 60, gap: 40, priority: 'medium' },
                { skill: 'TypeScript', current: 40, target: 75, gap: 35, priority: 'medium' },
                { skill: 'Leadership', current: 25, target: 70, gap: 45, priority: 'low' },
                { skill: 'System Design', current: 35, target: 80, gap: 45, priority: 'high' }
            ]);

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

    const runCareerSimulation = (careerPath) => {
        setSelectedCareer(careerPath);
        setShowSimulation(true);

        // Mock simulation results
        const simulation = {
            careerPath,
            timeToAchieve: Math.floor(Math.random() * 12) + 6,
            salaryIncrease: Math.floor(Math.random() * 50000) + 20000,
            newOpportunities: [
                'Senior Developer roles',
                'Tech Lead positions',
                'Startup opportunities',
                'Remote work options',
                'Consulting gigs'
            ],
            requiredSkills: [
                'Advanced JavaScript',
                'Cloud Architecture',
                'Team Leadership',
                'System Design',
                'DevOps Practices'
            ],
            marketDemand: Math.floor(Math.random() * 40) + 60,
            difficulty: Math.floor(Math.random() * 3) + 1
        };

        setSimulationResults(simulation);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'career-path', label: 'Career Path', icon: Map },
        { id: 'skills', label: 'Skills Gap', icon: TrendingUp },
        { id: 'simulation', label: 'What-If', icon: Zap }
    ];

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
                {/* Enhanced Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.welcomeSection}
                >
                    <div className={styles.welcomeContent}>
                        <div className={styles.welcomeHeader}>
                            <div>
                                <h1 className={styles.welcomeTitle}>
                                    {getGreeting()}, {user?.name}! 👋
                                </h1>
                                <p className={styles.welcomeSubtitle}>
                                    Your career journey is looking bright! Let's explore your growth opportunities.
                                </p>
                            </div>
                            <div className={styles.welcomeActions}>
                                <button
                                    className={styles.simulationBtn}
                                    onClick={() => setShowSimulation(true)}
                                >
                                    <Zap className="w-4 h-4" />
                                    Career Simulation
                                </button>
                            </div>
                        </div>

                        <div className={styles.welcomeStats}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.testsCompleted}</div>
                                    <div className={styles.statLabel}>Tests Completed</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <Award className="w-6 h-6" />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.certificatesEarned}</div>
                                    <div className={styles.statLabel}>Certificates</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.avgScore}%</div>
                                    <div className={styles.statLabel}>Avg Score</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>${(stats.marketValue / 1000).toFixed(0)}k</div>
                                    <div className={styles.statLabel}>Market Value</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.learningStreak}</div>
                                    <div className={styles.statLabel}>Day Streak</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={styles.tabNavigation}
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.tabContent}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Quick Actions */}
                                <div className="lg:col-span-2">
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
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-8">
                                    {/* AI Recommendations */}
                                    {recommendations && (
                                        <div className="card p-6">
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

                                            <Link
                                                to="/certificates"
                                                className="btn btn-primary btn-sm w-full mt-4"
                                            >
                                                View All Recommendations
                                            </Link>
                                        </div>
                                    )}

                                    {/* Recent Test Results */}
                                    <div className="card p-6">
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
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'career-path' && (
                        <motion.div
                            key="career-path"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.tabContent}
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Career Roadmap</h2>
                                <p className="text-gray-600 dark:text-gray-400">Visualize your journey from current role to your dream position</p>
                            </div>

                            <div className={styles.careerTimeline}>
                                {careerPaths.map((path, index) => (
                                    <motion.div
                                        key={path.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className={`${styles.careerStep} ${path.level === 'Current' ? styles.currentStep : ''}`}
                                    >
                                        <div className={styles.stepHeader}>
                                            <div className={styles.stepIcon}>
                                                {path.level === 'Current' ? <Target className="w-6 h-6" /> :
                                                    path.level === 'Next' ? <ArrowRight className="w-6 h-6" /> :
                                                        <Star className="w-6 h-6" />}
                                            </div>
                                            <div className={styles.stepInfo}>
                                                <h3 className={styles.stepTitle}>{path.title}</h3>
                                                <span className={styles.stepLevel}>{path.level}</span>
                                            </div>
                                            <div className={styles.stepActions}>
                                                <button
                                                    className={styles.simulateBtn}
                                                    onClick={() => runCareerSimulation(path.title)}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    Simulate
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.stepProgress}>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${path.progress}%` }}
                                                />
                                            </div>
                                            <span className={styles.progressText}>{path.progress}% Complete</span>
                                        </div>

                                        <div className={styles.stepSkills}>
                                            <h4 className={styles.skillsTitle}>Key Skills:</h4>
                                            <div className={styles.skillsList}>
                                                {path.skills.map((skill, skillIndex) => (
                                                    <span key={skillIndex} className={styles.skillTag}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.stepDetails}>
                                            <div className={styles.detailItem}>
                                                <Clock className="w-4 h-4" />
                                                <span>Timeline: {path.timeline}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <DollarSign className="w-4 h-4" />
                                                <span>${path.salary.min / 1000}k - ${path.salary.max / 1000}k</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'skills' && (
                        <motion.div
                            key="skills"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.tabContent}
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Skill Gap Analysis</h2>
                                <p className="text-gray-600 dark:text-gray-400">Identify areas for improvement and prioritize your learning</p>
                            </div>

                            <div className={styles.skillHeatmap}>
                                {skillGaps.map((skill, index) => (
                                    <motion.div
                                        key={skill.skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${styles.skillCard} ${styles[`priority-${skill.priority}`]}`}
                                    >
                                        <div className={styles.skillHeader}>
                                            <h3 className={styles.skillName}>{skill.skill}</h3>
                                            <span className={`${styles.priorityBadge} ${styles[`badge-${skill.priority}`]}`}>
                                                {skill.priority} priority
                                            </span>
                                        </div>

                                        <div className={styles.skillProgress}>
                                            <div className={styles.progressLabels}>
                                                <span>Current: {skill.current}%</span>
                                                <span>Target: {skill.target}%</span>
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.currentProgress}
                                                    style={{ width: `${skill.current}%` }}
                                                />
                                                <div
                                                    className={styles.targetProgress}
                                                    style={{ width: `${skill.target}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.skillGap}>
                                            <span className={styles.gapLabel}>Gap: {skill.gap}%</span>
                                            <div className={styles.gapBar}>
                                                <div
                                                    className={styles.gapFill}
                                                    style={{ width: `${(skill.gap / 50) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.skillActions}>
                                            <button className={styles.learnBtn}>
                                                <BookOpen className="w-4 h-4" />
                                                Learn Now
                                            </button>
                                            <button className={styles.testBtn}>
                                                <BarChart3 className="w-4 h-4" />
                                                Test
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'simulation' && (
                        <motion.div
                            key="simulation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.tabContent}
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What-If Career Simulations</h2>
                                <p className="text-gray-600 dark:text-gray-400">Explore different career paths and see what opportunities await</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {['Cloud Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UX Designer', 'Tech Lead'].map((career, index) => (
                                    <motion.div
                                        key={career}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={styles.simulationCard}
                                    >
                                        <div className={styles.simulationHeader}>
                                            <h3 className={styles.simulationTitle}>{career}</h3>
                                            <div className={styles.simulationIcon}>
                                                <Zap className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className={styles.simulationStats}>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Time to Achieve</span>
                                                <span className={styles.statValue}>{Math.floor(Math.random() * 12) + 6} months</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Salary Increase</span>
                                                <span className={styles.statValue}>+${Math.floor(Math.random() * 30) + 15}k</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Market Demand</span>
                                                <span className={styles.statValue}>{Math.floor(Math.random() * 30) + 70}%</span>
                                            </div>
                                        </div>

                                        <button
                                            className={styles.runSimulationBtn}
                                            onClick={() => runCareerSimulation(career)}
                                        >
                                            <Play className="w-4 h-4" />
                                            Run Simulation
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Career Simulation Modal */}
                <AnimatePresence>
                    {showSimulation && simulationResults && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.modalOverlay}
                            onClick={() => setShowSimulation(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={styles.simulationModal}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>
                                        Career Simulation: {simulationResults.careerPath}
                                    </h2>
                                    <button
                                        className={styles.closeBtn}
                                        onClick={() => setShowSimulation(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className={styles.simulationContent}>
                                    <div className={styles.simulationOverview}>
                                        <div className={styles.overviewCard}>
                                            <div className={styles.overviewIcon}>
                                                <Clock className="w-8 h-8" />
                                            </div>
                                            <div className={styles.overviewInfo}>
                                                <h3>Time to Achieve</h3>
                                                <p>{simulationResults.timeToAchieve} months</p>
                                            </div>
                                        </div>

                                        <div className={styles.overviewCard}>
                                            <div className={styles.overviewIcon}>
                                                <DollarSign className="w-8 h-8" />
                                            </div>
                                            <div className={styles.overviewInfo}>
                                                <h3>Salary Increase</h3>
                                                <p>+${simulationResults.salaryIncrease.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className={styles.overviewCard}>
                                            <div className={styles.overviewIcon}>
                                                <TrendingUp className="w-8 h-8" />
                                            </div>
                                            <div className={styles.overviewInfo}>
                                                <h3>Market Demand</h3>
                                                <p>{simulationResults.marketDemand}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.simulationDetails}>
                                        <div className={styles.detailSection}>
                                            <h3 className={styles.sectionTitle}>New Opportunities</h3>
                                            <div className={styles.opportunitiesList}>
                                                {simulationResults.newOpportunities.map((opportunity, index) => (
                                                    <div key={index} className={styles.opportunityItem}>
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span>{opportunity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.detailSection}>
                                            <h3 className={styles.sectionTitle}>Required Skills</h3>
                                            <div className={styles.skillsGrid}>
                                                {simulationResults.requiredSkills.map((skill, index) => (
                                                    <span key={index} className={styles.requiredSkill}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.simulationActions}>
                                        <button className={styles.startJourneyBtn}>
                                            <Map className="w-5 h-5" />
                                            Start This Journey
                                        </button>
                                        <button
                                            className={styles.closeModalBtn}
                                            onClick={() => setShowSimulation(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashboardPage;
