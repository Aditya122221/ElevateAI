import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Clock,
    BookOpen,
    Star,
    Play,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    X,
    Target,
    Users,
    Award
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './TestPage.module.css';

const TestPage = () => {
    const [tests, setTests] = useState([]);
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

    const categories_list = [
        'programming', 'data-science', 'cloud-computing', 'cybersecurity',
        'project-management', 'design', 'marketing', 'business', 'soft-skills', 'general'
    ];

    useEffect(() => {
        fetchTests();
    }, [selectedCategory, selectedDifficulty, searchTerm, pagination.current]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.current,
                limit: 12
            });

            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedDifficulty) params.append('difficulty', selectedDifficulty);

            const response = await axios.get(`/api/tests?${params}`);
            setTests(response.data.tests);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
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

    const toggleCardExpansion = (testId) => {
        setExpandedCard(expandedCard === testId ? null : testId);
    };

    const startTest = async (testId) => {
        try {
            const response = await axios.post(`/api/tests/${testId}/start`);
            // Navigate to test taking page with test data
            console.log('Test started:', response.data);
            // You would implement navigation to test taking page here
        } catch (error) {
            console.error('Error starting test:', error);
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        return `${duration} minutes`;
    };

    const getDifficultyColor = (difficulty) => {
        const diff = difficulties.find(d => d.value === difficulty);
        return diff ? diff.color : 'bg-gray-100 text-gray-800';
    };

    const formatCategory = (category) => {
        return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Skill Assessment Tests
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Test your knowledge and skills with our comprehensive assessments
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
                                    placeholder="Search tests..."
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
                                                {categories_list.map(category => (
                                                    <option key={category} value={category}>
                                                        {formatCategory(category)}
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
                        Showing {tests.length} of {pagination.total} tests
                    </p>
                </motion.div>

                {/* Tests Grid */}
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
                        {tests.map((test, index) => (
                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-6 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {test.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatCategory(test.category)}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                                        {test.difficulty}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                    {test.description}
                                </p>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {formatDuration(test.duration)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        {test.questions?.length || 0} questions
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Target className="w-4 h-4 mr-2" />
                                        {test.passingScore}% passing score
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Users className="w-4 h-4 mr-2" />
                                        Max {test.maxAttempts} attempts
                                    </div>
                                </div>

                                {/* Skills */}
                                {test.skills && test.skills.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Skills tested:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {test.skills.slice(0, 3).map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {test.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                    +{test.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleCardExpansion(test._id)}
                                        className="btn btn-outline btn-sm flex-1"
                                    >
                                        {expandedCard === test._id ? 'Show Less' : 'Learn More'}
                                    </button>
                                    <button
                                        onClick={() => startTest(test._id)}
                                        className="btn btn-primary btn-sm flex items-center gap-1"
                                    >
                                        <Play className="w-4 h-4" />
                                        Start
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedCard === test._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Prerequisites */}
                                            {test.prerequisites && test.prerequisites.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Prerequisites:
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {test.prerequisites.map((prereq, prereqIndex) => (
                                                            <li key={prereqIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                                {prereq}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {test.tags && test.tags.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Tags:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {test.tags.map((tag, tagIndex) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
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
                {!loading && tests.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No tests found
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

export default TestPage;
