const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const certificateRoutes = require('./routes/certificates');
const testRoutes = require('./routes/tests');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
(async () => {
    try {
        const c = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected to ${c.connection.host}`);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'ElevateAI Server is running!', status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`ElevateAI Server running on port ${PORT}`);
    console.log('\n📧 Email Verification Setup:');
    console.log('   - Make sure to configure SMTP_USER and SMTP_PASS in your .env file');
    console.log('   - For Gmail, use an App Password (not your regular password)');
    console.log('   - Check EMAIL_SETUP_GUIDE.md for detailed instructions');
    console.log('   - If email sending fails, verification links will be logged to console\n');
});
