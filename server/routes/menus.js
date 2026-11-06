const express = require('express');
const ctrl = require('../controllers/menuController');

const router = express.Router();

// MGKVP-style nested tree (page_type, translations, children)
router.get('/', ctrl.tree);
router.get('/tree', ctrl.tree);
// Flat list for admin drill-down
router.get('/list', ctrl.list);
router.get('/:id', ctrl.show);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
