const mongoose = require('mongoose');
const slugify = require('slugify');
const Tour = require('./tour.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class TourService {
  async getAllTours(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.destinationId) {
      filter.destinationId = query.destinationId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.minPrice || query.maxPrice) {
      filter['durationOptions.price'] = {};
      if (query.minPrice) filter['durationOptions.price'].$gte = Number(query.minPrice);
      if (query.maxPrice) filter['durationOptions.price'].$lte = Number(query.maxPrice);
    }

    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      const searchConditions = [
        { title: searchRegex },
        { overview: searchRegex },
        { includes: searchRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const [items, totalItems] = await Promise.all([
      Tour.find(filter)
        .populate('destinationId', 'name slug image location region')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Tour.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getTourByIdOrSlug(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const tour = await Tour.findOne(query).populate(
      'destinationId',
      'name slug image location region theme overview'
    );

    if (!tour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

    // Đảm bảo availableSeats luôn chuẩn xác theo logic:
    // Nếu chưa có ai đặt: availableSeats = maxPassengers
    // Nếu đã có khách đặt: availableSeats = maxPassengers - số lượng người đã đặt trong tour đó
    try {
      const Booking = require('../booking/booking.model');
      const activeBookings = await Booking.find({
        tourId: tour._id,
        bookingStatus: { $ne: 'cancelled' },
      });

      const bookedCount = activeBookings.reduce((sum, b) => {
        const adults = b.numberOfGuests?.adults || 0;
        const children = b.numberOfGuests?.children || 0;
        return sum + adults + children;
      }, 0);

      const max = tour.maxPassengers !== undefined ? tour.maxPassengers : 20;
      const expectedSeats = Math.max(0, max - bookedCount);

      if (tour.availableSeats !== expectedSeats) {
        tour.availableSeats = expectedSeats;
        await tour.save();
      }
    } catch (err) {
      console.warn('[TourService] Warning: Could not sync availableSeats for tour:', err.message);
    }

    return tour;
  }

  async getToursByDestination(destinationId) {
    return Tour.find({ destinationId, status: 'active' }).sort({ 'durationOptions.price': 1 });
  }

  async recalculateAvailableSeats(tourId) {
    const tour = await Tour.findById(tourId);
    if (!tour) return null;

    const Booking = require('../booking/booking.model');
    const activeBookings = await Booking.find({
      tourId,
      bookingStatus: { $ne: 'cancelled' },
    });

    const bookedCount = activeBookings.reduce((sum, b) => {
      const adults = b.numberOfGuests?.adults || 0;
      const children = b.numberOfGuests?.children || 0;
      return sum + adults + children;
    }, 0);

    const maxPassengers = tour.maxPassengers !== undefined ? tour.maxPassengers : 20;
    // Ban đầu chưa có ai đặt tour: maxPassengers = availableSeats
    // Khi khách hàng đã đặt tour: availableSeats = maxPassengers - số lượng người đã đặt trong tour đó
    const newAvailableSeats = Math.max(0, maxPassengers - bookedCount);

    tour.availableSeats = newAvailableSeats;
    await tour.save();
    return tour;
  }

  async createTour(data) {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    }

    const maxPassengers = data.maxPassengers !== undefined ? Number(data.maxPassengers) : 20;
    data.maxPassengers = maxPassengers;
    // Ban đầu chưa có ai đặt tour: maxPassengers = availableSeats
    data.availableSeats = maxPassengers;

    return Tour.create(data);
  }

  async updateTour(id, data) {
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    }

    const currentTour = await Tour.findById(id);
    if (!currentTour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

    // Nếu cập nhật maxPassengers, tính lại availableSeats tương ứng
    if (data.maxPassengers !== undefined) {
      const newMaxPassengers = Math.max(1, Number(data.maxPassengers));
      data.maxPassengers = newMaxPassengers;

      const Booking = require('../booking/booking.model');
      const activeBookings = await Booking.find({
        tourId: id,
        bookingStatus: { $ne: 'cancelled' },
      });

      const bookedCount = activeBookings.reduce((sum, b) => {
        const adults = b.numberOfGuests?.adults || 0;
        const children = b.numberOfGuests?.children || 0;
        return sum + adults + children;
      }, 0);

      data.availableSeats = Math.max(0, newMaxPassengers - bookedCount);
    }

    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return tour;
  }

  async deleteTour(id) {
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Tour deleted successfully' };
  }
}

module.exports = new TourService();
