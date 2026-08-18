// notices CRUD + optional PDF upload

const express = require('express');
const pool = require('../db');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/notices
router.get('/', async function (req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC'
    );
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /api/notices/:id
router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM notices WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Notice not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// POST /api/notices
router.post('/', upload.single('pdf_file'), async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const pdfFile = req.file ? req.file.filename : null;
    const result = await pool.query(
      `INSERT INTO notices
        (title, title_hi, description, category, pdf_file, is_pinned, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        req.body.title_hi || '',
        req.body.description || '',
        req.body.category || 'general',
        pdfFile,
        req.body.is_pinned === 'true' || req.body.is_pinned === true,
        req.body.is_published !== 'false' && req.body.is_published !== false
      ]
    );

    return res.json({ success: true, message: 'Notice created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// PUT /api/notices/:id
router.put('/:id', upload.single('pdf_file'), async function (req, res) {
  try {
    const old = await pool.query('SELECT * FROM notices WHERE id = $1', [req.params.id]);
    if (!old.rows[0]) {
      return res.status(404).json({ success: false, message: 'Notice not found', data: null });
    }

    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const pdfFile = req.file ? req.file.filename : old.rows[0].pdf_file;
    const result = await pool.query(
      `UPDATE notices SET
        title = $1, title_hi = $2, description = $3, category = $4,
        pdf_file = $5, is_pinned = $6, is_published = $7
       WHERE id = $8 RETURNING *`,
      [
        title,
        req.body.title_hi || '',
        req.body.description || '',
        req.body.category || 'general',
        pdfFile,
        req.body.is_pinned === 'true' || req.body.is_pinned === true,
        req.body.is_published !== 'false' && req.body.is_published !== false,
        req.params.id
      ]
    );

    return res.json({ success: true, message: 'Notice updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// DELETE /api/notices/:id
router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM notices WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Notice not found', data: null });
    }
    return res.json({ success: true, message: 'Notice deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
