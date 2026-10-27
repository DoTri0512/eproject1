const bookingService = require('./booking.service');
const { successResponse } = require('../../utils/response');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.user.id, req.body);
      return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const result = await bookingService.getUserBookings(req.user.id, req.query);
      return successResponse(res, result, 'User bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(
        req.params.id,
        req.user.id,
        req.user.role
      );
      return successResponse(res, booking, 'Booking retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const reason = req.body?.reason || '';
      const booking = await bookingService.cancelBooking(req.params.id, req.user.id, reason);
      return successResponse(res, booking, 'Booking cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const result = await bookingService.getAllBookings(req.query);
      return successResponse(res, result, 'All bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(req, res, next) {
    try {
      const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
      return successResponse(res, booking, 'Booking status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteBooking(req, res, next) {
    try {
      const result = await bookingService.deleteBooking(req.params.id);
      return successResponse(res, result, 'Booking deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
