const mongoose = require('mongoose');
const slugify = require('slugify');
const Guide = require('./guide.model');
const Destination = require('../destination/destination.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class GuideService {
  /**
   * Helper: Check if guide is occupied by any active BookingPlan or Booking during [departureDate, endDate]
   */
  async getGuideScheduleConflicts(guideId, departureDate, endDate) {
    if (!guideId || !departureDate) {
      return { isAvailable: true, conflicts: [], busyReason: '' };
    }

    const Booking = require('../booking/booking.model');
    const BookingPlan = require('../bookingPlan/bookingPlan.model');

    const dep = new Date(departureDate);
    dep.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate || departureDate);
    end.setUTCHours(23, 59, 59, 999);

    const guideObjId = typeof guideId === 'string' ? new mongoose.Types.ObjectId(guideId) : guideId;

    // 1. Check in BookingPlan (scheduled or in_progress)
    const conflictingPlans = await BookingPlan.find({
      guideId: guideObjId,
      status: { $nin: ['cancelled', 'completed'] },
      departureDate: { $lte: end },
      $expr: {
        $gte: [{ $ifNull: ['$endDate', '$departureDate'] }, dep],
      },
    }).populate('tourId', 'title slug');

    // 2. Check in Booking (pending or confirmed)
    const conflictingBookings = await Booking.find({
      guide_id: guideObjId,
      bookingStatus: { $in: ['pending', 'confirmed'] },
      departureDate: { $lte: end },
      $expr: {
        $gte: [{ $ifNull: ['$endDate', '$departureDate'] }, dep],
      },
    }).populate('tourId', 'title slug');

    const conflicts = [];
    const fmt = (d) => {
      if (!d) return '';
      const dt = new Date(d);
      return String(dt.getUTCDate()).padStart(2, '0') + '/' + String(dt.getUTCMonth() + 1).padStart(2, '0') + '/' + dt.getUTCFullYear();
    };

    for (const plan of conflictingPlans) {
      conflicts.push({
        type: 'booking_plan',
        id: plan._id,
        tourTitle: plan.tourId?.title || 'Tour theo đoàn',
        departureDate: plan.departureDate,
        endDate: plan.endDate || plan.departureDate,
      });
    }

    for (const b of conflictingBookings) {
      const alreadyInPlan = conflictingPlans.some((p) =>
        p.bookings && p.bookings.some((bid) => bid.toString() === b._id.toString())
      );
      if (!alreadyInPlan) {
        conflicts.push({
          type: 'booking',
          id: b._id,
          tourTitle: b.tourId?.title || 'Đơn đặt tour',
          departureDate: b.departureDate,
          endDate: b.endDate || b.departureDate,
        });
      }
    }

    const isAvailable = conflicts.length === 0;
    let busyReason = '';
    if (!isAvailable) {
      const first = conflicts[0];
      const startStr = fmt(first.departureDate);
      const endStr = fmt(first.endDate);
      const dateText = startStr === endStr ? startStr : startStr + ' - ' + endStr;
      busyReason = 'Đã có lịch bận tour "' + first.tourTitle + '" (' + dateText + ')';
    }

    return { isAvailable, conflicts, busyReason };
  }

  async checkGuideAvailability(idOrSlug, departureDate, endDate) {
    const guide = await this.getGuideByIdOrSlug(idOrSlug);
    const availability = await this.getGuideScheduleConflicts(
      guide._id,
      departureDate,
      endDate
    );
    return {
      guideId: guide._id,
      name: guide.name,
      slug: guide.slug,
      departureDate,
      endDate: endDate || departureDate,
      ...availability,
    };
  }

  /**
   * Helper: Check if all destination IDs exist in Destination collection
   */
  async validateDestinationsExist(destinationIds) {
    if (!destinationIds || destinationIds.length === 0) return [];

    const stringIds = destinationIds.map((id) => id.toString());
    const validDestinations = await Destination.find({ _id: { $in: stringIds } }).select('_id name');

    if (validDestinations.length !== stringIds.length) {
      const foundIds = validDestinations.map((d) => d._id.toString());
      const missingIds = stringIds.filter((id) => !foundIds.includes(id));
      const error = new Error(`Không tìm thấy điểm đến với ID: ${missingIds.join(', ')}`);
      error.statusCode = 404;
      throw error;
    }

    return validDestinations;
  }

  async getAllGuides(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.destinationId) {
      filter.destinations = query.destinationId;
    }

    if (query.language && query.language !== 'Tất cả') {
      filter.languages = { $regex: query.language, $options: 'i' };
    }

    if (query.specialisation && query.specialisation !== 'Tất cả') {
      filter.specialisation = { $regex: query.specialisation, $options: 'i' };
    }

    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { specialisation: searchRegex },
        { languages: searchRegex },
        { biography: searchRegex },
        { background: searchRegex },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Guide.find(filter)
        .populate('destinations', 'name slug image location region theme')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Guide.countDocuments(filter),
    ]);

    if (query.departureDate) {
      const depDate = query.departureDate;
      const endDate = query.endDate || depDate;

      const itemsWithAvailability = await Promise.all(
        items.map(async (guide) => {
          const gObj = guide.toObject ? guide.toObject() : { ...guide };
          const availability = await this.getGuideScheduleConflicts(guide._id, depDate, endDate);
          return {
            ...gObj,
            isAvailable: availability.isAvailable,
            busyReason: availability.busyReason,
            conflicts: availability.conflicts,
          };
        })
      );

      return formatPaginationResponse(itemsWithAvailability, totalItems, page, limit);
    }

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getGuideByIdOrSlug(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const guide = await Guide.findOne(query).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide;
  }

  async createGuide(data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsExist(data.destinations);
    }

    const createdGuide = await Guide.create(data);
    return Guide.findById(createdGuide._id).populate(
      'destinations',
      'name slug image location region theme'
    );
  }

  async updateGuide(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsExist(data.destinations);
    }

    const guide = await Guide.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('destinations', 'name slug image location region theme');

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide;
  }

  async deleteGuide(id) {
    const guide = await Guide.findByIdAndDelete(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Guide deleted successfully' };
  }

  /**
   * Thêm danh sách điểm đến guide phụ trách (không trùng lặp)
   */
  async addDestinationsToGuide(id, destinationIds) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    await this.validateDestinationsExist(destinationIds);

    const currentIds = (guide.destinations || []).map((d) => d.toString());
    const newIds = destinationIds
      .map((d) => d.toString())
      .filter((destId) => !currentIds.includes(destId));

    if (newIds.length > 0) {
      guide.destinations.push(...newIds);
      await guide.save();
    }

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Cập nhật toàn bộ danh sách điểm đến guide phụ trách
   */
  async setGuideDestinations(id, destinationIds) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    await this.validateDestinationsExist(destinationIds);

    const uniqueIds = Array.from(new Set(destinationIds.map((d) => d.toString())));
    guide.destinations = uniqueIds;
    await guide.save();

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xóa một điểm đến khỏi danh sách phụ trách của guide
   */
  async removeDestinationFromGuide(id, destinationId) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    guide.destinations = (guide.destinations || []).filter(
      (d) => d.toString() !== destinationId.toString()
    );
    await guide.save();

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xem danh sách các điểm đến mà guide phụ trách
   */
  async getGuideDestinations(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const guide = await Guide.findOne(query).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide.destinations;
  }
}

module.exports = new GuideService();
