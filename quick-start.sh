#!/bin/bash

echo "🚀 Starting Voca-Flash Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create environment files
echo "🔧 Creating environment files..."

# Create root .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL=./server/database.sqlite
EOF

# Create client .env file
cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SPEECH_RECOGNITION_LANG=en-US
REACT_APP_SPEECH_SYNTHESIS_LANG=en-US
EOF

echo "✅ Environment files created"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p server
mkdir -p client/public
mkdir -p client/src/components
mkdir -p client/src/context

echo "✅ Directories created"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  npm run server  # Backend on port 5000"
echo "  npm run client  # Frontend on port 3000"
echo ""
echo "📖 For detailed instructions, see SETUP.md"
echo ""
echo "🎤 Voice Commands:"
echo "  - 'Create new flashcard'"
echo "  - 'Next card' / 'Previous card'"
echo "  - 'Read card' / 'Flip card'"
echo "  - 'Start quiz'"
echo "" 