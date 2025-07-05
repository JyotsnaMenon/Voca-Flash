# Voca-Flash

A voice-based flashcard application designed specifically for visually impaired users, featuring speech-to-text input, text-to-speech output, and voice navigation.

## Features

- **Voice Input**: Create flashcards by speaking naturally
- **Voice Output**: Hear flashcards read aloud with natural speech
- **Voice Navigation**: Navigate through flashcards using voice commands
- **Accessibility-First**: Screen reader compatible, keyboard navigation
- **Study Modes**: Review, quiz, and spaced repetition
- **Flashcard Management**: Create, edit, delete, and organize flashcards

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Speech Recognition**: Web Speech API + Azure Cognitive Services
- **Text-to-Speech**: Web Speech API + Azure Cognitive Services
- **Audio Processing**: Web Audio API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Voice Commands

- "Create new flashcard" - Start creating a new flashcard
- "Next card" - Move to the next flashcard
- "Previous card" - Move to the previous flashcard
- "Read card" - Read the current flashcard aloud
- "Flip card" - Flip between front and back of the card
- "Start quiz" - Begin quiz mode
- "Stop" - Stop current operation

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Adjustable text size
- Voice feedback for all interactions