const express = require('express');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/noticeController');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.post('/', upload.single('pdf_file'), ctrl.create);
router.put('/:id', upload.single('pdf_file'), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
