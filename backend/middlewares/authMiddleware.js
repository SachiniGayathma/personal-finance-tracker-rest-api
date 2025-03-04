const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); // Get token from the Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using your JWT secret
    const user = await User.findById(decoded.id); // Find the user by ID from the decoded token
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed', error: err });
  }
};

module.exports =  authMiddleWare ;
