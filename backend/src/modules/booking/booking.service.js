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

    // Determine selected duration
    let selectedDuration = bookingData.selectedDuration;
    if (!selectedDuration || !selectedDuration.days) {
      if (tour.durationOptions && tour.durationOptions.length > 0) {
        selectedDuration = {
          days: tour.durationOptions[0].days,
          nights: tour.durationOptions[0].nights,
          price: tour.durationOptions[0].price,
        };
      } else {
        selectedDuration = {
          days: 1,
          nights: 0,
          price: 0,
        };
      }
    }

    const departure = new Date(bookingData.departureDate);
    const tourDays = selectedDuration.days || 1;
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

    const adults = (bookingData.numberOfGuests && bookingData.numberOfGuests.adults) || 1;
    const children = (bookingData.numberOfGuests && bookingData.numberOfGuests.children) || 0;
    const totalRequestedSeats = Number(adults) + Number(children);

    // Tính số khách đã đặt hiện tại trong tour này (không tính các đơn đã hủy)
    const activeBookings = await Booking.find({
      tourId: bookingData.tourId,
      bookingStatus: { $ne: 'cancelled' },
    });
    const currentBookedCount = activeBookings.reduce((sum, b) => {
      const a = b.numberOfGuests?.adults || 0;
      const c = b.numberOfGuests?.children || 0;
      return sum + a + c;
    }, 0);

    const maxPassengers = tour.maxPassengers !== undefined ? tour.maxPassengers : 20;
    const currentAvailableSeats = Math.max(0, maxPassengers - currentBookedCount);

    if (currentAvailableSeats <= 0) {
      const error = new Error('Tour này hiện đã hết chỗ (Sold Out). Quý khách vui lòng chọn tour hoặc ngày khởi hành khác!');
      error.statusCode = 400;
      throw error;
    }

    if (totalRequestedSeats > currentAvailableSeats) {
      const error = new Error(`Tour chỉ còn ${currentAvailableSeats} chỗ trống, không đủ cho ${totalRequestedSeats} khách.`);
      error.statusCode = 400;
      throw error;
    }

    const computedTotal = (bookingData.totalAmount !== undefined && Number(bookingData.totalAmount) > 0)
      ? Number(bookingData.totalAmount)
      : (selectedDuration.price * adults + Math.round(selectedDuration.price * 0.75) * children);

    const booking = await Booking.create({
      userId,
      tourId: bookingData.tourId,
      customerId,
      selectedDuration,
      departureDate: departure,
      endDate,
      numberOfGuests: bookingData.numberOfGuests || { adults: 1, children: 0 },
      totalAmount: computedTotal,
      paymentMethod: bookingData.paymentMethod || 'cash',
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      notes: bookingData.notes || '',
      guide_id: bookingData.guide_id || bookingData.guideId || null,
    });

    // Cập nhật lại availableSeats của Tour: availableSeats = maxPassengers - số lượng người đã đặt trong tour đó
    tour.availableSeats = Math.max(0, maxPassengers - (currentBookedCount + totalRequestedSeats));
    await tour.save();

    // Automatically sync/group into BookingPlan
    try {
      const bookingPlanService = require('../bookingPlan/bookingPlan.service');
      await bookingPlanService.syncBookingToPlan(booking, bookingData);
    } catch (bpErr) {
      console.warn('[BookingService] Non-blocking warning: Failed to sync booking plan:', bpErr.message);
    }

    return booking.populate([
      { path: 'tourId', select: 'title slug durationOptions overview destinationId' },
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
        populate: { path: 'destinationId', select: 'name slug image location gallery region theme' },
      })
      .populate('customerId')
      .populate('guide_id', 'name specialisation languages background biography');

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

  async cancelBooking(id, userId, reason = '') {
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
    if (reason && typeof reason === 'string' && reason.trim()) {
      const trimmedReason = reason.trim();
      booking.notes = booking.notes
        ? `${booking.notes}\n[Lý do hủy: ${trimmedReason}]`
        : `[Lý do hủy: ${trimmedReason}]`;
    }
    await booking.save();

    // Hoàn trả lại số chỗ còn trống cho tour
    try {
      const tourService = require('../tour/tour.service');
      await tourService.recalculateAvailableSeats(booking.tourId);
    } catch (seatErr) {
      console.warn('[BookingService] Failed to recalculate available seats on cancel:', seatErr.message);
    }

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
          select: 'title slug durationOptions overview destinationId',
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

    if (updateData.bookingStatus !== undefined) {
      try {
        const tourService = require('../tour/tour.service');
        const tourId = booking.tourId?._id || booking.tourId;
        await tourService.recalculateAvailableSeats(tourId);
      } catch (seatErr) {
        console.warn('[BookingService] Failed to recalculate available seats on status update:', seatErr.message);
      }
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

    try {
      const tourService = require('../tour/tour.service');
      const tourId = booking.tourId?._id || booking.tourId;
      await tourService.recalculateAvailableSeats(tourId);
    } catch (seatErr) {
      console.warn('[BookingService] Failed to recalculate available seats on delete:', seatErr.message);
    }

    return { message: 'Booking deleted successfully' };
  }
}

module.exports = new BookingService();
