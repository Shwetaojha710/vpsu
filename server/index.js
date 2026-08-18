// start the Express server and connect all routes

const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// allow React app (localhost:5173) to call this API
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// login is public, other auth routes check token inside the file
app.use('/api/auth', require('./routes/auth'));

// all modules below need a valid JWT token
app.use('/api/dashboard', auth, require('./routes/dashboard'));
app.use('/api/notices', auth, require('./routes/notices'));
app.use('/api/pages', auth, require('./routes/pages'));
app.use('/api/slider', auth, require('./routes/slider'));
app.use('/api/leaders', auth, require('./routes/leaders'));
app.use('/api/stats', auth, require('./routes/stats'));
app.use('/api/quick-links', auth, require('./routes/quickLinks'));
app.use('/api/galleries', auth, require('./routes/galleries'));
app.use('/api/colleges', auth, require('./routes/colleges'));

app.use('/api', function (req, res) {
  res.status(404).json({ success: false, message: 'API not found', data: null });
});

// simple error handler so the server does not crash
app.use(function (err, req, res, next) {
  console.error(err.message);
  res.status(400).json({
    success: false,
    message: err.message || 'Something went wrong',
    data: null
  });
});

// test database first, then start server
pool.query('SELECT NOW()')
  .then(function () {
    console.log('PostgreSQL connected');
    app.listen(PORT, function () {
      console.log('Server running on http://localhost:' + PORT);
    });
  })
  .catch(function (err) {
    console.error('PostgreSQL connection failed.');
    console.error('Check DB name, user and password in server/.env');
    console.error('Error: ' + err.message);
    process.exit(1);
  });
