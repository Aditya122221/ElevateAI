import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle,
    Clock,
    Target,
    Award,
    Calendar,
    Filter,
    Download,
    Eye,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './TestResultsPage.module.css';

const TestResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedResult, setExpandedResult] = useState(null);
    const [stats, setStats] = useState({
        totalTests: 0,
        passedTests: 0,
        averageScore: 0,
        totalTimeSpent: 0
    });

    useEffect(() => {
        fetchResults();
    }, [selectedTest, selectedStatus]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tests/user/results');
            setResults(response.data.results);
            calculateStats(response.data.results);
        } catch (error) {
            console.error('Error fetching test results:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (testResults) => {
        const totalTests = testResults.length;
        const passedTests = testResults.filter(result => result.passed).length;
        const averageScore = totalTests > 0
            ? testResults.reduce((sum, result) => sum + result.percentage, 0) / totalTests
            : 0;
        const totalTimeSpent = testResults.reduce((sum, result) => sum + result.timeSpent, 0);

        setStats({
            totalTests,
            passedTests,
            averageScore: Math.round(averageScore * 100) / 100,
            totalTimeSpent: Math.round(totalTimeSpent / 60) // Convert to minutes
        });
    };

    const filteredResults = results.filter(result => {
        const testMatch = !selectedTest || result.test?._id === selectedTest;
        const statusMatch = !selectedStatus ||
            (selectedStatus === 'passed' && result.passed) ||
            (selectedStatus === 'failed' && !result.passed);
        return testMatch && statusMatch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-100 dark:bg-green-900';
        if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
        return 'bg-red-100 dark:bg-red-900';
    };

    const toggleResultExpansion = (resultId) => {
        setExpandedResult(expandedResult === resultId ? null : resultId);
    };

    const exportResults = () => {
        // Implement CSV export functionality
        const csvContent = [
            ['Test Name', 'Score', 'Percentage', 'Status', 'Date', 'Duration'],
            ...filteredResults.map(result => [
                result.test?.title || 'Unknown Test',
                result.score,
                result.percentage,
                result.passed ? 'Passed' : 'Failed',
                formatDate(result.completedAt),
                formatDuration(result.timeSpent)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test-results.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const uniqueTests = [...new Set(results.map(result => result.test?._id).filter(Boolean))];

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
                        Test Results
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your progress and performance across all assessments
                    </p>
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
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Passed Tests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passedTests}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTimeSpent}m</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters and Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="card p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col md:flex-row gap-4 flex-1">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="btn btn-outline flex items-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {showFilters && (
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <select
                                            value={selectedTest}
                                            onChange={(e) => setSelectedTest(e.target.value)}
                                            className="form-input form-select"
                                        >
                                            <option value="">All Tests</option>
                                            {uniqueTests.map(testId => {
                                                const test = results.find(r => r.test?._id === testId)?.test;
                                                return (
                                                    <option key={testId} value={testId}>
                                                        {test?.title || 'Unknown Test'}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="form-input form-select"
                                        >
                                            <option value="">All Results</option>
                                            <option value="passed">Passed</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={exportResults}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Results List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result, index) => (
                                <motion.div
                                    key={result._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {result.test?.title || 'Unknown Test'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    {result.passed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                    <span className={`text-sm font-medium ${result.passed ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {result.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(result.completedAt)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDuration(result.timeSpent)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Target className="w-4 h-4" />
                                                    Attempt {result.attemptNumber}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                                                    {result.percentage}%
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {result.score}/{result.test?.totalPoints || 'N/A'} points
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleResultExpansion(result._id)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${result.percentage >= 80
                                                    ? 'bg-green-500'
                                                    : result.percentage >= 60
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${result.percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedResult === result._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                                        Test Information
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.test?.category || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.test?.difficulty || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Passing Score:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.test?.passingScore || 'N/A'}%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.answers?.length || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                                        Performance Breakdown
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Correct Answers:</span>
                                                            <span className="text-green-600">
                                                                {result.answers?.filter(a => a.isCorrect).length || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Incorrect Answers:</span>
                                                            <span className="text-red-600">
                                                                {result.answers?.filter(a => !a.isCorrect).length || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Total Points:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.answers?.reduce((sum, a) => sum + (a.points || 0), 0) || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Average Time per Question:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {result.answers?.length > 0
                                                                    ? formatDuration(Math.round(result.timeSpent / result.answers.length))
                                                                    : 'N/A'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Feedback */}
                                            {result.feedback && (
                                                <div className="mt-6">
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                                        Feedback
                                                    </h4>
                                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                        {result.feedback.overallComment && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                {result.feedback.overallComment}
                                                            </p>
                                                        )}

                                                        {result.feedback.strengths && result.feedback.strengths.length > 0 && (
                                                            <div className="mb-3">
                                                                <h5 className="text-sm font-medium text-green-600 mb-1">Strengths:</h5>
                                                                <ul className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {result.feedback.strengths.map((strength, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                                            {strength}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {result.feedback.weaknesses && result.feedback.weaknesses.length > 0 && (
                                                            <div className="mb-3">
                                                                <h5 className="text-sm font-medium text-red-600 mb-1">Areas for Improvement:</h5>
                                                                <ul className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {result.feedback.weaknesses.map((weakness, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                                                            {weakness}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {result.feedback.recommendations && result.feedback.recommendations.length > 0 && (
                                                            <div>
                                                                <h5 className="text-sm font-medium text-blue-600 mb-1">Recommendations:</h5>
                                                                <ul className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {result.feedback.recommendations.map((rec, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <Award className="w-3 h-3 text-blue-500 mr-2" />
                                                                            {rec}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No test results found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {results.length === 0
                                        ? "You haven't taken any tests yet. Start your first assessment!"
                                        : "No results match your current filters."
                                    }
                                </p>
                                {results.length === 0 && (
                                    <a
                                        href="/tests"
                                        className="btn btn-primary"
                                    >
                                        Browse Tests
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TestResultsPage;
