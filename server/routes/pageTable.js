const express = require('express');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/pageTableController');

const router = express.Router();

// Specific paths first
router.get('/by-card/:id', ctrl.listCards);
router.get('/cards/:id', ctrl.listCards);
router.post('/:id/cards', upload.any(), ctrl.listCards);
router.put('/cards/:id', upload.any(), ctrl.listCards);
router.delete('/cards/:id', ctrl.listCards);

router.get('/:id/export', ctrl.exportSheet);
router.post('/:id/rows', upload.any(), ctrl.createRows);
router.put('/:id/rows', upload.any(), ctrl.updateRows);

// List: /api/page-table  OR  /api/page-table/table  OR  /api/page-table/:table
router.get('/', function (req, res, next) {
  req.params.layoutType = req.query.layout_type || 'table';
  return ctrl.list(req, res, next);
});
router.get('/:layoutType', ctrl.list);

router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
