@echo off
echo 🚀 Setting up ElevateAI...

REM Create .env file for server
echo Creating environment file...
cd server
echo # Database > .env
echo MONGODB_URI=mongodb://localhost:27017/elevateai >> .env
echo. >> .env
echo # JWT >> .env
echo JWT_SECRET=your_super_secret_jwt_key_here_change_in_production >> .env
echo JWT_EXPIRE=7d >> .env
echo. >> .env
echo # Server >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # Ollama AI >> .env
echo OLLAMA_BASE_URL=http://localhost:11434 >> .env
echo OLLAMA_MODEL=mistral >> .env
cd ..

echo ✅ Environment file created!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running
echo 2. Install Ollama and pull Mistral model (optional for AI features)
echo 3. Run: start.bat
echo.
pause
