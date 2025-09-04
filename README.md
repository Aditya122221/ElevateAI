# ElevateAI - AI-Powered Career Development Platform

ElevateAI is a comprehensive MERN stack application that helps professionals advance their careers through AI-powered insights, personalized recommendations, and skill development tools.

## 🚀 Features

### Core Features
- **Interactive Landing Dashboard** - Parallax effects and smooth animations
- **JWT Authentication** - Secure login/signup with profile creation
- **AI-Powered Recommendations** - Ollama integration with Mistral AI model
- **Certificate Library** - Comprehensive database of industry certifications
- **Skill Assessment Tests** - Interactive tests with detailed scoreboards
- **Profile Management** - Complete user profile system with career tracking

### Technical Features
- **Responsive Design** - Pure CSS with modern animations
- **Dark/Light Theme** - User preference support
- **Real-time Updates** - Live data synchronization
- **Advanced Filtering** - Search and filter capabilities
- **Progress Tracking** - Detailed analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Elegant notifications
- **Pure CSS** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcryptjs** - Password hashing
- **Axios** - HTTP client for AI integration

### AI Integration
- **Ollama** - Local AI model runner
- **Mistral AI** - Large language model for recommendations

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **Ollama** (for AI features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd elevate-ai
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend Environment
Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/elevateai

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Ollama AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### 4. Setup Ollama (for AI features)

#### Install Ollama
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

#### Pull Mistral Model
```bash
ollama pull mistral
```

#### Start Ollama Service
```bash
ollama serve
```

### 5. Seed the Database

```bash
cd server
node scripts/seedData.js
```

### 6. Start the Application

#### Start Backend Server
```bash
cd server
npm run dev
```

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
elevate-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Database scripts
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Profile Management
- `POST /api/profile` - Create/update profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile
- `GET /api/profile/recommendations` - Get AI recommendations

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:id` - Get single certificate
- `POST /api/certificates` - Create certificate (Admin)
- `PUT /api/certificates/:id` - Update certificate (Admin)
- `DELETE /api/certificates/:id` - Delete certificate (Admin)
- `POST /api/certificates/:id/reviews` - Add review
- `GET /api/certificates/categories/list` - Get categories

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create test (Admin)
- `PUT /api/tests/:id` - Update test (Admin)
- `DELETE /api/tests/:id` - Delete test (Admin)
- `POST /api/tests/:id/start` - Start test
- `POST /api/tests/:id/submit` - Submit test answers
- `GET /api/tests/:id/results` - Get test results
- `GET /api/tests/user/results` - Get user's all results

### AI Integration
- `POST /api/ai/analyze-profile` - Analyze user profile
- `POST /api/ai/generate-test` - Generate AI test questions
- `POST /api/ai/career-advice` - Get career advice
- `GET /api/ai/health` - Check AI service health

## 🎨 UI Components

### Layout Components
- **Navbar** - Responsive navigation with theme toggle
- **Footer** - Site footer with links and social media
- **LoadingSpinner** - Animated loading indicator

### Page Components
- **LandingPage** - Hero section with parallax effects
- **LoginPage/SignupPage** - Authentication forms
- **ProfileCreationPage** - Multi-step profile setup
- **DashboardPage** - User dashboard with stats and quick actions
- **CertificateLibraryPage** - Browse and filter certificates
- **TestPage** - Available skill assessment tests
- **TestResultsPage** - Detailed test results and analytics
- **ProfilePage** - User profile management

## 🎯 Key Features Explained

### AI-Powered Recommendations
The platform uses Ollama with Mistral AI to analyze user profiles and provide personalized recommendations for:
- Skills to develop
- Certifications to pursue
- Career path suggestions
- Learning opportunities

### Interactive Dashboard
- Real-time statistics
- Quick action buttons
- AI recommendations display
- Recent test results
- Profile completion status

### Certificate Library
- Comprehensive database of industry certifications
- Advanced filtering and search
- Detailed certificate information
- User reviews and ratings
- Direct enrollment links

### Skill Assessment Tests
- Multiple question types
- Real-time scoring
- Detailed feedback
- Progress tracking
- Performance analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd client
npm run build
```

#### Backend
```bash
cd server
npm start
```

### Environment Variables for Production
Make sure to set secure environment variables:
- Strong JWT secret
- Production MongoDB URI
- Secure CORS origins
- Production Ollama configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- [ ] Real-time chat support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with more AI models
- [ ] Social learning features
- [ ] Mentorship program
- [ ] Job board integration
- [ ] Advanced reporting tools

---

**ElevateAI** - Empowering your career growth with AI-driven insights and personalized learning paths.
