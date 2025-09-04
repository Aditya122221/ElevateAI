const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');
const Test = require('../models/Test');
require('dotenv').config();

// Sample certificates data
const certificates = [
    {
        name: "AWS Certified Solutions Architect - Associate",
        provider: "Amazon Web Services",
        description: "This certification validates your ability to design and deploy scalable systems on AWS. It covers architectural best practices, security, and cost optimization.",
        category: "cloud-computing",
        skills: [
            { name: "AWS Services", level: "intermediate" },
            { name: "Cloud Architecture", level: "intermediate" },
            { name: "Security", level: "intermediate" },
            { name: "Cost Optimization", level: "beginner" }
        ],
        topics: [
            "EC2 and VPC",
            "S3 and Storage Services",
            "RDS and Database Services",
            "IAM and Security",
            "CloudFormation",
            "Load Balancing",
            "Auto Scaling",
            "Monitoring and Logging"
        ],
        duration: "130 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "Basic understanding of AWS services",
            "Experience with cloud computing concepts",
            "Knowledge of networking fundamentals"
        ],
        cost: {
            amount: 150,
            currency: "USD",
            free: false
        },
        format: ["online"],
        language: "English",
        validity: "3 years",
        examDetails: {
            format: "multiple-choice",
            duration: "130 minutes",
            passingScore: 72,
            attempts: 2
        },
        benefits: [
            "Industry-recognized certification",
            "Higher salary potential",
            "Career advancement opportunities",
            "Access to AWS professional community"
        ],
        targetAudience: [
            "Solutions Architects",
            "Cloud Engineers",
            "DevOps Engineers",
            "System Administrators"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Cloud Solutions Architect",
            "AWS Engineer",
            "Cloud Consultant",
            "DevOps Engineer"
        ],
        averageSalary: {
            min: 90000,
            max: 150000,
            currency: "USD"
        },
        enrollmentUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        officialWebsite: "https://aws.amazon.com/certification/",
        rating: {
            average: 4.5,
            count: 1250
        }
    },
    {
        name: "Google Cloud Professional Data Engineer",
        provider: "Google Cloud",
        description: "This certification demonstrates your ability to design and build data processing systems on Google Cloud Platform using machine learning and data engineering best practices.",
        category: "data-science",
        skills: [
            { name: "Google Cloud Platform", level: "intermediate" },
            { name: "Data Engineering", level: "advanced" },
            { name: "Machine Learning", level: "intermediate" },
            { name: "BigQuery", level: "intermediate" }
        ],
        topics: [
            "BigQuery and Data Warehousing",
            "Cloud Dataflow",
            "Cloud Dataproc",
            "Cloud Pub/Sub",
            "Machine Learning APIs",
            "Data Pipeline Design",
            "Data Security and Privacy",
            "Cost Optimization"
        ],
        duration: "120 minutes",
        difficulty: "advanced",
        prerequisites: [
            "Experience with data engineering",
            "Knowledge of SQL and Python",
            "Understanding of machine learning concepts",
            "Google Cloud Platform experience"
        ],
        cost: {
            amount: 200,
            currency: "USD",
            free: false
        },
        format: ["online"],
        language: "English",
        validity: "2 years",
        examDetails: {
            format: "multiple-choice",
            duration: "120 minutes",
            passingScore: 70,
            attempts: 2
        },
        benefits: [
            "High-demand skill set",
            "Competitive salary",
            "Access to Google Cloud community",
            "Career growth opportunities"
        ],
        targetAudience: [
            "Data Engineers",
            "Data Scientists",
            "ML Engineers",
            "Analytics Engineers"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Data Engineer",
            "ML Engineer",
            "Analytics Engineer",
            "Cloud Data Architect"
        ],
        averageSalary: {
            min: 100000,
            max: 180000,
            currency: "USD"
        },
        enrollmentUrl: "https://cloud.google.com/certification/data-engineer",
        officialWebsite: "https://cloud.google.com/certification/",
        rating: {
            average: 4.3,
            count: 890
        }
    },
    {
        name: "Certified Ethical Hacker (CEH)",
        provider: "EC-Council",
        description: "The CEH certification validates your knowledge of ethical hacking and penetration testing techniques. It covers the latest tools and methodologies used by ethical hackers.",
        category: "cybersecurity",
        skills: [
            { name: "Ethical Hacking", level: "intermediate" },
            { name: "Penetration Testing", level: "intermediate" },
            { name: "Network Security", level: "intermediate" },
            { name: "Vulnerability Assessment", level: "intermediate" }
        ],
        topics: [
            "Footprinting and Reconnaissance",
            "Scanning Networks",
            "Enumeration",
            "System Hacking",
            "Malware Threats",
            "Sniffing",
            "Social Engineering",
            "Denial of Service",
            "Session Hijacking",
            "Web Application Security"
        ],
        duration: "240 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "2 years of information security experience",
            "Knowledge of networking fundamentals",
            "Understanding of operating systems",
            "Basic programming knowledge"
        ],
        cost: {
            amount: 1199,
            currency: "USD",
            free: false
        },
        format: ["online", "in-person"],
        language: "English",
        validity: "3 years",
        examDetails: {
            format: "multiple-choice",
            duration: "240 minutes",
            passingScore: 70,
            attempts: 2
        },
        benefits: [
            "Industry-recognized certification",
            "High salary potential",
            "Career advancement",
            "Access to security community"
        ],
        targetAudience: [
            "Security Professionals",
            "Penetration Testers",
            "Network Administrators",
            "IT Auditors"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Ethical Hacker",
            "Penetration Tester",
            "Security Analyst",
            "Cybersecurity Consultant"
        ],
        averageSalary: {
            min: 70000,
            max: 130000,
            currency: "USD"
        },
        enrollmentUrl: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
        officialWebsite: "https://www.eccouncil.org/",
        rating: {
            average: 4.2,
            count: 2100
        }
    },
    {
        name: "React Developer Certification",
        provider: "Meta",
        description: "This certification validates your skills in building modern web applications using React. It covers React fundamentals, hooks, state management, and best practices.",
        category: "programming",
        skills: [
            { name: "React", level: "intermediate" },
            { name: "JavaScript", level: "intermediate" },
            { name: "JSX", level: "intermediate" },
            { name: "State Management", level: "beginner" }
        ],
        topics: [
            "React Fundamentals",
            "Components and Props",
            "State and Lifecycle",
            "Event Handling",
            "Conditional Rendering",
            "Lists and Keys",
            "Forms and Controlled Components",
            "Hooks (useState, useEffect)",
            "Context API",
            "Performance Optimization"
        ],
        duration: "90 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "JavaScript fundamentals",
            "HTML and CSS knowledge",
            "Basic understanding of web development",
            "Node.js and npm experience"
        ],
        cost: {
            amount: 99,
            currency: "USD",
            free: false
        },
        format: ["online"],
        language: "English",
        validity: "2 years",
        examDetails: {
            format: "multiple-choice",
            duration: "90 minutes",
            passingScore: 75,
            attempts: 3
        },
        benefits: [
            "Industry-recognized certification",
            "Career advancement",
            "Access to Meta developer community",
            "Portfolio enhancement"
        ],
        targetAudience: [
            "Frontend Developers",
            "Web Developers",
            "JavaScript Developers",
            "UI/UX Developers"
        ],
        industryRecognition: "medium",
        jobRoles: [
            "React Developer",
            "Frontend Developer",
            "JavaScript Developer",
            "UI Developer"
        ],
        averageSalary: {
            min: 60000,
            max: 120000,
            currency: "USD"
        },
        enrollmentUrl: "https://www.meta.com/certifications/",
        officialWebsite: "https://react.dev/",
        rating: {
            average: 4.4,
            count: 3200
        }
    },
    {
        name: "PMP - Project Management Professional",
        provider: "Project Management Institute",
        description: "The PMP certification is the most important industry-recognized certification for project managers. It validates your competence to perform in the role of a project manager.",
        category: "project-management",
        skills: [
            { name: "Project Management", level: "advanced" },
            { name: "Leadership", level: "intermediate" },
            { name: "Risk Management", level: "intermediate" },
            { name: "Stakeholder Management", level: "intermediate" }
        ],
        topics: [
            "Project Integration Management",
            "Project Scope Management",
            "Project Schedule Management",
            "Project Cost Management",
            "Project Quality Management",
            "Project Resource Management",
            "Project Communications Management",
            "Project Risk Management",
            "Project Procurement Management",
            "Project Stakeholder Management"
        ],
        duration: "230 minutes",
        difficulty: "advanced",
        prerequisites: [
            "Secondary degree with 7,500 hours leading projects",
            "OR four-year degree with 4,500 hours leading projects",
            "35 hours of project management education"
        ],
        cost: {
            amount: 405,
            currency: "USD",
            free: false
        },
        format: ["online", "in-person"],
        language: "English",
        validity: "3 years",
        examDetails: {
            format: "multiple-choice",
            duration: "230 minutes",
            passingScore: 61,
            attempts: 3
        },
        benefits: [
            "Global recognition",
            "Higher salary potential",
            "Career advancement",
            "Professional credibility"
        ],
        targetAudience: [
            "Project Managers",
            "Program Managers",
            "Portfolio Managers",
            "Team Leads"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Project Manager",
            "Program Manager",
            "Portfolio Manager",
            "Project Director"
        ],
        averageSalary: {
            min: 80000,
            max: 140000,
            currency: "USD"
        },
        enrollmentUrl: "https://www.pmi.org/certifications/project-management-pmp",
        officialWebsite: "https://www.pmi.org/",
        rating: {
            average: 4.1,
            count: 4500
        }
    }
];

