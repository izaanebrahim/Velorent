const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
  body('phone').optional().trim(),
  body('role').optional().isIn(['customer', 'owner']).withMessage('Invalid role')
], register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
