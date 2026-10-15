const Booking = require('./booking.model');
const Tour = require('../tour/tour.model');
const Customer = require('../customer/customer.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class BookingService {
  async createBooking(userId, bookingData) {
    const tour = await Tour.findById(bookingData.tourId);
    if (!tour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

    const departure = new Date(bookingData.departureDate);
    const tourDays = (tour.duration && tour.duration.days) ? tour.duration.days : 1;
    const endDate = new Date(departure);
    endDate.setDate(departure.getDate() + Math.max(tourDays - 1, 0));

    let customerId = bookingData.customerId;
    if (!customerId && bookingData.customer) {
      const customer = await Customer.create({
        ...bookingData.customer,
        userId,
      });
      customerId = customer._id;
    } else if (!customerId) {
      const existingCustomer = await Customer.findOne({ userId });
      if (existingCustomer) {
        customerId = existingCustomer._id;
      }
    }

    const booking = await Booking.create({
      userId,
      tourId: bookingData.tourId,
      customerId,
      departureDate: departure,
      endDate,
      numberOfGuests: bookingData.numberOfGuests || { adults: 1, children: 0 },
      totalAmount: bookingData.totalAmount,
      paymentMethod: bookingData.paymentMethod || 'cash',
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      notes: bookingData.notes || '',
      guide_id: bookingData.guide_id || null,
    });

    return booking.populate([
      { path: 'tourId', select: 'title slug price duration destinationId' },
      { path: 'customerId' },
      { path: 'guide_id', select: 'name specialisation' },
    ]);
  }

  async getUserBookings(userId, query) {
    const { page, limit, skip } = getPagination(query);
    const filter = { userId };

    if (query.bookingStatus) {
      filter.bookingStatus = query.bookingStatus;
    }

    const [items, totalItems] = await Promise.all([
      Booking.find(filter)
        .populate({
          path: 'tourId',
          populate: { path: 'destinationId', select: 'name slug image location' },
        })
        .populate('customerId')
        .populate('guide_id', 'name specialisation')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Booking.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getBookingById(id, userId, role) {
    const booking = await Booking.findById(id)
      .populate({
        path: 'tourId',
        populate: { path: 'destinationId', select: 'name slug image location' },
      })
      .populate('customerId')
      .populate('guide_id', 'name specialisation phone languages');

    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (role !== 'admin' && booking.userId.toString() !== userId.toString()) {
      const error = new Error('Access denied to this booking');
      error.statusCode = 403;
      throw error;
    }

    return booking;
  }

  async cancelBooking(id, userId) {
    const booking = await Booking.findById(id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (booking.userId.toString() !== userId.toString()) {
      const error = new Error('You can only cancel your own bookings');
      error.statusCode = 403;
      throw error;
    }

    if (booking.bookingStatus !== 'pending') {
      const error = new Error('Only pending bookings can be cancelled');
      error.statusCode = 400;
      throw error;
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    return booking;
  }

  async getAllBookings(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.bookingStatus) filter.bookingStatus = query.bookingStatus;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.tourId) filter.tourId = query.tourId;

    const [items, totalItems] = await Promise.all([
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('customerId')
        .populate({
          path: 'tourId',
          select: 'title slug price destinationId',
          populate: { path: 'destinationId', select: 'name slug' },
        })
        .populate('guide_id', 'name specialisation')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Booking.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async updateBookingStatus(id, updateData) {
    const allowed = ['bookingStatus', 'paymentStatus', 'notes', 'guide_id'];
    const fieldsToUpdate = {};

    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        fieldsToUpdate[key] = updateData[key];
      }
    }

    const booking = await Booking.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('customerId tourId guide_id');

    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    return booking;
  }

  async deleteBooking(id) {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Booking deleted successfully' };
  }
}

module.exports = new BookingService();
