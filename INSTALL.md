# Voca-Flash Installation Guide

## Fixing Client Errors

The client errors you're seeing are because the dependencies haven't been installed yet. Here's how to fix them:

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Install Missing TypeScript Types

The TypeScript errors are due to missing type definitions. Run these commands:

```bash
cd client
npm install --save-dev @types/react @types/react-dom @types/node
npm install react-router-dom lucide-react axios framer-motion
cd ..
```

### Step 3: Create Environment Files

Create the following environment files:

**Root `.env` file:**
```
PORT=5000
NODE_ENV=development
DATABASE_URL=./server/database.sqlite
```

**Client `.env` file:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SPEECH_RECOGNITION_LANG=en-US
REACT_APP_SPEECH_SYNTHESIS_LANG=en-US
```

### Step 4: Start the Application

```bash
# Start both server and client
npm run dev

# Or start them separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## Common Errors and Solutions

### 1. "Cannot find module 'react'" Error
**Solution:** Install React types
```bash
cd client
npm install --save-dev @types/react @types/react-dom
```

### 2. "Cannot find module 'react-router-dom'" Error
**Solution:** Install React Router
```bash
cd client
npm install react-router-dom @types/react-router-dom
```

### 3. "Cannot find module 'lucide-react'" Error
**Solution:** Install Lucide React
```bash
cd client
npm install lucide-react
```

### 4. TypeScript Configuration Issues
**Solution:** Update `client/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 5. Tailwind CSS Issues
**Solution:** Install Tailwind CSS
```bash
cd client
npm install tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

## Quick Fix Script

Run this script to fix all common issues:

```bash
# Linux/Mac
chmod +x quick-start.sh
./quick-start.sh

# Windows
quick-start.bat
```

## Manual Installation Steps

If the quick scripts don't work, follow these steps manually:

1. **Install Root Dependencies:**
   ```bash
   npm install
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   npm install --save-dev @types/react @types/react-dom @types/node
   npm install react-router-dom lucide-react axios framer-motion
   npm install tailwindcss autoprefixer postcss
   npx tailwindcss init -p
   cd ..
   ```

3. **Create Environment Files:**
   ```bash
   # Root .env
   echo "PORT=5000" > .env
   echo "NODE_ENV=development" >> .env
   echo "DATABASE_URL=./server/database.sqlite" >> .env
   
   # Client .env
   echo "REACT_APP_API_URL=http://localhost:5000/api" > client/.env
   echo "REACT_APP_SPEECH_RECOGNITION_LANG=en-US" >> client/.env
   echo "REACT_APP_SPEECH_SYNTHESIS_LANG=en-US" >> client/.env
   ```

4. **Start the Application:**
   ```bash
   npm run dev
   ```

## Browser Requirements

For voice recognition to work:
- **Chrome** (recommended): Full support
- **Firefox**: Limited support, may require HTTPS
- **Safari**: Limited support
- **Edge**: Good support

## Troubleshooting

### If you still see TypeScript errors:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   rm -rf client/node_modules client/package-lock.json
   npm install
   cd client && npm install && cd ..
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

### If voice recognition doesn't work:
1. Ensure you're using HTTPS or localhost
2. Grant microphone permissions to the browser
3. Check browser console for errors

### If the database doesn't connect:
1. Check if SQLite is installed
2. Verify the database file path
3. Restart the server

## Verification

After installation, you should be able to:
1. Navigate to `http://localhost:3000`
2. See the Voca-Flash dashboard
3. Click the microphone button to start voice recognition
4. Create flashcards using voice or text input
5. Browse and study flashcards

The application should work without TypeScript errors once all dependencies are properly installed. 