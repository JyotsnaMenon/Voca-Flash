import React, { useState } from 'react';

const FlashcardCreator = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('General');

  const handleSave = () => {
    if (!front.trim() || !back.trim()) {
      alert('Please provide both front and back content');
      return;
    }
    alert('Flashcard created! (Backend not connected yet)');
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
            disabled={!front.trim() || !back.trim()}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create Flashcard
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreator; 