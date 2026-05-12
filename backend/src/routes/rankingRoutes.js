const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const rankingController = require('../controllers/rankingController');

const router = express.Router();

router.use(authMiddleware);
router.get('/monthly', rankingController.monthlyRanking);

module.exports = router;
