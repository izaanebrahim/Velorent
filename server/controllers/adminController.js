const pool = require('../config/db');

// Get all users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    const conditions = [];
    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const [users] = await pool.query(
      `SELECT id, name, email, phone, role, is_active, email_verified, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user role/status (admin)
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    const updates = [];
    const values = [];

    if (role) { updates.push('role = ?'); values.push(role); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    values.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    const [user] = await pool.query(
      'SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalVehicles] = await pool.query('SELECT COUNT(*) as count FROM vehicles WHERE is_approved = TRUE');
    const [activeBookings] = await pool.query("SELECT COUNT(*) as count FROM bookings WHERE status IN ('confirmed', 'active')");
    const [totalRevenue] = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success'");

    const [recentBookings] = await pool.query(
      `SELECT b.*, v.brand, v.model, u.name as customer_name
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC LIMIT 10`
    );

    const [vehicleStats] = await pool.query(
      `SELECT
        SUM(is_available = TRUE) as available,
        SUM(is_available = FALSE) as rented,
        COUNT(*) as total
       FROM vehicles WHERE is_approved = TRUE`
    );

    const [monthlyRevenue] = await pool.query(
      `SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as revenue,
        COUNT(*) as transactions
       FROM payments
       WHERE status = 'success'
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC LIMIT 12`
    );

    const [categoryStats] = await pool.query(
      `SELECT category, COUNT(*) as count FROM vehicles WHERE is_approved = TRUE GROUP BY category`
    );

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers[0].count,
          totalVehicles: totalVehicles[0].count,
          activeBookings: activeBookings[0].count,
          totalRevenue: totalRevenue[0].total
        },
        recentBookings,
        vehicleStats: vehicleStats[0],
        monthlyRevenue,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUser, getDashboardStats };
