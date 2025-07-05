import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  registerCommandHandler: (handler: (command: string) => void) => void;
  unregisterCommandHandler: () => void;
  clearTranscript: () => void;
  announceHelp: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null);
  const [commandHandler, setCommandHandler] = useState<((command: string) => void) | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        speak('Listening for voice commands');
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript with both final and interim results
        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript);
        
        // Call the registered command handler if available and we have final results
        if (commandHandler && finalTranscript.trim()) {
          commandHandler(finalTranscript.toLowerCase());
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle specific errors
        if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else if (event.error === 'audio-capture') {
          console.log('Audio capture error');
        } else if (event.error === 'not-allowed') {
          console.log('Microphone access denied');
        } else if (event.error === 'network') {
          console.log('Network error');
        }
        
        setIsListening(false);
        
        // Restart recognition after a short delay for recoverable errors
        if (['no-speech', 'network'].includes(event.error)) {
          setTimeout(() => {
            if (recognitionInstance) {
              try {
                recognitionInstance.start();
              } catch (error) {
                console.log('Failed to restart recognition:', error);
              }
            }
          }, 1000);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, [commandHandler]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.log('Speech recognition already started or error:', error);
        // If it's already started, just set the state
        setIsListening(true);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (error) {
        console.log('Speech recognition stop error:', error);
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const speak = useCallback((text: string) => {
    if (speechSynthesis) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis]);

  const registerCommandHandler = useCallback((handler: (command: string) => void) => {
    setCommandHandler(() => handler);
  }, []);

  const unregisterCommandHandler = useCallback(() => {
    setCommandHandler(null);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const announceHelp = useCallback(() => {
    const helpText = `
      Voca-Flash Accessibility Help. 
      Keyboard shortcuts: Control V to toggle voice recognition, Control 1 for dashboard, Control 2 for create flashcard, Control 3 for view cards, Control 4 for study mode.
      Voice commands: say "create new flashcard", "view cards", "study mode", "help", "next card", "previous card", "flip card", "read card", "delete card", "save", "cancel".
      Press Control H anytime for this help message.
    `;
    speak(helpText);
  }, [speak]);

  const value: VoiceContextType = {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    registerCommandHandler,
    unregisterCommandHandler,
    clearTranscript,
    announceHelp
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
}; 