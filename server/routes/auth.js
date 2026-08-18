// login, current admin, and change password

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async function (req, res) {
  try {
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: null
      });
    }

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Wrong email or password',
        data: null
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Wrong email or password',
        data: null
      });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /api/auth/me
router.get('/me', auth, async function (req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM admins WHERE id = $1',
      [req.admin.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Admin not found', data: null });
    }
    return res.json({ success: true, message: 'OK', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// PUT /api/auth/password
router.put('/password', auth, async function (req, res) {
  try {
    const oldPassword = req.body.oldPassword || '';
    const newPassword = req.body.newPassword || '';

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required',
        data: null
      });
    }

    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
    const admin = result.rows[0];
    const match = await bcrypt.compare(oldPassword, admin.password);

    if (!match) {
      return res.status(400).json({ success: false, message: 'Old password is wrong', data: null });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [hash, req.admin.id]);

    return res.json({ success: true, message: 'Password changed', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
});

module.exports = router;
