# Voca-Flash Setup Guide

## Complete Workflow & File Structure

### **Project Overview**
Voca-Flash is a voice-based flashcard application designed specifically for visually impaired users. It features speech-to-text input, text-to-speech output, and voice navigation for creating, managing, and studying flashcards.

### **Technology Stack**
- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech API
- **Audio Processing**: Web Audio API

### **File Structure**
```
Voca-Flash/
├── README.md
├── package.json
├── SETUP.md
├── server/
│   ├── index.js
│   └── database.sqlite (auto-generated)
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.tsx
│       ├── index.css
│       ├── App.tsx
│       ├── components/
│       │   ├── Navigation.tsx
│       │   ├── VoiceRecognition.tsx
│       │   ├── Dashboard.tsx
│       │   ├── FlashcardCreator.tsx
│       │   ├── FlashcardViewer.tsx
│       │   └── StudyMode.tsx
│       └── context/
│           ├── VoiceContext.tsx
│           └── FlashcardContext.tsx
```

### **Installation Steps**

#### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

#### 2. Environment Setup
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

#### 3. Start the Application
```bash
# Start both server and client in development mode
npm run dev

# Or start them separately:
npm run server  # Starts backend on port 5000
npm run client  # Starts frontend on port 3000
```

### **Voice Commands Reference**

#### **Navigation Commands**
- "Create new flashcard" - Navigate to flashcard creator
- "Go to dashboard" - Return to main dashboard
- "View cards" - Navigate to flashcard viewer
- "Start studying" - Enter study mode
- "Stop" - Stop current operation

#### **Flashcard Creation Commands**
- "Front" - Start recording the question
- "Back" - Start recording the answer
- "Save" - Create the flashcard
- "Cancel" - Go back to dashboard

#### **Study Mode Commands**
- "Next card" - Move to next flashcard
- "Previous card" - Move to previous flashcard
- "Read card" - Read current card aloud
- "Flip card" - Flip between front and back
- "Correct" - Mark answer as correct (quiz mode)
- "Incorrect" - Mark answer as incorrect (quiz mode)

### **Accessibility Features**

#### **Keyboard Navigation**
- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate buttons and flip cards
- **Arrow Keys** - Navigate between flashcards
- **Escape** - Cancel current operation

#### **Screen Reader Support**
- All interactive elements have proper ARIA labels
- Semantic HTML structure
- Focus indicators for all interactive elements
- Voice feedback for all actions

#### **Visual Accessibility**
- High contrast mode support
- Adjustable text size
- Clear visual indicators for voice recognition status
- Responsive design for different screen sizes

### **Core Features**

#### **1. Voice Input Creation**
- Natural speech-to-text for creating flashcards
- Voice command recognition for navigation
- Real-time transcription feedback

#### **2. Voice Output**
- Text-to-speech for reading flashcards
- Voice feedback for all user actions
- Audio cues for navigation and status

#### **3. Flashcard Management**
- Create, edit, delete flashcards
- Categorize flashcards by subject
- Search and filter functionality
- Import/export capabilities

#### **4. Study Modes**
- **Review Mode**: Browse flashcards with voice assistance
- **Quiz Mode**: Test knowledge with voice feedback
- **Spaced Repetition**: Intelligent review scheduling

#### **5. Voice Navigation**
- Complete hands-free operation
- Voice commands for all functions
- Audio feedback for all interactions

### **Database Schema**

#### **Flashcards Table**
```sql
CREATE TABLE flashcards (
  id TEXT PRIMARY KEY,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_reviewed DATETIME,
  review_count INTEGER DEFAULT 0,
  difficulty_level INTEGER DEFAULT 1
);
```

#### **Study Sessions Table**
```sql
CREATE TABLE study_sessions (
  id TEXT PRIMARY KEY,
  flashcard_id TEXT,
  session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  result TEXT,
  time_spent INTEGER,
  FOREIGN KEY (flashcard_id) REFERENCES flashcards (id)
);
```

### **API Endpoints**

#### **Flashcards**
- `GET /api/flashcards` - Get all flashcards
- `GET /api/flashcards/:id` - Get specific flashcard
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard

#### **Categories**
- `GET /api/categories` - Get all categories

#### **Study Sessions**
- `POST /api/study-sessions` - Record study session
- `GET /api/statistics` - Get study statistics

### **Development Workflow**

#### **1. Voice Recognition Setup**
The application uses the Web Speech API for voice recognition:
- Automatic speech detection
- Continuous listening mode
- Command interpretation and routing
- Error handling for unsupported browsers

#### **2. Text-to-Speech Implementation**
- Natural language synthesis
- Adjustable speech rate and pitch
- Voice feedback for all user interactions
- Audio cues for navigation

#### **3. Accessibility Implementation**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode
- Focus management

#### **4. Database Management**
- SQLite for lightweight, file-based storage
- Automatic database initialization
- Backup and restore functionality
- Data migration support

### **Testing the Application**

#### **1. Voice Recognition Test**
1. Click the microphone button in the navigation
2. Say "Create new flashcard"
3. Verify the application navigates to the creator page
4. Test voice input for creating flashcards

#### **2. Navigation Test**
1. Use voice commands to navigate between pages
2. Test keyboard navigation with Tab and arrow keys
3. Verify screen reader compatibility

#### **3. Flashcard Management Test**
1. Create flashcards using voice input
2. Browse and edit existing flashcards
3. Test deletion and categorization

#### **4. Study Mode Test**
1. Enter study mode and test voice navigation
2. Try quiz mode with voice feedback
3. Verify score tracking and statistics

### **Troubleshooting**

#### **Common Issues**

**1. Voice Recognition Not Working**
- Ensure microphone permissions are granted
- Check browser compatibility (Chrome recommended)
- Verify HTTPS connection (required for speech API)

**2. Database Connection Issues**
- Check if SQLite is properly installed
- Verify database file permissions
- Restart the server if needed

**3. Frontend Build Issues**
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration
- Verify all required dependencies are installed

#### **Browser Compatibility**
- **Chrome**: Full support for Web Speech API
- **Firefox**: Limited support, may require HTTPS
- **Safari**: Limited support
- **Edge**: Good support

### **Deployment**

#### **Production Setup**
1. Build the React application: `npm run build`
2. Set up environment variables for production
3. Configure database for production use
4. Set up HTTPS for voice recognition
5. Deploy to your preferred hosting platform

#### **Environment Variables for Production**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=/path/to/production/database.sqlite
REACT_APP_API_URL=https://your-domain.com/api
```

### **Future Enhancements**

#### **Planned Features**
1. **Advanced Voice Recognition**: Azure Cognitive Services integration
2. **Multi-language Support**: Multiple language voice recognition
3. **Cloud Sync**: Synchronize flashcards across devices
4. **Analytics Dashboard**: Detailed study analytics
5. **Mobile App**: Native mobile application
6. **AI-powered Suggestions**: Intelligent flashcard recommendations

#### **Accessibility Improvements**
1. **Braille Display Support**: Integration with braille displays
2. **Gesture Control**: Hand gesture recognition
3. **Eye Tracking**: Eye movement-based navigation
4. **Haptic Feedback**: Vibration feedback for mobile

This comprehensive setup provides a fully functional voice-based flashcard application designed specifically for visually impaired users, with complete accessibility features and voice navigation throughout the entire application. 