import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';
import { useVoice } from '../context/VoiceContext';
import { BookOpen, Plus, Brain, BarChart3, Mic, Keyboard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { flashcards, loading, getFlashcards } = useFlashcards();
  const { speak, isListening } = useVoice();

  useEffect(() => {
    getFlashcards();
  }, [getFlashcards]);

  useEffect(() => {
    if (isListening) {
      speak('Dashboard. Keyboard shortcuts: Control V for voice recognition, Control 1-4 for navigation. Voice commands: say "create new flashcard", "view cards", or "study mode"');
    }
  }, [isListening, speak]);

  const stats = [
    {
      title: 'Total Cards',
      value: flashcards.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'Flashcards created'
    },
    {
      title: 'Categories',
      value: new Set(flashcards.map(card => card.category)).size,
      icon: BarChart3,
      color: 'bg-green-500',
      description: 'Different categories'
    },
    {
      title: 'Study Ready',
      value: flashcards.filter(card => card.review_count > 0).length,
      icon: Brain,
      color: 'bg-purple-500',
      description: 'Cards studied'
    }
  ];

  const features = [
    {
      title: 'Create Flashcard',
      description: 'Create new flashcards using voice or text input',
      icon: Plus,
      path: '/create',
      shortcut: 'Ctrl+2',
      voiceCommand: 'Say "create new flashcard"'
    },
    {
      title: 'View Cards',
      description: 'Browse and manage your existing flashcards',
      icon: BookOpen,
      path: '/view',
      shortcut: 'Ctrl+3',
      voiceCommand: 'Say "view cards"'
    },
    {
      title: 'Study Mode',
      description: 'Practice with your flashcards using voice commands',
      icon: Brain,
      path: '/study',
      shortcut: 'Ctrl+4',
      voiceCommand: 'Say "study mode"'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Voca-Flash
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your voice-powered flashcard application. Use voice commands to navigate and create flashcards.
        </p>
      </div>

      {/* Accessibility Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8" role="region" aria-label="Accessibility help">
        <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center justify-center">
          <Keyboard className="h-5 w-5 mr-2" />
          Accessibility Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Voice Commands:
            </h3>
            <ul className="space-y-1 text-blue-700">
              <li>• "Create new flashcard"</li>
              <li>• "View cards"</li>
              <li>• "Study mode"</li>
              <li>• "Help" for commands</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <Keyboard className="h-4 w-4 mr-2" />
              Keyboard Shortcuts:
            </h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Ctrl+V: Toggle voice recognition</li>
              <li>• Ctrl+1: Dashboard</li>
              <li>• Ctrl+2: Create flashcard</li>
              <li>• Ctrl+3: View cards</li>
              <li>• Ctrl+4: Study mode</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${feature.title}. ${feature.description}. ${feature.shortcut} shortcut available. ${feature.voiceCommand}`}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Keyboard: {feature.shortcut}</p>
                    <p>Voice: {feature.voiceCommand}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Cards */}
      {flashcards.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Cards</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {flashcards.slice(0, 5).map((card) => (
                <div key={card.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {card.front}
                      </h3>
                      <p className="text-gray-600 mb-2">{card.back}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {card.category}</span>
                        <span>Reviews: {card.review_count}</span>
                        <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {flashcards.length > 5 && (
              <div className="p-4 bg-gray-50 text-center">
                <Link
                  to="/view"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {flashcards.length} cards →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 