const express = require('express');
const router = express.Router();
const db = require('../database');

// Toggle vote (add if not exists, remove if exists)
router.post('/toggle', (req, res) => {
  const { user_id, feature_id } = req.body;

  if (!user_id || !feature_id) {
    return res.status(400).json({ error: 'user_id and feature_id are required' });
  }

  // Check if vote exists
  db.get('SELECT * FROM votes WHERE user_id = ? AND feature_id = ?', [user_id, feature_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Vote exists, remove it
      db.run('DELETE FROM votes WHERE user_id = ? AND feature_id = ?', [user_id, feature_id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Vote removed', voted: false });
      });
    } else {
      // Vote doesn't exist, add it
      db.run('INSERT INTO votes (user_id, feature_id) VALUES (?, ?)', [user_id, feature_id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Vote added', voted: true });
      });
    }
  });
});

// Get user's votes
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  db.all('SELECT feature_id FROM votes WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const votedFeatures = rows.map(row => row.feature_id);
    res.json({ votedFeatures });
  });
});

module.exports = router;