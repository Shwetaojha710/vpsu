const express = require('express');
const lmsAuth = require('../middleware/lmsAuth');
const portal = require('../controllers/lmsTeacherPortalController');
const contentCtrl = require('../controllers/lmsContentController');
const uploadLms = require('../middleware/uploadLms');
const lmsAccess = require('../middleware/lmsAccess');

const router = express.Router();
const teacher = [lmsAuth('teacher'), lmsAccess('teacher')];

router.post('/login', portal.login);
router.get('/me', lmsAuth('teacher'), portal.me);
router.get('/subjects', lmsAuth('teacher'), portal.mySubjects);

// Teacher content management (own contents only)
router.get('/contents', teacher, contentCtrl.list);
router.get('/contents/:id/download', teacher, contentCtrl.download);
router.post('/contents', teacher, uploadLms.single('file'), contentCtrl.create);
router.put('/contents/:id', teacher, uploadLms.single('file'), contentCtrl.update);
router.patch('/contents/:id/publish', teacher, contentCtrl.publish);
router.delete('/contents/:id', teacher, contentCtrl.remove);

module.exports = router;
