const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', processPayment);
router.get('/:bookingId', getPaymentStatus);

module.exports = router;
