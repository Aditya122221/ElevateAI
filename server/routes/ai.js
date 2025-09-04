const express = require('express');
const axios = require('axios');
const Profile = require('../models/Profile');
const Certificate = require('../models/Certificate');
const Test = require('../models/Test');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ollama API configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

// Helper function to call Ollama API
const callOllama = async (prompt) => {
    try {
        console.log(`Attempting to connect to Ollama at: ${OLLAMA_BASE_URL}`);
        console.log(`Using model: ${OLLAMA_MODEL}`);

        const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false
        }, {
            timeout: 30000 // Increased timeout for AI model processing
        });

        console.log('Ollama API call successful');
        return response.data.response;
    } catch (error) {
        console.error('Ollama API error:', error.message);
        console.error('Full error details:', {
            code: error.code,
            address: error.address,
            port: error.port,
            url: error.config?.url
        });
        // Return null instead of throwing error to allow graceful fallback
        return null;
    }
};

// @route   POST /api/ai/analyze-profile
// @desc    Analyze user profile and generate recommendations
// @access  Private
router.post('/analyze-profile', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        // Create a comprehensive prompt for AI analysis
        const prompt = `
    Analyze the following user profile and provide personalized career recommendations:

    Personal Information:
    - Name: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}
    - Age: ${profile.personalInfo.age || 'Not specified'}
    - Location: ${profile.personalInfo.location?.city || 'Not specified'}, ${profile.personalInfo.location?.country || 'Not specified'}

    Career Information:
    - Current Role: ${profile.careerInfo.currentRole || 'Not specified'}
    - Desired Role: ${profile.careerInfo.desiredRole}
    - Experience Level: ${profile.careerInfo.experienceLevel}
    - Industry: ${profile.careerInfo.industry || 'Not specified'}

    Technical Skills:
    ${profile.skills.technical.map(skill => `- ${skill.name} (${skill.level})`).join('\n') || 'None specified'}

    Soft Skills:
    ${profile.skills.soft.map(skill => `- ${skill.name} (${skill.level})`).join('\n') || 'None specified'}

    Interests:
    ${profile.interests.join(', ') || 'None specified'}

    Goals:
    Short-term: ${profile.goals.shortTerm.join(', ') || 'None specified'}
    Long-term: ${profile.goals.longTerm.join(', ') || 'None specified'}

    Based on this profile, please provide:
    1. 5-7 specific technical skills they should develop to advance in their desired role
    2. 3-5 relevant certifications that would boost their career
    3. A suggested career progression path with 3-4 steps
    4. Any gaps in their current skill set that need attention

    Format your response as a JSON object with the following structure:
    {
      "suggestedSkills": ["skill1", "skill2", "skill3"],
      "suggestedCertifications": ["cert1", "cert2", "cert3"],
      "careerPath": ["step1", "step2", "step3"],
      "skillGaps": ["gap1", "gap2", "gap3"],
      "analysis": "Brief analysis of their profile and recommendations"
    }
    `;

        const aiResponse = await callOllama(prompt);

        // Try to parse the AI response as JSON
        let recommendations;
        if (aiResponse) {
            try {
                // Extract JSON from the response (in case there's extra text)
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    recommendations = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                // Fallback recommendations if AI response parsing fails
                recommendations = {
                    suggestedSkills: ['JavaScript', 'React', 'Node.js', 'Database Management', 'Cloud Computing'],
                    suggestedCertifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Fundamentals'],
                    careerPath: ['Junior Developer', 'Mid-level Developer', 'Senior Developer', 'Tech Lead'],
                    skillGaps: ['Advanced Programming', 'System Design', 'Leadership Skills'],
                    analysis: 'Based on your profile, focus on building strong technical foundations and gaining relevant certifications.'
                };
            }
        } else {
            // AI service unavailable - use fallback recommendations
            console.log('AI service unavailable, using fallback recommendations');
            recommendations = {
                suggestedSkills: ['JavaScript', 'React', 'Node.js', 'Database Management', 'Cloud Computing'],
                suggestedCertifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Fundamentals'],
                careerPath: ['Junior Developer', 'Mid-level Developer', 'Senior Developer', 'Tech Lead'],
                skillGaps: ['Advanced Programming', 'System Design', 'Leadership Skills'],
                analysis: 'AI service is currently unavailable. Based on your profile, focus on building strong technical foundations and gaining relevant certifications.'
            };
        }

        // Update profile with AI recommendations
        profile.aiRecommendations = {
            ...recommendations,
            lastUpdated: new Date()
        };

        await profile.save();

        res.json({
            message: 'Profile analysis completed successfully',
            recommendations
        });
    } catch (error) {
        console.error('Profile analysis error:', error);
        res.status(500).json({
            message: 'Error analyzing profile',
            error: error.message
        });
    }
});

