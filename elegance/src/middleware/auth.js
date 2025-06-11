// Temporarily comment out jsonwebtoken until it's installed
// const jwt = require('jsonwebtoken');
const httpError = require('http-errors');
const db = require('../models');
const Admin = db.admin;

// Temporarily commented out since we're not using JWT
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authMiddleware = async (req, res, next) => {
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
    // If x-admin is true, fetch the first admin from the database
    if (req.headers['x-admin'] === 'true') {
      const admin = await Admin.findOne();
      if (!admin) {
        throw httpError.Unauthorized('No admin account found for development');
      }
      req.user = {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      };
    } else {
      // For regular users, continue with a mock user for development
      req.user = {
        id: 1, // This can be any user ID that exists in your development `users` table
        email: 'user@example.com',
        role: 'user'
      };
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
