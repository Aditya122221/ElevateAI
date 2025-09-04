@echo off
echo 🚀 Starting ElevateAI Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ⚠️  MongoDB is not running. Please start MongoDB service.
    echo    Run: net start MongoDB
    pause
    exit /b 1
)

REM Check if Ollama is running (optional for AI features)
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ⚠️  Ollama is not running. AI features will not be available.
    echo    To start Ollama: ollama serve
    echo    To pull Mistral model: ollama pull mistral
)

REM Install backend dependencies if needed
if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

REM Install frontend dependencies if needed
if not exist "client\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd client
    call npm install
    cd ..
)

REM Check if database is seeded
echo 🌱 Checking database...
cd server
if not exist ".db_seeded" (
    echo 🌱 Seeding database with sample data...
    call node scripts/seedData.js
    echo. > .db_seeded
    echo ✅ Database seeded successfully!
)
cd ..

REM Start backend server
echo 🔧 Starting backend server...
cd server
start "ElevateAI Backend" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend development server
echo 🎨 Starting frontend development server...
cd client
start "ElevateAI Frontend" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 ElevateAI is now running!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:5000
echo 📊 API Health: http://localhost:5000/api/health
echo.
echo Press any key to exit...
pause >nul
