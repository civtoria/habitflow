const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const habitController = require('../controllers/habitController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', habitController.listHabits);
router.get('/stats', habitController.dashboardStats);
router.post('/', habitController.createHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.post('/:id/toggle', habitController.toggleHabitToday);

module.exports = router;
