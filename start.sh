#!/bin/bash

# ElevateAI Startup Script
echo "🚀 Starting ElevateAI Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Linux: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
    exit 1
fi

# Check if Ollama is running (optional for AI features)
if ! pgrep -x "ollama" > /dev/null; then
    echo "⚠️  Ollama is not running. AI features will not be available."
    echo "   To start Ollama: ollama serve"
    echo "   To pull Mistral model: ollama pull mistral"
fi

# Install backend dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

# Install frontend dependencies if needed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

# Check if database is seeded
echo "🌱 Checking database..."
cd server
if [ ! -f ".db_seeded" ]; then
    echo "🌱 Seeding database with sample data..."
    node scripts/seedData.js
    touch .db_seeded
    echo "✅ Database seeded successfully!"
fi
cd ..

# Start backend server
echo "🔧 Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend development server..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 ElevateAI is now running!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
