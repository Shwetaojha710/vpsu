// gallery CRUD + image upload

const express = require('express');
const pool = require('../db');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM galleries ORDER BY created_at DESC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM galleries WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Photo not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', upload.single('image'), async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const image = req.file ? req.file.filename : '';
    const result = await pool.query(
      'INSERT INTO galleries (title, image) VALUES ($1, $2) RETURNING *',
      [title, image]
    );
    return res.json({ success: true, message: 'Photo created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', upload.single('image'), async function (req, res) {
  try {
    const old = await pool.query('SELECT * FROM galleries WHERE id = $1', [req.params.id]);
    if (!old.rows[0]) {
      return res.status(404).json({ success: false, message: 'Photo not found', data: null });
    }

    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const image = req.file ? req.file.filename : old.rows[0].image;
    const result = await pool.query(
      'UPDATE galleries SET title = $1, image = $2 WHERE id = $3 RETURNING *',
      [title, image, req.params.id]
    );
    return res.json({ success: true, message: 'Photo updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM galleries WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Photo not found', data: null });
    }
    return res.json({ success: true, message: 'Photo deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
