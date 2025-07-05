import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import { useVoice } from '../context/VoiceContext';
import { Check, X, RotateCcw, Volume2, Play, Pause, Mic, MicOff } from 'lucide-react';

const StudyMode: React.FC = () => {
  const { flashcards, loading } = useFlashcards();
  const { speak, isListening, startListening, stopListening, transcript, registerCommandHandler, unregisterCommandHandler } = useVoice();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoRead, setAutoRead] = useState(true);
  const [lastCommand, setLastCommand] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const filteredCards = selectedCategory === 'all' 
    ? flashcards 
    : flashcards.filter(card => card.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(flashcards.map(card => card.category)))];

  // Voice command handling
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    if (command.includes('next card') || command.includes('next')) {
      nextCard();
    } else if (command.includes('previous card') || command.includes('previous') || command.includes('back')) {
      previousCard();
    } else if (command.includes('flip card') || command.includes('flip')) {
      flipCard();
    } else if (command.includes('read card') || command.includes('read')) {
      readCard();
    } else if (command.includes('correct') || command.includes('right')) {
      if (isQuizMode) {
        markCorrect();
      } else {
        speak('Not in quiz mode. Say "start quiz" to begin quiz mode.');
      }
    } else if (command.includes('incorrect') || command.includes('wrong')) {
      if (isQuizMode) {
        markIncorrect();
      } else {
        speak('Not in quiz mode. Say "start quiz" to begin quiz mode.');
      }
    } else if (command.includes('start quiz')) {
      startQuiz();
    } else if (command.includes('end quiz') || command.includes('stop quiz')) {
      endQuiz();
    } else if (command.includes('toggle listening') || command.includes('listen')) {
      if (isListening) {
        stopListening();
        speak('Voice recognition stopped');
      } else {
        startListening();
        speak('Voice recognition started. You can now use voice commands.');
      }
    } else if (command.includes('auto read') || command.includes('auto read off')) {
      setAutoRead(!autoRead);
      speak(`Auto read ${autoRead ? 'disabled' : 'enabled'}`);
    } else if (command.includes('go home') || command.includes('dashboard')) {
      window.location.href = '/';
    } else if (command.includes('create card') || command.includes('new card')) {
      window.location.href = '/create';
    } else if (command.includes('help') || command.includes('commands')) {
      speak('Available commands: next card, previous card, flip card, read card, start quiz, end quiz, correct, incorrect, toggle listening, auto read, go home, create card, help');
    }
  }, [isQuizMode, isListening, autoRead, speak, startListening, stopListening]);

  // Register command handler when component mounts
  useEffect(() => {
    registerCommandHandler(handleVoiceCommand);
    return () => {
      unregisterCommandHandler();
    };
  }, [registerCommandHandler, unregisterCommandHandler, handleVoiceCommand]);

  // Auto-read card when it changes
  useEffect(() => {
    if (autoRead && filteredCards.length > 0 && !loading) {
      const currentCard = filteredCards[currentIndex];
      if (currentCard) {
        const mode = isQuizMode ? 'quiz' : 'study';
        const cardContent = isFlipped ? currentCard.back : currentCard.front;
        speak(`${mode} mode. Card ${currentIndex + 1} of ${filteredCards.length}. ${isFlipped ? 'Answer' : 'Question'}: ${cardContent}. Say "flip card" to see the ${isFlipped ? 'question' : 'answer'}`);
      }
    }
  }, [currentIndex, isFlipped, filteredCards, isQuizMode, autoRead, loading, speak]);

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      speak(`Moving to card ${currentIndex + 2} of ${filteredCards.length}`);
    } else {
      speak('This is the last card');
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      speak(`Moving to card ${currentIndex} of ${filteredCards.length}`);
    } else {
      speak('This is the first card');
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    const currentCard = filteredCards[currentIndex];
    if (currentCard) {
      const content = isFlipped ? currentCard.front : currentCard.back;
      const side = isFlipped ? 'question' : 'answer';
      speak(`${side}: ${content}`);
    }
  };

  const readCard = () => {
    const currentCard = filteredCards[currentIndex];
    if (currentCard) {
      const content = isFlipped ? currentCard.back : currentCard.front;
      const side = isFlipped ? 'answer' : 'question';
      speak(`${side}: ${content}`);
    }
  };

  const markCorrect = () => {
    setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    speak('Correct! Moving to next card');
    nextCard();
  };

  const markIncorrect = () => {
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    speak('Incorrect. Moving to next card');
    nextCard();
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setScore({ correct: 0, total: 0 });
    setCurrentIndex(0);
    setIsFlipped(false);
    speak('Quiz mode started. Answer each card as correct or incorrect. Say "correct" or "incorrect" to mark your answer.');
  };

  const endQuiz = () => {
    setIsQuizMode(false);
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    speak(`Quiz ended. You got ${score.correct} out of ${score.total} correct. That's ${percentage} percent`);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      speak('Voice recognition stopped');
    } else {
      startListening();
      speak('Voice recognition started. You can now use voice commands.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-label="Loading flashcards"></div>
        <span className="sr-only">Loading flashcards...</span>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12" role="region" aria-label="No flashcards available">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Flashcards Available</h2>
        <p className="text-gray-600 mb-4">Create some flashcards to start studying!</p>
        <button
          onClick={() => window.location.href = '/create'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          aria-label="Go to create flashcards page"
        >
          Create Flashcards
        </button>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8" role="main" aria-label="Study mode">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isQuizMode ? 'Quiz Mode' : 'Study Mode'}
        </h1>
        <p className="text-lg text-gray-600">
          {isQuizMode 
            ? 'Test your knowledge with voice feedback'
            : 'Review flashcards with voice assistance'
          }
        </p>
      </div>

      {/* Voice Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Controls</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={toggleListening}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
            aria-pressed={isListening}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
          </button>

          <button
            onClick={() => setAutoRead(!autoRead)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              autoRead 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            aria-label={`${autoRead ? 'Disable' : 'Enable'} auto read`}
            aria-pressed={autoRead}
          >
            <Volume2 className="h-5 w-5" />
            <span>Auto Read {autoRead ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => handleVoiceCommand('help')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            aria-label="Show voice commands help"
          >
            <span>Voice Commands Help</span>
          </button>
        </div>
        
        {isListening && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Listening for commands...</strong> Say "help" for available commands.
            </p>
            {transcript && (
              <p className="text-xs text-blue-600 mt-1">Heard: "{transcript}"</p>
            )}
          </div>
        )}
      </div>

      {/* Quiz Controls */}
      {!isQuizMode && (
        <div className="flex justify-center">
          <button
            onClick={startQuiz}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            aria-label="Start quiz mode"
          >
            <Play className="h-5 w-5" />
            <span>Start Quiz</span>
          </button>
        </div>
      )}

      {/* Quiz Score */}
      {isQuizMode && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center" role="region" aria-label="Quiz progress">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Progress</h3>
          <div className="flex justify-center space-x-8">
            <div>
              <p className="text-2xl font-bold text-green-600" aria-label={`${score.correct} correct answers`}>{score.correct}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${score.total} total questions`}>{score.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600" aria-label={`${score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0} percent score`}>
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
          </div>
          <button
            onClick={endQuiz}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 mx-auto"
            aria-label="End quiz"
          >
            <Pause className="h-4 w-4" />
            <span>End Quiz</span>
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Study Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
              speak(`Switched to ${e.target.value === 'all' ? 'all categories' : e.target.value} category`);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select study category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Flashcard Display */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Card Counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600" aria-label={`Card ${currentIndex + 1} of ${filteredCards.length}`}>
              Card {currentIndex + 1} of {filteredCards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div 
            ref={cardRef}
            className={`flashcard relative w-full h-64 cursor-pointer ${
              isFlipped ? 'flipped' : ''
            }`}
            onClick={flipCard}
            role="button"
            tabIndex={0}
            aria-label={`${isFlipped ? 'Answer' : 'Question'}: ${isFlipped ? currentCard.back : currentCard.front}. Click to flip card`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard();
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center text-center">
              <div className="w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Category: {currentCard.category}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={previousCard}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous card"
            >
              ←
            </button>

            <button
              onClick={readCard}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Read card aloud"
            >
              <Volume2 className="h-6 w-6" />
            </button>

            <button
              onClick={flipCard}
              className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700"
              aria-label="Flip card"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            {isQuizMode && (
              <>
                <button
                  onClick={markCorrect}
                  className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700"
                  aria-label="Mark as correct"
                >
                  <Check className="h-6 w-6" />
                </button>

                <button
                  onClick={markIncorrect}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
                  aria-label="Mark as incorrect"
                >
                  <X className="h-6 w-6" />
                </button>
              </>
            )}

            <button
              onClick={nextCard}
              disabled={currentIndex === filteredCards.length - 1}
              className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next card"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Voice Commands Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" role="region" aria-label="Voice commands help">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Voice Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Navigation:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Next card" or "Next" - Move to next card</li>
              <li>• "Previous card" or "Previous" or "Back" - Move to previous card</li>
              <li>• "Read card" or "Read" - Read current card aloud</li>
              <li>• "Flip card" or "Flip" - Flip between front and back</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Quiz Mode:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Correct" or "Right" - Mark answer as correct</li>
              <li>• "Incorrect" or "Wrong" - Mark answer as incorrect</li>
              <li>• "Start quiz" - Begin quiz mode</li>
              <li>• "End quiz" or "Stop quiz" - Finish quiz mode</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Controls:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Toggle listening" or "Listen" - Start/stop voice recognition</li>
              <li>• "Auto read" - Toggle automatic card reading</li>
              <li>• "Help" or "Commands" - Show this help</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Navigation:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Go home" or "Dashboard" - Return to dashboard</li>
              <li>• "Create card" or "New card" - Go to card creator</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMode; 