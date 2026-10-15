const BookingPlan = require('./bookingPlan.model');
const Tour = require('../tour/tour.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class BookingPlanService {
  async getAllPlans(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.tourId) filter.tourId = query.tourId;
    if (query.status) filter.status = query.status;
    if (query.guideId) filter.guideId = query.guideId;

    const [items, totalItems] = await Promise.all([
      BookingPlan.find(filter)
        .populate({
          path: 'tourId',
          select: 'title slug price duration destinationId',
          populate: { path: 'destinationId', select: 'name slug' },
        })
        .populate('guideId', 'name slug specialisation')
        .skip(skip)
        .limit(limit)
        .sort({ departureDate: 1 }),
      BookingPlan.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getPlanById(id) {
    const plan = await BookingPlan.findById(id)
      .populate({
        path: 'tourId',
        populate: { path: 'destinationId', select: 'name slug image location' },
      })
      .populate('guideId')
      .populate({
        path: 'bookings',
        populate: { path: 'customerId' },
      });

    if (!plan) {
      const error = new Error('Booking plan not found');
      error.statusCode = 404;
      throw error;
    }

    return plan;
  }

  async createPlan(data) {
    const tour = await Tour.findById(data.tourId);
    if (!tour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

    const departure = new Date(data.departureDate);
    const tourDays = (tour.duration && tour.duration.days) ? tour.duration.days : 1;
    const endDate = new Date(departure);
    endDate.setDate(departure.getDate() + Math.max(tourDays - 1, 0));

    return BookingPlan.create({
      ...data,
      departureDate: departure,
      endDate: data.endDate || endDate,
    });
  }

  async assignGuide(planId, guideId) {
    const plan = await BookingPlan.findByIdAndUpdate(
      planId,
      { guideId },
      { new: true, runValidators: true }
    ).populate('guideId');

    if (!plan) {
      const error = new Error('Booking plan not found');
      error.statusCode = 404;
      throw error;
    }

    return plan;
  }

  async updateStatus(planId, status) {
    const plan = await BookingPlan.findByIdAndUpdate(
      planId,
      { status },
      { new: true, runValidators: true }
    );

    if (!plan) {
      const error = new Error('Booking plan not found');
      error.statusCode = 404;
      throw error;
    }

    return plan;
  }

  async addPassenger(planId, passengerData) {
    const plan = await BookingPlan.findById(planId);
    if (!plan) {
      const error = new Error('Booking plan not found');
      error.statusCode = 404;
      throw error;
    }

    plan.passengersList.push(passengerData);
    plan.totalPassengers = plan.passengersList.length;
    await plan.save();

    return plan;
  }

  async deletePlan(id) {
    const plan = await BookingPlan.findByIdAndDelete(id);
    if (!plan) {
      const error = new Error('Booking plan not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Booking plan deleted successfully' };
  }
}

module.exports = new BookingPlanService();
