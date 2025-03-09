const {createTransaction,getllTransactions,updateTransaction,deleteTransaction,getSingleTransaction,filterTransactionsByTags,checkRecurringTransactions} = require('../controllers/transactionController');
const authMiddleWare = require('../Middlewares/authMiddleware');
const myAdminMiddleWare = require('../Middlewares/myAdminMiddleware');
const express = require('express');
const router = express.Router();

//console.log(authMiddleWare);
//console.log(myAdminMiddleWare);




router.post('/addTransaction',authMiddleWare,createTransaction);
router.get('/viewAllTransactions', authMiddleWare,myAdminMiddleWare,getllTransactions,);
router.get('/viewTransaction/:id',authMiddleWare,getSingleTransaction);
router.get('/transactions/filter',authMiddleWare,filterTransactionsByTags);
router.put('/updateTransaction/:id',authMiddleWare,updateTransaction);
router.delete('/deleteTransaction/:id', authMiddleWare,deleteTransaction);
router.get('/checkRecurringTransaction',checkRecurringTransactions);

module.exports = router;