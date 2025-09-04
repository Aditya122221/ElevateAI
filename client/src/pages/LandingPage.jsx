import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Star,
    Users,
    Award,
    Brain,
    Target,
    Zap,
    Shield,
    Globe,
    TrendingUp,
    BookOpen,
    BarChart3,
    Lightbulb,
    Sparkles,
    Rocket
} from 'lucide-react';
import logo from '../assets/logo.png';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();

    // Parallax transforms
    const heroY = useTransform(scrollY, [0, 500], [0, -150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const featuresY = useTransform(scrollY, [0, 1000], [0, -100]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Insights',
            description: 'Get personalized career recommendations powered by advanced AI algorithms.',
            color: 'from-blue-500 to-purple-600'
        },
        {
            icon: Award,
            title: 'Certificate Library',
            description: 'Access thousands of industry-recognized certifications and courses.',
            color: 'from-green-500 to-teal-600'
        },
        {
            icon: BarChart3,
            title: 'Skill Assessment',
            description: 'Take comprehensive tests to evaluate and improve your skills.',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: Target,
            title: 'Goal Tracking',
            description: 'Set and track your career goals with detailed progress analytics.',
            color: 'from-purple-500 to-pink-600'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '500+', label: 'Certificates' },
        { number: '95%', label: 'Success Rate' },
        { number: '24/7', label: 'AI Support' }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            content: 'ElevateAI helped me identify the exact skills I needed to advance my career. The AI recommendations were spot-on!',
            rating: 5,
            avatar: 'SJ'
        },
        {
            name: 'Michael Chen',
            role: 'Data Scientist',
            company: 'DataFlow Inc',
            content: 'The certificate library is incredible. I found exactly what I needed to transition into data science.',
            rating: 5,
            avatar: 'MC'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Product Manager',
            company: 'InnovateLab',
            content: 'The skill assessments helped me understand my strengths and areas for improvement. Highly recommended!',
            rating: 5,
            avatar: 'ER'
        }
    ];

    const roadmap = [
        {
            phase: 'Phase 1',
            title: 'Core Platform',
            status: 'completed',
            features: ['User Authentication', 'Profile Creation', 'Basic AI Recommendations']
        },
        {
            phase: 'Phase 2',
            title: 'AI Enhancement',
            status: 'completed',
            features: ['Advanced AI Analysis', 'Personalized Learning Paths', 'Skill Gap Analysis']
        },
        {
            phase: 'Phase 3',
            title: 'Assessment Tools',
            status: 'in-progress',
            features: ['Interactive Tests', 'Real-time Scoring', 'Progress Tracking']
        },
        {
            phase: 'Phase 4',
            title: 'Community Features',
            status: 'planned',
            features: ['Peer Learning', 'Mentorship Program', 'Career Networking']
        }
    ];

    return (
        <div className={styles.landingPage}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                {/* Animated Background */}
                <div className={styles.animatedBackground}>
                    <motion.div
                        className={styles.floatingElement1}
                        style={{
                            x: mousePosition.x - 200,
                            y: mousePosition.y - 200,
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className={styles.floatingElement2}
                        style={{
                            x: mousePosition.x + 100,
                            y: mousePosition.y + 100,
                        }}
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Floating Elements */}
                <motion.div
                    className={styles.floatingOrb1}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className={styles.floatingOrb2}
                    animate={{
                        y: [0, 20, 0],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className={styles.heroContent}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={styles.heroTitle}
                    >
                        Elevate Your Career
                        <br />
                        <span className={styles.heroSubtitle}>with AI Power</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroDescription}
                    >
                        Discover your potential, develop in-demand skills, and advance your career with personalized AI-powered recommendations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={styles.heroButtons}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="btn btn-primary btn-xl"
                            >
                                <Sparkles size={20} />
                                Get Started Free
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/login"
                                className="btn btn-secondary btn-xl"
                            >
                                <Rocket size={20} />
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className={styles.heroStats}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                className={styles.statItem}
                            >
                                <div className={styles.statNumber}>
                                    {stat.number}
                                </div>
                                <div className={styles.statLabel}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className={styles.featuresSection}>
                <motion.div
                    style={{ y: featuresY }}
                    className={styles.featuresContainer}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={styles.featuresHeader}
                    >
                        <h2 className={styles.featuresTitle}>
                            Powerful Features for Your Career Growth
                        </h2>
                        <p className={styles.featuresDescription}>
                            Everything you need to identify opportunities, develop skills, and advance your career.
                        </p>
                    </motion.div>

                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className={styles.featureCard}
                                >
                                    <div className={`${styles.featureIcon} bg-gradient-to-r ${feature.color}`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                                    <p className={styles.featureDescription}>{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Roadmap Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Our Development Roadmap
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            See what we've built and what's coming next to help you succeed.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {roadmap.map((phase, index) => (
                            <motion.div
                                key={phase.phase}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className="flex-1">
                                    <div className="card p-6">
                                        <div className="flex items-center mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${phase.status === 'completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : phase.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                }`}>
                                                {phase.phase}
                                            </span>
                                            <h3 className="text-xl font-semibold ml-4">{phase.title}</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {phase.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="w-8 h-8 mx-4 flex-shrink-0">
                                    <div className={`w-full h-full rounded-full ${phase.status === 'completed'
                                        ? 'bg-green-500'
                                        : phase.status === 'in-progress'
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                        }`} />
                                </div>
                                <div className="flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Join thousands of professionals who have transformed their careers with ElevateAI.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.role} at {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 italic">
                                    "{testimonial.content}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Elevate Your Career?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who are already using AI to advance their careers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="btn bg-white text-primary hover:bg-gray-100 btn-lg group"
                            >
                                Start Your Journey
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="btn border-white text-white hover:bg-white hover:text-primary btn-lg"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
