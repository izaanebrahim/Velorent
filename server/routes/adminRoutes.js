const express = require('express');
const { getAllUsers, updateUser, getDashboardStats } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(auth);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

module.exports = router;