// @route   POST /api/ai/generate-test
// @desc    Generate AI-powered test questions
// @access  Private
router.post('/generate-test', auth, async (req, res) => {
    try {
        const { topic, difficulty, numberOfQuestions = 5 } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        const prompt = `
    Generate ${numberOfQuestions} multiple-choice questions about ${topic} at ${difficulty || 'intermediate'} level.
    
    Each question should have:
    - A clear, well-formulated question
    - 4 answer options (A, B, C, D)
    - One correct answer
    - A brief explanation of why the correct answer is right
    
    Format your response as a JSON array with the following structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation of the correct answer"
      }
    ]
    
    Make sure the questions are practical and relevant to real-world applications.
    `;

        const aiResponse = await callOllama(prompt);

        // Try to parse the AI response as JSON
        let questions;
        if (aiResponse) {
            try {
                const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    questions = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No JSON array found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse AI test response:', parseError);
                // Fallback questions if AI response parsing fails
                questions = [
                    {
                        question: `What is a key concept in ${topic}?`,
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        correctAnswer: 0,
                        explanation: 'This is the correct answer because...'
                    }
                ];
            }
        } else {
            // AI service unavailable - use fallback questions
            console.log('AI service unavailable, using fallback questions');
            questions = [
                {
                    question: `What is a key concept in ${topic}?`,
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: 0,
                    explanation: 'This is the correct answer because...'
                }
            ];
        }

        res.json({
            message: 'Test questions generated successfully',
            questions
        });
    } catch (error) {
        console.error('Test generation error:', error);
        res.status(500).json({
            message: 'Error generating test questions',
            error: error.message
        });
    }
});

// @route   POST /api/ai/career-advice
// @desc    Get personalized career advice
// @access  Private
router.post('/career-advice', auth, async (req, res) => {
    try {
        const { question } = req.body;
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        const prompt = `
    You are a career advisor. A user with the following profile is asking for advice:

    Profile Summary:
    - Desired Role: ${profile.careerInfo.desiredRole}
    - Experience Level: ${profile.careerInfo.experienceLevel}
    - Industry: ${profile.careerInfo.industry || 'Not specified'}
    - Technical Skills: ${profile.skills.technical.map(s => s.name).join(', ') || 'None'}
    - Goals: ${profile.goals.longTerm.join(', ') || 'None specified'}

    User's Question: ${question}

    Please provide thoughtful, personalized career advice based on their profile and question. 
    Keep your response practical and actionable, focusing on specific steps they can take.
    `;

        const advice = await callOllama(prompt);

        if (!advice) {
            // AI service unavailable - provide fallback advice
            console.log('AI service unavailable, using fallback career advice');
            const fallbackAdvice = `Based on your profile as a ${profile.careerInfo.desiredRole} with ${profile.careerInfo.experienceLevel} experience, I recommend focusing on building strong technical foundations, gaining hands-on experience with projects, and networking within your industry. Consider taking relevant courses and certifications to advance your career.`;

            res.json({
                message: 'Career advice generated successfully (AI service unavailable)',
                advice: fallbackAdvice
            });
        } else {
            res.json({
                message: 'Career advice generated successfully',
                advice
            });
        }
    } catch (error) {
        console.error('Career advice error:', error);
        res.status(500).json({
            message: 'Error generating career advice',
            error: error.message
        });
    }
});

// @route   GET /api/ai/recommendations/certificates
// @desc    Get AI-recommended certificates based on user profile
// @access  Private
router.get('/recommendations/certificates', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        // Get all certificates
        const allCertificates = await Certificate.find({});

        if (allCertificates.length === 0) {
            return res.json({
                message: 'No certificates available',
                certificates: [],
                recommendations: []
            });
        }

        // Create AI prompt for certificate recommendations
        const userSkills = profile.skills.technical.map(s => s.name).join(', ');
        const userInterests = profile.interests.join(', ');
        const desiredRole = profile.careerInfo.desiredRole;
        const experienceLevel = profile.careerInfo.experienceLevel;

        const certificateList = allCertificates.map(cert =>
            `- ${cert.name} (${cert.category}, ${cert.difficulty}): ${cert.description}`
        ).join('\n');

        const prompt = `
        Based on the user's profile, recommend the most relevant certificates from the following list:

        User Profile:
        - Desired Role: ${desiredRole}
        - Experience Level: ${experienceLevel}
        - Technical Skills: ${userSkills}
        - Interests: ${userInterests}

        Available Certificates:
        ${certificateList}

        Please return ONLY a JSON array of certificate names that are most relevant to this user's profile and career goals. 
        Return maximum 8 recommendations, prioritized by relevance.

        Format: ["Certificate Name 1", "Certificate Name 2", "Certificate Name 3"]
        `;

        const aiResponse = await callOllama(prompt);

        let recommendedCertNames = [];
        if (aiResponse) {
            try {
                const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
                if (jsonMatch) {
                    recommendedCertNames = JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                console.error('Failed to parse certificate recommendations:', parseError);
                // Fallback: return first 6 certificates
                recommendedCertNames = allCertificates.slice(0, 6).map(cert => cert.name);
            }
        } else {
            // AI service unavailable - use fallback recommendations
            console.log('AI service unavailable, using fallback certificate recommendations');
            recommendedCertNames = allCertificates.slice(0, 6).map(cert => cert.name);
        }

        // Filter certificates based on AI recommendations
        const recommendedCertificates = allCertificates.filter(cert =>
            recommendedCertNames.includes(cert.name)
        );

        // If AI didn't return enough recommendations, add some based on user skills
        if (recommendedCertificates.length < 4) {
            const skillBasedCerts = allCertificates.filter(cert =>
                userSkills.toLowerCase().includes(cert.category.toLowerCase()) ||
                cert.category.toLowerCase().includes(userSkills.toLowerCase())
            ).slice(0, 4 - recommendedCertificates.length);

            recommendedCertificates.push(...skillBasedCerts);
        }

        res.json({
            message: 'AI recommendations generated successfully',
            certificates: recommendedCertificates,
            totalAvailable: allCertificates.length,
            recommendedCount: recommendedCertificates.length
        });

    } catch (error) {
        console.error('Certificate recommendation error:', error);
        res.status(500).json({
            message: 'Error generating certificate recommendations',
            error: error.message
        });
    }
});

