import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';
import { useVoice } from '../context/VoiceContext';
import { Mic, MicOff, Save, ArrowLeft } from 'lucide-react';

const FlashcardCreator: React.FC = () => {
  const navigate = useNavigate();
  const { createFlashcard, loading } = useFlashcards();
  const { speak, isListening, startListening, stopListening, transcript, registerCommandHandler, unregisterCommandHandler, clearTranscript } = useVoice();
  
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('General');
  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState<'front' | 'back' | null>(null);

  // Voice command handling
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    if (command.includes('save') || command.includes('create')) {
      handleSave();
      clearTranscript();
    } else if (command.includes('cancel') || command.includes('back')) {
      navigate('/');
      clearTranscript();
    } else if (command.includes('front') || command.includes('question')) {
      setActiveField('front');
      clearTranscript(); // Clear before starting new recording
      speak('Recording for question field. Speak now.');
    } else if (command.includes('back') || command.includes('answer')) {
      setActiveField('back');
      clearTranscript(); // Clear before starting new recording
      speak('Recording for answer field. Speak now.');
    } else if (command.includes('category')) {
      speak('Available categories: General, Language, Science, History, Math. Say the category name.');
      clearTranscript();
    } else if (command.includes('general')) {
      setCategory('General');
      speak('Category set to General');
      clearTranscript();
    } else if (command.includes('language')) {
      setCategory('Language');
      speak('Category set to Language');
      clearTranscript();
    } else if (command.includes('science')) {
      setCategory('Science');
      speak('Category set to Science');
      clearTranscript();
    } else if (command.includes('history')) {
      setCategory('History');
      speak('Category set to History');
      clearTranscript();
    } else if (command.includes('math')) {
      setCategory('Math');
      speak('Category set to Math');
      clearTranscript();
    } else if (command.includes('help') || command.includes('commands')) {
      speak('Available commands: save, cancel, front, back, category, help');
      clearTranscript();
    }
  }, [navigate, speak, clearTranscript]);

  // Register command handler when component mounts
  useEffect(() => {
    registerCommandHandler(handleVoiceCommand);
    return () => {
      unregisterCommandHandler();
    };
  }, [registerCommandHandler, unregisterCommandHandler, handleVoiceCommand]);

  // Handle transcript for voice input
  useEffect(() => {
    if (transcript && activeField) {
      if (activeField === 'front') {
        setFront(transcript);
        setActiveField(null);
        clearTranscript(); // Clear transcript after use
        speak('Question recorded. Say "back" to record the answer.');
      } else if (activeField === 'back') {
        setBack(transcript);
        setActiveField(null);
        clearTranscript(); // Clear transcript after use
        speak('Answer recorded. Say "save" to create the flashcard.');
      }
    }
  }, [transcript, activeField, speak, clearTranscript]);

  // Announce page when voice recognition starts
  useEffect(() => {
    if (isListening) {
      speak('Flashcard creator. Say "front" to record question, "back" to record answer, or "help" for commands.');
    }
  }, [isListening, speak]);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      speak('Please provide both question and answer content');
      return;
    }

    try {
      await createFlashcard(front.trim(), back.trim(), category);
      speak('Flashcard created successfully!');
      navigate('/');
    } catch (error) {
      speak('Error creating flashcard. Please try again.');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      stopListening();
      speak('Voice recording stopped');
    } else {
      setIsRecording(true);
      startListening();
      speak('Voice recording started. Say "front" for question or "back" for answer.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Create New Flashcard
        </h1>
        <p className="text-lg text-gray-600">
          Create flashcards using voice or text input
        </p>
      </div>

      {/* Voice Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Controls</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={toggleRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
            aria-pressed={isRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>

          <button
            onClick={() => handleVoiceCommand('help')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            aria-label="Show voice commands help"
          >
            <span>Voice Commands Help</span>
          </button>
        </div>
        
        {isRecording && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Recording...</strong> Say "front" for question, "back" for answer, or "help" for commands.
            </p>
            {transcript && (
              <p className="text-xs text-blue-600 mt-1">Heard: "{transcript}"</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
            Question (Front)
          </label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter the question or prompt..."
            aria-label="Question field"
          />
        </div>

        <div>
          <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
            Answer (Back)
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter the answer or explanation..."
            aria-label="Answer field"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select category"
          >
            <option value="General">General</option>
            <option value="Language">Language</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Math">Math</option>
          </select>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleSave}
            disabled={!front.trim() || !back.trim() || loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            aria-label="Create flashcard"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Creating...' : 'Create Flashcard'}</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            aria-label="Cancel and go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Voice Commands Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" role="region" aria-label="Voice commands help">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Voice Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Content:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Front" - Record question</li>
              <li>• "Back" - Record answer</li>
              <li>• "Category" - Set category</li>
              <li>• "Save" - Create flashcard</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Navigation:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Cancel" - Go back</li>
              <li>• "Help" - Show commands</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreator; 