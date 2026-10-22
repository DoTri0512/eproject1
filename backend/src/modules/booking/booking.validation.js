const { errorResponse } = require('../../utils/response');

const validateCreateBooking = (req, res, next) => {
  const { tourId, departureDate, numberOfGuests, totalAmount, selectedDuration } = req.body;
  const errors = [];

  if (!tourId) {
    errors.push('Tour ID is required');
  }

  if (!departureDate) {
    errors.push('Departure date is required');
  }

  if (selectedDuration) {
    if (selectedDuration.days === undefined || Number(selectedDuration.days) < 1) {
      errors.push('selectedDuration.days must be a number >= 1');
    }
    if (selectedDuration.nights === undefined || Number(selectedDuration.nights) < 0) {
      errors.push('selectedDuration.nights must be a number >= 0');
    }
    if (selectedDuration.price === undefined || Number(selectedDuration.price) < 0) {
      errors.push('selectedDuration.price must be a valid positive number');
    }
  }

  if (totalAmount !== undefined && (totalAmount === null || Number(totalAmount) <= 0)) {
    errors.push('A valid total amount is required');
  }

  if (numberOfGuests) {
    if (numberOfGuests.adults !== undefined && Number(numberOfGuests.adults) < 1) {
      errors.push('At least 1 adult guest is required');
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

const validateUpdateBookingStatus = (req, res, next) => {
  const { bookingStatus, paymentStatus } = req.body;
  const validBookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const validPaymentStatuses = ['pending', 'confirmed', 'completed'];
  const errors = [];

  if (bookingStatus && !validBookingStatuses.includes(bookingStatus)) {
    errors.push(`Invalid booking status. Allowed: ${validBookingStatuses.join(', ')}`);
  }

  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    errors.push(`Invalid payment status. Allowed: ${validPaymentStatuses.join(', ')}`);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateCreateBooking,
  validateUpdateBookingStatus,
};
