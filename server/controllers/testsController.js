const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

// @desc    Get all tests with optional filtering
// @access  Public
const getAllTests = async (req, res) => {
    try {
        const {
            category,
            difficulty,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const tests = await Test.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-questions'); // Exclude questions for list view

        const total = await Test.countDocuments(filter);

        res.json({
            tests,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
                hasNext: skip + tests.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Tests fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching tests' });
    }
};

// @desc    Get single test by ID
// @access  Public
const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test || !test.isActive) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ test });
    } catch (error) {
        console.error('Test fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching test' });
    }
};

// @desc    Create new test (Admin only)
// @access  Private/Admin
const createTest = async (req, res) => {
    try {
        const testData = req.body;
        testData.createdBy = req.user.id;

        // Calculate total points
        testData.totalPoints = testData.questions.reduce((total, question) => {
            return total + (question.points || 1);
        }, 0);

        const test = new Test(testData);
        await test.save();

        res.status(201).json({
            message: 'Test created successfully',
            test
        });
    } catch (error) {
        console.error('Test creation error:', error);
        res.status(500).json({ message: 'Server error while creating test' });
    }
};

// @desc    Update test (Admin only)
// @access  Private/Admin
const updateTest = async (req, res) => {
    try {
        const testData = req.body;

        // Recalculate total points if questions are updated
        if (testData.questions) {
            testData.totalPoints = testData.questions.reduce((total, question) => {
                return total + (question.points || 1);
            }, 0);
        }

        const test = await Test.findByIdAndUpdate(
            req.params.id,
            testData,
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({
            message: 'Test updated successfully',
            test
        });
    } catch (error) {
        console.error('Test update error:', error);
        res.status(500).json({ message: 'Server error while updating test' });
    }
};

// @desc    Delete test (Admin only)
// @access  Private/Admin
const deleteTest = async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Test delete error:', error);
        res.status(500).json({ message: 'Server error while deleting test' });
    }
};

// @desc    Start a test
// @access  Private
const startTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test || !test.isActive) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user has remaining attempts
        const userResults = await TestResult.find({
            user: req.user.id,
            test: req.params.id
        });

        if (userResults.length >= test.maxAttempts) {
            return res.status(400).json({
                message: 'Maximum attempts reached for this test'
            });
        }

        // Return test without correct answers
        const testForUser = {
            ...test.toObject(),
            questions: test.questions.map(q => ({
                ...q,
                correctAnswer: undefined // Hide correct answers
            }))
        };

        res.json({
            message: 'Test started successfully',
            test: testForUser,
            attemptNumber: userResults.length + 1,
            maxAttempts: test.maxAttempts
        });
    } catch (error) {
        console.error('Test start error:', error);
        res.status(500).json({ message: 'Server error while starting test' });
    }
};

// @desc    Submit test answers
// @access  Private
const submitTest = async (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        const test = await Test.findById(req.params.id);

        if (!test || !test.isActive) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user has remaining attempts
        const userResults = await TestResult.find({
            user: req.user.id,
            test: req.params.id
        });

        if (userResults.length >= test.maxAttempts) {
            return res.status(400).json({
                message: 'Maximum attempts reached for this test'
            });
        }

        // Calculate score
        let totalScore = 0;
        const processedAnswers = answers.map(answer => {
            const question = test.questions.id(answer.questionId);
            if (!question) return null;

            const isCorrect = JSON.stringify(answer.answer) === JSON.stringify(question.correctAnswer);
            const points = isCorrect ? (question.points || 1) : 0;
            totalScore += points;

            return {
                questionId: answer.questionId,
                answer: answer.answer,
                isCorrect,
                points,
                timeSpent: answer.timeSpent || 0
            };
        }).filter(Boolean);

        const percentage = (totalScore / test.totalPoints) * 100;
        const passed = percentage >= test.passingScore;

        // Create test result
        const testResult = new TestResult({
            user: req.user.id,
            test: req.params.id,
            answers: processedAnswers,
            score: totalScore,
            percentage: Math.round(percentage * 100) / 100,
            passed,
            timeSpent,
            attemptNumber: userResults.length + 1,
            startedAt: new Date(Date.now() - timeSpent * 1000),
            completedAt: new Date()
        });

        await testResult.save();

        res.json({
            message: 'Test submitted successfully',
            result: {
                score: totalScore,
                totalPoints: test.totalPoints,
                percentage: Math.round(percentage * 100) / 100,
                passed,
                timeSpent,
                attemptNumber: testResult.attemptNumber
            }
        });
    } catch (error) {
        console.error('Test submission error:', error);
        res.status(500).json({ message: 'Server error while submitting test' });
    }
};

// @desc    Get all user's test results
// @access  Private
const getUserTestResults = async (req, res) => {
    try {
        const results = await TestResult.find({ user: req.user.id })
            .populate('test', 'title category difficulty')
            .sort({ completedAt: -1 });

        res.json({ results });
    } catch (error) {
        console.error('User test results fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching user test results' });
    }
};

// @desc    Get user's test results for a specific test
// @access  Private
const getTestResults = async (req, res) => {
    try {
        const results = await TestResult.find({
            user: req.user.id,
            test: req.params.id
        }).sort({ completedAt: -1 });

        res.json({ results });
    } catch (error) {
        console.error('Test results fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching test results' });
    }
};

module.exports = {
    getAllTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest,
    startTest,
    submitTest,
    getUserTestResults,
    getTestResults
};