// @route   GET /api/ai/recommendations/tests
// @desc    Get AI-recommended tests based on user profile
// @access  Private
router.get('/recommendations/tests', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        // Get all tests
        const allTests = await Test.find({});

        if (allTests.length === 0) {
            return res.json({
                message: 'No tests available',
                tests: [],
                recommendations: []
            });
        }

        // Create AI prompt for test recommendations
        const userSkills = profile.skills.technical.map(s => s.name).join(', ');
        const userInterests = profile.interests.join(', ');
        const desiredRole = profile.careerInfo.desiredRole;
        const experienceLevel = profile.careerInfo.experienceLevel;

        const testList = allTests.map(test =>
            `- ${test.title} (${test.category}, ${test.difficulty}): ${test.description}`
        ).join('\n');

        const prompt = `
        Based on the user's profile, recommend the most relevant tests from the following list:

        User Profile:
        - Desired Role: ${desiredRole}
        - Experience Level: ${experienceLevel}
        - Technical Skills: ${userSkills}
        - Interests: ${userInterests}

        Available Tests:
        ${testList}

        IMPORTANT: You must return ONLY a JSON array with the EXACT test titles from the list above. Do not modify or paraphrase the titles.
        Return maximum 6 recommendations, prioritized by relevance and skill gaps.

        Format: ["JavaScript Fundamentals Assessment", "React Components and Hooks", "Data Science Fundamentals"]
        `;

        const aiResponse = await callOllama(prompt);
        console.log('AI Response for test recommendations:', aiResponse);

        let recommendedTestTitles = [];
        if (aiResponse) {
            try {
                const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
                if (jsonMatch) {
                    recommendedTestTitles = JSON.parse(jsonMatch[0]);
                    console.log('Parsed AI recommendations:', recommendedTestTitles);
                } else {
                    console.log('No JSON array found in AI response');
                }
            } catch (parseError) {
                console.error('Failed to parse test recommendations:', parseError);
                // Fallback: return first 4 tests
                recommendedTestTitles = allTests.slice(0, 4).map(test => test.title);
            }
        } else {
            // AI service unavailable - use fallback recommendations
            console.log('AI service unavailable, using fallback test recommendations');
            recommendedTestTitles = allTests.slice(0, 4).map(test => test.title);
        }

        // Filter tests based on AI recommendations
        const recommendedTests = allTests.filter(test =>
            recommendedTestTitles.includes(test.title)
        );
        console.log('Filtered recommended tests:', recommendedTests.map(t => t.title));

        // If AI didn't return enough recommendations, add some based on user skills
        if (recommendedTests.length < 3) {
            console.log('Not enough AI recommendations, adding skill-based tests');
            const skillBasedTests = allTests.filter(test =>
                userSkills.toLowerCase().includes(test.category.toLowerCase()) ||
                test.category.toLowerCase().includes(userSkills.toLowerCase())
            ).slice(0, 3 - recommendedTests.length);
            console.log('Skill-based tests:', skillBasedTests.map(t => t.title));

            recommendedTests.push(...skillBasedTests);
        }

        res.json({
            message: 'AI test recommendations generated successfully',
            tests: recommendedTests,
            totalAvailable: allTests.length,
            recommendedCount: recommendedTests.length
        });

    } catch (error) {
        console.error('Test recommendation error:', error);
        res.status(500).json({
            message: 'Error generating test recommendations',
            error: error.message
        });
    }
});

// @route   GET /api/ai/health
// @desc    Check AI service health
// @access  Public
router.get('/health', async (req, res) => {
    try {
        console.log(`Testing Ollama connection at: ${OLLAMA_BASE_URL}`);

        // Test Ollama connection
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
            timeout: 5000
        });

        console.log('Ollama health check successful');
        res.json({
            status: 'healthy',
            ollama: {
                connected: true,
                baseUrl: OLLAMA_BASE_URL,
                model: OLLAMA_MODEL,
                models: response.data.models || []
            }
        });
    } catch (error) {
        console.error('Ollama health check failed:', error.message);
        res.status(503).json({
            status: 'unhealthy',
            ollama: {
                connected: false,
                baseUrl: OLLAMA_BASE_URL,
                model: OLLAMA_MODEL,
                error: error.message,
                code: error.code
            }
        });
    }
});

module.exports = router;
