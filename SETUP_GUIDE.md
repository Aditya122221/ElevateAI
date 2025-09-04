# ElevateAI Setup Guide

## 🚀 Quick Setup

### Prerequisites
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
3. **Ollama** (optional, for AI features) - [Download here](https://ollama.ai/)

### Step 1: Install Dependencies
The dependencies are already installed! ✅

### Step 2: Setup Environment
Run the setup script to create the environment file:
```bash
setup.bat
```

Or manually create `server/.env` with:
```env
MONGODB_URI=mongodb://localhost:27017/elevateai
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Step 3: Start MongoDB
**Windows:**
```bash
# If installed as service
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4: Setup Ollama (Optional - for AI features)
```bash
# Install Ollama
# Windows: Download from https://ollama.ai/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Pull Mistral model (in another terminal)
ollama pull mistral
```

### Step 5: Seed Database
```bash
cd server
node scripts/seedData.js
```

### Step 6: Start Application
```bash
# Use the startup script
start.bat

# Or start manually:
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```

## 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check if the default port 27017 is available
- Verify MongoDB service is started

### Ollama Issues
- Make sure Ollama is running: `ollama serve`
- Check if Mistral model is pulled: `ollama list`
- AI features will be disabled if Ollama is not available

### Port Conflicts
- Backend uses port 5000
- Frontend uses port 5173
- Change ports in package.json if needed

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Use `npm install --legacy-peer-deps` if needed

## 📱 Features Available

### Without Ollama (Basic Features)
- ✅ User authentication
- ✅ Profile management
- ✅ Certificate library
- ✅ Skill tests
- ✅ Test results
- ❌ AI recommendations (will show fallback data)

### With Ollama (Full Features)
- ✅ All basic features
- ✅ AI-powered profile analysis
- ✅ Personalized recommendations
- ✅ AI-generated test questions
- ✅ Career advice

## 🎯 Next Steps

1. **Create an account** - Sign up on the landing page
2. **Complete your profile** - Fill in your career information
3. **Browse certificates** - Explore available certifications
4. **Take tests** - Assess your skills
5. **Get AI recommendations** - If Ollama is running

## 🆘 Need Help?

- Check the console for error messages
- Verify all services are running
- Check the API health endpoint
- Review the setup steps above

---

**ElevateAI** - Your AI-powered career development platform! 🚀
