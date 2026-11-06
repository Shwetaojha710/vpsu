const express = require('express');
const lmsAccess = require('../middleware/lmsAccess');
const ctrl = require('../controllers/lmsTeacherController');

const router = express.Router();
const manage = lmsAccess('admin', 'faculty', 'department');

router.get('/', manage, ctrl.list);
router.get('/:id', manage, ctrl.show);
router.post('/', manage, ctrl.create);
router.put('/:id', manage, ctrl.update);
router.delete('/:id', manage, ctrl.remove);
router.put('/:id/subjects', manage, ctrl.assignSubjects);

module.exports = router;
