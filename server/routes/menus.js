// nested menus: one table, parent_id = null means top menu
// any menu can have more child menus, any number of levels

const express = require('express');
const pool = require('../db');

const router = express.Router();

function toParentId(value) {
  if (value === undefined || value === null || value === '' || value === 'null') {
    return null;
  }
  return Number(value);
}

// walk up to Home > University > About (for breadcrumb)
async function getPath(id) {
  const path = [];
  let currentId = id;
  let step = 0;
  while (currentId && step < 20) {
    const result = await pool.query(
      'SELECT id, title, parent_id FROM menus WHERE id = $1',
      [currentId]
    );
    if (!result.rows[0]) break;
    path.unshift(result.rows[0]);
    currentId = result.rows[0].parent_id;
    step += 1;
  }
  return path;
}

async function getChildrenTree(parentId) {
  const result = await pool.query(
    `SELECT * FROM menus
     WHERE parent_id IS NOT DISTINCT FROM $1
     ORDER BY sort_order ASC, id ASC`,
    [parentId]
  );
  const rows = result.rows;
  for (let i = 0; i < rows.length; i++) {
    rows[i].children = await getChildrenTree(rows[i].id);
  }
  return rows;
}

// GET /api/menus          -> top menus
// GET /api/menus?parent_id=5 -> children of menu 5
router.get('/', async function (req, res) {
  try {
    const parentId = toParentId(req.query.parent_id);
    const result = await pool.query(
      `SELECT m.*,
        (SELECT COUNT(*)::int FROM menus c WHERE c.parent_id = m.id) AS child_count
       FROM menus m
       WHERE m.parent_id IS NOT DISTINCT FROM $1
       ORDER BY m.sort_order ASC, m.id ASC`,
      [parentId]
    );
    return res.json({ success: true, message: 'OK', data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /api/menus/tree  (full nested list for website later)
router.get('/tree', async function (req, res) {
  try {
    const tree = await getChildrenTree(null);
    return res.json({ success: true, message: 'OK', data: tree });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /api/menus/:id
router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM menus WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Menu not found', data: null });
    }
    const row = result.rows[0];
    row.path = await getPath(row.id);
    return res.json({ success: true, message: 'OK', data: row });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// POST /api/menus
router.post('/', async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const result = await pool.query(
      `INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        toParentId(req.body.parent_id),
        title,
        req.body.title_hi || '',
        req.body.url || '#',
        Number(req.body.sort_order) || 0,
        req.body.is_active !== false
      ]
    );
    return res.json({ success: true, message: 'Menu created', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// PUT /api/menus/:id
router.put('/:id', async function (req, res) {
  try {
    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const result = await pool.query(
      `UPDATE menus SET title = $1, title_hi = $2, url = $3, sort_order = $4, is_active = $5
       WHERE id = $6 RETURNING *`,
      [
        title,
        req.body.title_hi || '',
        req.body.url || '#',
        Number(req.body.sort_order) || 0,
        req.body.is_active !== false,
        req.params.id
      ]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Menu not found', data: null });
    }
    return res.json({ success: true, message: 'Menu updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// DELETE /api/menus/:id  (all nested children are deleted too)
router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM menus WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Menu not found', data: null });
    }
    return res.json({ success: true, message: 'Menu deleted', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
