import React, { useState, useEffect } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import { useVoice } from '../context/VoiceContext';
import { Check, X, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

const StudyMode: React.FC = () => {
  const { flashcards, loading } = useFlashcards();
  const { speak, isListening } = useVoice();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCards = selectedCategory === 'all' 
    ? flashcards 
    : flashcards.filter(card => card.category === selectedCategory);

  const categories = ['all', ...new Set(flashcards.map(card => card.category))];

  useEffect(() => {
    if (isListening && filteredCards.length > 0) {
      const mode = isQuizMode ? 'quiz' : 'study';
      speak(`${mode} mode. Card ${currentIndex + 1} of ${filteredCards.length}. Say "flip card" to see the answer`);
    }
  }, [isListening, currentIndex, filteredCards.length, isQuizMode, speak]);

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      speak(`Card ${currentIndex + 2} of ${filteredCards.length}`);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      speak(`Card ${currentIndex} of ${filteredCards.length}`);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    const currentCard = filteredCards[currentIndex];
    if (currentCard) {
      speak(isFlipped ? currentCard.front : currentCard.back);
    }
  };

  const readCard = () => {
    const currentCard = filteredCards[currentIndex];
    if (currentCard) {
      speak(isFlipped ? currentCard.back : currentCard.front);
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
    setShowAnswer(false);
    speak('Quiz mode started. Answer each card as correct or incorrect');
  };

  const endQuiz = () => {
    setIsQuizMode(false);
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    speak(`Quiz ended. You got ${score.correct} out of ${score.total} correct. That's ${percentage} percent`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Flashcards Available</h2>
        <p className="text-gray-600">Create some flashcards to start studying!</p>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Progress</h3>
          <div className="flex justify-center space-x-8">
            <div>
              <p className="text-2xl font-bold text-green-600">{score.correct}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{score.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
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
              setShowAnswer(false);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-sm text-gray-600">
              Card {currentIndex + 1} of {filteredCards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div 
            className={`flashcard relative w-full h-64 cursor-pointer ${
              isFlipped ? 'flipped' : ''
            }`}
            onClick={flipCard}
            role="button"
            tabIndex={0}
            aria-label="Click to flip card"
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Voice Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Navigation:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Next card" - Move to next card</li>
              <li>• "Previous card" - Move to previous card</li>
              <li>• "Read card" - Read current card aloud</li>
              <li>• "Flip card" - Flip between front and back</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Quiz Mode:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Correct" - Mark answer as correct</li>
              <li>• "Incorrect" - Mark answer as incorrect</li>
              <li>• "Start quiz" - Begin quiz mode</li>
              <li>• "End quiz" - Finish quiz mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMode; 