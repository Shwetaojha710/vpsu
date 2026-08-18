// quick links CRUD (exam form, result, fee...)

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM quick_links ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM quick_links WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Link not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    const url = (req.body.url || '').trim();
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required', data: null });
    }

    const result = await pool.query(
      `INSERT INTO quick_links (title, url, icon, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        title,
        url,
        req.body.icon || '',
        Number(req.body.sort_order) || 0,
        req.body.is_active !== false
      ]
    );
    return res.json({ success: true, message: 'Link created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    const url = (req.body.url || '').trim();
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required', data: null });
    }

    const result = await pool.query(
      `UPDATE quick_links SET title = $1, url = $2, icon = $3, sort_order = $4, is_active = $5
       WHERE id = $6 RETURNING *`,
      [
        title,
        url,
        req.body.icon || '',
        Number(req.body.sort_order) || 0,
        req.body.is_active !== false,
        req.params.id
      ]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Link not found', data: null });
    }
    return res.json({ success: true, message: 'Link updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM quick_links WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Link not found', data: null });
    }
    return res.json({ success: true, message: 'Link deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
