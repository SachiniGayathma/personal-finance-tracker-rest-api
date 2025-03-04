const express = require('express');
const router = express.Router();
const {createBudget,viewAllBudgets,updateBudget,deleteBudget} = require('../controllers/budgetController');
const authMiiddleware = require('../middlewares/authMiddleware');


router.post('/addBudget',authMiiddleware,createBudget);
router.get('/viewBudgets', authMiiddleware, viewAllBudgets);
router.put('/updateBudget/:id',authMiiddleware,updateBudget);
router.delete('/deleteBudget/:id',authMiiddleware,deleteBudget);


module.exports = router;