const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all features with vote counts
router.get('/', (req, res) => {
  const query = `
    SELECT 
      f.id,
      f.name,
      f.user_id,
      f.created_at,
      u.email as creator_email,
      COUNT(v.id) as vote_count
    FROM features f
    LEFT JOIN users u ON f.user_id = u.id
    LEFT JOIN votes v ON f.id = v.feature_id
    GROUP BY f.id
    ORDER BY vote_count DESC, f.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ features: rows });
  });
});

// Get features by user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      f.id,
      f.name,
      f.user_id,
      f.created_at,
      COUNT(v.id) as vote_count
    FROM features f
    LEFT JOIN votes v ON f.id = v.feature_id
    WHERE f.user_id = ?
    GROUP BY f.id
    ORDER BY f.created_at DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ features: rows });
  });
});

// Create feature
router.post('/', (req, res) => {
  const { name, user_id } = req.body;

  if (!name || !user_id) {
    return res.status(400).json({ error: 'Feature name and user_id are required' });
  }

  db.run('INSERT INTO features (name, user_id) VALUES (?, ?)', [name, user_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const newFeature = {
      id: this.lastID,
      name,
      user_id,
      created_at: new Date().toISOString(),
      vote_count: 0
    };

    res.json({ feature: newFeature, message: 'Feature created successfully' });
  });
});

// Delete feature
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  // First check if the feature belongs to the user
  db.get('SELECT * FROM features WHERE id = ? AND user_id = ?', [id, user_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Feature not found or not authorized' });
    }

    // Delete associated votes first
    db.run('DELETE FROM votes WHERE feature_id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Delete the feature
      db.run('DELETE FROM features WHERE id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Feature deleted successfully' });
      });
    });
  });
});

module.exports = router;