// Sample tests data
const tests = [
    {
        title: "JavaScript Fundamentals Assessment",
        description: "Test your knowledge of JavaScript basics including variables, functions, objects, and ES6 features.",
        category: "programming",
        difficulty: "beginner",
        duration: 30,
        questions: [
            {
                question: "What is the correct way to declare a variable in JavaScript?",
                type: "multiple-choice",
                options: [
                    "var myVar = 5;",
                    "variable myVar = 5;",
                    "v myVar = 5;",
                    "declare myVar = 5;"
                ],
                correctAnswer: 0,
                explanation: "The correct way to declare a variable in JavaScript is using 'var', 'let', or 'const' keywords.",
                points: 1
            },
            {
                question: "Which method is used to add an element to the end of an array?",
                type: "multiple-choice",
                options: [
                    "push()",
                    "pop()",
                    "shift()",
                    "unshift()"
                ],
                correctAnswer: 0,
                explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
                points: 1
            },
            {
                question: "What will be the output of: console.log(typeof null);",
                type: "multiple-choice",
                options: [
                    "null",
                    "undefined",
                    "object",
                    "string"
                ],
                correctAnswer: 2,
                explanation: "typeof null returns 'object' in JavaScript, which is a known quirk of the language.",
                points: 1
            },
            {
                question: "Which ES6 feature allows you to destructure arrays and objects?",
                type: "multiple-choice",
                options: [
                    "Arrow functions",
                    "Template literals",
                    "Destructuring assignment",
                    "Spread operator"
                ],
                correctAnswer: 2,
                explanation: "Destructuring assignment allows you to unpack values from arrays or properties from objects into distinct variables.",
                points: 1
            },
            {
                question: "What is the difference between '==' and '===' in JavaScript?",
                type: "multiple-choice",
                options: [
                    "No difference",
                    "'==' compares values, '===' compares values and types",
                    "'===' is faster",
                    "'==' is newer syntax"
                ],
                correctAnswer: 1,
                explanation: "'==' performs type coercion and compares values, while '===' compares both values and types without coercion.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 60,
        maxAttempts: 3,
        tags: ["JavaScript", "Programming", "Basics", "ES6"],
        skills: ["JavaScript", "Programming Fundamentals", "ES6"]
    },
    {
        title: "React Components and Hooks",
        description: "Assess your understanding of React components, lifecycle methods, and modern hooks.",
        category: "programming",
        difficulty: "intermediate",
        duration: 45,
        questions: [
            {
                question: "What is the purpose of the useEffect hook?",
                type: "multiple-choice",
                options: [
                    "To manage component state",
                    "To perform side effects in functional components",
                    "To create custom hooks",
                    "To handle form submissions"
                ],
                correctAnswer: 1,
                explanation: "useEffect is used to perform side effects in functional components, similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
                points: 1
            },
            {
                question: "Which hook should you use to manage local component state?",
                type: "multiple-choice",
                options: [
                    "useEffect",
                    "useState",
                    "useContext",
                    "useReducer"
                ],
                correctAnswer: 1,
                explanation: "useState is the hook used to manage local component state in functional components.",
                points: 1
            },
            {
                question: "What is the correct way to pass data from parent to child component?",
                type: "multiple-choice",
                options: [
                    "Using props",
                    "Using state",
                    "Using refs",
                    "Using context"
                ],
                correctAnswer: 0,
                explanation: "Props are the standard way to pass data from parent to child components in React.",
                points: 1
            },
            {
                question: "When does a React component re-render?",
                type: "multiple-choice",
                options: [
                    "Only when props change",
                    "Only when state changes",
                    "When props or state change",
                    "Never, components are static"
                ],
                correctAnswer: 2,
                explanation: "React components re-render when their props or state change, or when their parent component re-renders.",
                points: 1
            },
            {
                question: "What is the purpose of the key prop in React lists?",
                type: "multiple-choice",
                options: [
                    "To style list items",
                    "To help React identify which items have changed",
                    "To sort the list",
                    "To filter the list"
                ],
                correctAnswer: 1,
                explanation: "The key prop helps React identify which items have changed, been added, or removed, improving performance.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["React", "Hooks", "Components", "Frontend"],
        skills: ["React", "JavaScript", "Frontend Development", "Hooks"]
    },
    {
        title: "Data Science Fundamentals",
        description: "Test your knowledge of data science concepts, statistics, and machine learning basics.",
        category: "data-science",
        difficulty: "intermediate",
        duration: 60,
        questions: [
            {
                question: "What is the difference between supervised and unsupervised learning?",
                type: "multiple-choice",
                options: [
                    "No difference",
                    "Supervised uses labeled data, unsupervised doesn't",
                    "Unsupervised is faster",
                    "Supervised is more accurate"
                ],
                correctAnswer: 1,
                explanation: "Supervised learning uses labeled training data, while unsupervised learning finds patterns in data without labels.",
                points: 1
            },
            {
                question: "What does 'overfitting' mean in machine learning?",
                type: "multiple-choice",
                options: [
                    "Model is too simple",
                    "Model performs well on training data but poorly on test data",
                    "Model is too slow",
                    "Model has too few parameters"
                ],
                correctAnswer: 1,
                explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.",
                points: 1
            },
            {
                question: "Which metric is best for evaluating classification models with imbalanced classes?",
                type: "multiple-choice",
                options: [
                    "Accuracy",
                    "Precision",
                    "Recall",
                    "F1-Score"
                ],
                correctAnswer: 3,
                explanation: "F1-Score is the harmonic mean of precision and recall, providing a balanced measure for imbalanced datasets.",
                points: 1
            },
            {
                question: "What is the purpose of cross-validation?",
                type: "multiple-choice",
                options: [
                    "To increase model accuracy",
                    "To reduce overfitting and get better performance estimates",
                    "To speed up training",
                    "To reduce model complexity"
                ],
                correctAnswer: 1,
                explanation: "Cross-validation helps reduce overfitting and provides more reliable estimates of model performance.",
                points: 1
            },
            {
                question: "What is the difference between correlation and causation?",
                type: "multiple-choice",
                options: [
                    "No difference",
                    "Correlation implies causation",
                    "Correlation doesn't imply causation",
                    "Causation is always stronger"
                ],
                correctAnswer: 2,
                explanation: "Correlation measures the relationship between variables, but doesn't imply that one causes the other.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["Data Science", "Machine Learning", "Statistics", "Analytics"],
        skills: ["Data Science", "Machine Learning", "Statistics", "Python"]
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevateai');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Certificate.deleteMany({});
        await Test.deleteMany({});
        console.log('Cleared existing data');

        // Insert certificates
        const insertedCertificates = await Certificate.insertMany(certificates);
        console.log(`Inserted ${insertedCertificates.length} certificates`);

        // Insert tests
        const insertedTests = await Test.insertMany(tests);
        console.log(`Inserted ${insertedTests.length} tests`);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seed function
seedDatabase();
