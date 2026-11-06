const express = require('express');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/quickLinkController');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.post('/', upload.single('icon'), ctrl.create);
router.put('/:id', upload.single('icon'), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
