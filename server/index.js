const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./server/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Flashcards table
    db.run(`CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_reviewed DATETIME,
      review_count INTEGER DEFAULT 0,
      difficulty_level INTEGER DEFAULT 1
    )`);

    // Study sessions table
    db.run(`CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      flashcard_id TEXT,
      session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      result TEXT,
      time_spent INTEGER,
      FOREIGN KEY (flashcard_id) REFERENCES flashcards (id)
    )`);

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// API Routes

// Get all flashcards
app.get('/api/flashcards', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM flashcards ORDER BY created_at DESC';
  let params = [];

  if (category && category !== 'all') {
    query = 'SELECT * FROM flashcards WHERE category = ? ORDER BY created_at DESC';
    params = [category];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get flashcard by ID
app.get('/api/flashcards/:id', (req, res) => {
  db.get('SELECT * FROM flashcards WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }
    res.json(row);
  });
});

// Create new flashcard
app.post('/api/flashcards', (req, res) => {
  const { front, back, category = 'General' } = req.body;
  const id = uuidv4();

  if (!front || !back) {
    res.status(400).json({ error: 'Front and back content are required' });
    return;
  }

  db.run(
    'INSERT INTO flashcards (id, front, back, category) VALUES (?, ?, ?, ?)',
    [id, front, back, category],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, front, back, category });
    }
  );
});

// Update flashcard
app.put('/api/flashcards/:id', (req, res) => {
  const { front, back, category } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE flashcards SET front = ?, back = ?, category = ? WHERE id = ?',
    [front, back, category, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Flashcard not found' });
        return;
      }
      res.json({ id, front, back, category });
    }
  );
});

// Delete flashcard
app.delete('/api/flashcards/:id', (req, res) => {
  db.run('DELETE FROM flashcards WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }
    res.json({ message: 'Flashcard deleted successfully' });
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM flashcards ORDER BY category', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
});

// Record study session
app.post('/api/study-sessions', (req, res) => {
  const { flashcard_id, result, time_spent } = req.body;
  const session_id = uuidv4();

  db.run(
    'INSERT INTO study_sessions (id, flashcard_id, result, time_spent) VALUES (?, ?, ?, ?)',
    [session_id, flashcard_id, result, time_spent],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update flashcard review count and last reviewed
      db.run(
        'UPDATE flashcards SET review_count = review_count + 1, last_reviewed = CURRENT_TIMESTAMP WHERE id = ?',
        [flashcard_id]
      );
      
      res.status(201).json({ id: session_id, flashcard_id, result, time_spent });
    }
  );
});

// Get study statistics
app.get('/api/statistics', (req, res) => {
  db.get('SELECT COUNT(*) as total_cards FROM flashcards', (err, totalCards) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.get('SELECT COUNT(*) as total_sessions FROM study_sessions', (err, totalSessions) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        totalCards: totalCards.total_cards,
        totalSessions: totalSessions.total_sessions
      });
    });
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Voca-Flash API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
}); 