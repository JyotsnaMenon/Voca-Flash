import React, { useEffect } from 'react';
import { useVoice } from '../context/VoiceContext';
import { Mic, MicOff } from 'lucide-react';

const VoiceRecognition: React.FC = () => {
  const { isListening, transcript, speak } = useVoice();

  useEffect(() => {
    // Announce current page when voice recognition starts
    if (isListening) {
      const currentPage = window.location.pathname;
      let pageDescription = '';
      
      switch (currentPage) {
        case '/':
          pageDescription = 'Dashboard. You can say "create new flashcard" to start creating';
          break;
        case '/create':
          pageDescription = 'Flashcard creator. Speak to create your flashcard';
          break;
        case '/view':
          pageDescription = 'Flashcard viewer. Say "next card" or "previous card" to navigate';
          break;
        case '/study':
          pageDescription = 'Study mode. Say "start quiz" to begin';
          break;
        default:
          pageDescription = 'Voice recognition active';
      }
      
      speak(pageDescription);
    }
  }, [isListening, speak]);

  if (!isListening) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
      <Mic className="h-5 w-5" />
      <span className="text-sm font-medium">Listening</span>
      
      {transcript && (
        <div className="absolute top-full mt-2 right-0 bg-white text-gray-900 px-3 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition; 