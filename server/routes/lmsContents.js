const express = require('express');
const lmsAccess = require('../middleware/lmsAccess');
const uploadLms = require('../middleware/uploadLms');
const ctrl = require('../controllers/lmsContentController');

const router = express.Router();
const view = lmsAccess('admin', 'faculty', 'department', 'teacher');

router.get('/', view, ctrl.list);
router.get('/:id', view, ctrl.show);
router.get('/:id/download', view, ctrl.download);
router.post('/', view, uploadLms.single('file'), ctrl.create);
router.put('/:id', view, uploadLms.single('file'), ctrl.update);
router.patch('/:id/publish', view, ctrl.publish);
router.delete('/:id', view, ctrl.remove);

module.exports = router;
