import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVoice } from '../context/VoiceContext';
import { Mic, MicOff, Home, Plus, BookOpen, Brain } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isListening, startListening, stopListening, speak } = useVoice();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      speak('Voice recognition stopped');
    } else {
      startListening();
      speak('Voice recognition started. Say "create new flashcard" to begin');
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, ariaLabel: 'Go to dashboard' },
    { path: '/create', label: 'Create', icon: Plus, ariaLabel: 'Create new flashcard' },
    { path: '/view', label: 'View Cards', icon: BookOpen, ariaLabel: 'View all flashcards' },
    { path: '/study', label: 'Study', icon: Brain, ariaLabel: 'Start study mode' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900"
              aria-label="Voca-Flash Home"
            >
              <Mic className="h-8 w-8 text-blue-600" />
              <span>Voca-Flash</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Voice Control Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isListening
                  ? 'bg-red-500 text-white focus:ring-red-500 animate-pulse'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }`}
              aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
              aria-pressed={isListening}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            {/* Voice Status Indicator */}
            {isListening && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Listening</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 