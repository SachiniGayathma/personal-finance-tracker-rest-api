const express = require('express');
const router = express.Router();
const {createGoal,allGoal,viewGoalById,updateGoal,deleteGoal} = require('../controllers/goalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/createGoal',authMiddleware,createGoal);
router.get('/getGoals',authMiddleware,allGoal);
router.get('/viewGoal/:id',authMiddleware,viewGoalById);
router.put('/updateGoal/:id',authMiddleware,updateGoal);
router.delete('/deleteGoal/:id',authMiddleware,deleteGoal);

module.exports = router;