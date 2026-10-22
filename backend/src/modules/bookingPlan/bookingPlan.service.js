const BookingPlan = require('./bookingPlan.model');
const Tour = require('../tour/tour.model');
require('../destination/destination.model');
require('../customer/customer.model');
require('../guide/guide.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class BookingPlanService {
  normalizeDate(d) {
    const date = new Date(d);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  async getAllPlans(query = {}) {
    // If no booking plans exist, automatically sync from existing bookings
    const totalCount = await BookingPlan.countDocuments();
    if (totalCount === 0) {
      await this.syncFromBookings();
    }

    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.tourId && query.tourId !== 'all') filter.tourId = query.tourId;
    if (query.status && query.status !== 'all') filter.status = query.status;
    if (query.guideId && query.guideId !== 'all') filter.guideId = query.guideId;

    const [items, totalItems] = await Promise.all([
      BookingPlan.find(filter)
        .populate({
          path: 'tourId',
          select: 'title slug durationOptions overview destinationId',
          populate: { path: 'destinationId', select: 'name slug' },
        })
        .populate('guideId', 'name slug specialisation avatar phone')
        .populate({
          path: 'bookings',
          populate: { path: 'customerId' },
        })
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
      .populate('guideId', 'name slug specialisation avatar phone')
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

    const departure = this.normalizeDate(data.departureDate);
    const duration = data.duration || (tour.durationOptions && tour.durationOptions[0]) || { days: 1, nights: 0 };
    const tourDays = duration.days || 1;
    const endDate = new Date(departure);
    endDate.setDate(departure.getDate() + Math.max(tourDays - 1, 0));

    const existing = await BookingPlan.findOne({
      tourId: data.tourId,
      departureDate: departure,
    });

    if (existing) {
      const error = new Error('Đã có đoàn khởi hành cho tour này vào ngày đã chọn');
      error.statusCode = 400;
      throw error;
    }

    return BookingPlan.create({
      ...data,
      duration: { days: duration.days || 1, nights: duration.nights || 0 },
      departureDate: departure,
      endDate: data.endDate || endDate,
      totalPassengers: data.totalPassengers || 0,
      passengersList: data.passengersList || [],
      bookings: data.bookings || [],
    });
  }

  async assignGuide(planId, guideId) {
    const plan = await BookingPlan.findByIdAndUpdate(
      planId,
      { guideId },
      { new: true, runValidators: true }
    ).populate('guideId', 'name slug specialisation avatar phone');

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
    ).populate('guideId', 'name slug specialisation avatar phone');

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

  /**
   * Sync and aggregate all bookings into departure BookingPlans
   */
  async syncFromBookings() {
    const Booking = require('../booking/booking.model');

    const bookings = await Booking.find({
      bookingStatus: { $ne: 'cancelled' },
    })
      .populate('customerId')
      .populate('tourId');

    const groups = {};

    for (const b of bookings) {
      if (!b.tourId) continue;
      const tourId = b.tourId._id ? b.tourId._id.toString() : b.tourId.toString();
      const depDate = this.normalizeDate(b.departureDate);
      const dateKey = depDate.toISOString().slice(0, 10);
      const groupKey = tourId + '_' + dateKey;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          tourId: b.tourId._id || b.tourId,
          tour: b.tourId,
          departureDate: depDate,
          bookings: [],
          guideId: b.guide_id || null,
        };
      }

      if (!groups[groupKey].guideId && b.guide_id) {
        groups[groupKey].guideId = b.guide_id;
      }

      groups[groupKey].bookings.push(b);
    }

    const syncedPlans = [];

    for (const key of Object.keys(groups)) {
      const grp = groups[key];
      const tour = grp.tour;
      const firstBooking = grp.bookings[0];
      const duration = (firstBooking && firstBooking.selectedDuration && firstBooking.selectedDuration.days)
        ? { days: firstBooking.selectedDuration.days, nights: firstBooking.selectedDuration.nights }
        : ((tour && tour.durationOptions && tour.durationOptions[0])
            ? { days: tour.durationOptions[0].days, nights: tour.durationOptions[0].nights }
            : { days: 1, nights: 0 });

      const tourDays = duration.days || 1;
      const endDate = new Date(grp.departureDate);
      endDate.setDate(grp.departureDate.getDate() + Math.max(tourDays - 1, 0));

      const passengersList = [];
      let totalPax = 0;

      for (const b of grp.bookings) {
        const cust = b.customerId || {};
        const adults = (b.numberOfGuests && b.numberOfGuests.adults) || 1;
        const children = (b.numberOfGuests && b.numberOfGuests.children) || 0;
        const totalGuests = adults + children;
        totalPax += totalGuests;

        // Primary passenger (booker)
        passengersList.push({
          bookingId: b._id,
          fullName: cust.fullName || 'Hành khách',
          gender: 'other',
          idCardNumber: cust.idCardNumber || '',
          passengerType: 'adult',
          phone: cust.phone || '',
        });

        // Additional companion passengers
        for (let i = 2; i <= totalGuests; i++) {
          passengersList.push({
            bookingId: b._id,
            fullName: (cust.fullName || 'Hành khách') + ' (Khách đi kèm ' + i + ')',
            gender: 'other',
            idCardNumber: '',
            passengerType: i <= adults ? 'adult' : 'child',
            phone: cust.phone || '',
          });
        }
      }

      // Check existing plan or create
      let plan = await BookingPlan.findOne({
        tourId: grp.tourId,
        departureDate: grp.departureDate,
      });

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      let initialStatus = 'scheduled';
      if (endDate < today) {
        initialStatus = 'completed';
      } else if (grp.departureDate <= today && today <= endDate) {
        initialStatus = 'in_progress';
      }

      if (!plan) {
        plan = await BookingPlan.create({
          tourId: grp.tourId,
          duration: { days: duration.days || 1, nights: duration.nights || 0 },
          departureDate: grp.departureDate,
          endDate,
          guideId: grp.guideId,
          bookings: grp.bookings.map((b) => b._id),
          passengersList,
          totalPassengers: totalPax,
          status: initialStatus,
        });
      } else {
        plan.duration = { days: duration.days || 1, nights: duration.nights || 0 };
        plan.endDate = endDate;
        plan.bookings = grp.bookings.map((b) => b._id);
        plan.passengersList = passengersList;
        plan.totalPassengers = totalPax;
        if (!plan.guideId && grp.guideId) {
          plan.guideId = grp.guideId;
        }
        await plan.save();
      }

      syncedPlans.push(plan);
    }

    return syncedPlans;
  }

  /**
   * Sync a newly created booking into its BookingPlan
   */
  async syncBookingToPlan(booking, bookingData = {}) {
    try {
      const Customer = require('../customer/customer.model');
      const tour = await Tour.findById(booking.tourId);
      if (!tour) return null;

      const depDate = this.normalizeDate(booking.departureDate);
      const duration = (booking.selectedDuration && booking.selectedDuration.days)
        ? { days: booking.selectedDuration.days, nights: booking.selectedDuration.nights }
        : ((tour.durationOptions && tour.durationOptions[0])
            ? { days: tour.durationOptions[0].days, nights: tour.durationOptions[0].nights }
            : { days: 1, nights: 0 });

      const tourDays = duration.days || 1;
      const endDate = new Date(depDate);
      endDate.setDate(depDate.getDate() + Math.max(tourDays - 1, 0));

      let plan = await BookingPlan.findOne({
        tourId: booking.tourId,
        departureDate: depDate,
      });

      const customer = booking.customerId
        ? (typeof booking.customerId === 'object' ? booking.customerId : await Customer.findById(booking.customerId))
        : null;

      const adults = (booking.numberOfGuests && booking.numberOfGuests.adults) || 1;
      const children = (booking.numberOfGuests && booking.numberOfGuests.children) || 0;
      const totalCount = adults + children;

      const newPassengers = [];
      const guestDetails = bookingData.guestDetails || [];

      if (guestDetails.length > 0) {
        guestDetails.forEach((g) => {
          newPassengers.push({
            bookingId: booking._id,
            fullName: g.fullName || (customer && customer.fullName) || 'Hành khách',
            gender: g.gender === 'Nữ' || g.gender === 'female' ? 'female' : g.gender === 'Nam' || g.gender === 'male' ? 'male' : 'other',
            dob: g.dob ? new Date(g.dob) : undefined,
            idCardNumber: g.idCardNumber || '',
            passengerType: g.passengerType || g.type || 'adult',
            phone: (customer && customer.phone) || '',
          });
        });
      } else {
        newPassengers.push({
          bookingId: booking._id,
          fullName: (customer && customer.fullName) || 'Hành khách',
          gender: 'other',
          idCardNumber: (customer && customer.idCardNumber) || '',
          passengerType: 'adult',
          phone: (customer && customer.phone) || '',
        });
        for (let i = 2; i <= totalCount; i++) {
          newPassengers.push({
            bookingId: booking._id,
            fullName: ((customer && customer.fullName) || 'Hành khách') + ' (Khách đi kèm ' + i + ')',
            gender: 'other',
            idCardNumber: '',
            passengerType: i <= adults ? 'adult' : 'child',
            phone: (customer && customer.phone) || '',
          });
        }
      }

      if (!plan) {
        plan = await BookingPlan.create({
          tourId: booking.tourId,
          duration: { days: duration.days || 1, nights: duration.nights || 0 },
          departureDate: depDate,
          endDate,
          guideId: booking.guide_id || null,
          totalPassengers: newPassengers.length,
          bookings: [booking._id],
          passengersList: newPassengers,
          status: 'scheduled',
        });
      } else {
        if (!plan.bookings.includes(booking._id)) {
          plan.bookings.push(booking._id);
        }
        plan.duration = { days: duration.days || 1, nights: duration.nights || 0 };
        plan.endDate = endDate;
        plan.passengersList.push(...newPassengers);
        plan.totalPassengers = plan.passengersList.length;
        if (!plan.guideId && booking.guide_id) {
          plan.guideId = booking.guide_id;
        }
        await plan.save();
      }

      return plan;
    } catch (err) {
      console.error('[BookingPlanService] Error auto-syncing booking to plan:', err);
      return null;
    }
  }
}

module.exports = new BookingPlanService();
