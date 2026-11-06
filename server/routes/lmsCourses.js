const express = require('express');
const lmsAccess = require('../middleware/lmsAccess');
const ctrl = require('../controllers/lmsCourseController');

const router = express.Router();
const view = lmsAccess('admin', 'faculty', 'department', 'teacher');
const manage = lmsAccess('admin', 'faculty', 'department');

router.get('/', view, ctrl.list);
router.get('/:id', view, ctrl.show);
router.post('/', manage, ctrl.create);
router.put('/:id', manage, ctrl.update);
router.delete('/:id', manage, ctrl.remove);

module.exports = router;
