const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { generateToken } = require('../utils/tokenUtils');
const { AppError } = require('../middleware/errorHandler');

// Register new user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, passwordHash, role || 'customer']
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: role || 'customer'
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT id, name, email, phone, password_hash, role, avatar_url, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, license_url, avatar_url, email_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, license_url, avatar_url } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (license_url) { updates.push('license_url = ?'); values.push(license_url); }
    if (avatar_url) { updates.push('avatar_url = ?'); values.push(avatar_url); }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update.'
      });
    }

    values.push(req.user.id);
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await pool.query(
      'SELECT id, name, email, phone, role, license_url, avatar_url, email_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
