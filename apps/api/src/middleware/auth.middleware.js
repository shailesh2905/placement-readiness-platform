import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_do_not_use_in_prod');
      
      // We will fetch the user from DB here and attach to req.user once Prisma is set up
      req.user = {
        id: decoded.userId,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'User role not authorized to access this route' });
    }
    next();
  };
};

export { protect, authorize };
