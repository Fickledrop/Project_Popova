const express = require('express');
const pool = require('../db/pool');
const router = express.Router();

// GET all promotions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM promotions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single promotion
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM promotions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create promotion
router.post('/', async (req, res) => {
  try {
    const { title, content, discount } = req.body;
    const result = await pool.query('INSERT INTO promotions (title, content, discount) VALUES ($1, $2, $3) RETURNING *', [title, content, discount]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update promotion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, discount } = req.body;
    const result = await pool.query('UPDATE promotions SET title = $1, content = $2, discount = $3 WHERE id = $4 RETURNING *', [title, content, discount, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE promotion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM promotions WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
