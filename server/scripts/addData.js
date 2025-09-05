const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');
const Test = require('../models/Test');
require('dotenv').config();

// Function to add a single certificate
const addCertificate = async (certificateData) => {
    try {
        const certificate = new Certificate(certificateData);
        const savedCertificate = await certificate.save();
        console.log('Certificate added successfully:', savedCertificate.name);
        return savedCertificate;
    } catch (error) {
        console.error('Error adding certificate:', error.message);
        throw error;
    }
};

// Function to add a single test
const addTest = async (testData) => {
    try {
        const test = new Test(testData);
        const savedTest = await test.save();
        console.log('Test added successfully:', savedTest.title);
        return savedTest;
    } catch (error) {
        console.error('Error adding test:', error.message);
        throw error;
    }
};

// Function to add multiple certificates
const addMultipleCertificates = async (certificatesArray) => {
    try {
        const savedCertificates = await Certificate.insertMany(certificatesArray);
        console.log(`Added ${savedCertificates.length} certificates successfully`);
        return savedCertificates;
    } catch (error) {
        console.error('Error adding certificates:', error.message);
        throw error;
    }
};

// Function to add multiple tests
const addMultipleTests = async (testsArray) => {
    try {
        const savedTests = await Test.insertMany(testsArray);
        console.log(`Added ${savedTests.length} tests successfully`);
        return savedTests;
    } catch (error) {
        console.error('Error adding tests:', error.message);
        throw error;
    }
};

// Function to connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevateai');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Function to close database connection
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database:', error.message);
    }
};

// Example usage functions
const exampleAddCertificate = async () => {
    await connectDB();

    const newCertificate = {
        name: "Docker Certified Associate (DCA)",
        provider: "Docker Inc.",
        description: "The Docker Certified Associate certification validates your skills in containerization and Docker technologies.",
        category: "cloud-computing",
        skills: [
            { name: "Docker", level: "intermediate" },
            { name: "Containerization", level: "intermediate" },
            { name: "DevOps", level: "beginner" },
            { name: "Orchestration", level: "beginner" }
        ],
        topics: [
            "Docker Fundamentals",
            "Container Lifecycle",
            "Docker Images",
            "Docker Networking",
            "Docker Storage",
            "Docker Compose",
            "Docker Swarm",
            "Security Best Practices"
        ],
        duration: "90 minutes",
        difficulty: "intermediate",
        prerequisites: [
            "Basic understanding of Linux",
            "Experience with command line",
            "Knowledge of containerization concepts"
        ],
        cost: {
            amount: 195,
            currency: "USD",
            free: false
        },
        format: ["online"],
        language: "English",
        validity: "2 years",
        examDetails: {
            format: "multiple-choice",
            duration: "90 minutes",
            passingScore: 70,
            attempts: 2
        },
        benefits: [
            "Industry-recognized certification",
            "Career advancement",
            "DevOps skills validation",
            "Access to Docker community"
        ],
        targetAudience: [
            "DevOps Engineers",
            "Software Developers",
            "System Administrators",
            "Cloud Engineers"
        ],
        industryRecognition: "high",
        jobRoles: [
            "DevOps Engineer",
            "Container Specialist",
            "Cloud Engineer",
            "Platform Engineer"
        ],
        averageSalary: {
            min: 70000,
            max: 130000,
            currency: "USD"
        },
        enrollmentUrl: "https://training.mirantis.com/certification/dca-certification-exam/",
        officialWebsite: "https://www.docker.com/",
        rating: {
            average: 4.2,
            count: 1800
        }
    };

    try {
        await addCertificate(newCertificate);
    } finally {
        await closeDB();
    }
};

const exampleAddTest = async () => {
    await connectDB();

    const newTest = {
        title: "Docker Container Fundamentals",
        description: "Test your knowledge of Docker containers, images, and basic containerization concepts.",
        category: "cloud-computing",
        difficulty: "beginner",
        duration: 30,
        questions: [
            {
                question: "What is a Docker container?",
                type: "multiple-choice",
                options: [
                    "A virtual machine",
                    "A lightweight, portable package of software",
                    "A cloud service",
                    "A programming language"
                ],
                correctAnswer: 1,
                explanation: "A Docker container is a lightweight, portable package of software that includes everything needed to run an application.",
                points: 1
            },
            {
                question: "What command is used to build a Docker image?",
                type: "multiple-choice",
                options: [
                    "docker create",
                    "docker build",
                    "docker run",
                    "docker start"
                ],
                correctAnswer: 1,
                explanation: "The 'docker build' command is used to build a Docker image from a Dockerfile.",
                points: 1
            },
            {
                question: "What is the purpose of a Dockerfile?",
                type: "multiple-choice",
                options: [
                    "To run containers",
                    "To define how to build a Docker image",
                    "To manage Docker networks",
                    "To store container data"
                ],
                correctAnswer: 1,
                explanation: "A Dockerfile is a text file that contains instructions for building a Docker image.",
                points: 1
            },
            {
                question: "Which command is used to run a Docker container?",
                type: "multiple-choice",
                options: [
                    "docker start",
                    "docker run",
                    "docker create",
                    "docker build"
                ],
                correctAnswer: 1,
                explanation: "The 'docker run' command is used to create and start a new container from an image.",
                points: 1
            },
            {
                question: "What is Docker Hub?",
                type: "multiple-choice",
                options: [
                    "A Docker container",
                    "A cloud-based registry for Docker images",
                    "A Docker command",
                    "A Docker network"
                ],
                correctAnswer: 1,
                explanation: "Docker Hub is a cloud-based registry service where you can find and share Docker images.",
                points: 1
            }
        ],
        totalPoints: 5,
        passingScore: 60,
        maxAttempts: 3,
        tags: ["Docker", "Containers", "DevOps", "Cloud"],
        skills: ["Docker", "Containerization", "DevOps", "Cloud Computing"]
    };

    try {
        await addTest(newTest);
    } finally {
        await closeDB();
    }
};

// Export functions for use in other scripts
module.exports = {
    addCertificate,
    addTest,
    addMultipleCertificates,
    addMultipleTests,
    connectDB,
    closeDB,
    exampleAddCertificate,
    exampleAddTest
};

// If this script is run directly, show usage examples
if (require.main === module) {
    console.log('Add Data Script - Usage Examples:');
    console.log('1. To add a certificate: node scripts/addData.js certificate');
    console.log('2. To add a test: node scripts/addData.js test');
    console.log('3. Import functions in other scripts for programmatic use');

    const action = process.argv[2];

    if (action === 'certificate') {
        exampleAddCertificate();
    } else if (action === 'test') {
        exampleAddTest();
    } else {
        console.log('No action specified. Use "certificate" or "test" as argument.');
    }
}
