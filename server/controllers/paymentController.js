const pool = require('../config/db');
const { generateTransactionId } = require('../utils/tokenUtils');

// Process payment (mock)
const processPayment = async (req, res, next) => {
  try {
    const { booking_id, method } = req.body;

    // Validate booking
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [booking_id, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const booking = bookings[0];

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot process payment for booking with status: ${booking.status}`
      });
    }

    // Check if payment already exists
    const [existingPayment] = await pool.query(
      "SELECT id FROM payments WHERE booking_id = ? AND status = 'success'",
      [booking_id]
    );

    if (existingPayment.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed for this booking.'
      });
    }

    // Generate transaction ID
    const transaction_id = generateTransactionId();

    // Simulate payment processing (mock - always succeeds)
    const paymentStatus = 'success';

    // Create payment record
    const [result] = await pool.query(
      'INSERT INTO payments (booking_id, amount, method, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
      [booking_id, booking.total_amount, method, transaction_id, paymentStatus]
    );

    // Update booking status to confirmed
    await pool.query(
      "UPDATE bookings SET status = 'confirmed' WHERE id = ?",
      [booking_id]
    );

    const [payment] = await pool.query('SELECT * FROM payments WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get payment status
const getPaymentStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const [payments] = await pool.query(
      `SELECT p.*, b.total_amount as booking_amount, b.status as booking_status
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE p.booking_id = ?`,
      [bookingId]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No payment found for this booking.'
      });
    }

    res.json({
      success: true,
      data: payments[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { processPayment, getPaymentStatus };
