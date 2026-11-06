const express = require('express');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/sideMenuFileController');

const router = express.Router();

router.get('/', ctrl.list);
router.post('/', upload.single('file'), ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
