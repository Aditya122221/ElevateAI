import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Star,
    Clock,
    Award,
    Users,
    DollarSign,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Globe,
    CheckCircle,
    X
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './CertificateLibraryPage.module.css';

const CertificateLibraryPage = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false
    });

    const difficulties = [
        { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-800' },
        { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        fetchCertificates();
        fetchCategories();
    }, [selectedCategory, selectedDifficulty, searchTerm, pagination.current]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.current,
                limit: 12
            });

            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedDifficulty) params.append('difficulty', selectedDifficulty);

            const response = await axios.get(`/api/certificates?${params}`);
            setCertificates(response.data.certificates);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/certificates/categories/list');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const toggleCardExpansion = (certificateId) => {
        setExpandedCard(expandedCard === certificateId ? null : certificateId);
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        return duration;
    };

    const formatCost = (cost) => {
        if (cost.free) return 'Free';
        return `${cost.currency} ${cost.amount}`;
    };

    const getDifficultyColor = (difficulty) => {
        const diff = difficulties.find(d => d.value === difficulty);
        return diff ? diff.color : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className={styles.certificateLibraryPage}>
            <div className={styles.certificateContainer}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.certificateHeader}
                >
                    <h1 className={styles.certificateTitle}>
                        Certificate Library
                    </h1>
                    <p className={styles.certificateSubtitle}>
                        Discover industry-recognized certifications to advance your career
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="card p-6">
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search certificates..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="form-input pl-10 w-full"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-gray-200 dark:border-gray-700 pt-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Category Filter */}
                                        <div>
                                            <label className="form-label">Category</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="form-input form-select"
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Difficulty Filter */}
                                        <div>
                                            <label className="form-label">Difficulty</label>
                                            <select
                                                value={selectedDifficulty}
                                                onChange={(e) => handleDifficultyChange(e.target.value)}
                                                className="form-input form-select"
                                            >
                                                <option value="">All Levels</option>
                                                {difficulties.map(difficulty => (
                                                    <option key={difficulty.value} value={difficulty.value}>
                                                        {difficulty.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    {(selectedCategory || selectedDifficulty || searchTerm) && (
                                        <div className="mt-4">
                                            <button
                                                onClick={clearFilters}
                                                className="btn btn-ghost btn-sm flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" />
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Showing {certificates.length} of {pagination.total} certificates
                    </p>
                </motion.div>

                {/* Certificates Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    >
                        {certificates.map((certificate, index) => (
                            <motion.div
                                key={certificate._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-6 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {certificate.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            by {certificate.provider}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(certificate.difficulty)}`}>
                                        {certificate.difficulty}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                    {certificate.description}
                                </p>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {formatDuration(certificate.duration)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        {formatCost(certificate.cost)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Globe className="w-4 h-4 mr-2" />
                                        {certificate.language}
                                    </div>
                                </div>

                                {/* Rating */}
                                {certificate.rating && certificate.rating.count > 0 && (
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(certificate.rating.average)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                            ({certificate.rating.count} reviews)
                                        </span>
                                    </div>
                                )}

                                {/* Skills */}
                                {certificate.skills && certificate.skills.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Skills you'll learn:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {certificate.skills.slice(0, 3).map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                            {certificate.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                    +{certificate.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleCardExpansion(certificate._id)}
                                        className="btn btn-outline btn-sm flex-1"
                                    >
                                        {expandedCard === certificate._id ? 'Show Less' : 'Learn More'}
                                    </button>
                                    {certificate.enrollmentUrl && (
                                        <a
                                            href={certificate.enrollmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm flex items-center gap-1"
                                        >
                                            Enroll
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedCard === certificate._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Topics */}
                                            {certificate.topics && certificate.topics.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Covered Topics:
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {certificate.topics.slice(0, 5).map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                                {topic}
                                                            </li>
                                                        ))}
                                                        {certificate.topics.length > 5 && (
                                                            <li className="text-sm text-gray-500 dark:text-gray-500">
                                                                +{certificate.topics.length - 5} more topics
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Benefits */}
                                            {certificate.benefits && certificate.benefits.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Benefits:
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {certificate.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                                                            <li key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <Award className="w-3 h-3 text-blue-500 mr-2" />
                                                                {benefit}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Prerequisites */}
                                            {certificate.prerequisites && certificate.prerequisites.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Prerequisites:
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {certificate.prerequisites.map((prereq, prereqIndex) => (
                                                            <li key={prereqIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <BookOpen className="w-3 h-3 text-orange-500 mr-2" />
                                                                {prereq}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center items-center space-x-2"
                    >
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                            disabled={!pagination.hasPrev}
                            className="btn btn-outline btn-sm"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-1">
                            {[...Array(pagination.pages)].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === pagination.current;
                                const isNearCurrent = Math.abs(page - pagination.current) <= 2;
                                const isFirstOrLast = page === 1 || page === pagination.pages;

                                if (!isCurrentPage && !isNearCurrent && !isFirstOrLast) {
                                    return index === 1 || index === pagination.pages - 2 ? (
                                        <span key={index} className="px-3 py-1 text-gray-500">...</span>
                                    ) : null;
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setPagination(prev => ({ ...prev, current: page }))}
                                        className={`px-3 py-1 rounded-lg text-sm ${isCurrentPage
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                            disabled={!pagination.hasNext}
                            className="btn btn-outline btn-sm"
                        >
                            Next
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && certificates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No certificates found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Try adjusting your search criteria or filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-primary"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CertificateLibraryPage;
