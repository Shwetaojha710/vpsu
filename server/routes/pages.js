// pages CRUD (About, VC, Admission...)

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY id ASC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM pages WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Page not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', async function (req, res) {
  try {
    const slug = (req.body.slug || '').trim();
    const title = (req.body.title || '').trim();
    if (!slug || !title) {
      return res.status(400).json({ success: false, message: 'Slug and title are required', data: null });
    }

    const result = await pool.query(
      `INSERT INTO pages (slug, title, title_hi, content, content_hi, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        slug,
        title,
        req.body.title_hi || '',
        req.body.content || '',
        req.body.content_hi || '',
        req.body.is_published !== false
      ]
    );
    return res.json({ success: true, message: 'Page created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', async function (req, res) {
  try {
    const slug = (req.body.slug || '').trim();
    const title = (req.body.title || '').trim();
    if (!slug || !title) {
      return res.status(400).json({ success: false, message: 'Slug and title are required', data: null });
    }

    const result = await pool.query(
      `UPDATE pages SET
        slug = $1, title = $2, title_hi = $3, content = $4, content_hi = $5,
        is_published = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [
        slug,
        title,
        req.body.title_hi || '',
        req.body.content || '',
        req.body.content_hi || '',
        req.body.is_published !== false,
        req.params.id
      ]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Page not found', data: null });
    }
    return res.json({ success: true, message: 'Page updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM pages WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Page not found', data: null });
    }
    return res.json({ success: true, message: 'Page deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
