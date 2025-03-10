const {getFinancialPdf} = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/generateReport/filter',authMiddleware,getFinancialPdf);

module.exports = router;