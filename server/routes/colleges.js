// colleges CRUD (affiliated / government / aided)

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM colleges ORDER BY id ASC');
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM colleges WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'College not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.post('/', async function (req, res) {
  try {
    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required', data: null });
    }

    const result = await pool.query(
      `INSERT INTO colleges (name, code, district, type, email, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        req.body.code || '',
        req.body.district || '',
        req.body.type || 'affiliated',
        req.body.email || '',
        req.body.phone || '',
        req.body.is_active !== false
      ]
    );
    return res.json({ success: true, message: 'College created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.put('/:id', async function (req, res) {
  try {
    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required', data: null });
    }

    const result = await pool.query(
      `UPDATE colleges SET name = $1, code = $2, district = $3, type = $4,
        email = $5, phone = $6, is_active = $7
       WHERE id = $8 RETURNING *`,
      [
        name,
        req.body.code || '',
        req.body.district || '',
        req.body.type || 'affiliated',
        req.body.email || '',
        req.body.phone || '',
        req.body.is_active !== false,
        req.params.id
      ]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'College not found', data: null });
    }
    return res.json({ success: true, message: 'College updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM colleges WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'College not found', data: null });
    }
    return res.json({ success: true, message: 'College deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
