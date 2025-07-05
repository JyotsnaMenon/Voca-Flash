import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoiceRecognition from './components/VoiceRecognition';
import Dashboard from './components/Dashboard';
import FlashcardCreator from './components/FlashcardCreator';
import FlashcardViewer from './components/FlashcardViewer';
import StudyMode from './components/StudyMode';
import Navigation from './components/Navigation';
import { FlashcardProvider } from './context/FlashcardContext';
import { VoiceProvider } from './context/VoiceContext';

const App = () => {
  return (
    <VoiceProvider>
      <FlashcardProvider>
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
      </FlashcardProvider>
    </VoiceProvider>
  );
};

export default App; 