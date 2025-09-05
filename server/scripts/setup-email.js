const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('📧 ElevateAI Email Configuration Setup\n');

const questions = [
    {
        key: 'SMTP_USER',
        question: 'Enter your email address (e.g., your_email@gmail.com): ',
        required: true
    },
    {
        key: 'SMTP_PASS',
        question: 'Enter your email password or App Password: ',
        required: true,
        hidden: true
    },
    {
        key: 'FROM_EMAIL',
        question: 'Enter the FROM email address (default: noreply@elevateai.com): ',
        required: false,
        default: 'noreply@elevateai.com'
    },
    {
        key: 'CLIENT_URL',
        question: 'Enter your client URL (default: http://localhost:5173): ',
        required: false,
        default: 'http://localhost:5173'
    }
];

const config = {};

function askQuestion(index) {
    if (index >= questions.length) {
        saveConfig();
        return;
    }

    const question = questions[index];
    const prompt = question.question;

    rl.question(prompt, (answer) => {
        if (question.required && !answer.trim()) {
            console.log('❌ This field is required. Please try again.\n');
            askQuestion(index);
            return;
        }

        if (answer.trim()) {
            config[question.key] = answer.trim();
        } else if (question.default) {
            config[question.key] = question.default;
        }

        askQuestion(index + 1);
    });
}

function saveConfig() {
    const envPath = path.join(__dirname, '..', '.env');

    // Read existing .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add email configuration
    const emailConfig = `
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${config.SMTP_USER}
SMTP_PASS=${config.SMTP_PASS}
FROM_EMAIL=${config.FROM_EMAIL}
CLIENT_URL=${config.CLIENT_URL}
`;

    // Remove existing email config if present
    envContent = envContent.replace(/# Email Configuration[\s\S]*?(?=\n[A-Z]|\n$|$)/g, '');

    // Add new email config
    envContent += emailConfig;

    // Write back to .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Email configuration saved to .env file!');
    console.log('\n📋 Next steps:');
    console.log('   1. If using Gmail, make sure you have:');
    console.log('      - Enabled 2-Factor Authentication');
    console.log('      - Generated an App Password');
    console.log('   2. Restart your server: npm run dev');
    console.log('   3. Test registration with a real email address');
    console.log('   4. Check EMAIL_SETUP_GUIDE.md for troubleshooting\n');

    rl.close();
}

// Start the setup process
askQuestion(0);
