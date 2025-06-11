const { body } = require('express-validator');
const { httpLogin, httpGetProfile, httpRegister } = require('./auth.controller');
const authMiddleware = require('../../middleware/auth');

const router = require('express').Router();

// Login route for both users and admin
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  httpLogin
);

// Get current user profile (protected route)
router.get('/profile', authMiddleware, httpGetProfile);

// Register a new user
router.post(
  '/register',
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    // Optional fields, add validation if they become mandatory or have specific formats
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('postal_code').optional().trim(),
  ],
  httpRegister
);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ message: 'Auth route not found!' });
});

module.exports = router;
