


const myAdminMiddleware = (req, res, next) => {
   if (!req.user || req.user.role !== "admin") {
     return res.status(403).json({ message: "Access denied. Admins only." });
    }
   next(); // Proceed if user is an admin
  };
  
module.exports = myAdminMiddleware;
  