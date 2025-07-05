import React, { useState, useEffect } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import { useVoice } from '../context/VoiceContext';
import { ChevronLeft, ChevronRight, Volume2, Trash2, RotateCcw } from 'lucide-react';

const FlashcardViewer: React.FC = () => {
  const { flashcards, loading, deleteFlashcard, getFlashcards } = useFlashcards();
  const { speak, isListening, registerCommandHandler, unregisterCommandHandler } = useVoice();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    getFlashcards(selectedCategory);
  }, [selectedCategory, getFlashcards]);

  useEffect(() => {
    if (isListening && flashcards.length > 0) {
      speak(`Viewing flashcard ${currentIndex + 1} of ${flashcards.length}. Voice commands: "next card", "previous card", "flip card", "read card", "delete card", "help"`);
    }
  }, [isListening, currentIndex, flashcards.length, speak]);

  const filteredCards = selectedCategory === 'all' 
    ? flashcards 
    : flashcards.filter(card => card.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(flashcards.map(card => card.category)))];

  // Voice command handling
  useEffect(() => {
    const handleVoiceCommands = (command: string) => {
      if (command.includes('next card') || command.includes('next')) {
        nextCard();
      } else if (command.includes('previous card') || command.includes('previous') || command.includes('back')) {
        previousCard();
      } else if (command.includes('flip card') || command.includes('flip')) {
        flipCard();
      } else if (command.includes('read card') || command.includes('read')) {
        readCard();
      } else if (command.includes('delete card') || command.includes('delete')) {
        handleDelete(currentCard?.id || '');
      } else if (command.includes('help')) {
        speak('Voice commands: next card, previous card, flip card, read card, delete card, help');
      }
    };

    registerCommandHandler(handleVoiceCommands);

    return () => {
      unregisterCommandHandler();
    };
  }, [currentIndex, filteredCards.length, registerCommandHandler, unregisterCommandHandler, speak]);

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      speak(`Card ${currentIndex + 2} of ${filteredCards.length}`);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
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

  const handleDelete = async (id: string) => {
    const currentCard = filteredCards[currentIndex];
    if (currentCard) {
      speak(`Are you sure you want to delete the flashcard: ${currentCard.front}? Say "yes" to confirm or "no" to cancel`);
      
      // Set up a temporary command handler for delete confirmation
      const deleteConfirmHandler = (command: string) => {
        if (command.includes('yes') || command.includes('confirm')) {
          deleteCardConfirmed(id);
          unregisterCommandHandler();
        } else if (command.includes('no') || command.includes('cancel')) {
          speak('Delete cancelled');
          unregisterCommandHandler();
        }
      };
      registerCommandHandler(deleteConfirmHandler);
    }
  };

  const deleteCardConfirmed = async (id: string) => {
    try {
      await deleteFlashcard(id);
      speak('Flashcard deleted successfully');
      if (currentIndex >= filteredCards.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      speak('Error deleting flashcard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Flashcards Found</h2>
        <p className="text-gray-600">Create your first flashcard to get started!</p>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">View Flashcards</h1>
        <p className="text-lg text-gray-600">
          Browse and manage your flashcards with voice navigation
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
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
              <ChevronLeft className="h-6 w-6" />
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

            <button
              onClick={() => handleDelete(currentCard.id)}
              className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
              aria-label="Delete card"
            >
              <Trash2 className="h-6 w-6" />
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex === filteredCards.length - 1}
              className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next card"
            >
              <ChevronRight className="h-6 w-6" />
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
            <h3 className="font-medium text-blue-800 mb-2">Keyboard:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Arrow keys - Navigate cards</li>
              <li>• Space/Enter - Flip card</li>
              <li>• R - Read card aloud</li>
              <li>• Delete - Delete current card</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardViewer; 