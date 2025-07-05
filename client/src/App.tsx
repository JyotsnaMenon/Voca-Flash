import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoiceRecognition from './components/VoiceRecognition';
import Dashboard from './components/Dashboard';
import FlashcardCreator from './components/FlashcardCreator';
import FlashcardViewer from './components/FlashcardViewer';
import StudyMode from './components/StudyMode';
import Navigation from './components/Navigation';
import { FlashcardProvider } from './context/FlashcardContext';
import { VoiceProvider } from './context/VoiceContext';
import { useVoice } from './context/VoiceContext';

const AppContent = () => {
  const { speak } = useVoice();

  useEffect(() => {
    // Welcome voice announcement when app starts
    const welcomeMessage = `
      Welcome to Voca-Flash! Your voice-powered flashcard application.
      You can navigate using voice commands or keyboard shortcuts.
      Say "help" for available commands.
      Available options: "view cards", "create cards", and "study".
      What would you like to do?
    `;
    
    // Delay the welcome message slightly to ensure voice context is ready
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 1000);

    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <VoiceRecognition />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<FlashcardCreator />} />
            <Route path="/view" element={<FlashcardViewer />} />
            <Route path="/study" element={<StudyMode />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <VoiceProvider>
      <FlashcardProvider>
        <AppContent />
      </FlashcardProvider>
    </VoiceProvider>
  );
};

export default App; 