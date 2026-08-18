// leaders CRUD + photo upload (Governor, CM, VC)

const express = require('express');
const pool = require('../db');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM leaders ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM leaders WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Leader not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', upload.single('photo'), async function (req, res) {
  try {
    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required', data: null });
    }

    const photo = req.file ? req.file.filename : '';
    const result = await pool.query(
      `INSERT INTO leaders (name, designation, photo, profile_text, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, req.body.designation || '', photo, req.body.profile_text || '', Number(req.body.sort_order) || 0]
    );
    return res.json({ success: true, message: 'Leader created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', upload.single('photo'), async function (req, res) {
  try {
    const old = await pool.query('SELECT * FROM leaders WHERE id = $1', [req.params.id]);
    if (!old.rows[0]) {
      return res.status(404).json({ success: false, message: 'Leader not found', data: null });
    }

    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required', data: null });
    }

    const photo = req.file ? req.file.filename : old.rows[0].photo;
    const result = await pool.query(
      `UPDATE leaders SET name = $1, designation = $2, photo = $3, profile_text = $4, sort_order = $5
       WHERE id = $6 RETURNING *`,
      [
        name,
        req.body.designation || '',
        photo,
        req.body.profile_text || '',
        Number(req.body.sort_order) || 0,
        req.params.id
      ]
    );
    return res.json({ success: true, message: 'Leader updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM leaders WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Leader not found', data: null });
    }
    return res.json({ success: true, message: 'Leader deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
