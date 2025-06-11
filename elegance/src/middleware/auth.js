// Temporarily comment out jsonwebtoken until it's installed
// const jwt = require('jsonwebtoken');
const httpError = require('http-errors');

// Temporarily commented out since we're not using JWT
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw httpError.Unauthorized('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw httpError.Unauthorized('No token provided');
    }
    
    // Mode de développement - accepter n'importe quel token
    // Dans un environnement de production, utiliser JWT.verify
    // const decoded = jwt.verify(token, JWT_SECRET);
    
    // Pour le développement, nous acceptons simplement le token et créons un utilisateur fictif
    // Cette approche n'est pas sécurisée et ne devrait jamais être utilisée en production
    req.user = {
      id: 1,
      email: 'user@example.com',
      role: 'user'
    };
    
    // Permettre aux requêtes qui incluent un paramètre admin=true d'accéder en tant qu'admin
    if (req.query.admin === 'true' || req.headers['x-admin'] === 'true') {
      req.user.role = 'admin';
    }
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(httpError.Unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

// Admin role check middleware
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw httpError.Forbidden('Admin access required');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
