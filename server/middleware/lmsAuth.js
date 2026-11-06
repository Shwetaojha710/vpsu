// JWT auth for LMS teacher / student (separate from admin auth)

const jwt = require('jsonwebtoken');

function lmsAuth(requiredRole) {
  return function (req, res, next) {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (!token) {
        return res.status(401).json({
          status: false,
          message: 'Please login first',
          data: null
        });
      }

      const data = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && data.role !== requiredRole) {
        return res.status(403).json({
          status: false,
          message: 'Access denied',
          data: null
        });
      }

      req.lmsUser = data;
      next();
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: 'Login expired. Please login again',
        data: null
      });
    }
  };
}

module.exports = lmsAuth;
