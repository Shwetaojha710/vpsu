const express = require('express');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);
router.put('/password', auth, ctrl.changePassword);

module.exports = router;
