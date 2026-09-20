const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

// Create booking
const createBooking = async (req, res, next) => {
  try {
    const { vehicle_id, start_date, end_date, pickup_location, notes } = req.body;
    const user_id = req.user.id;

    // Validate dates
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past.'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date.'
      });
    }

    // Check vehicle exists and is available
    const [vehicles] = await pool.query(
      'SELECT * FROM vehicles WHERE id = ? AND is_available = TRUE AND is_approved = TRUE',
      [vehicle_id]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or not available.'
      });
    }

    // Check for overlapping bookings (prevent double booking)
    // Check confirmed/active bookings and pending reservations created within the last 15 minutes
    const [conflicts] = await pool.query(
      `SELECT id FROM bookings
       WHERE vehicle_id = ?
       AND (
         status IN ('confirmed', 'active')
         OR (status = 'pending' AND created_at >= NOW() - INTERVAL 15 MINUTE)
       )
       AND start_date < ? AND end_date > ?`,
      [vehicle_id, end_date, start_date]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Vehicle is already booked or reserved for the selected dates.'
      });
    }

    // Calculate total amount (base rate + 18% GST matching checkout invoice)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const base_amount = days * Number(vehicles[0].price_per_day);
    const total_amount = Math.round(base_amount * 1.18 * 100) / 100;

    // Create booking
    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_amount, status, pickup_location, notes)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [user_id, vehicle_id, start_date, end_date, total_amount, pickup_location, notes]
    );

    const [booking] = await pool.query(
      `SELECT b.*, v.brand, v.model, v.image_url, v.price_per_day
       FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings
const getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE b.user_id = ?';
    const params = [req.user.id];

    if (status) {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause}`,
      params
    );

    const [bookings] = await pool.query(
      `SELECT b.*, v.brand, v.model, v.image_url, v.type, v.price_per_day,
              p.status as payment_status, p.method as payment_method, p.transaction_id
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       LEFT JOIN payments p ON b.id = p.booking_id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: bookings,
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

// Get single booking
const getBookingById = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, v.brand, v.model, v.image_url, v.type, v.price_per_day, v.fuel_type, v.transmission,
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              p.status as payment_status, p.method as payment_method, p.transaction_id
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Check authorization (user can only see their own bookings, admin sees all)
    if (req.user.role !== 'admin' && bookings[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.'
      });
    }

    res.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const booking = bookings[0];

    // Authorization
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.'
      });
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status: ${booking.status}`
      });
    }

    await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [id]);

    // Refund payment if exists
    await pool.query("UPDATE payments SET status = 'refunded' WHERE booking_id = ? AND status = 'success'", [id]);

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE b.status = ?';
      params.push(status);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause}`,
      params
    );

    const [bookings] = await pool.query(
      `SELECT b.*, v.brand, v.model, v.image_url, u.name as customer_name, u.email as customer_email,
              p.status as payment_status
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN payments p ON b.id = p.booking_id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: bookings,
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

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};
