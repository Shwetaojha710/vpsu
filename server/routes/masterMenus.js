const express = require('express');
const ctrl = require('../controllers/pageTableController');

const router = express.Router();

// GET /api/master/menus  and  /api/master/menus/
router.get('/', ctrl.menusByPageType);
router.get('/by-faculty/:id', ctrl.menusByPageType);

module.exports = router;
