const express = require('express');
const pool = require('../db/pool');
const router = express.Router();

// POST create tables from JSON schema
router.post('/', async (req, res) => {
  try {
    const { tables } = req.body;

    if (!tables || !Array.isArray(tables)) {
      return res.status(400).json({ error: 'Invalid JSON: expected { tables: [...] }' });
    }

    const results = [];

    for (const table of tables) {
      const { name, columns } = table;

      if (!name || !columns || !Array.isArray(columns)) {
        results.push({ table: name, error: 'Invalid table definition' });
        continue;
      }

      const columnDefs = columns.map(col => `${col.name} ${col.type}`).join(', ');

      const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnDefs})`;

      try {
        await pool.query(query);
        results.push({ table: name, status: 'created' });
      } catch (err) {
        results.push({ table: name, error: err.message });
      }
    }

    res.json({ message: 'Table creation attempted', results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
