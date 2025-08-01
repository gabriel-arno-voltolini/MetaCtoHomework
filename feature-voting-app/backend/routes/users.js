const express = require('express');
const router = express.Router();
const db = require('../database');

// Login/Create user
router.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // User exists
      res.json({ user: row, message: 'Login successful' });
    } else {
      // Create new user
      db.run('INSERT INTO users (email) VALUES (?)', [email], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const newUser = { id: this.lastID, email, created_at: new Date().toISOString() };
        res.json({ user: newUser, message: 'User created successfully' });
      });
    }
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: row });
  });
});

module.exports = router;