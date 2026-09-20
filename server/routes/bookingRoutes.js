const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

// All booking routes require authentication
router.use(auth);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/all', authorize('admin'), getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
