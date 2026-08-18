// this file checks JWT token on every protected API
// if token is missing or wrong, we send 401

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  try {
    // token comes like: Authorization: Bearer eyJhbGci...
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login first',
        data: null
      });
    }

    // decode token and save admin info on req
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = data;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Login expired. Please login again',
      data: null
    });
  }
}

module.exports = auth;
