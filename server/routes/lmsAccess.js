const express = require('express');
const lmsAccess = require('../middleware/lmsAccess');
const ctrl = require('../controllers/lmsAccessController');

const router = express.Router();
const adminOnly = lmsAccess('admin');

router.get('/scope', lmsAccess('admin', 'faculty', 'department', 'teacher'), ctrl.scope);
router.get('/departments', lmsAccess('admin', 'faculty', 'department', 'teacher'), ctrl.departments);
router.get('/users', adminOnly, ctrl.listUsers);
router.post('/users', adminOnly, ctrl.createUser);
router.put('/users/:id', adminOnly, ctrl.updateUser);
router.delete('/users/:id', adminOnly, ctrl.removeUser);

module.exports = router;
