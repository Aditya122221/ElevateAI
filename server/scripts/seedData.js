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
    },
    {
        name: "Microsoft Azure Fundamentals (AZ-900)",
        provider: "Microsoft",
        description: "This certification validates your foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
        category: "cloud-computing",
        skills: [
            { name: "Azure Services", level: "beginner" },
            { name: "Cloud Computing", level: "beginner" },
            { name: "Security", level: "beginner" },
            { name: "Pricing", level: "beginner" }
        ],
        topics: [
            "Cloud Concepts",
            "Azure Architecture and Services",
            "Azure Management and Governance",
            "Azure Security",
            "Azure Pricing and Support"
        ],
        duration: "85 minutes",
        difficulty: "beginner",
        prerequisites: [
            "Basic understanding of cloud computing",
            "General IT knowledge"
        ],
        cost: {
            amount: 99,
            currency: "USD",
            free: false
        },
        format: ["online", "in-person"],
        language: "English",
        validity: "No expiration",
        examDetails: {
            format: "multiple-choice",
            duration: "85 minutes",
            passingScore: 70,
            attempts: 5
        },
        benefits: [
            "Industry-recognized certification",
            "Foundation for advanced Azure certifications",
            "Career advancement opportunities",
            "Access to Microsoft learning resources"
        ],
        targetAudience: [
            "IT Professionals",
            "Students",
            "Career Changers",
            "Business Stakeholders"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Cloud Administrator",
            "Solutions Architect",
            "DevOps Engineer",
            "Cloud Consultant"
        ],
        averageSalary: {
            min: 50000,
            max: 100000,
            currency: "USD"
        },
        enrollmentUrl: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/",
        officialWebsite: "https://azure.microsoft.com/",
        rating: {
            average: 4.3,
            count: 8500
        }
    },
    {
        name: "Google Analytics Individual Qualification (GAIQ)",
        provider: "Google",
        description: "The Google Analytics Individual Qualification demonstrates your proficiency in Google Analytics and digital analytics.",
        category: "marketing",
        skills: [
            { name: "Google Analytics", level: "intermediate" },
            { name: "Digital Marketing", level: "intermediate" },
            { name: "Data Analysis", level: "beginner" },
            { name: "Reporting", level: "beginner" }
        ],
        topics: [
            "Google Analytics Setup",
            "Data Collection and Processing",
            "Configuration and Administration",
            "Conversion and Attribution",
            "Reports, Metrics, and Dimensions"
        ],
        duration: "90 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "Basic understanding of digital marketing",
            "Experience with Google Analytics",
            "Knowledge of web analytics concepts"
        ],
        cost: {
            amount: 0,
            currency: "USD",
            free: true
        },
        format: ["online"],
        language: "English",
        validity: "18 months",
        examDetails: {
            format: "multiple-choice",
            duration: "90 minutes",
            passingScore: 80,
            attempts: 3
        },
        benefits: [
            "Free certification",
            "Industry recognition",
            "Career advancement",
            "Access to Google resources"
        ],
        targetAudience: [
            "Digital Marketers",
            "Analytics Professionals",
            "Marketing Managers",
            "Business Analysts"
        ],
        industryRecognition: "medium",
        jobRoles: [
            "Digital Marketing Specialist",
            "Analytics Manager",
            "Marketing Analyst",
            "Growth Hacker"
        ],
        averageSalary: {
            min: 45000,
            max: 85000,
            currency: "USD"
        },
        enrollmentUrl: "https://skillshop.exceedlms.com/student/catalog",
        officialWebsite: "https://analytics.google.com/",
        rating: {
            average: 4.0,
            count: 12000
        }
    },
    {
        name: "CompTIA Security+",
        provider: "CompTIA",
        description: "CompTIA Security+ is a global certification that validates the baseline skills necessary to perform core security functions and pursue an IT security career.",
        category: "cybersecurity",
        skills: [
            { name: "Network Security", level: "intermediate" },
            { name: "Threats and Vulnerabilities", level: "intermediate" },
            { name: "Identity Management", level: "intermediate" },
            { name: "Risk Management", level: "intermediate" }
        ],
        topics: [
            "Threats, Attacks and Vulnerabilities",
            "Architecture and Design",
            "Implementation",
            "Operations and Incident Response",
            "Governance, Risk and Compliance"
        ],
        duration: "90 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "CompTIA Network+ certification recommended",
            "2 years of IT administration experience",
            "Basic understanding of security concepts"
        ],
        cost: {
            amount: 370,
            currency: "USD",
            free: false
        },
        format: ["online", "in-person"],
        language: "English",
        validity: "3 years",
        examDetails: {
            format: "multiple-choice",
            duration: "90 minutes",
            passingScore: 75,
            attempts: 3
        },
        benefits: [
            "Industry-recognized certification",
            "DoD approved",
            "Career advancement",
            "Foundation for advanced security certifications"
        ],
        targetAudience: [
            "Security Specialists",
            "Network Administrators",
            "IT Auditors",
            "Security Consultants"
        ],
        industryRecognition: "high",
        jobRoles: [
            "Security Specialist",
            "Security Administrator",
            "Security Analyst",
            "IT Auditor"
        ],
        averageSalary: {
            min: 55000,
            max: 95000,
            currency: "USD"
        },
        enrollmentUrl: "https://www.comptia.org/certifications/security",
        officialWebsite: "https://www.comptia.org/",
        rating: {
            average: 4.2,
            count: 15000
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
    },
    {
        title: "Cloud Computing Fundamentals",
        description: "Test your understanding of cloud computing concepts, services, and deployment models.",
        category: "cloud-computing",
        difficulty: "beginner",
        duration: 40,
        questions: [
            {
                question: "What are the three main cloud service models?",
                type: "multiple-choice",
                options: [
                    "Public, Private, Hybrid",
                    "IaaS, PaaS, SaaS",
                    "On-premise, Cloud, Edge",
                    "Local, Regional, Global"
                ],
                correctAnswer: 1,
                explanation: "The three main cloud service models are Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
                points: 1
            },
            {
                question: "Which cloud deployment model provides the highest level of control and security?",
                type: "multiple-choice",
                options: [
                    "Public Cloud",
                    "Private Cloud",
                    "Hybrid Cloud",
                    "Community Cloud"
                ],
                correctAnswer: 1,
                explanation: "Private cloud provides the highest level of control and security as it's dedicated to a single organization.",
                points: 1
            },
            {
                question: "What is the main advantage of cloud computing?",
                type: "multiple-choice",
                options: [
                    "Lower initial costs",
                    "Scalability and flexibility",
                    "Better security",
                    "Faster internet"
                ],
                correctAnswer: 1,
                explanation: "The main advantage of cloud computing is scalability and flexibility, allowing resources to be scaled up or down as needed.",
                points: 1
            },
            {
                question: "Which AWS service provides virtual servers in the cloud?",
                type: "multiple-choice",
                options: [
                    "S3",
                    "EC2",
                    "RDS",
                    "Lambda"
                ],
                correctAnswer: 1,
                explanation: "Amazon EC2 (Elastic Compute Cloud) provides virtual servers in the cloud.",
                points: 1
            },
            {
                question: "What does 'auto-scaling' mean in cloud computing?",
                type: "multiple-choice",
                options: [
                    "Automatic backup",
                    "Automatic security updates",
                    "Automatic resource adjustment based on demand",
                    "Automatic cost optimization"
                ],
                correctAnswer: 2,
                explanation: "Auto-scaling automatically adjusts computing resources based on demand to maintain performance and optimize costs.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 60,
        maxAttempts: 3,
        tags: ["Cloud Computing", "AWS", "Azure", "GCP"],
        skills: ["Cloud Computing", "AWS", "Infrastructure", "Scalability"]
    },
    {
        title: "Cybersecurity Basics",
        description: "Assess your knowledge of fundamental cybersecurity concepts and best practices.",
        category: "cybersecurity",
        difficulty: "beginner",
        duration: 35,
        questions: [
            {
                question: "What is the primary goal of cybersecurity?",
                type: "multiple-choice",
                options: [
                    "To make systems faster",
                    "To protect information and systems from threats",
                    "To reduce costs",
                    "To improve user experience"
                ],
                correctAnswer: 1,
                explanation: "The primary goal of cybersecurity is to protect information and systems from threats, vulnerabilities, and attacks.",
                points: 1
            },
            {
                question: "What is a 'phishing' attack?",
                type: "multiple-choice",
                options: [
                    "A physical attack on servers",
                    "A social engineering attack using fake emails",
                    "A type of malware",
                    "A network intrusion"
                ],
                correctAnswer: 1,
                explanation: "Phishing is a social engineering attack that uses fake emails or messages to trick users into revealing sensitive information.",
                points: 1
            },
            {
                question: "What does 'MFA' stand for in cybersecurity?",
                type: "multiple-choice",
                options: [
                    "Multi-Factor Authentication",
                    "Multiple File Access",
                    "Managed Firewall Access",
                    "Mobile File Authentication"
                ],
                correctAnswer: 0,
                explanation: "MFA stands for Multi-Factor Authentication, which requires multiple forms of verification to access systems.",
                points: 1
            },
            {
                question: "What is the purpose of a firewall?",
                type: "multiple-choice",
                options: [
                    "To speed up internet connection",
                    "To block unauthorized network access",
                    "To store backup data",
                    "To manage user accounts"
                ],
                correctAnswer: 1,
                explanation: "A firewall is designed to block unauthorized network access while allowing authorized communications.",
                points: 1
            },
            {
                question: "What should you do if you suspect a security breach?",
                type: "multiple-choice",
                options: [
                    "Ignore it",
                    "Report it immediately to IT security",
                    "Fix it yourself",
                    "Wait and see what happens"
                ],
                correctAnswer: 1,
                explanation: "Security breaches should be reported immediately to IT security teams to minimize damage and prevent further compromise.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["Cybersecurity", "Security", "Threats", "Protection"],
        skills: ["Cybersecurity", "Information Security", "Risk Management", "Threat Analysis"]
    },
    {
        title: "Project Management Essentials",
        description: "Test your knowledge of project management principles, methodologies, and best practices.",
        category: "project-management",
        difficulty: "intermediate",
        duration: 50,
        questions: [
            {
                question: "What are the five phases of project management according to PMI?",
                type: "multiple-choice",
                options: [
                    "Initiate, Plan, Execute, Monitor, Close",
                    "Start, Design, Build, Test, Deploy",
                    "Analyze, Design, Develop, Test, Maintain",
                    "Plan, Do, Check, Act, Review"
                ],
                correctAnswer: 0,
                explanation: "The five phases of project management are: Initiate, Plan, Execute, Monitor & Control, and Close.",
                points: 1
            },
            {
                question: "What is the 'triple constraint' in project management?",
                type: "multiple-choice",
                options: [
                    "Time, Cost, Quality",
                    "Scope, Time, Cost",
                    "Resources, Time, Budget",
                    "Risk, Quality, Schedule"
                ],
                correctAnswer: 1,
                explanation: "The triple constraint consists of Scope, Time, and Cost - the three main factors that affect project success.",
                points: 1
            },
            {
                question: "What is a 'Gantt Chart' used for?",
                type: "multiple-choice",
                options: [
                    "Budget tracking",
                    "Risk assessment",
                    "Project scheduling and timeline visualization",
                    "Quality control"
                ],
                correctAnswer: 2,
                explanation: "A Gantt chart is used for project scheduling and timeline visualization, showing tasks and their dependencies over time.",
                points: 1
            },
            {
                question: "What does 'WBS' stand for in project management?",
                type: "multiple-choice",
                options: [
                    "Work Breakdown Structure",
                    "Weekly Business Summary",
                    "Work Budget Schedule",
                    "Work Balance Sheet"
                ],
                correctAnswer: 0,
                explanation: "WBS stands for Work Breakdown Structure, which breaks down the project into smaller, manageable components.",
                points: 1
            },
            {
                question: "What is the purpose of a 'risk register'?",
                type: "multiple-choice",
                options: [
                    "To track project expenses",
                    "To document and monitor project risks",
                    "To schedule team meetings",
                    "To track project progress"
                ],
                correctAnswer: 1,
                explanation: "A risk register is used to document and monitor project risks, including their probability, impact, and mitigation strategies.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["Project Management", "PMI", "Planning", "Leadership"],
        skills: ["Project Management", "Planning", "Risk Management", "Leadership"]
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
