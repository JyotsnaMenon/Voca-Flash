@echo off
echo 🚀 Starting Voca-Flash Setup...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Create environment files
echo 🔧 Creating environment files...

REM Create root .env file
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo DATABASE_URL=./server/database.sqlite >> .env

REM Create client .env file
echo REACT_APP_API_URL=http://localhost:5000/api > client\.env
echo REACT_APP_SPEECH_RECOGNITION_LANG=en-US >> client\.env
echo REACT_APP_SPEECH_SYNTHESIS_LANG=en-US >> client\.env

echo ✅ Environment files created

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist server mkdir server
if not exist client\public mkdir client\public
if not exist client\src\components mkdir client\src\components
if not exist client\src\context mkdir client\src\context

echo ✅ Directories created

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo   npm run dev
echo.
echo Or start them separately:
echo   npm run server  # Backend on port 5000
echo   npm run client  # Frontend on port 3000
echo.
echo 📖 For detailed instructions, see SETUP.md
echo.
echo 🎤 Voice Commands:
echo   - 'Create new flashcard'
echo   - 'Next card' / 'Previous card'
echo   - 'Read card' / 'Flip card'
echo   - 'Start quiz'
echo.
pause 