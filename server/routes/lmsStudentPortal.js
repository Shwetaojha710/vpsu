const express = require('express');
const lmsAuth = require('../middleware/lmsAuth');
const portal = require('../controllers/lmsStudentPortalController');

const router = express.Router();

router.post('/login', portal.login);
router.get('/me', lmsAuth('student'), portal.me);
router.get('/subjects', lmsAuth('student'), portal.mySubjects);
router.get('/subjects/:subjectId/contents', lmsAuth('student'), portal.subjectContents);

module.exports = router;
