const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const {
  validateCreateBooking,
  validateUpdateBookingStatus,
} = require('./booking.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/', authenticate, validateCreateBooking, bookingController.createBooking);
router.get('/my-bookings', authenticate, bookingController.getMyBookings);
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);
router.get('/:id', authenticate, bookingController.getBookingById);

// Admin routes
router.get('/', authenticate, authorize('admin'), bookingController.getAllBookings);
router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateUpdateBookingStatus,
  bookingController.updateBookingStatus
);
router.delete('/:id', authenticate, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
