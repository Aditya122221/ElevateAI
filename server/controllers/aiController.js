const axios = require('axios');
const BasicDetails = require('../models/BasicDetails');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const Experience = require('../models/Experience');
const JobRoles = require('../models/JobRoles');

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
            timeout: 30000 // 30 second timeout
        });

        if (response.data && response.data.response) {
            console.log('Ollama response received successfully');
            return response.data.response;
        } else {
            console.error('Unexpected Ollama response format:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Ollama API error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Ollama service is not running. Please start Ollama and try again.');
        }
        // Return null instead of throwing error to allow graceful fallback
        return null;
    }
};

// @desc    Analyze user profile and generate recommendations
// @access  Private
const analyzeProfile = async (req, res) => {
    try {
        // Get all sections data
        const [basicDetails, skills, projects, experience, jobRoles] = await Promise.allSettled([
            BasicDetails.findOne({ user: req.user.id }),
            Skills.findOne({ user: req.user.id }),
            Projects.findOne({ user: req.user.id }),
            Experience.findOne({ user: req.user.id }),
            JobRoles.findOne({ user: req.user.id })
        ]);

        // Check if required sections exist
        if (!basicDetails.value || !skills.value || !jobRoles.value) {
            return res.status(404).json({ message: 'Profile not found. Please complete your profile first.' });
        }

        // Create a comprehensive prompt for AI analysis
        const prompt = `
    Analyze the following user profile and provide personalized career recommendations:

    Personal Information:
    - Name: ${basicDetails.value.firstName} ${basicDetails.value.lastName}
    - Email: ${basicDetails.value.email}
    - LinkedIn: ${basicDetails.value.linkedin}
    - GitHub: ${basicDetails.value.github}
    - Bio: ${basicDetails.value.bio || 'Not specified'}

    Desired Job Roles:
    - ${jobRoles.value.desiredJobRoles.join(', ')}

    Technical Skills:
    - Programming Languages: ${skills.value.languages.join(', ') || 'None specified'}
    - Technologies: ${skills.value.technologies.join(', ') || 'None specified'}
    - Frameworks: ${skills.value.frameworks.join(', ') || 'None specified'}
    - Tools: ${skills.value.tools.join(', ') || 'None specified'}
    - Soft Skills: ${skills.value.softSkills.join(', ') || 'None specified'}

    Projects:
    ${projects.value?.projects?.map(project => `
    - ${project.name}
      Details: ${project.details.join(', ')}
      Technologies: ${project.skillsUsed?.join(', ') || 'None specified'}
      Duration: ${project.startDate} to ${project.endDate || 'Present'}
    `).join('') || 'No projects specified'}

    Experience:
    ${experience.value?.experiences?.map(exp => `
    - ${exp.position} at ${exp.companyName}
      Duration: ${exp.startDate} to ${exp.endDate || 'Present'}
      Skills: ${exp.skills?.join(', ') || 'None specified'}
      Achievements: ${exp.achievements?.join(', ') || 'None specified'}
    `).join('') || 'No experience specified'}

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
                // Try to extract JSON from the response
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    recommendations = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError);
                console.log('Raw AI response:', aiResponse);

                // Fallback recommendations
                recommendations = {
                    suggestedSkills: [
                        "Advanced JavaScript/TypeScript",
                        "Cloud Computing (AWS/Azure)",
                        "Database Design & Optimization",
                        "System Architecture",
                        "DevOps & CI/CD"
                    ],
                    suggestedCertifications: [
                        "AWS Certified Developer",
                        "Google Cloud Professional",
                        "Microsoft Azure Fundamentals"
                    ],
                    careerPath: [
                        "Junior Developer",
                        "Mid-level Developer",
                        "Senior Developer",
                        "Tech Lead/Architect"
                    ],
                    skillGaps: [
                        "Advanced system design",
                        "Cloud platform expertise",
                        "Leadership skills"
                    ],
                    analysis: "Based on your profile, focus on advancing your technical skills and gaining cloud computing experience to progress in your career."
                };
            }
        } else {
            // AI service unavailable - return fallback recommendations
            console.log('AI service unavailable, using fallback recommendations');
            recommendations = {
                suggestedSkills: [
                    "Advanced JavaScript/TypeScript",
                    "Cloud Computing (AWS/Azure)",
                    "Database Design & Optimization",
                    "System Architecture",
                    "DevOps & CI/CD"
                ],
                suggestedCertifications: [
                    "AWS Certified Developer",
                    "Google Cloud Professional",
                    "Microsoft Azure Fundamentals"
                ],
                careerPath: [
                    "Junior Developer",
                    "Mid-level Developer",
                    "Senior Developer",
                    "Tech Lead/Architect"
                ],
                skillGaps: [
                    "Advanced system design",
                    "Cloud platform expertise",
                    "Leadership skills"
                ],
                analysis: "Based on your profile, focus on advancing your technical skills and gaining cloud computing experience to progress in your career."
            };
        }

        res.json({
            message: 'Profile analysis completed successfully',
            recommendations: recommendations,
            aiServiceAvailable: !!aiResponse
        });

    } catch (error) {
        console.error('Profile analysis error:', error);
        res.status(500).json({
            message: 'Error analyzing profile',
            error: error.message
        });
    }
};

// @desc    Generate personalized test questions
// @access  Private
const generateTestQuestions = async (req, res) => {
    try {
        const { topic, difficulty, count = 5 } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        const prompt = `
        Generate ${count} ${difficulty || 'intermediate'} level questions about ${topic}.
        
        Each question should have:
        - A clear, specific question
        - 4 multiple choice options (A, B, C, D)
        - One correct answer
        - A brief explanation
        
        Format as JSON:
        {
          "questions": [
            {
              "question": "Question text here?",
              "options": {
                "A": "Option A",
                "B": "Option B", 
                "C": "Option C",
                "D": "Option D"
              },
              "correctAnswer": "A",
              "explanation": "Brief explanation of why this is correct"
            }
          ]
        }
        `;

        const aiResponse = await callOllama(prompt);

        if (aiResponse) {
            try {
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const questions = JSON.parse(jsonMatch[0]);
                    res.json({
                        message: 'Test questions generated successfully',
                        questions: questions.questions || [],
                        aiServiceAvailable: true
                    });
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse test questions:', parseError);
                res.status(500).json({
                    message: 'Failed to generate test questions',
                    error: 'AI response parsing failed'
                });
            }
        } else {
            // Fallback questions
            const fallbackQuestions = [
                {
                    question: `What is the primary purpose of ${topic}?`,
                    options: {
                        A: "Option A",
                        B: "Option B",
                        C: "Option C",
                        D: "Option D"
                    },
                    correctAnswer: "A",
                    explanation: "This is a fallback question generated when AI service is unavailable."
                }
            ];

            res.json({
                message: 'Test questions generated (fallback mode)',
                questions: fallbackQuestions,
                aiServiceAvailable: false
            });
        }

    } catch (error) {
        console.error('Test generation error:', error);
        res.status(500).json({
            message: 'Error generating test questions',
            error: error.message
        });
    }
};

module.exports = {
    analyzeProfile,
    generateTestQuestions
};