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
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { includes: { $regex: query.search, $options: 'i' } },
      ];
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

    return tour;
  }

  async getToursByDestination(destinationId) {
    return Tour.find({ destinationId, status: 'active' }).sort({ price: 1 });
  }

  async createTour(data) {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    }

    return Tour.create(data);
  }

  async updateTour(id, data) {
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    }

    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      const error = new Error('Tour not found');
      error.statusCode = 404;
      throw error;
    }

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
