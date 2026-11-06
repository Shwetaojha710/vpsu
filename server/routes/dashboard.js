const express = require('express');
const ctrl = require('../controllers/dashboardController');

const router = express.Router();
router.get('/', ctrl.index);

module.exports = router;
