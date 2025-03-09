const express = require('express');
const router = express.Router();
const {createBudget,viewAllBudgets,updateBudget,deleteBudget,checkBudgetFlow} = require('../controllers/budgetController');
const authMiiddleware = require('../middlewares/authMiddleware');


router.post('/addBudget',authMiiddleware,createBudget);
router.get('/viewBudgets', authMiiddleware, viewAllBudgets);
router.put('/updateBudget/:id',authMiiddleware,updateBudget);
router.delete('/deleteBudget/:id',authMiiddleware,deleteBudget);
router.get('/checkBudgetFlow',checkBudgetFlow);


module.exports = router;