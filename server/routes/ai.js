const express = require('express');
const axios = require('axios');
const Profile = require('../models/Profile');
const Certificate = require('../models/Certificate');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ollama API configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

// Helper function to call Ollama API
const callOllama = async (prompt) => {
    try {
        const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false
        }, {
            timeout: 30000 // 30 seconds timeout
        });

        return response.data.response;
    } catch (error) {
        console.error('Ollama API error:', error);
        throw new Error('AI service temporarily unavailable');
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

        res.json({
            message: 'Career advice generated successfully',
            advice
        });
    } catch (error) {
        console.error('Career advice error:', error);
        res.status(500).json({
            message: 'Error generating career advice',
            error: error.message
        });
    }
});

// @route   GET /api/ai/health
// @desc    Check AI service health
// @access  Public
router.get('/health', async (req, res) => {
    try {
        // Test Ollama connection
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
            timeout: 5000
        });

        res.json({
            status: 'healthy',
            ollama: {
                connected: true,
                models: response.data.models || []
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            ollama: {
                connected: false,
                error: error.message
            }
        });
    }
});

module.exports = router;
