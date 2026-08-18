// stats CRUD (student and college numbers)

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM stats WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stat not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', async function (req, res) {
  try {
    const label = (req.body.label || '').trim();
    const value = (req.body.value || '').trim();
    if (!label || !value) {
      return res.status(400).json({ success: false, message: 'Label and value are required', data: null });
    }

    const result = await pool.query(
      'INSERT INTO stats (label, value, icon, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [label, value, req.body.icon || '', Number(req.body.sort_order) || 0]
    );
    return res.json({ success: true, message: 'Stat created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', async function (req, res) {
  try {
    const label = (req.body.label || '').trim();
    const value = (req.body.value || '').trim();
    if (!label || !value) {
      return res.status(400).json({ success: false, message: 'Label and value are required', data: null });
    }

    const result = await pool.query(
      'UPDATE stats SET label = $1, value = $2, icon = $3, sort_order = $4 WHERE id = $5 RETURNING *',
      [label, value, req.body.icon || '', Number(req.body.sort_order) || 0, req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stat not found', data: null });
    }
    return res.json({ success: true, message: 'Stat updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM stats WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stat not found', data: null });
    }
    return res.json({ success: true, message: 'Stat deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
