const express = require('express');
const router = express.Router();
const{registerUser, loginUser, getAllUsers, deleteUser} = require('../controllers/authController');
const{authMiddleware, adminMiddleware} = require('../middlewares/authMiddleware');


//Public Route Implementation
router.post('/register',registerUser);
router.post('/login',loginUser);

//Admin Route Implementation With The Security 

router.get('/users',authMiddleware,adminMiddleware,getAllUsers);
router.delete('/users/:id',authMiddleware,adminMiddleware,deleteUser);

module.exports = router;