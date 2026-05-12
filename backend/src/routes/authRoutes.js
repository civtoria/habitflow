const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
