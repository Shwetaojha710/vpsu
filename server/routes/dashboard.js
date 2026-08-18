// counts for the dashboard cards

const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/dashboard
router.get('/', async function (req, res) {
  try {
    const notices = await pool.query('SELECT COUNT(*)::int AS total FROM notices');
    const published = await pool.query(
      'SELECT COUNT(*)::int AS total FROM notices WHERE is_published = true'
    );
    const pages = await pool.query('SELECT COUNT(*)::int AS total FROM pages');
    const colleges = await pool.query('SELECT COUNT(*)::int AS total FROM colleges');
    const galleries = await pool.query('SELECT COUNT(*)::int AS total FROM galleries');

    return res.json({
      success: true,
      message: 'OK',
      data: {
        notices: notices.rows[0].total,
        publishedNotices: published.rows[0].total,
        pages: pages.rows[0].total,
        colleges: colleges.rows[0].total,
        galleries: galleries.rows[0].total
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
