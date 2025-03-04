const express = require('express');
const router = express.Router();
const{registerUser, loginUser,getAllUsers,deleteUser} = require('../controllers/authController');
const authMiddleware = require('../Middlewares/authMiddleware');
const myAdminMiddleware = require('../Middlewares/myAdminMiddleware');
//console.log(authMiddleware);
//console.log(myAdminMiddleware);






//Public Route Implementation
router.post('/register',registerUser);
router.post('/login',loginUser);

//Admin Route Implementation With The Security 

router.get('/users',authMiddleware,myAdminMiddleware,getAllUsers);
router.delete('/users/:id',authMiddleware,myAdminMiddleware,deleteUser);

module.exports = router;